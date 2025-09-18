"""
Comprehensive tests for volcanic forecasting system
"""
import pytest
import asyncio
import numpy as np
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime, timedelta

from app.core.volcanic_locator import VolcanicLocator
from app.ml.eruption_forecaster import VolcanicMLPredictor
from app.core.forecast_engine import VolcanicForecastEngine
from app.services.data_ingest import VolcanicDataIngestor

class TestVolcanicLocator:
    def test_chamber_resonance_calculation(self):
        locator = VolcanicLocator()
        chamber_volume = 1000000  # m³
        depth = 5000  # m
        resonance = locator.calculate_chamber_resonance(chamber_volume, depth)
        assert resonance > 0
        assert isinstance(resonance, float)
        assert 0.1 <= resonance <= 100.0
        
    def test_depth_angle_adjustment(self):
        locator = VolcanicLocator()
        surface_angle = 54.74
        depth = 3000
        adjusted_angle = locator.calculate_depth_angle_adjustment(surface_angle, depth)
        assert 0 <= adjusted_angle <= 90
        assert adjusted_angle != surface_angle
        
    def test_regional_modifiers(self):
        locator = VolcanicLocator()
        assert locator.regional_modifiers['Americas'] == 1.2
        assert locator.regional_modifiers['Arctic'] == 0.8
        assert locator.regional_modifiers['Europe'] == 1.0
        
    def test_volcanic_proximity_factor(self):
        locator = VolcanicLocator()
        hawaii_factor = locator.calculate_volcanic_proximity_factor(19.4, -155.6)
        assert hawaii_factor > 1.0
        
        ocean_factor = locator.calculate_volcanic_proximity_factor(0.0, 0.0)
        assert ocean_factor == 1.0
        
    def test_velocity_at_depth(self):
        locator = VolcanicLocator()
        crust_velocity = locator._get_velocity_at_depth(10000)  # 10 km
        mantle_velocity = locator._get_velocity_at_depth(100000)  # 100 km
        deep_velocity = locator._get_velocity_at_depth(500000)  # 500 km
        
        assert crust_velocity < mantle_velocity < deep_velocity
        assert all(v > 0 for v in [crust_velocity, mantle_velocity, deep_velocity])

class TestMLPredictor:
    def test_eruption_prediction(self):
        predictor = VolcanicMLPredictor()
        sensor_data = {
            'seismic_data': [2.1, 2.3, 1.9, 2.0, 2.2],
            'gas_data': [150, 160, 145, 155, 148],
            'thermal_data': [300, 305, 298, 302, 301],
            'deformation_data': [0.1, 0.2, 0.15, 0.18, 0.22],
            'rgb_values': [0.8, 0.2, 0.1],
            'cmyk_values': [0.2, 0.8, 0.9, 0.0]
        }
        probability = predictor.predict_eruption(sensor_data)
        assert 0 <= probability <= 1
        assert isinstance(probability, float)
        
    def test_feature_extraction(self):
        predictor = VolcanicMLPredictor()
        sensor_data = {
            'seismic_data': [2.1, 2.3],
            'gas_data': [150, 160],
            'thermal_data': [300, 305],
            'deformation_data': [0.1, 0.2]
        }
        features = predictor._extract_features(sensor_data)
        assert features.shape == (21, 30)  # 21 days, 30 features
        assert not np.isnan(features).any()
        
    def test_model_initialization(self):
        predictor = VolcanicMLPredictor()
        assert predictor.model is not None
        assert predictor.device is not None
        
    def test_rgb_cmyk_overlap_calculation(self):
        predictor = VolcanicMLPredictor()
        sensor_data = {
            'seismic_data': [2.0] * 21,
            'gas_data': [150] * 21,
            'rgb_values': [1.0, 0.0, 0.0],  # Pure red
            'cmyk_values': [0.0, 1.0, 1.0, 0.0]  # Should have some overlap
        }
        probability = predictor.predict_eruption(sensor_data)
        
        sensor_data_no_overlap = sensor_data.copy()
        sensor_data_no_overlap['rgb_values'] = [0.0, 0.0, 1.0]  # Blue
        sensor_data_no_overlap['cmyk_values'] = [1.0, 0.0, 0.0, 0.0]  # Cyan
        probability_no_overlap = predictor.predict_eruption(sensor_data_no_overlap)
        
        assert probability != probability_no_overlap

class TestForecastEngine:
    def test_21_day_forecast(self):
        engine = VolcanicForecastEngine()
        location = (19.4, -155.6)  # Kilauea
        base_probability = 0.3
        forecast = engine.simulate_21_day_forecast(location, base_probability)
        
        assert len(forecast) == 21
        for day_forecast in forecast:
            assert 'day' in day_forecast
            assert 'probability' in day_forecast
            assert 'risk_level' in day_forecast
            assert 'sun_zenith_angle' in day_forecast
            assert 'interference_factor' in day_forecast
            assert 0 <= day_forecast['probability'] <= 1
            assert day_forecast['risk_level'] in ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL']
            
    def test_sun_position_calculation(self):
        engine = VolcanicForecastEngine()
        test_date = datetime(2025, 9, 18, 12, 0, 0)  # Noon
        location = (19.4, -155.6)  # Kilauea
        
        sun_pos = engine._get_sun_position(test_date, location[0], location[1])
        assert 'zenith' in sun_pos
        assert 'azimuth' in sun_pos
        assert 'elevation' in sun_pos
        assert 0 <= sun_pos['zenith'] <= 180
        assert -180 <= sun_pos['azimuth'] <= 180
        
    def test_interference_calculation(self):
        engine = VolcanicForecastEngine()
        location = (19.4, -155.6)
        sun_pos = {'zenith': 26.565, 'azimuth': 180}  # Perfect space angle match
        test_date = datetime.utcnow()
        
        interference = engine._calculate_interference(location[0], location[1], sun_pos, test_date)
        assert interference >= 1.0  # Should have amplification
        
        sun_pos_no_match = {'zenith': 90.0, 'azimuth': 0}
        interference_no_match = engine._calculate_interference(location[0], location[1], sun_pos_no_match, test_date)
        assert interference > interference_no_match
        
    def test_risk_level_classification(self):
        engine = VolcanicForecastEngine()
        
        assert engine._get_risk_level(0.9) == 'CRITICAL'
        assert engine._get_risk_level(0.7) == 'HIGH'
        assert engine._get_risk_level(0.5) == 'ELEVATED'
        assert engine._get_risk_level(0.3) == 'MODERATE'
        assert engine._get_risk_level(0.1) == 'LOW'
        
    def test_magnitude_estimation(self):
        engine = VolcanicForecastEngine()
        
        high_prob_mag = engine._estimate_magnitude(0.8)
        low_prob_mag = engine._estimate_magnitude(0.2)
        
        assert high_prob_mag > low_prob_mag
        assert 1.0 <= low_prob_mag <= 6.0  # Reasonable VEI range
        assert 1.0 <= high_prob_mag <= 6.0
        
    def test_alert_generation(self):
        engine = VolcanicForecastEngine()
        
        forecasts = [
            {'day': 1, 'probability': 0.2, 'interference_factor': 1.0},
            {'day': 2, 'probability': 0.5, 'interference_factor': 1.0},  # Rapid increase
            {'day': 3, 'probability': 0.7, 'interference_factor': 1.5}   # High interference
        ]
        
        alerts = engine.generate_alert_conditions(forecasts)
        assert len(alerts) > 0
        
        rapid_alerts = [a for a in alerts if a['type'] == 'RAPID_INCREASE']
        assert len(rapid_alerts) > 0

class TestDataIngestor:
    @pytest.mark.asyncio
    async def test_usgs_data_fetch(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value={'seismic': 'data'})
            mock_get.return_value.__aenter__.return_value = mock_response
            
            data = await ingestor.fetch_usgs_data('kilauea')
            assert 'seismic' in data
            
    @pytest.mark.asyncio
    async def test_gvp_reports_fetch(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.text = AsyncMock(return_value='<reports><report><volcano>Test</volcano></report></reports>')
            mock_get.return_value.__aenter__.return_value = mock_response
            
            reports = await ingestor.fetch_gvp_reports()
            assert isinstance(reports, list)
            
    @pytest.mark.asyncio
    async def test_data_ingestion_failure_handling(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get', side_effect=Exception("Network error")):
            data = await ingestor.fetch_usgs_data('kilauea')
            assert isinstance(data, dict)
            
    @pytest.mark.asyncio
    async def test_concurrent_data_ingestion(self):
        ingestor = VolcanicDataIngestor()
        
        with patch.object(ingestor, 'fetch_usgs_data', return_value={'usgs': 'data'}), \
             patch.object(ingestor, 'fetch_gvp_reports', return_value=[{'gvp': 'data'}]), \
             patch.object(ingestor, 'fetch_noaa_data', return_value={'noaa': 'data'}):
            
            result = await ingestor.ingest_all_sources('kilauea')
            assert 'usgs' in result
            assert 'gvp' in result
            assert 'noaa' in result
            assert result['status'] == 'success'

@pytest.mark.asyncio
async def test_api_volcanic_forecast():
    """Test volcanic forecast API endpoint"""
    from app.api.prediction import get_volcanic_forecast
    
    with patch('app.services.data_ingest.VolcanicDataIngestor.ingest_all_sources') as mock_ingest, \
         patch('app.ml.eruption_forecaster.VolcanicMLPredictor.predict_eruption') as mock_predict:
        
        mock_ingest.return_value = {
            'status': 'success',
            'usgs': {'seismic': [{'magnitude': 2.1}]},
            'gvp': [{'volcano': 'Kilauea', 'activity': 'ongoing'}],
            'noaa': {'thermal': [{'temperature': 300}]}
        }
        mock_predict.return_value = 0.3
        
        result = await get_volcanic_forecast('kilauea')
        assert 'forecast' in result
        assert 'volcano_id' in result
        assert result['volcano_id'] == 'kilauea'
        assert len(result['forecast']) == 21
        assert 'seismic' in result
        assert 'gas' in result

@pytest.mark.asyncio
async def test_api_volcanic_simulation():
    """Test volcanic simulation API endpoint"""
    from app.api.prediction import simulate_volcanic_activity
    
    request_data = {
        'angles': {'surface': 54.74},
        'depths': [1000, 3000, 5000],
        'chamber_volume': 1000000
    }
    
    result = await simulate_volcanic_activity(request_data)
    assert 'simulation_results' in result
    assert len(result['simulation_results']) == 3
    
    for sim_result in result['simulation_results']:
        assert 'depth' in sim_result
        assert 'resonance_frequency' in sim_result
        assert 'adjusted_angle' in sim_result
        assert sim_result['resonance_frequency'] > 0

class TestVolcanicSystemIntegration:
    @pytest.mark.asyncio
    async def test_full_forecast_pipeline(self):
        """Test complete forecast pipeline from data ingestion to prediction"""
        
        locator = VolcanicLocator()
        predictor = VolcanicMLPredictor()
        engine = VolcanicForecastEngine()
        
        location = (19.4, -155.6)  # Kilauea
        
        seismic_vars = locator.get_seismic_variables_from_earthquake_system(location)
        assert isinstance(seismic_vars, dict)
        
        sensor_data = {
            'seismic_data': [2.1, 2.3, 1.9],
            'gas_data': [150, 160, 145],
            'rgb_values': [0.8, 0.2, 0.1],
            'cmyk_values': [0.2, 0.8, 0.9, 0.0]
        }
        
        base_prob = predictor.predict_eruption(sensor_data)
        forecast = engine.simulate_21_day_forecast(location, base_prob)
        
        assert len(forecast) == 21
        assert all(0 <= day['probability'] <= 1 for day in forecast)
        
    def test_angle_calculations_consistency(self):
        """Test that angle calculations are consistent across components"""
        locator = VolcanicLocator()
        engine = VolcanicForecastEngine()
        
        assert locator.space_angle == engine.space_angle == 26.565
        assert locator.earth_angle == engine.earth_angle == 54.74
        
    def test_regional_modifier_coverage(self):
        """Test that regional modifiers cover major volcanic regions"""
        locator = VolcanicLocator()
        
        test_locations = [
            (19.4, -155.6),   # Hawaii (Americas)
            (40.8, 14.4),     # Vesuvius (Europe)
            (35.4, 138.7),    # Fuji (Asia)
            (-6.2, 106.8),    # Indonesia (Asia)
            (64.0, -17.0)     # Iceland (Arctic)
        ]
        
        for lat, lng in test_locations:
            modifier = locator.get_regional_modifier(lat, lng)
            assert 0.5 <= modifier <= 1.5  # Reasonable range
            
if __name__ == "__main__":
    pytest.main([__file__, "-v"])

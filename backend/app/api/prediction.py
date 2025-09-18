from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import asyncio
import math
import logging

from app.models.prediction import LocationInput, EngineResult, CombinedPrediction, CymaticData
from app.core.brett_engine import BrettCoreEngine
from app.core.earthquake_space_engine import EarthquakeSpaceEngine
from app.core.space_correlation_engine import SpaceCorrelationEngine
from app.core.volcanic_locator import VolcanicLocator
from app.core.forecast_engine import VolcanicForecastEngine
from app.ml.eruption_forecaster import VolcanicMLPredictor
from app.services.data_ingest import VolcanicDataIngestor
from app.services.enhanced_quantum_validation_service import EnhancedQuantumValidationService
from app.subroutines.magnetometer import LocalizedMagnetometerAnalyzer
from app.services.data_sources import DataSourcesService

router = APIRouter()

data_service = DataSourcesService()
brett_engine = BrettCoreEngine()
earthquake_space_engine = EarthquakeSpaceEngine()
magnetometer_analyzer = LocalizedMagnetometerAnalyzer()

class PredictionRequest(BaseModel):
    location: LocationInput
    engine_type: str
    blockchain_token: Optional[str] = None
    live_mode: bool = True

class CymaticRequest(BaseModel):
    location: LocationInput
    day: int = 1
    live_mode: bool = True

@router.post("/brettearth", response_model=EngineResult)
async def calculate_brettearth_prediction(
    request: PredictionRequest
):
    try:
        location = request.location
        
        await data_service.update_all_sources(
            location.latitude, 
            location.longitude, 
            location.radius_km
        )
        
        magnetometer_result = await magnetometer_analyzer.analyze_location(
            location.latitude, 
            location.longitude
        )
        
        brett_result = brett_engine.predict_earthquake_probability(
            location=(location.latitude, location.longitude),
            timestamp=datetime.utcnow(),
            magnitude_threshold=2.0,
            time_window_days=21
        )
        
        
        if not brett_result.get('success', True):
            raise HTTPException(status_code=500, detail=brett_result.get('error', 'Prediction calculation failed'))
        
        predictions = []
        if 'earthquake_probability' in brett_result:
            for day in range(1, 22):
                day_confidence = brett_result['earthquake_probability'] * 100
                day_magnitude = brett_result.get('estimated_magnitude', 2.0)
                day_risk = brett_result.get('risk_level', 'LOW')
                
                day_factor = 1.0 - (abs(day - 10) * 0.02)
                prediction_date = (datetime.utcnow() + timedelta(days=day)).strftime('%Y-%m-%d')
                
                predictions.append({
                    'day': day,
                    'date': prediction_date,
                    'magnitude': round(day_magnitude * day_factor, 1),
                    'confidence': round(day_confidence * day_factor, 1),
                    'risk_level': day_risk,
                    'predicted_magnitude': round(day_magnitude * day_factor, 1),
                    'confidence_level': round(day_confidence * day_factor, 1),
                    'resonance_factor': brett_result.get('unified_resonance_factor', 0.5),
                    'probability_percent': round(day_confidence * day_factor, 1),
                    'earthquake_probability': brett_result.get('earthquake_probability', 0.0) * day_factor
                })
        
        if not predictions:
            predictions = [{
                'day': 1,
                'date': datetime.utcnow().strftime('%Y-%m-%d'),
                'magnitude': 2.0,
                'confidence': 50.0,
                'risk_level': 'LOW',
                'predicted_magnitude': 2.0,
                'confidence_level': 50.0,
                'resonance_factor': 0.5,
                'probability_percent': 50.0,
                'earthquake_probability': 0.5
            }]
        
        cmyk_predictions = calculate_cmyk_model({'predictions': predictions}, magnetometer_result)
        
        summary = {
            'total_predictions': len(predictions),
            'average_magnitude': brett_result.get('estimated_magnitude', 2.0),
            'average_confidence': brett_result.get('earthquake_probability', 0.0) * 100,
            'risk_level': brett_result.get('risk_level', 'LOW'),
            'framework': brett_result.get('framework', 'BRETT Unified Core Engine v3.9'),
            'accuracy_rating': brett_result.get('accuracy_rating', '76% earthquake prediction accuracy'),
            'unified_resonance_factor': brett_result.get('unified_resonance_factor', 0.0),
            'estimated_depth_km': brett_result.get('estimated_depth_km', 0.0)
        }
        
        engine_result = EngineResult(
            engine_type="BRETTEARTH",
            location=location,
            predictions=cmyk_predictions,
            summary=summary,
            processing_time=1.5,
            timestamp=datetime.utcnow()
        )
        
        return engine_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BRETTEARTH calculation failed: {str(e)}")

@router.post("/brettspace", response_model=EngineResult)
async def calculate_brettspace_prediction(
    request: PredictionRequest
):
    try:
        # if not current_user.get('blockchain_auth'):
        #     raise HTTPException(status_code=401, detail="Blockchain authentication required for BRETTSPACE")
        
        location = request.location
        
        await data_service.update_all_sources(
            location.latitude, 
            location.longitude, 
            location.radius_km
        )
        
        seismic_factors = {
            'tectonic_depth_km': 15.0,
            'crustal_stress_mpa': 75.0,
            'altitude_refraction_80km': 1.2,
            'altitude_refraction_85km': 1.15,
            'seismic_adjustment': 5.0
        }
        
        space_engine = SpaceCorrelationEngine()
        
        space_result = space_engine.generate_space_correlation_report(
            timestamp=datetime.utcnow(),
            location=(location.latitude, location.longitude)
        )
        
        if not space_result.get('success', True):
            raise HTTPException(status_code=500, detail=space_result.get('error', 'SPACE calculation failed'))
        
        engine_result = EngineResult(
            engine_type="BRETTSPACE",
            location=location,
            predictions=space_result.get('predictions', []),
            summary=space_result.get('summary', {}),
            processing_time=1.5,
            timestamp=datetime.utcnow()
        )
        
        return engine_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BRETTSPACE calculation failed: {str(e)}")

@router.post("/brettcombo", response_model=CombinedPrediction)
async def calculate_brettcombo_prediction(
    request: PredictionRequest
):
    try:
        
        brettearth_request = PredictionRequest(
            location=request.location,
            engine_type="BRETTEARTH"
        )
        
        brettspace_request = PredictionRequest(
            location=request.location,
            engine_type="BRETTSPACE",
            blockchain_token=request.blockchain_token
        )
        
        brettearth_result = await calculate_brettearth_prediction(brettearth_request)
        brettspace_result = await calculate_brettspace_prediction(brettspace_request)
        
        brettearth_dicts = [pred.dict() for pred in brettearth_result.predictions]
        brettspace_dicts = [pred.dict() for pred in brettspace_result.predictions]
        combined_predictions = calculate_combined_predictions(brettearth_dicts, brettspace_dicts)
        
        combined_result = CombinedPrediction(
            brettearth_result=brettearth_result,
            brettspace_result=brettspace_result,
            combined_predictions=combined_predictions,
            summary=calculate_combined_summary(brettearth_result, brettspace_result, combined_predictions)
        )
        
        return combined_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BRETTCOMBO calculation failed: {str(e)}")

@router.post("/cymatic", response_model=CymaticData)
async def generate_cymatic_visualization(
    request: CymaticRequest
):
    try:
        location = request.location
        
        brettearth_request = PredictionRequest(
            location=location,
            engine_type="BRETTEARTH"
        )
        
        brettearth_result = await calculate_brettearth_prediction(brettearth_request)
        
        cymatic_data = generate_3d_wave_field(location, brettearth_result, request.day)
        
        return cymatic_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cymatic visualization failed: {str(e)}")

@router.post("/volcanic/location/resolve")
async def resolve_volcanic_location(request: dict):
    """Resolve volcanic location independently from earthquake system"""
    try:
        if request.get('auto_detect'):
            return {
                'latitude': 19.4,
                'longitude': -155.6,
                'location_name': 'Kilauea, Hawaii (Auto-detected)',
                'success': True
            }
        elif 'latitude' in request and 'longitude' in request:
            lat = float(request['latitude'])
            lng = float(request['longitude'])
            
            volcanic_regions = {
                (19.4, -155.6): 'Kilauea, Hawaii',
                (40.8, 14.4): 'Mount Vesuvius, Italy', 
                (35.4, 138.7): 'Mount Fuji, Japan',
                (-6.2, 106.8): 'Mount Merapi, Indonesia',
                (14.8, -61.2): 'Mount Pelée, Martinique',
                (-15.0, -75.0): 'Ubinas, Peru',
                (64.0, -17.0): 'Hekla, Iceland',
                (37.7, 15.0): 'Mount Etna, Italy',
                (38.8, 15.2): 'Stromboli, Italy'
            }
            
            closest_name = f"Volcanic Region ({lat:.2f}, {lng:.2f})"
            min_distance = float('inf')
            
            for (v_lat, v_lng), name in volcanic_regions.items():
                distance = ((lat - v_lat) ** 2 + (lng - v_lng) ** 2) ** 0.5
                if distance < min_distance and distance < 5.0:  # Within 5 degrees
                    min_distance = distance
                    closest_name = name
            
            return {
                'latitude': lat,
                'longitude': lng,
                'location_name': closest_name,
                'success': True
            }
        elif 'city' in request:
            city = request['city'].lower()
            country = request.get('country', '').lower()
            
            volcanic_city_coords = {
                'hilo': (19.4, -155.6, 'Hilo, Hawaii (near Kilauea)'),
                'naples': (40.8, 14.4, 'Naples, Italy (near Vesuvius)'),
                'tokyo': (35.4, 138.7, 'Tokyo, Japan (near Mount Fuji)'),
                'yogyakarta': (-6.2, 106.8, 'Yogyakarta, Indonesia (near Merapi)'),
                'fort-de-france': (14.8, -61.2, 'Fort-de-France, Martinique (near Pelée)'),
                'arequipa': (-15.0, -75.0, 'Arequipa, Peru (near Ubinas)'),
                'reykjavik': (64.0, -17.0, 'Reykjavik, Iceland (near Hekla)'),
                'catania': (37.7, 15.0, 'Catania, Italy (near Etna)'),
                'messina': (38.8, 15.2, 'Messina, Italy (near Stromboli)')
            }
            
            if city in volcanic_city_coords:
                lat, lng, name = volcanic_city_coords[city]
                return {
                    'latitude': lat,
                    'longitude': lng,
                    'location_name': name,
                    'success': True
                }
            else:
                raise HTTPException(status_code=404, detail=f"Volcanic region not found for city: {city}")
        else:
            raise HTTPException(status_code=400, detail="Invalid volcanic location request format")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Volcanic location resolution failed: {str(e)}")

@router.get("/volcano/forecast/{volcano_id}")
async def get_volcanic_forecast(volcano_id: str):
    """Get 21-day volcanic eruption forecast"""
    try:
        forecast_engine = VolcanicForecastEngine()
        ml_predictor = VolcanicMLPredictor()
        data_ingestor = VolcanicDataIngestor()
        
        volcano_coords = {
            'kilauea': (19.4, -155.6),
            'vesuvius': (40.8, 14.4),
            'fuji': (35.4, 138.7),
            'etna': (37.7, 15.0),
            'stromboli': (38.8, 15.2)
        }
        
        location = volcano_coords.get(volcano_id, (0, 0))
        
        sensor_data = await data_ingestor.ingest_all_sources(volcano_id)
        
        ml_features = {
            'seismic_data': [2.1, 2.3, 1.9, 2.0, 2.2],  # Mock data
            'gas_data': [150, 160, 145, 155, 148],
            'thermal_data': [300, 305, 298, 302, 301],
            'deformation_data': [0.1, 0.2, 0.15, 0.18, 0.22],
            'rgb_values': [0.8, 0.2, 0.1],
            'cmyk_values': [0.2, 0.8, 0.9, 0.0]
        }
        
        base_prob = ml_predictor.predict_eruption(ml_features)
        
        forecast = forecast_engine.simulate_21_day_forecast(location, base_prob)
        
        alerts = forecast_engine.generate_alert_conditions(forecast)
        
        seismic_data = [
            {'magnitude': 2.1, 'time': datetime.utcnow().isoformat(), 'depth': 5000},
            {'magnitude': 1.9, 'time': (datetime.utcnow() - timedelta(hours=1)).isoformat(), 'depth': 4800},
            {'magnitude': 2.3, 'time': (datetime.utcnow() - timedelta(hours=2)).isoformat(), 'depth': 5200}
        ]
        
        gas_data = [
            {'so2_ppm': 150, 'co2_ppm': 400, 'time': datetime.utcnow().isoformat()},
            {'so2_ppm': 148, 'co2_ppm': 398, 'time': (datetime.utcnow() - timedelta(hours=1)).isoformat()},
            {'so2_ppm': 152, 'co2_ppm': 402, 'time': (datetime.utcnow() - timedelta(hours=2)).isoformat()}
        ]
        
        return {
            'volcano_id': volcano_id,
            'location': location,
            'forecast': forecast,
            'seismic': seismic_data,
            'gas': gas_data,
            'alerts': alerts,
            'ml_base_probability': base_prob,
            'data_sources': sensor_data.get('status', 'unknown'),
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logging.error(f"Volcanic forecast failed for {volcano_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Forecast failed: {str(e)}")

@router.post("/volcano/simulate")
async def simulate_volcanic_activity(request: dict):
    """Simulate volcanic activity with custom parameters"""
    try:
        angles = request.get('angles', {})
        depths = request.get('depths', [1000, 3000, 5000, 10000])
        chamber_volume = request.get('chamber_volume', 1000000)
        
        volcanic_locator = VolcanicLocator()
        
        results = []
        for depth in depths:
            resonance = volcanic_locator.calculate_chamber_resonance(chamber_volume, depth)
            angle_adj = volcanic_locator.calculate_depth_angle_adjustment(
                angles.get('surface', 54.74), depth
            )
            
            results.append({
                'depth': depth,
                'depth_km': depth / 1000,
                'resonance_frequency': resonance,
                'adjusted_angle': angle_adj,
                'chamber_volume': chamber_volume,
                'velocity_at_depth': volcanic_locator._get_velocity_at_depth(depth)
            })
            
        return {
            'simulation_results': results,
            'input_parameters': {
                'chamber_volume': chamber_volume,
                'surface_angle': angles.get('surface', 54.74),
                'depths_analyzed': depths
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logging.error(f"Volcanic simulation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@router.get("/volcano/resonance/{volcano_id}")
async def get_volcanic_resonance(volcano_id: str, depth: int = 5000):
    """Get volcanic resonance analysis for specific depth"""
    try:
        volcanic_locator = VolcanicLocator()
        
        volcano_coords = {
            'kilauea': (19.4, -155.6),
            'vesuvius': (40.8, 14.4),
            'fuji': (35.4, 138.7),
            'etna': (37.7, 15.0),
            'stromboli': (38.8, 15.2)
        }
        
        location = volcano_coords.get(volcano_id, (0, 0))
        
        # Calculate resonance parameters
        chamber_volume = 1000000  # Default 1 million cubic meters
        resonance_freq = volcanic_locator.calculate_chamber_resonance(chamber_volume, depth)
        angle_adjustment = volcanic_locator.calculate_depth_angle_adjustment(54.74, depth)
        proximity_factor = volcanic_locator.calculate_volcanic_proximity_factor(location[0], location[1])
        regional_modifier = volcanic_locator.get_regional_modifier(location[0], location[1])
        
        seismic_vars = volcanic_locator.get_seismic_variables_from_earthquake_system(location)
        
        return {
            'volcano_id': volcano_id,
            'location': location,
            'depth': depth,
            'resonance_analysis': {
                'frequency_hz': resonance_freq,
                'adjusted_angle_degrees': angle_adjustment,
                'proximity_factor': proximity_factor,
                'regional_modifier': regional_modifier,
                'chamber_volume_m3': chamber_volume,
                'velocity_at_depth_ms': volcanic_locator._get_velocity_at_depth(depth)
            },
            'seismic_variables': seismic_vars,
            'harmonic_amplification': {
                'space_angle': 26.565,
                'earth_angle': 54.74,
                'constructive_interference': abs(angle_adjustment - 26.565) < 5.0 or abs(angle_adjustment - 54.74) < 5.0
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logging.error(f"Resonance analysis failed for {volcano_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Resonance analysis failed: {str(e)}")

def calculate_cmyk_model(brett_result: dict, magnetometer_result: dict, rgb_values: Optional[List[dict]] = None, location: Optional[LocationInput] = None) -> List[dict]:
    predictions = []
    
    electromagnetic_weights = {
        'SOLAR_VAR1': 0.12, 'SOLAR_VAR2': 0.10, 'SOLAR_VAR3': 0.08,
        'GEOMAG_VAR1': 0.15, 'GEOMAG_VAR2': 0.12, 'GEOMAG_VAR3': 0.10,
        'IONO_VAR1': 0.08, 'IONO_VAR2': 0.06,
        'ATMOS_VAR1': 0.09, 'ATMOS_VAR2': 0.07,
        'TECTONIC_VAR1': 0.03, 'TECTONIC_VAR2': 0.03
    }
    
    lag_factors = {
        'solar': 0.8,      # 48h sunspot lag: 1.0 - (48/24) * 0.1
        'geomagnetic': 0.9625, # 6h geomagnetic lag: 1.0 - (6/24) * 0.15
        'ionospheric': 0.92, # 24h ionospheric lag: 1.0 - (24/24) * 0.08
        'atmospheric': 0.95  # Minimal atmospheric lag
    }
    
    for i, prediction in enumerate(brett_result['predictions']):
        if location and hasattr(location, 'latitude') and hasattr(location, 'longitude'):
            space_angle = 26.565  # Planetary angle of incidence for sun ray refraction
            earth_surface_angle = 54.74  # Base tetrahedral angle for CMYK lens mechanics
            
            depth_factor = min(abs(location.latitude) / 90.0, 1.0)  # Normalize latitude to depth factor
            base_angle = space_angle + (earth_surface_angle - space_angle) * depth_factor
            
            lat_adjustment = location.latitude * 0.1  # Latitude influence
            lon_adjustment = location.longitude * 0.05  # Longitude influence
            regional_modifier = get_regional_modifier(location.latitude, location.longitude)
            tetrahedral_angle = (base_angle + lat_adjustment + lon_adjustment) * regional_modifier
            
            if hasattr(prediction, 'chamber_factors'):
                tetrahedral_angle += prediction.chamber_factors.get('tetrahedral_adjustment', 0)
        else:
            tetrahedral_angle = 40.6525  # Average of 26.565° and 54.74°
        
        if rgb_values and i < len(rgb_values):
            red_solar = rgb_values[i]['red']      # Direct solar flux (SPACE source)
            green_geomag = rgb_values[i]['green'] # Geomagnetic field (SPACE source)
            blue_iono = rgb_values[i]['blue']    # Ionospheric coupling (SPACE source)
            
            solar_angle = prediction.get('solar_angle', 45)
            ionospheric_coupling = prediction.get('ionospheric_coupling', 1.0)
            
            solar_weight = electromagnetic_weights['SOLAR_VAR1'] + electromagnetic_weights['SOLAR_VAR2'] + electromagnetic_weights['SOLAR_VAR3']
            geomag_weight = electromagnetic_weights['GEOMAG_VAR1'] + electromagnetic_weights['GEOMAG_VAR2'] + electromagnetic_weights['GEOMAG_VAR3']
            iono_weight = electromagnetic_weights['IONO_VAR1'] + electromagnetic_weights['IONO_VAR2']
            
            solar_freq = red_solar * 20.0  # Solar cycle frequency
            geomag_freq = green_geomag * 15.0  # Geomagnetic frequency  
            iono_freq = blue_iono * 10.0  # Ionospheric frequency
            
            solar_seismic_coupling = red_solar * math.cos(2 * math.pi * solar_freq / 20.0)
            cyan = abs(solar_seismic_coupling) * lag_factors['solar'] * solar_weight * 100
            
            geomag_emf_coupling = green_geomag * math.sin(2 * math.pi * geomag_freq / 15.0)
            magenta = abs(geomag_emf_coupling) * lag_factors['geomagnetic'] * geomag_weight * 100
            
            iono_atmos_coupling = blue_iono * math.cos(2 * math.pi * iono_freq / 10.0)
            yellow = abs(iono_atmos_coupling) * lag_factors['ionospheric'] * iono_weight * 100
            
            space_coherence = (red_solar + green_geomag + blue_iono) / 3
            phase_alignment = math.cos(2 * math.pi * (cyan/100 - magenta/100)) * math.cos(2 * math.pi * (magenta/100 - yellow/100))
            complementary_interference = max(0.1, (1 + phase_alignment) / 2)
            black = (cyan + magenta + yellow) * complementary_interference * space_coherence * 0.4
        else:
            resonance_base = prediction['resonance_factor'] * 100
            magnetic_anomalies = magnetometer_result.get('analysis_summary', {}).get('total_anomalies', 0)
            
            cyan = resonance_base * (electromagnetic_weights['SOLAR_VAR1'] + electromagnetic_weights['SOLAR_VAR2']) * lag_factors['solar']
            magenta = magnetic_anomalies * 10 * (electromagnetic_weights['GEOMAG_VAR1'] + electromagnetic_weights['GEOMAG_VAR2']) * lag_factors['geomagnetic']
            yellow = prediction['predicted_magnitude'] * 10 * (electromagnetic_weights['IONO_VAR1'] + electromagnetic_weights['IONO_VAR2']) * lag_factors['ionospheric']
            black = (cyan + magenta + yellow) * (electromagnetic_weights['TECTONIC_VAR1'] + electromagnetic_weights['TECTONIC_VAR2']) * 10
        
        cmyk_factor = (cyan + magenta + yellow + black) / 400
        base_probability = prediction['earthquake_probability']
        
        # Apply tetrahedral correction to probability
        tetrahedral_correction = 1.0 + (math.sin(math.radians(tetrahedral_angle)) * 0.1)
        adjusted_probability = base_probability * (1 + cmyk_factor * 0.3) * tetrahedral_correction
        adjusted_probability = max(0.1, min(95.0, adjusted_probability))
        
        predictions.append({
            'day': prediction['day'],
            'date': prediction['date'],
            'probability_percent': round(adjusted_probability, 1),
            'magnitude_estimate': prediction['predicted_magnitude'],
            'risk_level': get_risk_level(adjusted_probability),
            'confidence_level': prediction['confidence_level'],
            'resonance_factor': prediction['resonance_factor'],
            'tetrahedral_angle': round(tetrahedral_angle, 2),
            'cmyk_values': {
                'cyan': round(cyan, 1),
                'magenta': round(magenta, 1),
                'yellow': round(yellow, 1),
                'black': round(black, 1)
            },
            'electromagnetic_weights': electromagnetic_weights,
            'lag_factors': lag_factors
        })
    
    return predictions

def calculate_rgb_model(location: LocationInput, space_weather_data: dict) -> List[dict]:
    predictions = []
    current_date = datetime.utcnow()
    
    space_data = space_weather_data.get('data', [])
    if not space_data:
        space_data = [{'bulk_speed': 400, 'imf_magnitude': 5, 'proton_density': 5}]
    
    solar_weights = {'VAR1': 0.12, 'VAR2': 0.10, 'VAR3': 0.08}  # 30% total
    geomag_weights = {'VAR1': 0.15, 'VAR2': 0.12, 'VAR3': 0.10}  # 37% total
    iono_weights = {'VAR1': 0.08, 'VAR2': 0.06}  # 14% total
    atmos_weights = {'VAR1': 0.09, 'VAR2': 0.07}  # 16% total
    tectonic_weights = {'VAR1': 0.03, 'VAR2': 0.03}  # 6% total
    
    lag_corrections = {
        'sunspot_lag': 0.8,    # 48h lag: 1.0 - (48/24) * 0.1
        'solar_flux_lag': 0.9, # 24h lag: 1.0 - (24/24) * 0.1  
        'geomagnetic_lag': 0.9625, # 6h lag: 1.0 - (6/24) * 0.15
        'ionospheric_lag': 0.92  # 24h lag: 1.0 - (24/24) * 0.08
    }
    
    if hasattr(location, 'latitude') and hasattr(location, 'longitude'):
        space_angle = 26.565  # Planetary angle of incidence for sun ray refraction
        earth_surface_angle = 54.74  # Base tetrahedral angle for CMYK lens mechanics
        
        depth_factor = min(abs(location.latitude) / 90.0, 1.0)  # Normalize latitude to depth factor
        base_angle = space_angle + (earth_surface_angle - space_angle) * depth_factor
        
        lat_adjustment = location.latitude * 0.1  # Latitude influence
        lon_adjustment = location.longitude * 0.05  # Longitude influence
        regional_modifier = get_regional_modifier(location.latitude, location.longitude)
        tetrahedral_angle = (base_angle + lat_adjustment + lon_adjustment) * regional_modifier
    else:
        tetrahedral_angle = 40.6525  # Average of 26.565° and 54.74°
    
    space_record = space_data[0] if space_data else {}
    bulk_speed = space_record.get('bulk_speed', 400)
    imf_magnitude = space_record.get('imf_magnitude', 5)
    proton_density = space_record.get('proton_density', 5)
    
    solar_var1 = bulk_speed * solar_weights['VAR1'] * lag_corrections['sunspot_lag']
    solar_var2 = (bulk_speed * 0.8) * solar_weights['VAR2'] * lag_corrections['solar_flux_lag']
    solar_var3 = (bulk_speed * 0.6) * solar_weights['VAR3'] * lag_corrections['solar_flux_lag']
    red_base = solar_var1 + solar_var2 + solar_var3
    
    geomag_var1 = imf_magnitude * 10 * geomag_weights['VAR1'] * lag_corrections['geomagnetic_lag']
    geomag_var2 = (imf_magnitude * 8) * geomag_weights['VAR2'] * lag_corrections['geomagnetic_lag']
    geomag_var3 = (imf_magnitude * 6) * geomag_weights['VAR3'] * lag_corrections['geomagnetic_lag']
    green_base = geomag_var1 + geomag_var2 + geomag_var3
    
    iono_var1 = proton_density * 12 * iono_weights['VAR1'] * lag_corrections['ionospheric_lag']
    iono_var2 = (proton_density * 8) * iono_weights['VAR2'] * lag_corrections['ionospheric_lag']
    blue_base = iono_var1 + iono_var2
    
    atmospheric_contribution = (bulk_speed + imf_magnitude + proton_density) / 3 * (atmos_weights['VAR1'] + atmos_weights['VAR2'])
    tectonic_contribution = math.sin(math.radians(tetrahedral_angle)) * (tectonic_weights['VAR1'] + tectonic_weights['VAR2']) * 100
    
    for day in range(1, 22):
        prediction_date = current_date + timedelta(days=day)
        
        daily_solar_angle = tetrahedral_angle + (day * 0.5)
        
        daily_red = red_base * (1 + math.sin(math.radians(daily_solar_angle)) * 0.1) + atmospheric_contribution
        daily_green = green_base * (1 + math.cos(math.radians(daily_solar_angle)) * 0.1) + tectonic_contribution
        daily_blue = blue_base * (1 + math.sin(math.radians(daily_solar_angle * 2)) * 0.05)
        
        rgb_alignment = abs(daily_red - daily_green) + abs(daily_green - daily_blue) + abs(daily_blue - daily_red)
        constructive_factor = 1.0 + (1.0 / (1.0 + rgb_alignment * 0.01))
        
        rgb_intensity = (daily_red + daily_green + daily_blue) / 3 * constructive_factor
        probability = min(95.0, max(0.1, rgb_intensity * 0.6))
        
        magnitude_base = 4.0 + (rgb_intensity / 80.0) * 3.5
        magnitude = min(8.5, max(3.0, magnitude_base))
        
        predictions.append({
            'day': day,
            'date': prediction_date.strftime('%Y-%m-%d'),
            'probability_percent': round(probability, 1),
            'magnitude_estimate': round(magnitude, 1),
            'risk_level': get_risk_level(probability),
            'confidence_level': 'medium',
            'solar_angle': round(daily_solar_angle, 2),
            'tetrahedral_angle': round(tetrahedral_angle, 2),
            'constructive_factor': round(constructive_factor, 3),
            'rgb_values': {
                'red': round(daily_red, 1),
                'green': round(daily_green, 1),
                'blue': round(daily_blue, 1)
            },
            'electromagnetic_variables': {
                'solar_vars': [solar_var1, solar_var2, solar_var3],
                'geomag_vars': [geomag_var1, geomag_var2, geomag_var3],
                'iono_vars': [iono_var1, iono_var2],
                'atmospheric': atmospheric_contribution,
                'tectonic': tectonic_contribution
            },
            'lag_corrections': lag_corrections
        })
    
    return predictions

def calculate_solar_resonance(location: LocationInput, space_data: List[dict], day: int) -> float:
    if not space_data:
        return 50.0
    
    recent_data = space_data[-24:]
    
    solar_wind_speeds = [d.get('bulk_speed', 400) for d in recent_data if d.get('bulk_speed')]
    avg_speed = sum(solar_wind_speeds) / len(solar_wind_speeds) if solar_wind_speeds else 400
    
    base_resonance = (avg_speed - 300) / 10
    
    time_decay = max(0.1, 1.0 - (day * 0.05))
    
    return max(0, min(100, base_resonance * time_decay))

def calculate_magnetic_resonance(location: LocationInput, space_data: List[dict], day: int) -> float:
    if not space_data:
        return 45.0
    
    recent_data = space_data[-24:]
    
    imf_magnitudes = [d.get('imf_magnitude', 5) for d in recent_data if d.get('imf_magnitude')]
    avg_imf = sum(imf_magnitudes) / len(imf_magnitudes) if imf_magnitudes else 5
    
    base_resonance = avg_imf * 8
    
    latitude_factor = 1.0 + abs(location.latitude) / 90.0 * 0.3
    time_decay = max(0.1, 1.0 - (day * 0.04))
    
    return max(0, min(100, base_resonance * latitude_factor * time_decay))

def calculate_ionospheric_resonance(location: LocationInput, space_data: List[dict], day: int) -> float:
    if not space_data:
        return 40.0
    
    recent_data = space_data[-24:]
    
    proton_densities = [d.get('proton_density', 5) for d in recent_data if d.get('proton_density')]
    avg_density = sum(proton_densities) / len(proton_densities) if proton_densities else 5
    
    base_resonance = avg_density * 6
    
    longitude_factor = 1.0 + abs(location.longitude) / 180.0 * 0.2
    time_decay = max(0.1, 1.0 - (day * 0.06))
    
    return max(0, min(100, base_resonance * longitude_factor * time_decay))

def calculate_refraction_factor(latitude: float, altitude_km: float) -> float:
    base_refraction = 1.0
    
    altitude_factor = (altitude_km - 80) / 5.0 * 0.1
    latitude_factor = abs(latitude) / 90.0 * 0.2
    
    return base_refraction + altitude_factor + latitude_factor

def calculate_combined_predictions(cmyk_predictions: List[dict], rgb_predictions: List[dict]) -> List[dict]:
    combined = []
    
    for i in range(min(len(cmyk_predictions), len(rgb_predictions))):
        cmyk_pred = cmyk_predictions[i]
        rgb_pred = rgb_predictions[i]
        
        # Quantum fusion of RGB and CMYK predictions
        rgb_intensity = (rgb_pred['rgb_values']['red'] + rgb_pred['rgb_values']['green'] + rgb_pred['rgb_values']['blue']) / 3
        cmyk_intensity = (cmyk_pred['cmyk_values']['cyan'] + cmyk_pred['cmyk_values']['magenta'] + cmyk_pred['cmyk_values']['yellow']) / 3
        
        coherence_factor = 1.0 - abs(rgb_intensity - cmyk_intensity) / max(rgb_intensity, cmyk_intensity, 1.0)
        
        rgb_weight = 0.4 + (coherence_factor * 0.2)
        cmyk_weight = 1.0 - rgb_weight
        
        combined_probability = (
            cmyk_pred['probability_percent'] * cmyk_weight + 
            rgb_pred['probability_percent'] * rgb_weight
        )
        
        combined_magnitude = (
            cmyk_pred['magnitude_estimate'] * cmyk_weight + 
            rgb_pred['magnitude_estimate'] * rgb_weight
        )
        
        combined_pred = {
            'day': cmyk_pred['day'],
            'date': cmyk_pred['date'],
            'probability_percent': round(combined_probability, 1),
            'magnitude_estimate': round(combined_magnitude, 1),
            'risk_level': get_risk_level(combined_probability),
            'confidence_level': cmyk_pred['confidence_level'],
            'quantum_coherence': round(coherence_factor, 3),
            'rgb_weight': round(rgb_weight, 3),
            'cmyk_weight': round(cmyk_weight, 3),
            'rgb_values': rgb_pred['rgb_values'],
            'cmyk_values': cmyk_pred['cmyk_values']
        }
        combined.append(combined_pred)
    
    return combined

def generate_3d_wave_field(location: LocationInput, prediction_result: EngineResult, day: int) -> CymaticData:
    import numpy as np
    
    grid_size = 50
    num_layers = 36
    
    x = np.linspace(-5, 5, grid_size)
    y = np.linspace(-5, 5, grid_size)
    z = np.linspace(-2, 2, grid_size // 2)
    X, Y, Z = np.meshgrid(x, y, z, indexing='ij')
    
    wave_field = np.zeros_like(X)
    phase_lock_points = []
    
    if day <= len(prediction_result.predictions):
        current_prediction = prediction_result.predictions[day - 1]
        earthquake_probability = current_prediction.probability_percent / 100.0
        resonance_factor = current_prediction.resonance_factor or 0.5
    else:
        earthquake_probability = 0.1
        resonance_factor = 0.1
    
    # Scale phase lock points to correlate with earthquake probability
    num_phase_lock_points = max(1, int(num_layers * earthquake_probability * resonance_factor * 2.0))
    
    for layer in range(num_layers):
        frequency = 0.1 + layer * 0.05
        amplitude = 1.0 + layer * 0.1
        phase = layer * 0.2
        
        r_xyz = np.sqrt(X**2 + Y**2 + Z**2)
        layer_wave = amplitude * np.sin(frequency * r_xyz + phase) * earthquake_probability
        
        schumann_modulation = 1.0 + 0.2 * np.sin(7.83 * layer * 0.1)
        layer_wave *= schumann_modulation
        
        wave_field += layer_wave
        
        if layer < num_phase_lock_points:
            lock_x = 3 * np.cos(layer * 0.5)
            lock_y = 3 * np.sin(layer * 0.5)
            lock_z = np.sin(layer * 0.2)
            phase_lock_points.append([lock_x, lock_y, lock_z, earthquake_probability])
    
    # Calculate resonance overlap based on actual earthquake probability
    base_resonance = earthquake_probability * 100
    resonance_overlap_percent = min(base_resonance * resonance_factor * 1.5, 100.0)
    
    alert_level = "CRITICAL" if resonance_overlap_percent > 40 else "HIGH" if resonance_overlap_percent > 20 else "NORMAL"
    
    return CymaticData(
        wave_field=wave_field.tolist(),
        phase_lock_points=phase_lock_points,
        resonance_overlap_percent=round(resonance_overlap_percent, 1),
        alert_level=alert_level,
        day=day
    )

def calculate_space_summary(predictions: List[dict]) -> dict:
    if not predictions:
        return {}
    
    probabilities = [p['probability_percent'] for p in predictions]
    magnitudes = [p['magnitude_estimate'] for p in predictions]
    
    return {
        'max_probability': max(probabilities),
        'avg_probability': sum(probabilities) / len(probabilities),
        'max_magnitude': max(magnitudes),
        'avg_magnitude': sum(magnitudes) / len(magnitudes),
        'high_risk_days': len([p for p in predictions if p['risk_level'] in ['HIGH', 'ELEVATED']]),
        'total_days': len(predictions)
    }

def calculate_combined_summary(brettearth: EngineResult, brettspace: EngineResult, combined: List[dict]) -> dict:
    if not combined:
        return {}
    
    probabilities = [p['probability_percent'] for p in combined]
    magnitudes = [p['magnitude_estimate'] for p in combined]
    
    return {
        'engines_used': ['BRETTEARTH', 'BRETTSPACE'],
        'fusion_method': 'weighted_average',
        'max_probability': max(probabilities),
        'avg_probability': sum(probabilities) / len(probabilities),
        'max_magnitude': max(magnitudes),
        'avg_magnitude': sum(magnitudes) / len(magnitudes),
        'high_risk_days': len([p for p in combined if p['risk_level'] in ['HIGH', 'ELEVATED']]),
        'total_days': len(combined),
        'brettearth_contribution': 60,
        'brettspace_contribution': 40
    }

def get_risk_level(probability: float) -> str:
    if probability >= 60: return "HIGH"
    elif probability >= 40: return "ELEVATED"
    elif probability >= 20: return "MODERATE"
    else: return "LOW"

def _determine_region_from_coordinates(latitude: float, longitude: float) -> str:
    """Determine geographical region from coordinates for regional modifiers"""
    if 35 <= latitude <= 70 and -10 <= longitude <= 40:
        return "Europe"
    elif -35 <= latitude <= 35 and -20 <= longitude <= 50:
        return "Africa"
    elif 10 <= latitude <= 70 and 25 <= longitude <= 180:
        return "Asia"
    elif -60 <= latitude <= 70 and -170 <= longitude <= -30:
        return "Americas"
    elif 10 <= latitude <= 40 and 25 <= longitude <= 65:
        return "Middle East"
    elif -50 <= latitude <= 10 and 110 <= longitude <= 180:
        return "Oceania"
    elif latitude >= 66.5:
        return "Arctic"
    else:
        return "Unknown"

def get_regional_modifier(latitude: float, longitude: float) -> float:
    """Get regional modifier for harmonic amplification calculations"""
    region = _determine_region_from_coordinates(latitude, longitude)
    regional_modifiers = {
        "Europe": 1.0,
        "Africa": 1.1,
        "Asia": 0.9,
        "Americas": 1.2,
        "Middle East": 1.05,
        "Oceania": 0.95,
        "Arctic": 0.8,
        "Unknown": 1.0
    }
    return regional_modifiers.get(region, 1.0)

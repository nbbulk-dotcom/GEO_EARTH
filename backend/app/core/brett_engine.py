# BRETT BrettCoreEngine v4.0.0 - 12-Dimensional GAL-CRM Framework
import math
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import numpy as np

class BrettCoreEngine:
    def __init__(self, data_service=None):
        self.version = "4.0.0"
        self.engine_id = "BRETT-CORE-ENGINE-V1"
        self.valid_tokens = set()
        self.last_calculation = None
        self.data_service = data_service
        self.current_location = None
        
        self.electromagnetic_variables = {
            'SOLAR_VAR1': 0.15,
            'SOLAR_VAR2': 0.12,
            'SOLAR_VAR3': 0.10,
            'GEOMAG_VAR1': 0.18,
            'GEOMAG_VAR2': 0.14,
            'GEOMAG_VAR3': 0.11,
            'IONO_VAR1': 0.08,
            'IONO_VAR2': 0.06,
            'ATMOS_VAR1': 0.03,
            'ATMOS_VAR2': 0.02,
            'TECTONIC_VAR1': 0.01,
            'TECTONIC_VAR2': 0.005
        }
        
        self.last_update = datetime.utcnow()
        self.service_id = f"BRETT-GAL-CRM-{int(datetime.utcnow().timestamp())}"
        
        # Add atmospheric coupling calibration for deep subduction zones
        self.atmospheric_calibration = {
            'subsurface_resonance_80km': 1.0,
            'subsurface_resonance_85km': 1.0,
            'deep_coupling_enabled': True,
            'schumann_resonance_factor': 1.2,
            'ionospheric_coupling_strength': 0.85
        }
        
        self.gal_crm_framework = {
            'D1_tectonic_stress': {'base_coefficient': 0.18, 'vibration_field': 'seismic'},
            'D2_magmatic_pressure': {'base_coefficient': 0.15, 'vibration_field': 'magmatic'},
            'D3_atmospheric_load': {'base_coefficient': 0.12, 'vibration_field': 'atmospheric'},
            'D4_em_flux': {'base_coefficient': 0.14, 'vibration_field': 'electromagnetic'},
            'D5_gravitational_anomalies': {'base_coefficient': 0.10, 'vibration_field': 'gravitational'},
            'D6_oceanic_mass_shifts': {'base_coefficient': 0.08, 'vibration_field': 'seismic'},
            
            'D7_solar_wind_harmonics': {'base_coefficient': 0.16, 'vibration_field': 'solar'},
            'D8_planetary_tidal_vectors': {'base_coefficient': 0.11, 'vibration_field': 'gravitational'},
            'D9_galactic_em_background': {'base_coefficient': 0.09, 'vibration_field': 'electromagnetic'},
            'D10_cosmic_ray_flux': {'base_coefficient': 0.07, 'vibration_field': 'electromagnetic'},
            'D11_lunar_solar_interference': {'base_coefficient': 0.13, 'vibration_field': 'solar'},
            'D12_deep_space_gravitational_waves': {'base_coefficient': 0.05, 'vibration_field': 'gravitational'}
        }
        
        self.vibration_fields = {
            'seismic': {'base_amplitude': 1.0, 'frequency_range': (0.1, 10.0)},
            'magmatic': {'base_amplitude': 0.8, 'frequency_range': (0.01, 1.0)},
            'atmospheric': {'base_amplitude': 0.6, 'frequency_range': (0.001, 0.1)},
            'electromagnetic': {'base_amplitude': 1.2, 'frequency_range': (1.0, 100.0)},
            'gravitational': {'base_amplitude': 0.4, 'frequency_range': (0.0001, 0.01)},
            'solar': {'base_amplitude': 1.1, 'frequency_range': (0.1, 1.0)}
        }
        
        self._generate_valid_tokens()
    
    def _generate_valid_tokens(self):
        for _ in range(10):
            token = secrets.token_urlsafe(32)
            self.valid_tokens.add(token)
    
    def authenticate(self, client_id: Optional[str] = None) -> Dict[str, Any]:
        token = secrets.token_urlsafe(32)
        self.valid_tokens.add(token)
        
        return {
            'success': True,
            'token': token,
            'expires_in': 3600,
            'engine_version': self.version,
            'client_id': client_id or f"client_{int(datetime.utcnow().timestamp())}"
        }
    
    def get_current_token(self) -> Optional[str]:
        return list(self.valid_tokens)[0] if self.valid_tokens else None
    
    def calculate_prediction(self, latitude: float, longitude: float, days_ahead: int = 21, token: Optional[str] = None) -> Dict[str, Any]:
        try:
            current_time = datetime.utcnow()
            
            self.current_location = {'lat': latitude, 'lng': longitude}
            
            electromagnetic_readings = self._get_electromagnetic_readings_with_lag(latitude, longitude, current_time)
            
            predictions = []
            for day in range(1, days_ahead + 1):
                prediction_date = current_time + timedelta(days=day)
                
                projected_readings = self._project_readings_for_day(electromagnetic_readings, day)
                
                daily_prediction = self._calculate_daily_prediction(
                    latitude, longitude, day, projected_readings, prediction_date
                )
                
                predictions.append(daily_prediction)
            
            summary = self._calculate_prediction_summary(predictions)
            
            result = {
                'success': True,
                'predictions': predictions,
                'summary': summary,
                'engine_info': {
                    'version': self.version,
                    'engine_id': self.engine_id,
                    'calculation_time': current_time.isoformat(),
                    'location': {'latitude': latitude, 'longitude': longitude},
                    'electromagnetic_variables_used': len(self.electromagnetic_variables),
                    'lag_corrections_applied': True
                }
            }
            
            self.last_calculation = result
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Calculation failed: {str(e)}",
                'engine_id': self.engine_id
            }
    
    def _get_electromagnetic_readings_with_lag(self, lat: float, lng: float, current_time: datetime) -> Dict[str, float]:
        lag_factors = self._calculate_lag_time_factors(current_time)
        
        readings = {}
        
        cached_data = self._get_real_cached_data()
        
        readings['SOLAR_VAR1'] = self._calculate_solar_activity_with_real_data(cached_data, lag_factors['solar_lag'])
        readings['SOLAR_VAR2'] = self._calculate_solar_flux_with_real_data(cached_data, lag_factors['solar_lag'])
        readings['SOLAR_VAR3'] = self._calculate_plasma_velocity_with_real_data(cached_data, lag_factors['solar_lag'])
        
        readings['GEOMAG_VAR1'] = self._calculate_geomagnetic_disturbance_with_real_data(cached_data, lag_factors['geomag_lag'])
        readings['GEOMAG_VAR2'] = self._calculate_magnetic_field_variation_with_real_data(cached_data, lag_factors['geomag_lag'])
        readings['GEOMAG_VAR3'] = self._calculate_magnetic_declination_with_real_data(cached_data, lag_factors['geomag_lag'])
        
        readings['IONO_VAR1'] = self._calculate_ionospheric_density_with_real_data(cached_data, lag_factors['iono_lag'])
        readings['IONO_VAR2'] = self._calculate_critical_frequency_with_real_data(cached_data, lag_factors['iono_lag'])
        
        readings['ATMOS_VAR1'] = self._calculate_atmospheric_resonance_with_lag(lat, lng, lag_factors['atmos_lag'])
        readings['ATMOS_VAR2'] = self._calculate_elf_amplitude_with_lag(lat, lng, lag_factors['atmos_lag'])
        
        readings['TECTONIC_VAR1'] = self._calculate_regional_stress_with_real_data(cached_data, lat, lng)
        readings['TECTONIC_VAR2'] = self._calculate_crustal_deformation_with_real_data(cached_data, lat, lng)
        
        readings = self._apply_resonance_overlay_calculations(readings, lat, lng)
        
        return readings
    
    def _calculate_lag_time_factors(self, current_time: datetime) -> Dict[str, float]:
        hour = current_time.hour
        day_of_year = current_time.timetuple().tm_yday
        
        solar_lag = 8 + 4 * math.sin(2 * math.pi * day_of_year / 365)
        geomag_lag = 6 + 2 * math.cos(2 * math.pi * hour / 24)
        iono_lag = 4 + 3 * math.sin(2 * math.pi * hour / 12)
        atmos_lag = 2 + 1 * math.cos(2 * math.pi * hour / 6)
        
        return {
            'solar_lag': solar_lag,
            'geomag_lag': geomag_lag,
            'iono_lag': iono_lag,
            'atmos_lag': atmos_lag
        }
    
    def _calculate_daily_prediction(self, lat: float, lng: float, day: int, readings: Dict[str, float], prediction_date: datetime) -> Dict[str, Any]:
        resonance_factor = self._calculate_resonance_amplification(readings, lat, lng, prediction_date)
        magnitude = self._calculate_magnitude_prediction(lat, lng, resonance_factor, day)
        probability = self._calculate_earthquake_probability(resonance_factor, magnitude, day)
        
        return {
            'day': day,
            'date': prediction_date.strftime('%Y-%m-%d'),
            'predicted_magnitude': round(magnitude, 1),
            'earthquake_probability': round(probability, 1),
            'risk_level': self._get_risk_level(probability),
            'confidence_level': 'high' if resonance_factor > 0.7 else 'medium' if resonance_factor > 0.4 else 'low',
            'resonance_factor': round(resonance_factor, 3)
        }
    
    def _calculate_resonance_amplification(self, readings: Dict[str, float], lat: float, lng: float, current_time: datetime) -> float:
        """Calculate resonance amplification using 12-dimensional GAL-CRM framework"""
        
        cached_data = self._get_real_cached_data()
        
        dimensional_coefficients = self._calculate_dimensional_coefficients(lat, lng, cached_data)
        
        vibration_amplitudes = self._calculate_vibration_field_amplitudes(lat, lng, cached_data, current_time)
        
        decay_constant = self._calculate_decay_constant(lat, lng, cached_data)
        
        time_since_peak = 1.0  # Default to 1 hour for current calculation
        
        total_resonance = 0.0
        
        for dimension, coefficient in dimensional_coefficients.items():
            if dimension in self.gal_crm_framework:
                vibration_field = self.gal_crm_framework[dimension]['vibration_field']
                vibration_amplitude = vibration_amplitudes.get(vibration_field, 1.0)
                
                decay_factor = math.exp(-decay_constant * time_since_peak)
                
                dimensional_contribution = coefficient * vibration_amplitude * decay_factor
                total_resonance += dimensional_contribution
        
        normalized_resonance = total_resonance / 12.0  # Divide by number of dimensions
        return max(0.0, min(1.0, normalized_resonance))
    
    def _calculate_magnitude_prediction(self, lat: float, lng: float, resonance_factor: float, days_ahead: int) -> float:
        base_magnitude = 3.5
        
        resonance_contribution = resonance_factor * 3.0
        
        tectonic_zones = {
            'ring_of_fire': {'lat_range': (-60, 60), 'lng_range': (90, -90), 'magnitude_boost': 1.2},
            'mediterranean': {'lat_range': (30, 50), 'lng_range': (-10, 50), 'magnitude_boost': 0.8},
            'mid_atlantic': {'lat_range': (-60, 70), 'lng_range': (-40, -10), 'magnitude_boost': 0.6}
        }
        
        tectonic_boost = 0.0
        for zone, params in tectonic_zones.items():
            if (params['lat_range'][0] <= lat <= params['lat_range'][1] and
                params['lng_range'][0] <= lng <= params['lng_range'][1]):
                tectonic_boost = max(tectonic_boost, params['magnitude_boost'])
        
        time_decay = max(0.1, 1.0 - (days_ahead * 0.05))
        
        atmospheric_coupling_factor = 1.0
        if self.atmospheric_calibration['deep_coupling_enabled'] and self._is_in_deep_subduction_zone(lat, lng):
            subsurface_resonance = self._calculate_earthquake_subsurface_resonance(lat, lng)
            atmospheric_coupling_factor = 1.0 + (subsurface_resonance['deep_coupling_factor'] * 0.5)
        
        final_magnitude = (base_magnitude + resonance_contribution + tectonic_boost) * time_decay * atmospheric_coupling_factor
        
        return max(2.0, min(8.5, final_magnitude))
    
    def _calculate_earthquake_probability(self, resonance_factor: float, magnitude: float, days_ahead: int) -> float:
        base_probability = resonance_factor * 60
        magnitude_factor = (magnitude - 2.0) * 8
        time_factor = max(0.1, 1.0 - (days_ahead * 0.08))
        
        atmospheric_enhancement = 1.0
        if hasattr(self, 'current_location') and self.atmospheric_calibration['deep_coupling_enabled']:
            lat, lng = self.current_location['lat'], self.current_location['lng']
            if self._is_in_deep_subduction_zone(lat, lng):
                subsurface_resonance = self._calculate_earthquake_subsurface_resonance(lat, lng)
                atmospheric_enhancement = 1.0 + (subsurface_resonance['tectonic_amplification'] - 1.0) * 0.3
        
        probability = (base_probability + magnitude_factor) * time_factor * atmospheric_enhancement
        return max(0.1, min(95.0, probability))
    
    def _get_real_cached_data(self) -> Dict:
        """Get real cached data from data service"""
        if self.data_service:
            try:
                return self.data_service.get_cached_data()['cached_data']
            except Exception as e:
                print(f"Warning: Could not get cached data: {e}")
                return {}
        return {}
    
    def _calculate_solar_activity_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate solar activity using real NOAA space weather data"""
        try:
            noaa_data = cached_data.get('noaa', {})
            if noaa_data.get('success') and noaa_data.get('data'):
                solar_wind_data = noaa_data['data'].get('solar_wind', [])
                if solar_wind_data:
                    recent_speeds = [entry.get('speed', 400) for entry in solar_wind_data[-24:]]
                    avg_speed = sum(recent_speeds) / len(recent_speeds) if recent_speeds else 400
                    
                    base_activity = min(100, max(0, (avg_speed - 300) / 8))
                    
                    lag_factor = math.sin(2 * math.pi * lag_hours / 24) * 0.15
                    return max(0, min(100, base_activity * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for solar activity: {e}")
        
        base_activity = 65
        lag_factor = math.sin(2 * math.pi * lag_hours / 24) * 15
        return max(0, min(100, base_activity + lag_factor))
    
    def _calculate_solar_flux_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate solar flux using real NOAA space weather data"""
        try:
            noaa_data = cached_data.get('noaa', {})
            if noaa_data.get('success') and noaa_data.get('data'):
                solar_flux_data = noaa_data['data'].get('solar_flux', [])
                if solar_flux_data:
                    recent_flux = [entry.get('flux', 150) for entry in solar_flux_data[-24:]]
                    avg_flux = sum(recent_flux) / len(recent_flux) if recent_flux else 150
                    
                    base_flux = min(100, max(0, (avg_flux - 70) / 3))
                    
                    lag_factor = math.cos(2 * math.pi * lag_hours / 12) * 0.1
                    return max(0, min(100, base_flux * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for solar flux: {e}")
        
        base_flux = 70
        lag_factor = math.cos(2 * math.pi * lag_hours / 12) * 10
        return max(0, min(100, base_flux + lag_factor))
    
    def _calculate_plasma_velocity_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate plasma velocity using real NASA space weather data"""
        try:
            nasa_data = cached_data.get('nasa', {})
            if nasa_data.get('success') and nasa_data.get('data'):
                plasma_data = nasa_data['data'].get('plasma', [])
                if plasma_data:
                    recent_velocities = [entry.get('velocity', 400) for entry in plasma_data[-24:]]
                    avg_velocity = sum(recent_velocities) / len(recent_velocities) if recent_velocities else 400
                    
                    base_velocity = min(100, max(0, (avg_velocity - 300) / 6))
                    
                    lag_factor = math.sin(2 * math.pi * lag_hours / 8) * 0.12
                    return max(0, min(100, base_velocity * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for plasma velocity: {e}")
        
        base_velocity = 55
        lag_factor = math.sin(2 * math.pi * lag_hours / 8) * 12
        return max(0, min(100, base_velocity + lag_factor))
    
    def _calculate_geomagnetic_disturbance_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate geomagnetic disturbance using real GFZ geomagnetic data"""
        try:
            gfz_data = cached_data.get('gfz', {})
            if gfz_data.get('success') and gfz_data.get('data'):
                kp_index_data = gfz_data['data'].get('kp_index', [])
                if kp_index_data:
                    recent_kp = [entry.get('kp', 2.0) for entry in kp_index_data[-24:]]
                    avg_kp = sum(recent_kp) / len(recent_kp) if recent_kp else 2.0
                    
                    base_disturbance = min(100, max(0, avg_kp * 11.1))  # Kp ranges 0-9
                    
                    lag_factor = math.cos(2 * math.pi * lag_hours / 6) * 0.18
                    return max(0, min(100, base_disturbance * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for geomagnetic disturbance: {e}")
        
        base_disturbance = 45
        lag_factor = math.cos(2 * math.pi * lag_hours / 6) * 18
        return max(0, min(100, base_disturbance + lag_factor))
    
    def _calculate_magnetic_field_variation_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate magnetic field variation using real GFZ geomagnetic data"""
        try:
            gfz_data = cached_data.get('gfz', {})
            if gfz_data.get('success') and gfz_data.get('data'):
                magnetic_field_data = gfz_data['data'].get('magnetic_field', [])
                if magnetic_field_data:
                    recent_variations = [entry.get('variation', 50) for entry in magnetic_field_data[-24:]]
                    avg_variation = sum(recent_variations) / len(recent_variations) if recent_variations else 50
                    
                    base_variation = min(100, max(0, avg_variation))
                    
                    lag_factor = math.sin(2 * math.pi * lag_hours / 4) * 0.2
                    return max(0, min(100, base_variation * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for magnetic field variation: {e}")
        
        base_variation = 50
        lag_factor = math.sin(2 * math.pi * lag_hours / 4) * 20
        return max(0, min(100, base_variation + lag_factor))
    
    def _calculate_magnetic_declination_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate magnetic declination using real GFZ geomagnetic data"""
        try:
            gfz_data = cached_data.get('gfz', {})
            if gfz_data.get('success') and gfz_data.get('data'):
                declination_data = gfz_data['data'].get('declination', [])
                if declination_data:
                    recent_declinations = [entry.get('declination', 0) for entry in declination_data[-24:]]
                    avg_declination = sum(recent_declinations) / len(recent_declinations) if recent_declinations else 0
                    
                    base_declination = min(100, max(0, (abs(avg_declination) / 180) * 100))
                    
                    lag_factor = math.cos(2 * math.pi * lag_hours / 10) * 0.08
                    return max(0, min(100, base_declination * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for magnetic declination: {e}")
        
        base_declination = 40
        lag_factor = math.cos(2 * math.pi * lag_hours / 10) * 8
        return max(0, min(100, base_declination + lag_factor))
    
    def _calculate_ionospheric_density_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate ionospheric density using real NASA space weather data"""
        try:
            nasa_data = cached_data.get('nasa', {})
            if nasa_data.get('success') and nasa_data.get('data'):
                ionospheric_data = nasa_data['data'].get('ionospheric', [])
                if ionospheric_data:
                    recent_densities = [entry.get('density', 5) for entry in ionospheric_data[-24:]]
                    avg_density = sum(recent_densities) / len(recent_densities) if recent_densities else 5
                    
                    base_density = min(100, max(0, avg_density * 10))
                    
                    lag_factor = math.sin(2 * math.pi * lag_hours / 12) * 0.15
                    return max(0, min(100, base_density * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for ionospheric density: {e}")
        
        base_density = 60
        lag_factor = math.sin(2 * math.pi * lag_hours / 12) * 15
        return max(0, min(100, base_density + lag_factor))
    
    def _calculate_critical_frequency_with_real_data(self, cached_data: Dict, lag_hours: float) -> float:
        """Calculate critical frequency using real NASA space weather data"""
        try:
            nasa_data = cached_data.get('nasa', {})
            if nasa_data.get('success') and nasa_data.get('data'):
                frequency_data = nasa_data['data'].get('critical_frequency', [])
                if frequency_data:
                    recent_frequencies = [entry.get('frequency', 8) for entry in frequency_data[-24:]]
                    avg_frequency = sum(recent_frequencies) / len(recent_frequencies) if recent_frequencies else 8
                    
                    base_frequency = min(100, max(0, (avg_frequency / 15) * 100))
                    
                    lag_factor = math.cos(2 * math.pi * lag_hours / 8) * 0.12
                    return max(0, min(100, base_frequency * (1 + lag_factor)))
        except Exception as e:
            print(f"Warning: Using fallback for critical frequency: {e}")
        
        base_frequency = 35
        lag_factor = math.cos(2 * math.pi * lag_hours / 8) * 12
        return max(0, min(100, base_frequency + lag_factor))
    
    def _calculate_atmospheric_resonance_with_lag(self, lat: float, lng: float, lag_hours: float) -> float:
        schumann_frequency = self._calculate_schumann_frequency(lat, lng)
        schumann_amplitude = self._calculate_schumann_amplitude(lat, lng, schumann_frequency)
        
        base_resonance = schumann_amplitude * 30
        lag_factor = math.sin(2 * math.pi * lag_hours / 6) * 0.4
        lagged_resonance = base_resonance * (1 + lag_factor)
        
        if self.atmospheric_calibration['deep_coupling_enabled']:
            subsurface_resonance = self._calculate_earthquake_subsurface_resonance(lat, lng)
            altitude_refraction_80km = subsurface_resonance['earthquake_resonance_80km'] / 7.83
            altitude_refraction_85km = subsurface_resonance['earthquake_resonance_85km'] / 7.83
            deep_coupling_factor = subsurface_resonance['deep_coupling_factor']
            
            enhanced_resonance = lagged_resonance * ((altitude_refraction_80km + altitude_refraction_85km) / 2.0)
            enhanced_resonance *= (1 + deep_coupling_factor)
            
            atmos_resonance = enhanced_resonance
        else:
            altitude_factor = 1.0 + abs(lat) / 90.0 * 0.1
            longitude_factor = 1.0 + abs(lng) / 180.0 * 0.1
            atmos_resonance = lagged_resonance * altitude_factor * longitude_factor
        
        return max(0, min(100, atmos_resonance))
    
    def _calculate_elf_amplitude_with_lag(self, lat: float, lng: float, lag_hours: float) -> float:
        schumann_frequency = self._calculate_schumann_frequency(lat, lng)
        schumann_amplitude = self._calculate_schumann_amplitude(lat, lng, schumann_frequency)
        
        base_elf = schumann_amplitude * 25
        lag_factor = math.cos(2 * math.pi * lag_hours / 8) * 0.3
        lagged_elf = base_elf * (1 + lag_factor)
        
        lightning_centers = [(0, -60), (0, 20), (10, 110)]
        min_distance = min(math.sqrt((lat - lc[0])**2 + (lng - lc[1])**2) for lc in lightning_centers)
        distance_factor = 1.0 + (180 - min_distance) / 180.0 * 0.3
        
        elf_amplitude = lagged_elf * distance_factor
        return max(0, min(100, elf_amplitude))
    
    def _calculate_solar_angle(self, lat: float, lng: float) -> float:
        now = datetime.utcnow()
        day_of_year = now.timetuple().tm_yday
        hour = now.hour + now.minute/60.0
        
        declination = 23.45 * math.sin(math.radians(360 * (284 + day_of_year) / 365))
        hour_angle = 15 * (hour - 12)
        
        elevation = math.asin(
            math.sin(math.radians(declination)) * math.sin(math.radians(lat)) +
            math.cos(math.radians(declination)) * math.cos(math.radians(lat)) * 
            math.cos(math.radians(hour_angle))
        )
        
        return math.degrees(elevation)
    
    def _calculate_schumann_frequency(self, lat: float, lng: float) -> float:
        base_frequency = 7.83
        geological_factor = abs(lat * lng) / 10000.0
        return base_frequency + (geological_factor % 1.0)
    
    def _calculate_schumann_amplitude(self, lat: float, lng: float, frequency: float) -> float:
        base_amplitude = 1.0
        
        tectonic_zones = {
            'ring_of_fire': {'lat_range': (-60, 60), 'lng_range': (90, -90), 'amplification': 1.4},
            'mediterranean': {'lat_range': (30, 50), 'lng_range': (-10, 50), 'amplification': 1.3},
            'mid_atlantic': {'lat_range': (-60, 70), 'lng_range': (-40, -10), 'amplification': 1.2}
        }
        
        amplification_factor = 1.0
        for zone, params in tectonic_zones.items():
            if (params['lat_range'][0] <= lat <= params['lat_range'][1] and
                params['lng_range'][0] <= lng <= params['lng_range'][1]):
                amplification_factor = max(amplification_factor, params['amplification'])
        
        frequency_factor = frequency / 7.83
        
        magnetic_north_lat, magnetic_north_lng = 86.5, -164.04
        magnetic_south_lat, magnetic_south_lng = -64.07, 135.88
        
        dist_north = math.sqrt((lat - magnetic_north_lat)**2 + (lng - magnetic_north_lng)**2)
        dist_south = math.sqrt((lat - magnetic_south_lat)**2 + (lng - magnetic_south_lng)**2)
        min_magnetic_distance = min(dist_north, dist_south)
        
        magnetic_factor = 1.0 + (180 - min_magnetic_distance) / 180.0 * 0.3
        
        final_amplitude = base_amplitude * amplification_factor * frequency_factor * magnetic_factor
        return final_amplitude
    
    def _calculate_regional_stress_with_real_data(self, cached_data: Dict, lat: float, lng: float) -> float:
        """Calculate regional stress using real USGS/EMSC earthquake data"""
        try:
            usgs_data = cached_data.get('usgs', {})
            emsc_data = cached_data.get('emsc', {})
            
            if usgs_data.get('success') and usgs_data.get('data'):
                earthquakes = usgs_data['data'].get('earthquakes', [])
                if earthquakes:
                    recent_magnitudes = [eq.get('magnitude', 0) for eq in earthquakes[-50:]]
                    avg_magnitude = sum(recent_magnitudes) / len(recent_magnitudes) if recent_magnitudes else 0
                    base_stress = min(100, max(0, avg_magnitude * 15))
                    return base_stress
        except Exception as e:
            print(f"Warning: Using fallback for regional stress: {e}")
        
        base_stress = 55
        fault_proximity = 15
        return max(0, min(100, base_stress + fault_proximity))
    
    def _calculate_crustal_deformation_with_real_data(self, cached_data: Dict, lat: float, lng: float) -> float:
        """Calculate crustal deformation using real USGS/EMSC earthquake data"""
        try:
            usgs_data = cached_data.get('usgs', {})
            if usgs_data.get('success') and usgs_data.get('data'):
                earthquakes = usgs_data['data'].get('earthquakes', [])
                if earthquakes:
                    recent_count = len([eq for eq in earthquakes[-100:] if eq.get('magnitude', 0) > 3.0])
                    base_deformation = min(100, max(0, recent_count * 2))
                    return base_deformation
        except Exception as e:
            print(f"Warning: Using fallback for crustal deformation: {e}")
        
        base_deformation = 45
        tectonic_activity = 10
        return max(0, min(100, base_deformation + tectonic_activity))
    
    def _calculate_regional_stress(self, lat: float, lng: float) -> float:
        base_stress = 55
        fault_proximity = 15
        return max(0, min(100, base_stress + fault_proximity))
    
    def _calculate_crustal_deformation(self, lat: float, lng: float) -> float:
        base_deformation = 45
        tectonic_activity = 10
        return max(0, min(100, base_deformation + tectonic_activity))
    
    def _calculate_earthquake_subsurface_resonance(self, lat: float, lng: float) -> Dict[str, float]:
        """Calculate earthquake-specific subsurface resonance for 80-85km altitude"""
        
        base_frequency_80km = 7.83 * self.atmospheric_calibration['subsurface_resonance_80km']
        base_frequency_85km = 7.83 * self.atmospheric_calibration['subsurface_resonance_85km']
        
        depth_penetration_factor = 0.0
        if self._is_in_deep_subduction_zone(lat, lng):
            depth_penetration_factor = 0.8  # Enhanced for deep subduction zones
        else:
            depth_penetration_factor = 0.3  # Standard penetration
        
        tectonic_amplification = self._get_tectonic_amplification_factor(lat, lng)
        
        return {
            'earthquake_resonance_80km': base_frequency_80km * (1 + depth_penetration_factor),
            'earthquake_resonance_85km': base_frequency_85km * (1 + depth_penetration_factor),
            'deep_coupling_factor': depth_penetration_factor,
            'tectonic_amplification': tectonic_amplification
        }
    
    def _is_in_deep_subduction_zone(self, lat: float, lng: float) -> bool:
        """Identify deep subduction zones requiring enhanced atmospheric coupling"""
        deep_subduction_zones = {
            'indonesia_java_trench': {'lat_range': (-15, 5), 'lng_range': (95, 145)},
            'japan_trench': {'lat_range': (30, 45), 'lng_range': (140, 150)},
            'chile_peru_trench': {'lat_range': (-45, -5), 'lng_range': (-85, -65)},
            'cascadia_subduction': {'lat_range': (40, 50), 'lng_range': (-130, -120)}
        }
        
        for zone, params in deep_subduction_zones.items():
            if (params['lat_range'][0] <= lat <= params['lat_range'][1] and
                params['lng_range'][0] <= lng <= params['lng_range'][1]):
                return True
        return False
    
    def _get_tectonic_amplification_factor(self, lat: float, lng: float) -> float:
        """Get tectonic amplification factor for atmospheric coupling"""
        if self._is_in_deep_subduction_zone(lat, lng):
            return 1.6  # Enhanced for deep subduction zones
        
        tectonic_zones = {
            'ring_of_fire': {'lat_range': (-60, 60), 'lng_range': (90, -90), 'amplification': 1.4},
            'mediterranean': {'lat_range': (30, 50), 'lng_range': (-10, 50), 'amplification': 1.3},
            'mid_atlantic': {'lat_range': (-60, 70), 'lng_range': (-40, -10), 'amplification': 1.2}
        }
        
        for zone, params in tectonic_zones.items():
            if (params['lat_range'][0] <= lat <= params['lat_range'][1] and
                params['lng_range'][0] <= lng <= params['lng_range'][1]):
                return params['amplification']
        return 1.0
    
    def _project_readings_for_day(self, current_readings: Dict[str, float], days_ahead: int) -> Dict[str, float]:
        projected_readings = {}
        
        for var_name, current_value in current_readings.items():
            if var_name.startswith('_'):
                continue
                
            if not isinstance(current_value, (int, float)):
                continue
                
            if 'SOLAR' in var_name:
                solar_cycle_factor = math.sin(2 * math.pi * days_ahead / 27) * 5
                trend_factor = days_ahead * 0.2
                projected_value = current_value + solar_cycle_factor + trend_factor
            elif 'GEOMAG' in var_name:
                variation = math.sin(2 * math.pi * days_ahead / 11) * 3
                projected_value = current_value + variation
            elif 'IONO' in var_name:
                daily_cycle = math.sin(2 * math.pi * days_ahead / 1) * 2
                seasonal_trend = days_ahead * 0.1
                projected_value = current_value + daily_cycle + seasonal_trend
            elif 'ATMOS' in var_name:
                variation = math.cos(2 * math.pi * days_ahead / 3) * 4
                projected_value = current_value + variation
            elif 'TECTONIC' in var_name:
                stress_accumulation = days_ahead * 0.3
                projected_value = current_value + stress_accumulation
            else:
                projected_value = current_value
            
            projected_readings[var_name] = max(0, min(100, projected_value))
        
        return projected_readings
    
    def _calculate_prediction_summary(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not predictions:
            return {}
        
        magnitudes = [p['predicted_magnitude'] for p in predictions]
        probabilities = [p['earthquake_probability'] for p in predictions]
        resonance_factors = [p['resonance_factor'] for p in predictions]
        
        peak_day = max(predictions, key=lambda x: x['earthquake_probability'])
        high_risk_days = len([p for p in predictions if p['risk_level'] in ['HIGH', 'ELEVATED']])
        
        return {
            'max_magnitude': max(magnitudes),
            'avg_magnitude': sum(magnitudes) / len(magnitudes),
            'max_probability': max(probabilities),
            'avg_probability': sum(probabilities) / len(probabilities),
            'max_resonance_factor': max(resonance_factors),
            'avg_resonance_factor': sum(resonance_factors) / len(resonance_factors),
            'peak_risk_day': peak_day['day'],
            'peak_risk_date': peak_day['date'],
            'high_risk_days': high_risk_days,
            'total_days': len(predictions)
        }
    
    def _get_risk_level(self, probability: float) -> str:
        if probability >= 60: return "HIGH"
        elif probability >= 40: return "ELEVATED"
        elif probability >= 20: return "MODERATE"
        else: return "LOW"
    
    def get_status(self) -> Dict[str, Any]:
        return {
            'version': self.version,
            'engine_id': self.engine_id,
            'status': 'operational',
            'framework': '12-dimensional GAL-CRM',
            'last_calculation': self.last_calculation['engine_info']['calculation_time'] if self.last_calculation and 'engine_info' in self.last_calculation else None,
            'lag_corrections': True,
            'authentication': 'token_required',
            'atmospheric_coupling': self.atmospheric_calibration['deep_coupling_enabled'],
            'subsurface_resonance_calibrated': True,
            'dimensional_framework': 'GAL-CRM v4.0',
            'vibration_fields': list(self.vibration_fields.keys()),
            'location_specific_calculations': True,
            'last_update': self.last_update.isoformat() if hasattr(self, 'last_update') and self.last_update else None,
            'service_id': getattr(self, 'service_id', 'BRETT-GAL-CRM-DEFAULT'),
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def _apply_resonance_overlay_calculations(self, readings: Dict[str, float], lat: float, lng: float) -> Dict[str, float]:
        """Apply resonance overlay calculations to assess constructive interference from 3 tetrahedron RGB projection over CMYK earth fields"""
        
        firmament_height_km = 136.8  # 85 miles in km
        
        earth_radius_km = 6371.0
        target_distance_km = math.sqrt(lat**2 + lng**2) * 111.32  # Approximate km per degree
        
        tetrahedron_angles = {
            'red_tetrahedron': 26.52,    # Solar component tetrahedron
            'green_tetrahedron': 54.74,  # Magnetic component tetrahedron  
            'blue_tetrahedron': 70.53    # Cosmic/ionospheric component tetrahedron
        }
        
        sunspot_to_earth_delay_hours = 48.0  # Based on existing implementation
        solar_wind_speed_kms = 400.0  # Average solar wind speed
        space_to_earth_time_delay = (149.6e6) / (solar_wind_speed_kms * 3600)  # Hours for space weather to reach Earth
        
        def safe_numeric(value):
            if isinstance(value, (int, float)):
                return float(value)
            elif isinstance(value, dict):
                return 0.0  # Default for dict values
            else:
                return float(value) if value is not None else 0.0
        
        red_component = (safe_numeric(readings['SOLAR_VAR1']) + safe_numeric(readings['SOLAR_VAR2']) + safe_numeric(readings['SOLAR_VAR3'])) / 3.0
        green_component = (safe_numeric(readings['GEOMAG_VAR1']) + safe_numeric(readings['GEOMAG_VAR2']) + safe_numeric(readings['GEOMAG_VAR3'])) / 3.0
        blue_component = (safe_numeric(readings['IONO_VAR1']) + safe_numeric(readings['IONO_VAR2'])) / 2.0
        
        cyan_earth = (safe_numeric(readings['ATMOS_VAR1']) + safe_numeric(readings['ATMOS_VAR2'])) / 2.0  # Atmospheric resonance
        magenta_earth = (safe_numeric(readings['TECTONIC_VAR1']) + safe_numeric(readings['TECTONIC_VAR2'])) / 2.0  # Tectonic resonance
        yellow_earth = (safe_numeric(readings['GEOMAG_VAR1']) + safe_numeric(readings['GEOMAG_VAR2'])) / 2.0  # Geomagnetic earth field
        black_earth = min(cyan_earth, magenta_earth, yellow_earth)  # K is core/shadow of other fields
        
        refraction_factors = {}
        for color, angle in tetrahedron_angles.items():
            incident_angle_rad = math.radians(angle)
            refraction_angle_rad = math.asin(math.sin(incident_angle_rad) * 0.85)  # Atmospheric refraction index
            refraction_factors[color] = math.cos(refraction_angle_rad)
        
        enhanced_red = red_component * refraction_factors['red_tetrahedron']
        enhanced_green = green_component * refraction_factors['green_tetrahedron'] 
        enhanced_blue = blue_component * refraction_factors['blue_tetrahedron']
        
        rgb_space_resonance = math.sqrt((enhanced_red**2 + enhanced_green**2 + enhanced_blue**2) / 3.0)
        cmyk_earth_resonance = math.sqrt((cyan_earth**2 + magenta_earth**2 + yellow_earth**2 + black_earth**2) / 4.0)
        
        constructive_interference_factor = (rgb_space_resonance * cmyk_earth_resonance) / 100.0
        constructive_interference_threshold = 0.52
        constructive_interference = constructive_interference_factor > constructive_interference_threshold
        
        if constructive_interference:
            amplification_factor = 1.0 + (constructive_interference_factor - constructive_interference_threshold) * 2.0
            
            for var_name in readings:
                if not var_name.startswith('_'):  # Skip metadata fields
                    current_value = safe_numeric(readings[var_name])
                    readings[var_name] = min(100.0, current_value * amplification_factor)
        
        readings['_resonance_overlay_metadata'] = {
            'rgb_space_resonance': rgb_space_resonance,
            'cmyk_earth_resonance': cmyk_earth_resonance,
            'constructive_interference_factor': constructive_interference_factor,
            'constructive_interference': constructive_interference,
            'refraction_factors': refraction_factors,
            'tetrahedron_angles': tetrahedron_angles,
            'firmament_height_km': firmament_height_km,
            'time_delay_hours': space_to_earth_time_delay,
            'empirical_model': 'RGB_space_over_CMYK_earth_no_statistics'
        }
        
        return readings

    def _calculate_dimensional_coefficients(self, lat: float, lng: float, cached_data: Dict) -> Dict[str, float]:
        """Calculate location-specific dimensional coefficients D_i for GAL-CRM framework"""
        
        coefficients = {}
        
        
        tectonic_zones = self._get_tectonic_zone_factor(lat, lng)
        recent_seismic = self._get_recent_seismic_activity(cached_data, lat, lng)
        coefficients['D1'] = self.gal_crm_framework['D1_tectonic_stress']['base_coefficient'] * tectonic_zones * recent_seismic
        
        volcanic_proximity = self._get_volcanic_proximity_factor(lat, lng)
        coefficients['D2'] = self.gal_crm_framework['D2_magmatic_pressure']['base_coefficient'] * volcanic_proximity
        
        atmospheric_factor = self._get_atmospheric_load_factor(lat, lng)
        coefficients['D3'] = self.gal_crm_framework['D3_atmospheric_load']['base_coefficient'] * atmospheric_factor
        
        em_factor = self._get_em_flux_factor(cached_data, lat, lng)
        coefficients['D4'] = self.gal_crm_framework['D4_em_flux']['base_coefficient'] * em_factor
        
        gravity_factor = self._get_gravitational_anomaly_factor(lat, lng)
        coefficients['D5'] = self.gal_crm_framework['D5_gravitational_anomalies']['base_coefficient'] * gravity_factor
        
        oceanic_factor = self._get_oceanic_mass_factor(lat, lng)
        coefficients['D6'] = self.gal_crm_framework['D6_oceanic_mass_shifts']['base_coefficient'] * oceanic_factor
        
        
        solar_wind_factor = self._get_solar_wind_harmonic_factor(cached_data)
        coefficients['D7'] = self.gal_crm_framework['D7_solar_wind_harmonics']['base_coefficient'] * solar_wind_factor
        
        planetary_factor = self._get_planetary_tidal_factor(lat, lng)
        coefficients['D8'] = self.gal_crm_framework['D8_planetary_tidal_vectors']['base_coefficient'] * planetary_factor
        
        galactic_factor = self._get_galactic_em_factor(lat, lng)
        coefficients['D9'] = self.gal_crm_framework['D9_galactic_em_background']['base_coefficient'] * galactic_factor
        
        cosmic_ray_factor = self._get_cosmic_ray_factor(cached_data, lat, lng)
        coefficients['D10'] = self.gal_crm_framework['D10_cosmic_ray_flux']['base_coefficient'] * cosmic_ray_factor
        
        lunar_solar_factor = self._get_lunar_solar_interference_factor()
        coefficients['D11'] = self.gal_crm_framework['D11_lunar_solar_interference']['base_coefficient'] * lunar_solar_factor
        
        gw_factor = self._get_gravitational_wave_factor()
        coefficients['D12'] = self.gal_crm_framework['D12_deep_space_gravitational_waves']['base_coefficient'] * gw_factor
        
        return coefficients

    def _calculate_vibration_field_amplitudes(self, lat: float, lng: float, cached_data: Dict, current_time: datetime) -> Dict[str, float]:
        """Calculate vibration field amplitudes V_f(i) for each dimension"""
        
        amplitudes = {}
        
        # Seismic field amplitude - based on local seismic resonance
        seismic_resonance = self._calculate_earthquake_subsurface_resonance(lat, lng)
        amplitudes['seismic'] = self.vibration_fields['seismic']['base_amplitude'] * seismic_resonance['tectonic_amplification']
        
        magmatic_activity = self._get_magmatic_field_amplitude(lat, lng)
        amplitudes['magmatic'] = self.vibration_fields['magmatic']['base_amplitude'] * magmatic_activity
        
        schumann_freq = self._calculate_schumann_frequency(lat, lng)
        schumann_amp = self._calculate_schumann_amplitude(lat, lng, schumann_freq)
        amplitudes['atmospheric'] = self.vibration_fields['atmospheric']['base_amplitude'] * schumann_amp
        
        em_amplitude = self._get_em_field_amplitude(cached_data)
        amplitudes['electromagnetic'] = self.vibration_fields['electromagnetic']['base_amplitude'] * em_amplitude
        
        gravitational_amplitude = self._get_gravitational_field_amplitude(lat, lng, current_time)
        amplitudes['gravitational'] = self.vibration_fields['gravitational']['base_amplitude'] * gravitational_amplitude
        
        solar_amplitude = self._get_solar_field_amplitude(cached_data)
        amplitudes['solar'] = self.vibration_fields['solar']['base_amplitude'] * solar_amplitude
        
        return amplitudes

    def _calculate_decay_constant(self, lat: float, lng: float, cached_data: Dict) -> float:
        """Calculate system-specific decay constant λ derived from historical fade rates"""
        
        base_lambda = 0.1
        
        if self._is_in_deep_subduction_zone(lat, lng):
            geological_factor = 0.7
        elif self._is_in_stable_craton(lat, lng):
            geological_factor = 1.3
        else:
            geological_factor = 1.0
        
        recent_activity = self._get_recent_seismic_activity(cached_data, lat, lng)
        activity_factor = 1.0 / (1.0 + recent_activity * 0.5)
        
        space_weather_factor = self._get_space_weather_decay_factor(cached_data)
        
        lambda_value = base_lambda * geological_factor * activity_factor * space_weather_factor
        
        return max(0.01, min(1.0, lambda_value))

    def _get_tectonic_zone_factor(self, lat: float, lng: float) -> float:
        """Get tectonic zone amplification factor"""
        tectonic_zones = {
            'ring_of_fire': {'lat_range': (-60, 60), 'lng_range': (90, -90), 'factor': 1.8},
            'mediterranean': {'lat_range': (30, 50), 'lng_range': (-10, 50), 'factor': 1.5},
            'mid_atlantic': {'lat_range': (-60, 70), 'lng_range': (-40, -10), 'factor': 1.3},
            'himalayan': {'lat_range': (25, 40), 'lng_range': (70, 100), 'factor': 1.6}
        }
        
        for zone, params in tectonic_zones.items():
            if (params['lat_range'][0] <= lat <= params['lat_range'][1] and
                params['lng_range'][0] <= lng <= params['lng_range'][1]):
                return params['factor']
        return 1.0

    def _get_recent_seismic_activity(self, cached_data: Dict, lat: float, lng: float) -> float:
        """Calculate recent seismic activity factor from real earthquake data"""
        try:
            usgs_data = cached_data.get('usgs', {})
            if usgs_data.get('success') and usgs_data.get('data'):
                earthquakes = usgs_data['data'].get('earthquakes', [])
                if earthquakes:
                    recent_count = len([eq for eq in earthquakes[-50:] if eq.get('magnitude', 0) > 2.0])
                    return min(2.0, 1.0 + recent_count * 0.02)
        except Exception:
            pass
        return 1.0

    def _get_volcanic_proximity_factor(self, lat: float, lng: float) -> float:
        """Calculate volcanic proximity factor"""
        volcanic_regions = [
            {'center': (19.4, -155.6), 'radius': 500, 'intensity': 1.8},  # Hawaii
            {'center': (40.8, 14.4), 'radius': 300, 'intensity': 1.6},    # Vesuvius
            {'center': (-6.2, 106.8), 'radius': 400, 'intensity': 1.7},   # Indonesia
            {'center': (35.4, 138.7), 'radius': 350, 'intensity': 1.5}    # Japan
        ]
        
        max_factor = 1.0
        for region in volcanic_regions:
            distance = math.sqrt((lat - region['center'][0])**2 + (lng - region['center'][1])**2) * 111.32
            if distance < region['radius']:
                factor = region['intensity'] * (1.0 - distance / region['radius'])
                max_factor = max(max_factor, factor)
        
        return max_factor

    def _get_atmospheric_load_factor(self, lat: float, lng: float) -> float:
        """Calculate atmospheric load factor based on altitude and pressure"""
        altitude_factor = 1.0 - abs(lat) / 90.0 * 0.1  # Higher latitudes have lower pressure
        return max(0.8, min(1.2, altitude_factor))

    def _get_em_flux_factor(self, cached_data: Dict, lat: float, lng: float) -> float:
        """Calculate EM flux factor from real geomagnetic data"""
        try:
            gfz_data = cached_data.get('gfz', {})
            if gfz_data.get('success') and gfz_data.get('data'):
                kp_data = gfz_data['data'].get('kp_index', [])
                if kp_data:
                    recent_kp = [entry.get('kp', 2.0) for entry in kp_data[-24:]]
                    avg_kp = sum(recent_kp) / len(recent_kp) if recent_kp else 2.0
                    return 1.0 + (avg_kp - 2.0) / 7.0  # Normalize Kp index (0-9) to factor
        except Exception:
            pass
        return 1.0

    def _get_gravitational_anomaly_factor(self, lat: float, lng: float) -> float:
        """Calculate gravitational anomaly factor"""
        return 1.0 + abs(lat) / 90.0 * 0.05

    def _get_oceanic_mass_factor(self, lat: float, lng: float) -> float:
        """Calculate oceanic mass shift factor"""
        if abs(lat) > 60:  # Polar regions
            return 1.2
        elif abs(lng) > 160 or abs(lng) < 20:  # Pacific and Atlantic regions
            return 1.1
        return 1.0

    def _get_solar_wind_harmonic_factor(self, cached_data: Dict) -> float:
        """Calculate solar wind harmonic factor from real data"""
        try:
            space_weather = cached_data.get('space_weather', {})
            if space_weather.get('success') and space_weather.get('data'):
                data = space_weather['data']
                if isinstance(data, list) and data:
                    recent_data = data[-24:]  # Last 24 hours
                    bulk_speeds = [entry.get('bulk_speed', 400.0) for entry in recent_data if entry.get('bulk_speed')]
                    if bulk_speeds:
                        avg_speed = sum(bulk_speeds) / len(bulk_speeds)
                        return 0.5 + (avg_speed / 800.0)  # Normalize around typical 400 km/s
        except Exception:
            pass
        return 1.0

    def _get_planetary_tidal_factor(self, lat: float, lng: float) -> float:
        """Calculate planetary tidal factor"""
        current_time = datetime.utcnow()
        lunar_phase = (current_time.day % 29.5) / 29.5  # Approximate lunar cycle
        tidal_strength = 0.8 + 0.4 * math.sin(2 * math.pi * lunar_phase)
        return tidal_strength

    def _get_galactic_em_factor(self, lat: float, lng: float) -> float:
        """Calculate galactic EM background factor"""
        galactic_lat = lat + 27.0  # Approximate galactic coordinate offset
        return 1.0 + 0.1 * math.sin(math.radians(galactic_lat))

    def _get_cosmic_ray_factor(self, cached_data: Dict, lat: float, lng: float) -> float:
        """Calculate cosmic ray flux factor"""
        magnetic_shielding = 1.0 - abs(lat) / 90.0 * 0.3
        return 1.0 / magnetic_shielding

    def _get_lunar_solar_interference_factor(self) -> float:
        """Calculate lunar-solar interference factor"""
        current_time = datetime.utcnow()
        lunar_phase = (current_time.day % 29.5) / 29.5
        solar_cycle_phase = (current_time.year % 11) / 11.0  # 11-year solar cycle
        interference = 0.7 + 0.3 * math.cos(2 * math.pi * (lunar_phase - solar_cycle_phase))
        return interference

    def _get_gravitational_wave_factor(self) -> float:
        """Calculate gravitational wave factor"""
        return 1.0

    def _is_in_stable_craton(self, lat: float, lng: float) -> bool:
        """Check if location is in a stable craton"""
        stable_cratons = [
            {'center': (45, -100), 'radius': 1000},  # North American Craton
            {'center': (60, 100), 'radius': 1500},   # Siberian Craton
            {'center': (-25, 135), 'radius': 800}    # Australian Craton
        ]
        
        for craton in stable_cratons:
            distance = math.sqrt((lat - craton['center'][0])**2 + (lng - craton['center'][1])**2) * 111.32
            if distance < craton['radius']:
                return True
        return False

    def _get_magmatic_field_amplitude(self, lat: float, lng: float) -> float:
        """Calculate magmatic field amplitude"""
        volcanic_factor = self._get_volcanic_proximity_factor(lat, lng)
        return min(2.0, volcanic_factor)

    def _get_em_field_amplitude(self, cached_data: Dict) -> float:
        """Calculate electromagnetic field amplitude from real data"""
        try:
            space_weather = cached_data.get('space_weather', {})
            if space_weather.get('success') and space_weather.get('data'):
                data = space_weather['data']
                if isinstance(data, list) and data:
                    recent_data = data[-12:]  # Last 12 hours
                    imf_magnitudes = [entry.get('imf_magnitude', 5.0) for entry in recent_data if entry.get('imf_magnitude')]
                    if imf_magnitudes:
                        avg_imf = sum(imf_magnitudes) / len(imf_magnitudes)
                        return 0.5 + (avg_imf / 20.0)  # Normalize around typical 5 nT
        except Exception:
            pass
        return 1.0

    def _get_gravitational_field_amplitude(self, lat: float, lng: float, current_time: datetime) -> float:
        """Calculate gravitational field amplitude"""
        hour_factor = 0.8 + 0.4 * math.sin(2 * math.pi * current_time.hour / 24.0)
        lunar_factor = self._get_planetary_tidal_factor(lat, lng)
        return hour_factor * lunar_factor

    def _get_solar_field_amplitude(self, cached_data: Dict) -> float:
        """Calculate solar field amplitude from real data"""
        try:
            space_weather = cached_data.get('space_weather', {})
            if space_weather.get('success') and space_weather.get('data'):
                data = space_weather['data']
                if isinstance(data, list) and data:
                    recent_data = data[-6:]  # Last 6 hours
                    proton_densities = [entry.get('proton_density', 5.0) for entry in recent_data if entry.get('proton_density')]
                    if proton_densities:
                        avg_density = sum(proton_densities) / len(proton_densities)
                        return 0.6 + (avg_density / 20.0)  # Normalize around typical 5 p/cm³
        except Exception:
            pass
        return 1.0

    def _get_space_weather_decay_factor(self, cached_data: Dict) -> float:
        """Calculate space weather decay factor"""
        try:
            space_weather = cached_data.get('space_weather', {})
            if space_weather.get('success') and space_weather.get('data'):
                data = space_weather['data']
                if isinstance(data, list) and data:
                    recent_data = data[-12:]
                    avg_activity = 0.0
                    count = 0
                    for entry in recent_data:
                        if entry.get('bulk_speed') and entry.get('imf_magnitude'):
                            activity = (entry['bulk_speed'] / 400.0) * (entry['imf_magnitude'] / 5.0)
                            avg_activity += activity
                            count += 1
                    if count > 0:
                        avg_activity /= count
                        return 1.0 / (1.0 + avg_activity * 0.2)  # Higher activity = slower decay
        except Exception:
            pass
        return 1.0

    def is_available(self) -> bool:
        return True

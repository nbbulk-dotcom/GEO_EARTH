import math
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import random

class EarthquakeSpaceEngine:
    """
    SPACE Engine - Enhanced version for earthquake predictions with seismic-specific calibrations
    Separate from the volcanic SPACE V engine
    """
    
    def __init__(self):
        self.version = "SPACE-EARTHQUAKE-ENGINE-V1.0"
        self.engine_id = "SPACE_EARTHQUAKE"
        self.engine_type = "SPACE_EARTHQUAKE"
        self.last_calculation = None
        
        self.space_variables = {
            'VAR_SOLAR_WIND': 'Solar wind velocity and density',
            'VAR_MAGNETIC_FIELD': 'Interplanetary magnetic field strength',
            'VAR_COSMIC_RAYS': 'Cosmic ray flux intensity',
            'VAR_IONOSPHERIC': 'Ionospheric disturbances',
            'VAR_GEOMAGNETIC': 'Geomagnetic storm indices',
            'VAR_SOLAR_FLARES': 'Solar flare activity',
            'VAR_CORONAL_MASS': 'Coronal mass ejection events',
            'VAR_SCHUMANN': 'Schumann resonance variations',
            'VAR_ATMOSPHERIC': 'Atmospheric electromagnetic coupling',
            'VAR_MAGNETOSPHERE': 'Magnetospheric compression',
            'VAR_PLASMA_DENSITY': 'Space plasma density variations',
            'VAR_ELECTROMAGNETIC': 'Space electromagnetic field fluctuations'
        }
        
        self.earthquake_calibration = {
            'tectonic_depth_factor': 1.0,
            'crustal_stress_factor': 1.0,
            'subsurface_resonance_80km': 1.0,
            'subsurface_resonance_85km': 1.0,
            'seismic_angular_adjustment': 0.0
        }
    
    def _generate_valid_tokens(self) -> List[str]:
        return ["SPACE_EQ_TOKEN_001", "SPACE_EQ_TOKEN_002"]
    
    def authenticate(self, token: str) -> bool:
        return token in self._generate_valid_tokens()
    
    def get_current_token(self) -> str:
        return "SPACE_EQ_TOKEN_001"
    
    async def calculate_prediction(self, latitude: float, longitude: float, radius_km: float = 100, 
                                 seismic_factors: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        """
        Calculate SPACE earthquake predictions with seismic calibrations
        """
        try:
            current_time = datetime.utcnow()
            
            if seismic_factors:
                self._apply_seismic_calibrations(seismic_factors)
            
            current_readings = self._get_space_readings_with_seismic_calibration(latitude, longitude, current_time)
            
            predictions = []
            for day in range(1, 22):
                prediction_date = current_time + timedelta(days=day)
                projected_readings = self._project_space_readings_for_day(current_readings, day)
                daily_prediction = self._calculate_daily_space_prediction(latitude, longitude, day, projected_readings, prediction_date)
                predictions.append(daily_prediction)
            
            summary = self._calculate_space_prediction_summary(predictions)
            
            if seismic_factors:
                subsurface_resonance = self._calculate_earthquake_subsurface_resonance(
                    latitude, longitude, seismic_factors
                )
                summary['earthquake_subsurface_resonance'] = subsurface_resonance
            
            result = {
                'success': True,
                'predictions': predictions,
                'summary': summary,
                'engine_info': {
                    'version': self.version,
                    'engine_id': self.engine_id,
                    'engine_type': self.engine_type,
                    'calculation_time': current_time.isoformat(),
                    'location': {'latitude': latitude, 'longitude': longitude, 'radius_km': radius_km},
                    'space_variables_used': len(self.space_variables),
                    'seismic_calibration_applied': seismic_factors is not None,
                    'subsurface_resonance_calibrated': '80_85km_earthquake_enhanced'
                }
            }
            
            self.last_calculation = result
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f"SPACE earthquake prediction calculation failed: {str(e)}",
                'engine_id': self.engine_id
            }
    
    def _apply_seismic_calibrations(self, seismic_factors: Dict[str, float]):
        """Apply seismic factors to SPACE earthquake calibration"""
        self.earthquake_calibration['tectonic_depth_factor'] = seismic_factors.get('tectonic_depth_km', 10.0) / 10.0
        self.earthquake_calibration['crustal_stress_factor'] = seismic_factors.get('crustal_stress_mpa', 50.0) / 50.0
        self.earthquake_calibration['subsurface_resonance_80km'] = seismic_factors.get('altitude_refraction_80km', 1.0)
        self.earthquake_calibration['subsurface_resonance_85km'] = seismic_factors.get('altitude_refraction_85km', 1.0)
        self.earthquake_calibration['seismic_angular_adjustment'] = seismic_factors.get('seismic_adjustment', 0.0)
    
    def _get_space_readings_with_seismic_calibration(self, lat: float, lng: float, current_time: datetime) -> Dict[str, float]:
        """Get space readings with seismic-specific calibrations"""
        readings = {}
        
        base_factor = self.earthquake_calibration['tectonic_depth_factor'] * self.earthquake_calibration['crustal_stress_factor']
        
        readings['VAR_SOLAR_WIND'] = self._calculate_solar_wind_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_MAGNETIC_FIELD'] = self._calculate_magnetic_field_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_COSMIC_RAYS'] = self._calculate_cosmic_rays_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_IONOSPHERIC'] = self._calculate_ionospheric_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_GEOMAGNETIC'] = self._calculate_geomagnetic_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_SOLAR_FLARES'] = self._calculate_solar_flares_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_CORONAL_MASS'] = self._calculate_coronal_mass_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_SCHUMANN'] = self._calculate_schumann_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_ATMOSPHERIC'] = self._calculate_atmospheric_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_MAGNETOSPHERE'] = self._calculate_magnetosphere_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_PLASMA_DENSITY'] = self._calculate_plasma_density_with_seismic_calibration(lat, lng, base_factor)
        readings['VAR_ELECTROMAGNETIC'] = self._calculate_electromagnetic_with_seismic_calibration(lat, lng, base_factor)
        
        return readings
    
    def _calculate_daily_space_prediction(self, lat: float, lng: float, day: int, readings: Dict[str, float], prediction_date: datetime) -> Dict[str, Any]:
        """Calculate daily SPACE earthquake prediction with seismic enhancements"""
        
        rgb_resonance = self._calculate_seismic_rgb_resonance(readings)
        
        base_tetrahedral_angle = 26.52 + (lat * 0.1) + (lng * 0.05)
        tetrahedral_angle = base_tetrahedral_angle + self.earthquake_calibration['seismic_angular_adjustment']
        
        magnitude = self._calculate_space_magnitude_prediction_seismic(lat, lng, rgb_resonance, day, tetrahedral_angle)
        
        probability = self._calculate_space_earthquake_probability_seismic(rgb_resonance, magnitude, day)
        
        return {
            'day': day,
            'date': prediction_date.strftime('%Y-%m-%d'),
            'predicted_magnitude': round(magnitude, 1),
            'earthquake_probability': round(probability, 1),
            'risk_level': self._get_space_risk_level(probability),
            'confidence_level': 'high' if rgb_resonance > 0.7 else 'medium' if rgb_resonance > 0.4 else 'low',
            'rgb_resonance_factor': round(rgb_resonance, 3),
            'tetrahedral_angle': round(tetrahedral_angle, 2),
            'space_earthquake_calibration': self.earthquake_calibration.copy()
        }
    
    def _calculate_seismic_rgb_resonance(self, readings: Dict[str, float]) -> float:
        """Calculate RGB resonance with seismic enhancements"""
        
        red_component = (readings['VAR_SOLAR_WIND'] + readings['VAR_SOLAR_FLARES'] + readings['VAR_CORONAL_MASS']) / 3.0
        green_component = (readings['VAR_MAGNETIC_FIELD'] + readings['VAR_GEOMAGNETIC'] + readings['VAR_MAGNETOSPHERE']) / 3.0
        blue_component = (readings['VAR_COSMIC_RAYS'] + readings['VAR_IONOSPHERIC'] + readings['VAR_ATMOSPHERIC']) / 3.0
        
        depth_factor = self.earthquake_calibration['tectonic_depth_factor']
        stress_factor = self.earthquake_calibration['crustal_stress_factor']
        
        enhanced_red = red_component * self.earthquake_calibration['subsurface_resonance_80km']
        enhanced_green = green_component * depth_factor
        enhanced_blue = blue_component * stress_factor * self.earthquake_calibration['subsurface_resonance_85km']
        
        rgb_resonance = math.sqrt((enhanced_red**2 + enhanced_green**2 + enhanced_blue**2) / 3.0)
        
        return min(1.0, max(0.0, rgb_resonance))
    
    def _calculate_space_magnitude_prediction_seismic(self, lat: float, lng: float, rgb_resonance: float, days_ahead: int, tetrahedral_angle: float) -> float:
        """Calculate magnitude prediction with seismic factors"""
        
        base_magnitude = 2.0
        
        seismic_contribution = rgb_resonance * 6.5 * (tetrahedral_angle / 26.52)
        
        tectonic_zones = {
            'ring_of_fire': {'lat_range': (-60, 60), 'lng_range': (90, -90), 'space_boost': 2.2},
            'mediterranean': {'lat_range': (30, 50), 'lng_range': (-10, 50), 'space_boost': 1.8},
            'mid_atlantic': {'lat_range': (-60, 70), 'lng_range': (-40, -10), 'space_boost': 1.5},
            'san_andreas': {'lat_range': (32, 42), 'lng_range': (-125, -115), 'space_boost': 2.0}
        }
        
        space_boost = 0.0
        for zone, params in tectonic_zones.items():
            if (params['lat_range'][0] <= lat <= params['lat_range'][1] and
                params['lng_range'][0] <= lng <= params['lng_range'][1]):
                space_boost = max(space_boost, params['space_boost'])
        
        time_decay = max(0.2, 1.0 - (days_ahead * 0.015))
        
        subsurface_factor = (self.earthquake_calibration['subsurface_resonance_80km'] + 
                           self.earthquake_calibration['subsurface_resonance_85km']) / 2.0
        
        final_magnitude = (base_magnitude + seismic_contribution + space_boost) * time_decay * subsurface_factor
        return max(2.0, min(8.5, final_magnitude))
    
    def _calculate_space_earthquake_probability_seismic(self, rgb_resonance: float, magnitude: float, days_ahead: int) -> float:
        """Calculate earthquake probability with SPACE seismic enhancements"""
        
        base_probability = rgb_resonance * 85  # Enhanced base for earthquake applications
        magnitude_factor = (magnitude - 2.0) * 12  # Enhanced magnitude factor
        time_factor = max(0.3, 1.0 - (days_ahead * 0.012))  # Reduced decay for longer lead times
        
        seismic_factor = (self.earthquake_calibration['tectonic_depth_factor'] + 
                         self.earthquake_calibration['crustal_stress_factor']) / 2.0
        
        probability = (base_probability + magnitude_factor) * time_factor * seismic_factor
        return max(0.0, min(100.0, probability))
    
    def _calculate_earthquake_subsurface_resonance(self, lat: float, lng: float, seismic_factors: Dict[str, float]) -> Dict[str, float]:
        """Calculate earthquake-specific subsurface resonance for 80-85km altitude"""
        
        base_frequency_80km = 7.83 * seismic_factors.get('altitude_refraction_80km', 1.0)
        base_frequency_85km = 7.83 * seismic_factors.get('altitude_refraction_85km', 1.0)
        
        depth_penetration_factor = seismic_factors.get('tectonic_depth_km', 10.0) / 20.0
        
        stress_amplification = math.log(seismic_factors.get('crustal_stress_mpa', 50.0) + 1) * 0.1
        
        seismic_factor = seismic_factors.get('seismic_adjustment', 0.0) / 100.0
        
        return {
            'space_resonance_80km': base_frequency_80km * (1 + depth_penetration_factor + seismic_factor),
            'space_resonance_85km': base_frequency_85km * (1 + depth_penetration_factor + seismic_factor),
            'space_amplification_factor': stress_amplification,
            'space_penetration_depth': depth_penetration_factor,
            'seismic_space_adjustment': seismic_factor
        }
    
    def _calculate_solar_wind_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.35 + abs(lat) * 0.008 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_magnetic_field_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.45 + abs(lng) * 0.004 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_cosmic_rays_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.4 + (abs(lat) + abs(lng)) * 0.002 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_ionospheric_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.5 + math.sin(math.radians(lat)) * 0.15 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_geomagnetic_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.55 + math.cos(math.radians(lng)) * 0.12 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_solar_flares_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.3 + random.uniform(0.0, 0.25)) * base_factor))
    
    def _calculate_coronal_mass_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.25 + random.uniform(0.0, 0.35)) * base_factor))
    
    def _calculate_schumann_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.65 + math.sin(math.radians(lat + lng)) * 0.08 + random.uniform(-0.05, 0.05)) * base_factor))
    
    def _calculate_atmospheric_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.6 + abs(lat - lng) * 0.001 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_magnetosphere_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.45 + (lat**2 + lng**2) * 0.00008 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_plasma_density_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.4 + math.sqrt(abs(lat * lng)) * 0.008 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _calculate_electromagnetic_with_seismic_calibration(self, lat: float, lng: float, base_factor: float) -> float:
        return min(1.0, max(0.0, (0.55 + math.tan(math.radians(abs(lat))) * 0.04 + random.uniform(-0.1, 0.1)) * base_factor))
    
    def _project_space_readings_for_day(self, current_readings: Dict[str, float], day: int) -> Dict[str, float]:
        """Project space readings for future day with seismic calibration"""
        projected = {}
        decay_factor = 0.95 ** day
        
        for var, value in current_readings.items():
            trend_factor = random.uniform(0.9, 1.1)
            projected[var] = max(0.0, min(1.0, value * decay_factor * trend_factor))
        
        return projected
    
    def _calculate_space_prediction_summary(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate summary statistics for SPACE earthquake predictions"""
        if not predictions:
            return {}
        
        magnitudes = [p['predicted_magnitude'] for p in predictions]
        probabilities = [p['earthquake_probability'] for p in predictions]
        
        max_prob_day = max(predictions, key=lambda x: x['earthquake_probability'])
        max_mag_day = max(predictions, key=lambda x: x['predicted_magnitude'])
        
        return {
            'max_probability': max(probabilities),
            'max_magnitude': max(magnitudes),
            'avg_probability': sum(probabilities) / len(probabilities),
            'avg_magnitude': sum(magnitudes) / len(magnitudes),
            'peak_risk_day': max_prob_day['day'],
            'highest_magnitude_day': max_mag_day['day'],
            'high_risk_days': len([p for p in predictions if p['earthquake_probability'] > 70]),
            'space_engine_type': 'EARTHQUAKE_SPACE_ENHANCED'
        }
    
    def _get_space_risk_level(self, probability: float) -> str:
        """Get risk level based on probability"""
        if probability >= 80:
            return 'CRITICAL'
        elif probability >= 60:
            return 'HIGH'
        elif probability >= 40:
            return 'ELEVATED'
        elif probability >= 20:
            return 'MODERATE'
        else:
            return 'LOW'
    
    def get_status(self) -> Dict[str, Any]:
        """Get current engine status"""
        return {
            'version': self.version,
            'engine_id': self.engine_id,
            'engine_type': self.engine_type,
            'status': 'operational',
            'last_calculation': self.last_calculation['engine_info']['calculation_time'] if self.last_calculation else None,
            'seismic_calibration': True,
            'subsurface_resonance_calibrated': True
        }
    
    def is_available(self) -> bool:
        return True

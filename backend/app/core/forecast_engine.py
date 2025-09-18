"""
Volcanic Forecast Engine with Stationary Earth/Moving Sun Model
21-day forward simulation using sun trajectory and harmonic amplification
"""
import math
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import logging

class VolcanicForecastEngine:
    def __init__(self):
        self.space_angle = 26.565  # degrees - planetary angle of incidence
        self.earth_angle = 54.74   # degrees - base tetrahedral CMYK angle
        self.logger = logging.getLogger(__name__)
        
    def simulate_21_day_forecast(self, location: Tuple[float, float], 
                               base_probability: float) -> List[Dict]:
        """Generate 21-day volcanic eruption forecast"""
        forecasts = []
        lat, lng = location
        
        for day in range(21):
            forecast_date = datetime.utcnow() + timedelta(days=day)
            sun_position = self._get_sun_position(forecast_date, lat, lng)
            
            interference_factor = self._calculate_interference(
                lat, lng, sun_position, forecast_date
            )
            
            daily_probability = base_probability * interference_factor
            
            temporal_factor = self._calculate_temporal_factor(day, forecast_date)
            daily_probability *= temporal_factor
            
            daily_probability = min(1.0, max(0.0, daily_probability))
            
            forecasts.append({
                'day': day + 1,
                'date': forecast_date.isoformat(),
                'probability': daily_probability,
                'sun_zenith_angle': sun_position['zenith'],
                'sun_azimuth_angle': sun_position['azimuth'],
                'interference_factor': interference_factor,
                'temporal_factor': temporal_factor,
                'risk_level': self._get_risk_level(daily_probability),
                'magnitude_estimate': self._estimate_magnitude(daily_probability),
                'confidence': self._calculate_confidence(daily_probability, interference_factor)
            })
            
        return forecasts
        
    def _get_sun_position(self, date: datetime, lat: float, lng: float) -> Dict:
        """Calculate sun position using simplified astronomical calculations"""
        a = (14 - date.month) // 12
        y = date.year - a
        m = date.month + 12 * a - 3
        jd = date.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 + 1721119
        
        n = jd - 2451545.0
        L = (280.460 + 0.9856474 * n) % 360
        g = math.radians((357.528 + 0.9856003 * n) % 360)
        lambda_sun = math.radians(L + 1.915 * math.sin(g) + 0.020 * math.sin(2 * g))
        
        declination = math.asin(math.sin(math.radians(23.439)) * math.sin(lambda_sun))
        
        hour_angle = math.radians(15 * (date.hour + date.minute/60 + date.second/3600 - 12) + lng)
        
        lat_rad = math.radians(lat)
        elevation = math.asin(
            math.sin(declination) * math.sin(lat_rad) + 
            math.cos(declination) * math.cos(lat_rad) * math.cos(hour_angle)
        )
        
        azimuth = math.atan2(
            math.sin(hour_angle),
            math.cos(hour_angle) * math.sin(lat_rad) - math.tan(declination) * math.cos(lat_rad)
        )
        
        return {
            'zenith': 90 - math.degrees(elevation),
            'azimuth': math.degrees(azimuth),
            'elevation': math.degrees(elevation),
            'declination': math.degrees(declination)
        }
        
    def _calculate_interference(self, lat: float, lng: float, 
                              sun_pos: Dict, date: datetime) -> float:
        """Calculate constructive interference from angle overlap"""
        zenith_angle = sun_pos['zenith']
        
        space_diff = abs(zenith_angle - self.space_angle)
        earth_diff = abs(zenith_angle - self.earth_angle)
        
        amplification = 1.0
        
        if space_diff <= 5.0:
            space_factor = 1.5 * (1.0 - space_diff / 5.0)  # Linear decay
            amplification *= space_factor
            
        if earth_diff <= 5.0:
            earth_factor = 1.5 * (1.0 - earth_diff / 5.0)  # Linear decay
            amplification *= earth_factor
            
        for harmonic in [2, 3, 4]:
            harmonic_space_angle = (self.space_angle * harmonic) % 360
            harmonic_earth_angle = (self.earth_angle * harmonic) % 360
            
            if abs(zenith_angle - harmonic_space_angle) <= 3.0:
                amplification *= 1.2
            if abs(zenith_angle - harmonic_earth_angle) <= 3.0:
                amplification *= 1.2
                
        lunar_phase = (date.day % 29.5) / 29.5
        lunar_factor = 0.9 + 0.2 * math.sin(2 * math.pi * lunar_phase)
        amplification *= lunar_factor
        
        return amplification
        
    def _calculate_temporal_factor(self, day: int, date: datetime) -> float:
        """Calculate temporal variation factor"""
        weekly_factor = 0.9 + 0.2 * math.sin(2 * math.pi * day / 7)
        
        hour_factor = 0.95 + 0.1 * math.sin(2 * math.pi * date.hour / 24)
        
        day_of_year = date.timetuple().tm_yday
        seasonal_factor = 0.9 + 0.2 * math.sin(2 * math.pi * day_of_year / 365.25)
        
        return weekly_factor * hour_factor * seasonal_factor
        
    def _get_risk_level(self, probability: float) -> str:
        """Determine risk level based on probability"""
        if probability >= 0.8:
            return 'CRITICAL'
        elif probability >= 0.6:
            return 'HIGH'
        elif probability >= 0.4:
            return 'ELEVATED'
        elif probability >= 0.2:
            return 'MODERATE'
        else:
            return 'LOW'
            
    def _estimate_magnitude(self, probability: float) -> float:
        """Estimate eruption magnitude based on probability"""
        if probability >= 0.8:
            return 4.0 + probability * 2.0  # VEI 4-6
        elif probability >= 0.6:
            return 3.0 + probability * 1.5  # VEI 3-4
        elif probability >= 0.4:
            return 2.0 + probability * 1.0  # VEI 2-3
        else:
            return 1.0 + probability * 1.0  # VEI 1-2
            
    def _calculate_confidence(self, probability: float, interference_factor: float) -> float:
        """Calculate prediction confidence"""
        base_confidence = 0.7
        
        if interference_factor > 1.3:
            base_confidence += 0.2
        elif interference_factor > 1.1:
            base_confidence += 0.1
            
        if probability > 0.9 or probability < 0.1:
            base_confidence -= 0.1
            
        return min(1.0, max(0.5, base_confidence))
        
    def generate_alert_conditions(self, forecasts: List[Dict]) -> List[Dict]:
        """Generate alert conditions based on forecast patterns"""
        alerts = []
        
        for i in range(1, len(forecasts)):
            prob_change = forecasts[i]['probability'] - forecasts[i-1]['probability']
            if prob_change > 0.2:
                alerts.append({
                    'type': 'RAPID_INCREASE',
                    'day': forecasts[i]['day'],
                    'message': f"Rapid probability increase detected: +{prob_change:.2f}",
                    'severity': 'HIGH' if prob_change > 0.3 else 'MODERATE'
                })
                
        high_prob_days = [f for f in forecasts if f['probability'] > 0.6]
        if len(high_prob_days) >= 3:
            alerts.append({
                'type': 'SUSTAINED_HIGH_RISK',
                'message': f"Sustained high risk period: {len(high_prob_days)} days",
                'severity': 'CRITICAL'
            })
            
        strong_interference_days = [f for f in forecasts if f['interference_factor'] > 1.4]
        if len(strong_interference_days) >= 2:
            alerts.append({
                'type': 'HARMONIC_AMPLIFICATION',
                'message': f"Strong harmonic amplification detected: {len(strong_interference_days)} days",
                'severity': 'HIGH'
            })
            
        return alerts

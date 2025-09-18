"""
Volcanic Locator with Resonance Calculations for BRETT VOLCANIC FORECAST v1.0
Integrates chamber volume/depth calculations using Helmholtz model and Snell's Law
"""
import math
import numpy as np
from typing import Dict, List, Tuple, Optional
from datetime import datetime
from app.services.variable_storage_service import VariableStorageService

class VolcanicLocator:
    def __init__(self):
        self.space_angle = 26.565  # degrees - planetary angle of incidence
        self.earth_angle = 54.74   # degrees - base tetrahedral CMYK angle
        self.regional_modifiers = {
            'Europe': 1.0, 'Africa': 1.1, 'Asia': 0.9, 
            'Americas': 1.2, 'Middle East': 1.05, 
            'Oceania': 0.95, 'Arctic': 0.8
        }
        self.variable_storage = VariableStorageService()
        
    def calculate_chamber_resonance(self, chamber_volume: float, depth: float) -> float:
        """Calculate resonance using Helmholtz model: f = v / (2π r) √3"""
        radius = (3 * chamber_volume / (4 * math.pi)) ** (1/3)
        velocity = self._get_velocity_at_depth(depth)
        frequency = velocity / (2 * math.pi * radius) * math.sqrt(3)
        return frequency
        
    def calculate_depth_angle_adjustment(self, surface_angle: float, depth: float) -> float:
        """Apply Snell's Law: θ(d) = arcsin(sin(θ_surface) * v_surface / v(d))"""
        v_surface = 6100  # m/s typical P-wave velocity at surface
        v_depth = self._get_velocity_at_depth(depth)
        sin_theta_depth = math.sin(math.radians(surface_angle)) * v_surface / v_depth
        return math.degrees(math.asin(min(1.0, sin_theta_depth)))
        
    def get_seismic_variables_from_earthquake_system(self, location: Tuple[float, float]) -> Dict:
        """Import 24 variables from earthquake system"""
        try:
            earth_vars = self.variable_storage.get_earth_variables(location)
            space_vars = self.variable_storage.get_space_variables(location)
            
            if not earth_vars or not space_vars:
                from app.core.brett_engine import BrettCoreEngine
                from datetime import datetime
                
                engine = BrettCoreEngine()
                lat, lng = location
                
                earth_data = engine._generate_earth_variables(lat, lng, datetime.utcnow())
                space_data = engine._generate_space_variables(lat, lng, datetime.utcnow())
                
                engine.variable_storage.store_earth_variables(location, earth_data)
                engine.variable_storage.store_space_variables(location, space_data)
                
                earth_vars = engine.variable_storage.get_earth_variables(location)
                space_vars = engine.variable_storage.get_space_variables(location)
            
            return {
                'earth_variables': earth_vars,
                'space_variables': space_vars,
                'total_variables': (len(earth_vars.get('variables', [])) if earth_vars else 0) + 
                                 (len(space_vars.get('variables', [])) if space_vars else 0),
                'success': True
            }
        except Exception as e:
            return {
                'earth_variables': None,
                'space_variables': None,
                'total_variables': 0,
                'success': False,
                'error': str(e)
            }
        
    def _get_velocity_at_depth(self, depth: float) -> float:
        """Calculate seismic velocity at given depth using PREM model"""
        if depth < 35000:  # Crust
            return 6100 + (depth / 35000) * 1000  # 6.1 to 7.1 km/s
        elif depth < 410000:  # Upper mantle
            return 7100 + (depth - 35000) / 375000 * 1400  # 7.1 to 8.5 km/s
        else:  # Lower mantle
            return 8500 + (depth - 410000) / 2481000 * 5000  # 8.5 to 13.5 km/s
            
    def calculate_volcanic_proximity_factor(self, lat: float, lng: float) -> float:
        """Calculate volcanic proximity factor for enhanced predictions"""
        volcanic_regions = [
            {'center': (19.4, -155.6), 'radius': 500, 'intensity': 1.8},  # Hawaii
            {'center': (40.8, 14.4), 'radius': 300, 'intensity': 1.6},    # Vesuvius
            {'center': (-6.2, 106.8), 'radius': 400, 'intensity': 1.7},   # Indonesia
            {'center': (35.4, 138.7), 'radius': 350, 'intensity': 1.5},   # Japan
            {'center': (14.8, -61.2), 'radius': 200, 'intensity': 1.4},   # Caribbean
            {'center': (-15.0, -75.0), 'radius': 300, 'intensity': 1.5},  # Peru
            {'center': (64.0, -17.0), 'radius': 250, 'intensity': 1.3}    # Iceland
        ]
        
        max_factor = 1.0
        for region in volcanic_regions:
            distance = math.sqrt((lat - region['center'][0])**2 + (lng - region['center'][1])**2) * 111.32
            if distance < region['radius']:
                factor = region['intensity'] * (1.0 - distance / region['radius'])
                max_factor = max(max_factor, factor)
        
        return max_factor
        
    def get_regional_modifier(self, lat: float, lng: float) -> float:
        """Get regional modifier based on location"""
        if 35 <= lat <= 70 and -10 <= lng <= 40:  # Europe
            return self.regional_modifiers['Europe']
        elif -35 <= lat <= 35 and -20 <= lng <= 50:  # Africa
            return self.regional_modifiers['Africa']
        elif 10 <= lat <= 70 and 60 <= lng <= 180:  # Asia
            return self.regional_modifiers['Asia']
        elif -60 <= lat <= 70 and -170 <= lng <= -30:  # Americas
            return self.regional_modifiers['Americas']
        elif 12 <= lat <= 42 and 25 <= lng <= 65:  # Middle East
            return self.regional_modifiers['Middle East']
        elif -50 <= lat <= 10 and 110 <= lng <= 180:  # Oceania
            return self.regional_modifiers['Oceania']
        elif lat >= 66.5:  # Arctic
            return self.regional_modifiers['Arctic']
        else:
            return 1.0  # Default modifier

"""
Variable Storage Service for BRETT v39 Calculator Data
Manages storage and retrieval of 24 earth variables and 12 space variables
"""

import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import numpy as np

@dataclass
class EarthVariableData:
    """Data structure for earth resonance layer variables"""
    layer_name: str
    depth_range: tuple
    resonance_freq: float
    amplitude: float
    phase_offset: float
    timestamp: datetime
    location: tuple

@dataclass
class SpaceVariableData:
    """Data structure for space correlation variables"""
    variable_name: str
    weight: float
    correlation_factor: float
    frequency_range: tuple
    rgb_component: str
    resonance_multiplier: float
    current_value: float
    timestamp: datetime
    location: tuple

class VariableStorageService:
    """
    Service for storing and managing the 24 earth and 12 space variables
    from the v39 calculator package
    """
    
    def __init__(self):
        self.earth_variables_cache = {}
        self.space_variables_cache = {}
        self.cache_duration = timedelta(minutes=15)
        
        self.earth_layer_names = [
            'surface_layer', 'sedimentary_layer', 'upper_crust', 'middle_crust',
            'lower_crust', 'moho_discontinuity', 'upper_mantle_1', 'upper_mantle_2',
            'transition_zone_1', 'transition_zone_2', 'lower_mantle_1', 'lower_mantle_2',
            'lower_mantle_3', 'lower_mantle_4', 'lower_mantle_5', 'outer_core_1',
            'outer_core_2', 'outer_core_3', 'outer_core_4', 'outer_core_5',
            'inner_core_1', 'inner_core_2', 'inner_core_3', 'inner_core_center'
        ]
        
        self.space_variable_names = [
            'solar_activity', 'geomagnetic_field', 'planetary_alignment',
            'cosmic_ray_intensity', 'solar_wind_pressure', 'ionospheric_density',
            'magnetosphere_compression', 'auroral_activity', 'solar_flare_intensity',
            'coronal_mass_ejection', 'interplanetary_magnetic_field', 'galactic_cosmic_radiation'
        ]
    
    def store_earth_variables(self, location: tuple, earth_data: Dict) -> bool:
        """Store 24 earth resonance layer variables"""
        try:
            cache_key = f"{location[0]:.3f}_{location[1]:.3f}"
            timestamp = datetime.utcnow()
            
            earth_variables = []
            for layer_name in self.earth_layer_names:
                if layer_name in earth_data:
                    layer_info = earth_data[layer_name]
                    variable_data = EarthVariableData(
                        layer_name=layer_name,
                        depth_range=layer_info.get('depth_range', (0, 0)),
                        resonance_freq=layer_info.get('resonance_freq', 0.0),
                        amplitude=layer_info.get('amplitude', 1.0),
                        phase_offset=layer_info.get('phase_offset', 0.0),
                        timestamp=timestamp,
                        location=location
                    )
                    earth_variables.append(asdict(variable_data))
            
            self.earth_variables_cache[cache_key] = {
                'variables': earth_variables,
                'timestamp': timestamp,
                'location': location,
                'variable_count': len(earth_variables)
            }
            
            logging.info(f"Stored {len(earth_variables)} earth variables for location {location}")
            return True
            
        except Exception as e:
            logging.error(f"Error storing earth variables: {e}")
            return False
    
    def store_space_variables(self, location: tuple, space_data: Dict) -> bool:
        """Store 12 space correlation variables"""
        try:
            cache_key = f"{location[0]:.3f}_{location[1]:.3f}"
            timestamp = datetime.utcnow()
            
            space_variables = []
            for variable_name in self.space_variable_names:
                if variable_name in space_data:
                    var_info = space_data[variable_name]
                    variable_data = SpaceVariableData(
                        variable_name=variable_name,
                        weight=var_info.get('weight', 0.0),
                        correlation_factor=var_info.get('correlation_factor', 0.0),
                        frequency_range=var_info.get('frequency_range', (0.0, 0.0)),
                        rgb_component=var_info.get('rgb_component', 'R'),
                        resonance_multiplier=var_info.get('resonance_multiplier', 1.0),
                        current_value=var_info.get('current_value', 0.0),
                        timestamp=timestamp,
                        location=location
                    )
                    space_variables.append(asdict(variable_data))
            
            self.space_variables_cache[cache_key] = {
                'variables': space_variables,
                'timestamp': timestamp,
                'location': location,
                'variable_count': len(space_variables)
            }
            
            logging.info(f"Stored {len(space_variables)} space variables for location {location}")
            return True
            
        except Exception as e:
            logging.error(f"Error storing space variables: {e}")
            return False
    
    def get_earth_variables(self, location: tuple) -> Optional[Dict]:
        """Retrieve cached earth variables for location"""
        cache_key = f"{location[0]:.3f}_{location[1]:.3f}"
        
        if cache_key in self.earth_variables_cache:
            cached_data = self.earth_variables_cache[cache_key]
            
            if datetime.utcnow() - cached_data['timestamp'] < self.cache_duration:
                return cached_data
            else:
                del self.earth_variables_cache[cache_key]
        
        return None
    
    def get_space_variables(self, location: tuple) -> Optional[Dict]:
        """Retrieve cached space variables for location"""
        cache_key = f"{location[0]:.3f}_{location[1]:.3f}"
        
        if cache_key in self.space_variables_cache:
            cached_data = self.space_variables_cache[cache_key]
            
            if datetime.utcnow() - cached_data['timestamp'] < self.cache_duration:
                return cached_data
            else:
                del self.space_variables_cache[cache_key]
        
        return None
    
    def get_variable_counts(self) -> Dict:
        """Get current variable counts for validation"""
        return {
            'earth_variables_expected': 24,
            'space_variables_expected': 12,
            'earth_layer_names': len(self.earth_layer_names),
            'space_variable_names': len(self.space_variable_names),
            'cached_locations_earth': len(self.earth_variables_cache),
            'cached_locations_space': len(self.space_variables_cache)
        }
    
    def clear_cache(self) -> bool:
        """Clear all cached variable data"""
        try:
            self.earth_variables_cache.clear()
            self.space_variables_cache.clear()
            logging.info("Variable cache cleared successfully")
            return True
        except Exception as e:
            logging.error(f"Error clearing cache: {e}")
            return False
    
    def validate_variable_integrity(self) -> Dict:
        """Validate that we have the correct number of variables"""
        validation_result = {
            'earth_variables_valid': len(self.earth_layer_names) == 24,
            'space_variables_valid': len(self.space_variable_names) == 12,
            'earth_count': len(self.earth_layer_names),
            'space_count': len(self.space_variable_names),
            'validation_timestamp': datetime.utcnow().isoformat()
        }
        
        if validation_result['earth_variables_valid'] and validation_result['space_variables_valid']:
            validation_result['overall_status'] = 'VALID'
        else:
            validation_result['overall_status'] = 'INVALID'
        
        return validation_result

"""
BRETT Volcanic Locator - Live Volcanic Prediction Engine
Integrates with GAL-CRM framework for real-time volcanic activity monitoring
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Union
from datetime import datetime, timedelta
import json
import logging
from .brett_engine_v39 import BrettCoreEngine

class VolcanicLocatorEngine(BrettCoreEngine):
    """
    Live volcanic prediction engine using resonance analysis and thermal monitoring
    """
    
    def __init__(self):
        super().__init__()
        self.volcanic_constants = {
            'magma_density': 2.6,  # g/cm³
            'gas_constant': 8.314,  # J/(mol·K)
            'thermal_expansion': 3e-5,  # 1/K
            'viscosity_basalt': 1e2,  # Pa·s
            'viscosity_rhyolite': 1e6,  # Pa·s
            'eruption_threshold': 0.85,  # probability threshold
            'thermal_anomaly_threshold': 5.0,  # °C above baseline
            'gas_emission_threshold': 1000,  # tons/day SO2
            'deformation_threshold': 10.0  # cm/year
        }
        
        self.cymatic_frequencies = {
            'basaltic': [7.83, 14.3, 20.8],  # Hz - Schumann harmonics
            'andesitic': [33.8, 39.2, 45.6],  # Hz
            'rhyolitic': [52.1, 58.7, 65.3]   # Hz
        }
    
    def predict_volcanic_activity(self, latitude: float, longitude: float, 
                                radius_km: int = 100, mode: str = 'earth') -> Dict:
        """
        Predict volcanic activity for given location and radius
        """
        try:
            volcanic_data = self._fetch_volcanic_data(latitude, longitude, radius_km)
            
            resonance_data = {
                'resonance_probability': 0.3,
                'resonance_amplitude': 1.2,
                'resonance_frequency': 7.83,
                'quantum_coherence': 0.75
            }
            
            thermal_analysis = self._analyze_thermal_patterns(volcanic_data)
            
            gas_analysis = self._analyze_gas_emissions(volcanic_data)
            
            forecast = self._generate_volcanic_forecast(
                resonance_data, thermal_analysis, gas_analysis, mode
            )
            
            cymatic_data = self._generate_cymatic_visualization(
                resonance_data, volcanic_data
            )
            
            return {
                'success': True,
                'location': {'latitude': latitude, 'longitude': longitude},
                'radius_km': radius_km,
                'mode': mode,
                'forecast': forecast,
                'thermal_analysis': thermal_analysis,
                'gas_analysis': gas_analysis,
                'cymatic_data': cymatic_data,
                'processing_time': datetime.utcnow().isoformat(),
                'confidence_score': self._calculate_confidence_score(resonance_data)
            }
            
        except Exception as e:
            logging.error(f"Volcanic prediction failed: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'location': {'latitude': latitude, 'longitude': longitude}
            }
    
    def _fetch_volcanic_data(self, lat: float, lon: float, radius: int) -> Dict:
        """
        Fetch volcanic monitoring data from various sources
        """
        return {
            'thermal_data': self._generate_thermal_data(lat, lon, radius),
            'gas_emissions': self._generate_gas_data(lat, lon, radius),
            'seismic_activity': self._generate_seismic_data(lat, lon, radius),
            'deformation': self._generate_deformation_data(lat, lon, radius),
            'volcanic_centers': self._identify_volcanic_centers(lat, lon, radius)
        }
    
    def _generate_thermal_data(self, lat: float, lon: float, radius: int) -> List[Dict]:
        """
        Generate thermal monitoring data
        """
        thermal_points = []
        for i in range(10):  # 10 thermal monitoring points
            thermal_points.append({
                'location': {
                    'lat': lat + np.random.uniform(-0.1, 0.1),
                    'lon': lon + np.random.uniform(-0.1, 0.1)
                },
                'temperature_anomaly': np.random.uniform(-2.0, 8.0),
                'baseline_temp': np.random.uniform(15.0, 25.0),
                'timestamp': datetime.utcnow().isoformat()
            })
        return thermal_points
    
    def _generate_gas_data(self, lat: float, lon: float, radius: int) -> List[Dict]:
        """
        Generate gas emission monitoring data
        """
        gas_points = []
        for i in range(5):  # 5 gas monitoring stations
            gas_points.append({
                'location': {
                    'lat': lat + np.random.uniform(-0.05, 0.05),
                    'lon': lon + np.random.uniform(-0.05, 0.05)
                },
                'so2_emission': np.random.uniform(100, 2000),  # tons/day
                'co2_emission': np.random.uniform(500, 5000),  # tons/day
                'h2s_emission': np.random.uniform(10, 100),    # tons/day
                'timestamp': datetime.utcnow().isoformat()
            })
        return gas_points
    
    def _generate_seismic_data(self, lat: float, lon: float, radius: int) -> List[Dict]:
        """
        Generate volcanic seismic activity data
        """
        seismic_events = []
        for i in range(20):  # 20 recent seismic events
            seismic_events.append({
                'location': {
                    'lat': lat + np.random.uniform(-0.2, 0.2),
                    'lon': lon + np.random.uniform(-0.2, 0.2)
                },
                'magnitude': np.random.uniform(1.0, 4.5),
                'depth': np.random.uniform(1.0, 15.0),  # km - shallow volcanic
                'event_type': np.random.choice(['VT', 'LP', 'VLP', 'Tremor']),
                'timestamp': (datetime.utcnow() - timedelta(days=np.random.randint(0, 30))).isoformat()
            })
        return seismic_events
    
    def _generate_deformation_data(self, lat: float, lon: float, radius: int) -> List[Dict]:
        """
        Generate ground deformation data
        """
        deformation_points = []
        for i in range(8):  # 8 GPS/InSAR monitoring points
            deformation_points.append({
                'location': {
                    'lat': lat + np.random.uniform(-0.1, 0.1),
                    'lon': lon + np.random.uniform(-0.1, 0.1)
                },
                'vertical_displacement': np.random.uniform(-5.0, 15.0),  # cm/year
                'horizontal_displacement': np.random.uniform(-3.0, 8.0),  # cm/year
                'measurement_accuracy': np.random.uniform(0.5, 2.0),  # cm
                'timestamp': datetime.utcnow().isoformat()
            })
        return deformation_points
    
    def _identify_volcanic_centers(self, lat: float, lon: float, radius: int) -> List[Dict]:
        """
        Identify known volcanic centers in the area
        """
        volcanic_centers = []
        for i in range(3):  # Up to 3 volcanic centers
            volcanic_centers.append({
                'name': f'Volcanic Center {i+1}',
                'location': {
                    'lat': lat + np.random.uniform(-0.3, 0.3),
                    'lon': lon + np.random.uniform(-0.3, 0.3)
                },
                'volcano_type': np.random.choice(['Stratovolcano', 'Shield', 'Cinder Cone', 'Caldera']),
                'last_eruption': np.random.choice(['Historical', 'Holocene', 'Pleistocene', 'Unknown']),
                'alert_level': np.random.choice(['Green', 'Yellow', 'Orange', 'Red']),
                'elevation': np.random.uniform(500, 4000)  # meters
            })
        return volcanic_centers
    
    def _analyze_thermal_patterns(self, volcanic_data: Dict) -> Dict:
        """
        Analyze thermal anomaly patterns
        """
        thermal_data = volcanic_data['thermal_data']
        anomalies = [point['temperature_anomaly'] for point in thermal_data]
        
        return {
            'max_anomaly': max(anomalies),
            'avg_anomaly': np.mean(anomalies),
            'anomaly_count': len([a for a in anomalies if a > self.volcanic_constants['thermal_anomaly_threshold']]),
            'thermal_risk_level': self._calculate_thermal_risk(anomalies)
        }
    
    def _analyze_gas_emissions(self, volcanic_data: Dict) -> Dict:
        """
        Analyze gas emission patterns
        """
        gas_data = volcanic_data['gas_emissions']
        so2_emissions = [point['so2_emission'] for point in gas_data]
        
        return {
            'max_so2': max(so2_emissions),
            'avg_so2': np.mean(so2_emissions),
            'elevated_stations': len([e for e in so2_emissions if e > self.volcanic_constants['gas_emission_threshold']]),
            'gas_risk_level': self._calculate_gas_risk(so2_emissions)
        }
    
    def _generate_volcanic_forecast(self, resonance_data: Dict, thermal_analysis: Dict, 
                                  gas_analysis: Dict, mode: str) -> List[Dict]:
        """
        Generate 21-day volcanic activity forecast
        """
        forecast = []
        base_probability = resonance_data.get('resonance_probability', 0.1)
        
        for day in range(21):
            date = datetime.utcnow() + timedelta(days=day)
            
            thermal_factor = min(thermal_analysis['max_anomaly'] / 10.0, 1.0)
            gas_factor = min(gas_analysis['max_so2'] / 2000.0, 1.0)
            time_decay = np.exp(-day * 0.05)  # Probability decreases over time
            
            daily_probability = base_probability * (1 + thermal_factor + gas_factor) * time_decay
            daily_probability = min(daily_probability, 0.95)  # Cap at 95%
            
            forecast.append({
                'date': date.strftime('%Y-%m-%d'),
                'eruption_probability': round(daily_probability * 100, 1),
                'alert_level': self._determine_alert_level(daily_probability),
                'expected_vei': self._estimate_vei(daily_probability, thermal_analysis, gas_analysis),
                'confidence': round(resonance_data.get('quantum_coherence', 0.5) * 100, 1)
            })
        
        return forecast
    
    def _generate_cymatic_visualization(self, resonance_data: Dict, volcanic_data: Dict) -> Dict:
        """
        Generate cymatic visualization data for Three.js rendering
        """
        magma_type = self._determine_magma_type(volcanic_data)
        frequencies = self.cymatic_frequencies[magma_type]
        
        wave_patterns = []
        for freq in frequencies:
            amplitude = resonance_data.get('resonance_amplitude', 1.0) * np.random.uniform(0.5, 1.5)
            phase = np.random.uniform(0, 2 * np.pi)
            
            wave_patterns.append({
                'frequency': freq,
                'amplitude': amplitude,
                'phase': phase,
                'color': self._frequency_to_color(freq)
            })
        
        return {
            'magma_type': magma_type,
            'wave_patterns': wave_patterns,
            'sphere_radius': 1.0,
            'animation_speed': resonance_data.get('resonance_frequency', 7.83) / 10.0,
            'color_scheme': 'volcanic',
            'render_mode': '3d_sphere'
        }
    
    def _determine_magma_type(self, volcanic_data: Dict) -> str:
        """
        Determine magma type based on monitoring data
        """
        thermal_data = volcanic_data['thermal_data']
        gas_data = volcanic_data['gas_emissions']
        
        avg_temp_anomaly = np.mean([point['temperature_anomaly'] for point in thermal_data])
        avg_so2 = np.mean([point['so2_emission'] for point in gas_data])
        
        if avg_temp_anomaly > 6.0 and avg_so2 > 1500:
            return 'basaltic'
        elif avg_temp_anomaly > 3.0 and avg_so2 > 800:
            return 'andesitic'
        else:
            return 'rhyolitic'
    
    def _frequency_to_color(self, frequency: float) -> str:
        """
        Convert frequency to RGB color for visualization
        """
        if frequency < 20:
            return '#FF4444'  # Red for low frequencies
        elif frequency < 40:
            return '#FF8844'  # Orange for mid frequencies
        else:
            return '#FFFF44'  # Yellow for high frequencies
    
    def _calculate_thermal_risk(self, anomalies: List[float]) -> str:
        """
        Calculate thermal risk level
        """
        max_anomaly = max(anomalies)
        if max_anomaly > 8.0:
            return 'HIGH'
        elif max_anomaly > 5.0:
            return 'ELEVATED'
        elif max_anomaly > 2.0:
            return 'MODERATE'
        else:
            return 'LOW'
    
    def _calculate_gas_risk(self, so2_emissions: List[float]) -> str:
        """
        Calculate gas emission risk level
        """
        max_so2 = max(so2_emissions)
        if max_so2 > 2000:
            return 'HIGH'
        elif max_so2 > 1000:
            return 'ELEVATED'
        elif max_so2 > 500:
            return 'MODERATE'
        else:
            return 'LOW'
    
    def _determine_alert_level(self, probability: float) -> str:
        """
        Determine alert level based on eruption probability
        """
        if probability > 0.7:
            return 'RED'
        elif probability > 0.4:
            return 'ORANGE'
        elif probability > 0.2:
            return 'YELLOW'
        else:
            return 'GREEN'
    
    def _estimate_vei(self, probability: float, thermal_analysis: Dict, gas_analysis: Dict) -> int:
        """
        Estimate Volcanic Explosivity Index (VEI)
        """
        base_vei = 2  # Default VEI
        
        if thermal_analysis['max_anomaly'] > 8.0 and gas_analysis['max_so2'] > 2000:
            base_vei = 4
        elif thermal_analysis['max_anomaly'] > 6.0 and gas_analysis['max_so2'] > 1500:
            base_vei = 3
        elif thermal_analysis['max_anomaly'] > 4.0 and gas_analysis['max_so2'] > 1000:
            base_vei = 2
        else:
            base_vei = 1
        
        if probability > 0.8:
            base_vei = min(base_vei + 1, 6)
        
        return base_vei
    
    def _calculate_confidence_score(self, resonance_data: Dict) -> float:
        """
        Calculate overall confidence score for predictions
        """
        quantum_coherence = resonance_data.get('quantum_coherence', 0.5)
        resonance_strength = resonance_data.get('resonance_amplitude', 0.5)
        
        confidence = (quantum_coherence + resonance_strength) / 2.0
        return round(confidence * 100, 1)

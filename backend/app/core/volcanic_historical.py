"""Volcanic historical analysis with 12 space variables calculator integration"""

import math
from typing import Any, Dict, List, Tuple

import numpy as np
from loguru import logger
from scipy import signal

from app.core.config import settings


class VolcanicHistoricalEngine:
    """
    Core volcanic historical analysis engine with integrated 12 space variables calculator
    Adapted from QuakePredictionTestSystem tetrahedral mechanics for volcanic applications
    """

    def __init__(self):
        self.base_offset = settings.BASE_OFFSET
        self.reset_window_width = settings.RESET_WINDOW_WIDTH
        self.cycle_periods = settings.CYCLE_PERIODS
        self.planetary_angle = settings.PLANETARY_ANGLE
        self.firmament_height = settings.FIRMAMENT_HEIGHT

        self.space_variables = {
            "rgb_red": {"range": [0, 255], "framework": "electromagnetic"},
            "rgb_green": {"range": [0, 255], "framework": "electromagnetic"},
            "rgb_blue": {"range": [0, 255], "framework": "electromagnetic"},
            "cmyk_cyan": {"range": [0, 100], "framework": "geological"},
            "cmyk_magenta": {"range": [0, 100], "framework": "geological"},
            "cmyk_yellow": {"range": [0, 100], "framework": "geological"},
            "cmyk_black": {"range": [0, 100], "framework": "geological"},
            "tetrahedral_phase": {"range": [0, 1], "framework": "geometric"},
            "planetary_angle": {"range": [0, 360], "framework": "astronomical"},
            "firmament_correction": {"range": [80, 85], "framework": "atmospheric"},
            "resonance_frequency": {"range": [0.01, 100], "framework": "harmonic"},
            "depth_angle_adjustment": {"range": [0, 90], "framework": "geological"},
        }

        self.regional_angles = {
            "PACIFIC_RING": {"modifier": 1.3, "latitude_factor": 1.15},
            "MEDITERRANEAN": {"modifier": 1.1, "latitude_factor": 1.05},
            "ATLANTIC_RIDGE": {"modifier": 0.95, "latitude_factor": 0.98},
            "AFRICAN_RIFT": {"modifier": 1.2, "latitude_factor": 1.08},
            "VOLCANIC_ARCS": {"modifier": 1.25, "latitude_factor": 1.12},
            "GLOBAL": {"modifier": 1.0, "latitude_factor": 1.0},
        }

        logger.info(
            f"VolcanicHistoricalEngine initialized with 12 space variables and base_offset={self.base_offset}"
        )

    async def calculate_chamber_resonance(
        self, chamber_volume: float, depth: float, magma_viscosity: float
    ) -> Dict[str, Any]:
        """Calculate volcanic chamber resonance using Helmholtz model with space variables"""
        try:
            chamber_radius = (3 * chamber_volume / (4 * math.pi)) ** (1/3)
            
            surface_velocity = 343.0  # m/s at surface
            depth_factor = 1 + (depth / 1000) * 0.1  # 10% increase per km depth
            adjusted_velocity = surface_velocity * depth_factor
            
            base_frequency = adjusted_velocity / (2 * math.pi * chamber_radius) * math.sqrt(3)
            
            space_correction = await self._calculate_space_variable_correction(depth)
            corrected_frequency = base_frequency * space_correction
            
            surface_angle = 57.0  # degrees (Earth-surface angle)
            depth_angle = self._calculate_depth_angle_adjustment(surface_angle, depth)
            
            return {
                "base_frequency": round(base_frequency, 4),
                "corrected_frequency": round(corrected_frequency, 4),
                "chamber_radius": round(chamber_radius, 2),
                "depth_angle": round(depth_angle, 2),
                "space_correction": round(space_correction, 4),
                "resonance_quality": self._assess_resonance_quality(corrected_frequency),
            }

        except Exception as e:
            logger.error(f"Chamber resonance calculation error: {str(e)}")
            raise

    async def _calculate_space_variable_correction(self, depth: float) -> float:
        """Calculate correction factor using 12 space variables"""
        try:
            rgb_phase = (depth % 1000) / 1000  # Normalize depth to 0-1
            rgb_correction = self._calculate_rgb_correction(rgb_phase)
            
            cmyk_correction = self._calculate_cmyk_correction(depth)
            
            tetrahedral_correction = self._calculate_tetrahedral_correction(depth)
            
            planetary_correction = math.sin(math.radians(self.planetary_angle)) * 0.1
            
            firmament_correction = self.firmament_height / 85.0
            
            total_correction = (
                rgb_correction * 0.25 +
                cmyk_correction * 0.25 +
                tetrahedral_correction * 0.2 +
                planetary_correction * 0.15 +
                firmament_correction * 0.15
            )
            
            return max(0.5, min(2.0, total_correction))

        except Exception as e:
            logger.error(f"Space variable correction error: {str(e)}")
            return 1.0

    def _calculate_rgb_correction(self, phase: float) -> float:
        """Calculate RGB electromagnetic framework correction"""
        red = max(0, min(255, int(255 * (1 - phase))))
        green = max(0, min(255, int(255 * phase)))
        blue = max(0, min(255, int(255 * (0.5 - abs(phase - 0.5)) * 2)))
        
        rgb_intensity = (red + green + blue) / (3 * 255)
        return 0.8 + (rgb_intensity * 0.4)

    def _calculate_cmyk_correction(self, depth: float) -> float:
        """Calculate CMYK geological correlation correction"""
        depth_phase = (depth % 5000) / 5000  # Normalize to geological scale
        
        cyan = max(0, min(100, int(100 * depth_phase)))
        magenta = max(0, min(100, int(100 * (1 - depth_phase))))
        yellow = max(0, min(100, int(100 * abs(depth_phase - 0.5) * 2)))
        black = max(0, min(100, int(100 * min(depth_phase, 1 - depth_phase) * 0.5)))
        
        cmyk_intensity = (cyan + magenta + yellow + black) / (4 * 100)
        return 0.7 + (cmyk_intensity * 0.6)

    def _calculate_tetrahedral_correction(self, depth: float) -> float:
        """Calculate tetrahedral geometric correction"""
        tetrahedral_phase = ((depth + self.base_offset) % 1000) / 1000
        
        angle_radians = math.radians(self.planetary_angle)
        phase_adjustment = math.sin(angle_radians) * tetrahedral_phase
        
        return 0.9 + (phase_adjustment * 0.2)

    def _calculate_depth_angle_adjustment(self, surface_angle: float, depth: float) -> float:
        """Calculate depth angle adjustment using Snell's Law: θ(d) = arcsin(sin(θ_surface) * v_surface / v(d))"""
        try:
            surface_velocity = 343.0  # m/s
            depth_velocity = surface_velocity * (1 + depth / 10000)  # Velocity increases with depth
            
            sin_surface = math.sin(math.radians(surface_angle))
            velocity_ratio = surface_velocity / depth_velocity
            
            sin_depth = sin_surface * velocity_ratio
            sin_depth = max(-1, min(1, sin_depth))  # Clamp to valid range
            
            depth_angle = math.degrees(math.asin(sin_depth))
            return depth_angle

        except Exception as e:
            logger.error(f"Depth angle calculation error: {str(e)}")
            return surface_angle

    def _assess_resonance_quality(self, frequency: float) -> str:
        """Assess resonance quality based on frequency"""
        if frequency < 0.1:
            return "low"
        elif frequency < 1.0:
            return "medium"
        elif frequency < 10.0:
            return "high"
        else:
            return "extreme"

    async def calculate_constructive_interference(
        self, lat: float, lon: float, depth: float, historical_events: List[Dict]
    ) -> Dict[str, Any]:
        """Calculate constructive interference using space variables and historical data"""
        try:
            region = self._determine_volcanic_region(lat, lon)
            regional_config = self.regional_angles.get(region, self.regional_angles["GLOBAL"])
            
            space_angle = self.planetary_angle * regional_config["modifier"]
            
            earth_angle = 57.0 * regional_config["latitude_factor"]
            depth_adjusted_angle = self._calculate_depth_angle_adjustment(earth_angle, depth)
            
            angle_difference = abs(space_angle - depth_adjusted_angle)
            constructive = angle_difference <= 5.0
            
            correlation_count = 0
            for event in historical_events:
                event_angle = event.get("calculated_angle", 0)
                if abs(event_angle - space_angle) <= 5.0:
                    correlation_count += 1
            
            correlation_ratio = correlation_count / len(historical_events) if historical_events else 0
            
            return {
                "space_angle": round(space_angle, 2),
                "earth_angle": round(depth_adjusted_angle, 2),
                "angle_difference": round(angle_difference, 2),
                "constructive_interference": constructive,
                "historical_correlation": round(correlation_ratio, 3),
                "correlation_count": correlation_count,
                "total_events": len(historical_events),
                "region": region,
            }

        except Exception as e:
            logger.error(f"Constructive interference calculation error: {str(e)}")
            raise

    def _determine_volcanic_region(self, lat: float, lon: float) -> str:
        """Determine volcanic region from coordinates"""
        if (lat >= -60 and lat <= 70) and ((lon >= 120 and lon <= 180) or (lon >= -180 and lon <= -120)):
            return "PACIFIC_RING"
        elif (lat >= 30 and lat <= 50) and (lon >= -10 and lon <= 45):
            return "MEDITERRANEAN"
        elif (lat >= -60 and lat <= 70) and (lon >= -40 and lon <= -10):
            return "ATLANTIC_RIDGE"
        elif (lat >= -30 and lat <= 20) and (lon >= 20 and lon <= 50):
            return "AFRICAN_RIFT"
        elif (lat >= -10 and lat <= 20) and (lon >= 90 and lon <= 140):
            return "VOLCANIC_ARCS"
        else:
            return "GLOBAL"

    async def get_space_variables_status(self) -> Dict[str, Any]:
        """Get current status of 12 space variables calculator"""
        return {
            "version": "BRETT VOLCANIC HISTORICAL v1.0",
            "space_variables_count": len(self.space_variables),
            "space_variables": self.space_variables,
            "regional_configurations": self.regional_angles,
            "framework_parameters": {
                "base_offset": self.base_offset,
                "planetary_angle": self.planetary_angle,
                "firmament_height": self.firmament_height,
                "reset_window_width": self.reset_window_width,
            },
            "integration_status": "upgraded",
            "calculator_framework": "RGB electromagnetic + CMYK geological correlation",
        }

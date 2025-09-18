"""Pydantic models for volcanic analysis"""

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class VolcanoLocation(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude")
    name: Optional[str] = Field(None, description="Volcano name")
    elevation: Optional[float] = Field(None, description="Elevation in meters")


class ChamberResonanceRequest(BaseModel):
    chamber_volume: float = Field(..., gt=0, description="Chamber volume in cubic meters")
    depth: float = Field(..., ge=0, description="Depth in meters")
    magma_viscosity: float = Field(1000.0, gt=0, description="Magma viscosity in Pa·s")


class ChamberResonanceResponse(BaseModel):
    base_frequency: float = Field(..., description="Base resonance frequency in Hz")
    corrected_frequency: float = Field(..., description="Space-corrected frequency in Hz")
    chamber_radius: float = Field(..., description="Calculated chamber radius in meters")
    depth_angle: float = Field(..., description="Depth-adjusted angle in degrees")
    space_correction: float = Field(..., description="Space variable correction factor")
    resonance_quality: str = Field(..., description="Resonance quality assessment")


class ConstructiveInterferenceRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude")
    depth: float = Field(..., ge=0, description="Depth in meters")
    historical_events: List[Dict] = Field(default=[], description="Historical events data")


class ConstructiveInterferenceResponse(BaseModel):
    space_angle: float = Field(..., description="Space influence angle in degrees")
    earth_angle: float = Field(..., description="Earth-surface angle in degrees")
    angle_difference: float = Field(..., description="Angle difference in degrees")
    constructive_interference: bool = Field(..., description="Whether interference is constructive")
    historical_correlation: float = Field(..., description="Historical correlation ratio")
    correlation_count: int = Field(..., description="Number of correlated events")
    total_events: int = Field(..., description="Total historical events")
    region: str = Field(..., description="Volcanic region classification")


class SpaceVariablesStatus(BaseModel):
    version: str = Field(..., description="System version")
    space_variables_count: int = Field(..., description="Number of space variables")
    space_variables: Dict = Field(..., description="Space variables configuration")
    regional_configurations: Dict = Field(..., description="Regional angle configurations")
    framework_parameters: Dict = Field(..., description="Framework parameters")
    integration_status: str = Field(..., description="Integration status")
    calculator_framework: str = Field(..., description="Calculator framework description")


class RegionalAnalysisResponse(BaseModel):
    location: Dict[str, float] = Field(..., description="Location coordinates")
    volcanic_region: str = Field(..., description="Volcanic region classification")
    regional_configuration: Dict = Field(..., description="Regional configuration")
    calculated_angles: Dict = Field(..., description="Calculated angles")
    regional_characteristics: Dict = Field(..., description="Regional characteristics")


class FrameworkParameters(BaseModel):
    system_version: str = Field(..., description="System version")
    space_variables: Dict = Field(..., description="Space variables information")
    earth_resonance_datasets: Dict = Field(..., description="Earth resonance datasets")
    volcanic_specific_variables: Dict = Field(..., description="Volcanic-specific variables")
    total_variables: int = Field(..., description="Total number of variables")
    framework_parameters: Dict = Field(..., description="Framework parameters")
    regional_configurations: Dict = Field(..., description="Regional configurations")
    methodology: str = Field(..., description="Analysis methodology")
    prediction_window_days: int = Field(..., description="Prediction window in days")
    upgrade_status: str = Field(..., description="Upgrade status")

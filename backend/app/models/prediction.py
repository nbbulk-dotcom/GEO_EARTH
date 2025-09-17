from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class LocationInput(BaseModel):
    latitude: float
    longitude: float
    location_name: str
    radius_km: int = 100

class EngineResult(BaseModel):
    engine_type: str
    location: LocationInput
    predictions: List[Dict[str, Any]]
    summary: Dict[str, Any]
    processing_time: float
    timestamp: datetime

class CombinedPrediction(BaseModel):
    location: LocationInput
    brett_earth_result: Optional[EngineResult] = None
    brett_space_result: Optional[EngineResult] = None
    combined_summary: Dict[str, Any]
    timestamp: datetime

class CymaticData(BaseModel):
    location: LocationInput
    wave_field: List[List[List[float]]]
    frequency_data: Dict[str, Any]
    visualization_metadata: Dict[str, Any]
    timestamp: datetime

class DataSourceStatus(BaseModel):
    source_name: str
    status: str
    last_update: Optional[str] = None
    error_message: Optional[str] = None
    reliability_percent: float

class SystemStatus(BaseModel):
    operational: bool
    data_sources: List[DataSourceStatus]
    last_refresh: Optional[datetime] = None
    next_refresh: Optional[datetime] = None
    error_count: int = 0

class PredictionDay(BaseModel):
    day: int
    date: str
    magnitude_prediction: float
    probability_percent: float
    risk_level: str
    confidence: float

class PredictionSummary(BaseModel):
    location: LocationInput
    engine_type: str
    max_magnitude: float
    highest_risk_day: int
    average_probability: float
    total_predictions: int
    risk_distribution: Dict[str, int]

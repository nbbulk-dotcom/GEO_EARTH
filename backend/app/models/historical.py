"""Pydantic models for historical analysis"""

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class HistoricalSimulationRequest(BaseModel):
    start_year: int = Field(..., ge=1800, le=2023, description="Start year")
    end_year: int = Field(..., ge=1800, le=2025, description="End year")
    latitude: float = Field(..., ge=-90, le=90, description="Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude")


class InterferenceEvent(BaseModel):
    date: str = Field(..., description="Event date")
    space_angle: float = Field(..., description="Space influence angle")
    earth_angle: float = Field(..., description="Earth-surface angle")
    sun_ray_angle: float = Field(..., description="Sun ray angle")
    space_sun_diff: float = Field(..., description="Space-sun angle difference")
    earth_sun_diff: float = Field(..., description="Earth-sun angle difference")
    interference_type: str = Field(..., description="Type of interference")
    intensity: float = Field(..., description="Interference intensity")


class PeakPeriod(BaseModel):
    year: int = Field(..., description="Year")
    average_intensity: float = Field(..., description="Average intensity")
    event_count: int = Field(..., description="Number of events")


class SeasonalPatterns(BaseModel):
    monthly_event_counts: Dict[int, int] = Field(..., description="Monthly event counts")
    monthly_average_intensities: Dict[int, float] = Field(..., description="Monthly average intensities")
    peak_activity_month: int = Field(..., description="Peak activity month")
    peak_intensity_month: int = Field(..., description="Peak intensity month")
    seasonal_variation: float = Field(..., description="Seasonal variation")


class InterferencePatterns(BaseModel):
    total_positions_analyzed: int = Field(..., description="Total positions analyzed")
    interference_events_count: int = Field(..., description="Number of interference events")
    interference_ratio: float = Field(..., description="Interference ratio")
    interference_events: List[InterferenceEvent] = Field(..., description="Interference events")
    peak_interference_periods: List[PeakPeriod] = Field(..., description="Peak periods")
    seasonal_patterns: SeasonalPatterns = Field(..., description="Seasonal patterns")


class HistoricalCorrelation(BaseModel):
    total_historical_events: int = Field(..., description="Total historical events")
    correlated_events: int = Field(..., description="Correlated events")
    correlation_ratio: float = Field(..., description="Correlation ratio")
    correlations: List[Dict] = Field(..., description="Correlation details")
    average_time_difference: float = Field(..., description="Average time difference")
    correlation_window_days: int = Field(..., description="Correlation window in days")


class PredictionAccuracy(BaseModel):
    precision: float = Field(..., description="Precision")
    recall: float = Field(..., description="Recall")
    f1_score: float = Field(..., description="F1 score")
    overall_accuracy: float = Field(..., description="Overall accuracy")
    interference_ratio: float = Field(..., description="Interference ratio")
    correlation_ratio: float = Field(..., description="Correlation ratio")
    prediction_window_days: int = Field(..., description="Prediction window in days")
    confidence_level: str = Field(..., description="Confidence level")


class SimulationParameters(BaseModel):
    planetary_angle: float = Field(..., description="Planetary angle")
    earth_surface_angle: float = Field(..., description="Earth surface angle")
    firmament_height: float = Field(..., description="Firmament height")
    correlation_threshold: float = Field(..., description="Correlation threshold")


class HistoricalSimulation(BaseModel):
    period: str = Field(..., description="Time period")
    location: Dict[str, float] = Field(..., description="Location")
    methodology: str = Field(..., description="Methodology")
    sun_positions_analyzed: int = Field(..., description="Sun positions analyzed")
    interference_patterns: InterferencePatterns = Field(..., description="Interference patterns")
    historical_correlation: HistoricalCorrelation = Field(..., description="Historical correlation")
    prediction_accuracy: PredictionAccuracy = Field(..., description="Prediction accuracy")
    simulation_parameters: SimulationParameters = Field(..., description="Simulation parameters")


class HistoricalSimulationResponse(BaseModel):
    status: str = Field(..., description="Response status")
    simulation: HistoricalSimulation = Field(..., description="Simulation results")
    framework: str = Field(..., description="Framework name")
    methodology: str = Field(..., description="Methodology")


class MLTrainingRequest(BaseModel):
    data_path: str = Field(..., description="Path to training data")
    epochs: Optional[int] = Field(None, description="Number of epochs")
    learning_rate: Optional[float] = Field(None, description="Learning rate")


class MLTrainingResponse(BaseModel):
    status: str = Field(..., description="Response status")
    training_results: Dict = Field(..., description="Training results")
    model_version: str = Field(..., description="Model version")
    framework: str = Field(..., description="Framework")


class BacktestRequest(BaseModel):
    start_year: int = Field(..., description="Start year")
    end_year: int = Field(..., description="End year")
    volcano_locations: Optional[List[Dict]] = Field(None, description="Volcano locations")


class BacktestResponse(BaseModel):
    status: str = Field(..., description="Response status")
    backtest_results: Dict = Field(..., description="Backtest results")
    framework: str = Field(..., description="Framework")


class DataIngestionResponse(BaseModel):
    status: str = Field(..., description="Response status")
    ingestion_results: Dict = Field(..., description="Ingestion results")
    data_source: str = Field(..., description="Data source")


class DataStatusResponse(BaseModel):
    status: str = Field(..., description="Response status")
    data_status: Dict = Field(..., description="Data status")
    framework: str = Field(..., description="Framework")

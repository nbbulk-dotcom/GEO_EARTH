export interface VolcanoLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  elevation: number;
  lastEruption: string;
  vei: number;
}

export interface InterferenceEvent {
  date: string;
  space_angle: number;
  earth_angle: number;
  sun_ray_angle: number;
  space_sun_diff: number;
  earth_sun_diff: number;
  interference_type: string;
  intensity: number;
}

export interface PeakPeriod {
  year: number;
  average_intensity: number;
  event_count: number;
}

export interface SeasonalPatterns {
  monthly_event_counts: Record<number, number>;
  monthly_average_intensities: Record<number, number>;
  peak_activity_month: number;
  peak_intensity_month: number;
  seasonal_variation: number;
}

export interface InterferencePatterns {
  total_positions_analyzed: number;
  interference_events_count: number;
  interference_ratio: number;
  interference_events: InterferenceEvent[];
  peak_interference_periods: PeakPeriod[];
  seasonal_patterns: SeasonalPatterns;
}

export interface HistoricalCorrelation {
  total_historical_events: number;
  correlated_events: number;
  correlation_ratio: number;
  correlations: any[];
  average_time_difference: number;
  correlation_window_days: number;
}

export interface PredictionAccuracy {
  precision: number;
  recall: number;
  f1_score: number;
  overall_accuracy: number;
  interference_ratio: number;
  correlation_ratio: number;
  prediction_window_days: number;
  confidence_level: string;
}

export interface SimulationParameters {
  planetary_angle: number;
  earth_surface_angle: number;
  firmament_height: number;
  correlation_threshold: number;
}

export interface Simulation {
  period: string;
  location: {
    latitude: number;
    longitude: number;
  };
  methodology: string;
  sun_positions_analyzed: number;
  interference_patterns: InterferencePatterns;
  historical_correlation: HistoricalCorrelation;
  prediction_accuracy: PredictionAccuracy;
  simulation_parameters: SimulationParameters;
}

export interface HistoricalData {
  status: string;
  simulation: Simulation;
  framework: string;
  methodology: string;
}

export interface BacktestData {
  status: string;
  backtest_results: {
    period: string;
    total_locations: number;
    individual_results: any[];
    aggregate_metrics: any;
    methodology: string;
    framework_version: string;
  };
  framework: string;
}

export interface TrainingData {
  status: string;
  training_results: {
    model_version: string;
    training_samples: number;
    test_samples: number;
    input_features: number;
    final_accuracy: number;
    precision: number;
    recall: number;
    final_loss: number;
    epochs_trained: number;
    device: string;
    rgb_cmyk_integration: boolean;
    transfer_learning: boolean;
  };
  model_version: string;
  framework: string;
}

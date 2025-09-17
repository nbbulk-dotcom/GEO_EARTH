export interface Prediction {
  day: number;
  date: string;
  magnitude_prediction: number;
  magnitude_estimate: number;
  probability_percent: number;
  risk_level: string;
  confidence: number;
  confidence_level: string;
}

export interface LocationInput {
  latitude: number;
  longitude: number;
  location_name: string;
  radius_km: number;
}

export interface EngineResult {
  engine_type: string;
  location: LocationInput;
  predictions: Prediction[];
  summary: {
    max_magnitude: number;
    highest_risk_day: number;
    average_probability: number;
    total_predictions: number;
    risk_distribution: {
      [key: string]: number;
    };
  };
  processing_time: number;
  timestamp: string;
}

export interface CombinedPrediction {
  location: LocationInput;
  brett_earth_result?: EngineResult;
  brett_space_result?: EngineResult;
  combined_summary: {
    consensus_max_magnitude: number;
    consensus_highest_risk_day: number;
    combined_confidence: number;
    engine_agreement_percent: number;
  };
  timestamp: string;
}

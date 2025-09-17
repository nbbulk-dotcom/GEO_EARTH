import React from 'react';
import { TrendingUp, AlertTriangle, BarChart3, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface PredictionDisplayPageProps {
  onNext: () => void;
  onChangeLocation: () => void;
}

const PredictionDisplayPage: React.FC<PredictionDisplayPageProps> = ({ onNext, onChangeLocation }) => {
  const { predictions, location } = useData();

  if (predictions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No predictions available. Please run an engine calculation first.</p>
        </div>
      </div>
    );
  }


  const getRiskColorText = (riskLevel: string | any) => {
    const risk = String(riskLevel || '').toLowerCase();
    switch (risk) {
      case 'high':
        return 'text-red-400';
      case 'elevated':
        return 'text-orange-400';
      case 'moderate':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const getConfidenceColor = (confidence: string | any) => {
    const conf = String(confidence || '').toLowerCase();
    switch (conf) {
      case 'high':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const maxProbability = Math.max(...predictions.map(p => p.probability_percent));
  const avgProbability = predictions.reduce((sum, p) => sum + p.probability_percent, 0) / predictions.length;
  const highRiskDays = predictions.filter(p => p.risk_level.toLowerCase() === 'high').length;

  const weeks: Array<{
    number: number;
    startDate: Date;
    endDate: Date;
    predictions: any[];
  }> = [];
  for (let i = 0; i < 21; i += 7) {
    const weekPredictions = predictions.slice(i, i + 7);
    if (weekPredictions.length > 0) {
      const startDate = new Date(weekPredictions[0].date);
      const endDate = new Date(weekPredictions[weekPredictions.length - 1].date);
      weeks.push({
        number: Math.floor(i / 7) + 1,
        startDate,
        endDate,
        predictions: weekPredictions
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <style>{`
        .progress-bar {
          background: rgba(30, 41, 59, 0.8);
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
          padding: 1rem 0;
        }
        .progress-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .progress-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .progress-step.completed {
          color: #10b981;
        }
        .progress-step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .progress-step.completed .progress-step-number {
          background: #10b981;
          color: white;
        }
        .main-container {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-width: 1200px;
          margin: 2rem auto;
        }
        .location-info {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .week-section {
          margin-bottom: 2rem;
        }
        .week-header {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #93c5fd;
        }
        .prediction-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .prediction-card {
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(148, 163, 184, 0.3);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .prediction-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .day-number {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }
        .day-date {
          font-size: 0.75rem;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
        }
        .magnitude {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }
        .confidence {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .risk-level {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.3);
        }
        .legend {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .legend-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
        }
        .legend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-secondary {
          background: rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }
        .btn-secondary:hover {
          background: rgba(148, 163, 184, 0.3);
        }
      `}</style>

      <div className="progress-bar">
        <div className="progress-steps">
          <div className="progress-step completed">
            <div className="progress-step-number">✓</div>
            <span>Location Input and Confirmation</span>
          </div>
          <div className="progress-step completed">
            <div className="progress-step-number">✓</div>
            <span>Data Sources</span>
          </div>
          <div className="progress-step completed">
            <div className="progress-step-number">✓</div>
            <span>Engine Selection</span>
          </div>
          <div className="progress-step completed">
            <div className="progress-step-number">✓</div>
            <span>Engine Activation</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="main-container">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              21-Day Earthquake Predictions
            </h1>
            <p className="text-slate-300">
              Advanced seismic prediction analysis with magnitude estimates and confidence levels
            </p>
          </div>

          {location && (
            <div className="location-info">
              <div>
                <h3 className="font-semibold text-white mb-1">Analysis Location</h3>
                <p className="text-slate-300">{location.location_name}</p>
                <p className="text-sm text-slate-400">
                  {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}° 
                  (Radius: {location.radius_km} km)
                </p>
              </div>
              <button className="btn btn-secondary" onClick={onChangeLocation}>
                Change Location
              </button>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value text-red-400">{maxProbability.toFixed(1)}%</div>
              <div className="stat-label">Max Probability</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-yellow-400">{avgProbability.toFixed(1)}%</div>
              <div className="stat-label">Average Probability</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-orange-400">{highRiskDays}</div>
              <div className="stat-label">High Risk Days</div>
            </div>
          </div>

          {weeks.map((week) => (
            <div key={week.number} className="week-section">
              <div className="week-header">
                Week {week.number} - {week.startDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })} - {week.endDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="prediction-grid">
                {week.predictions.map((prediction) => (
                  <div
                    key={prediction.day}
                    className="prediction-card"
                    style={{
                      borderColor: prediction.risk_level.toLowerCase() === 'high' ? '#ef4444' :
                                 prediction.risk_level.toLowerCase() === 'elevated' ? '#f97316' :
                                 prediction.risk_level.toLowerCase() === 'moderate' ? '#eab308' : '#3b82f6'
                    }}
                  >
                    <div className="day-number">Day {prediction.day}</div>
                    <div className="day-date">
                      {new Date(prediction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="magnitude">
                      MAG {prediction.magnitude_estimate.toFixed(1)}
                    </div>
                    <div className={`confidence ${getConfidenceColor(prediction.confidence_level)}`}>
                      NN {prediction.probability_percent.toFixed(0)}%
                    </div>
                    <div className={`risk-level ${getRiskColorText(prediction.risk_level)}`}>
                      {prediction.risk_level.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="legend">
            <h3 className="legend-title">Risk Level Legend</h3>
            <div className="legend-grid">
              <div className="legend-item">
                <div className="legend-color bg-blue-500"></div>
                <span>Low Risk (0-25%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-yellow-500"></div>
                <span>Moderate Risk (26-50%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-orange-500"></div>
                <span>Elevated Risk (51-75%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bg-red-500"></div>
                <span>High Risk (76-100%)</span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={onNext}>
              <Eye size={16} />
              View Cymatic Visualization
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-200 font-medium">Important Notice</span>
            </div>
            <p className="text-blue-100 text-sm">
              These predictions are based on real-time electromagnetic and geological data analysis using the BRETT v39 calculator system. 
              They should be used as supplementary information alongside official seismic monitoring services. 
              Always follow local emergency guidelines and official earthquake warnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplayPage;

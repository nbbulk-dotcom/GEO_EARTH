// BRETT PredictionDisplay v3.0.0 - Universal Prediction Display Component
import React from 'react';
import { TrendingUp, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const PredictionDisplay: React.FC = () => {
  const { predictions, location } = useData();

  if (predictions.length === 0) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No predictions available. Please run an engine calculation first.</p>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return 'text-red-400 bg-red-900/30 border-red-500/50';
      case 'elevated':
        return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
      default:
        return 'text-green-400 bg-green-900/30 border-green-500/50';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
        <TrendingUp className="w-6 h-6 mr-3 text-yellow-400" />
        21-Day {window.location.search.includes('volcanic') ? 'Volcanic Eruption' : 'Earthquake'} Predictions
      </h2>

      {location && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Analysis Location</h3>
          <p className="text-gray-300">{location.location_name}</p>
          <p className="text-sm text-gray-400">
            {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}° 
            (Radius: {location.radius_km} km)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Max Probability</span>
            <span className="text-xl font-bold text-red-400">{maxProbability.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Average Probability</span>
            <span className="text-xl font-bold text-yellow-400">{avgProbability.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">High Risk Days</span>
            <span className="text-xl font-bold text-orange-400">{highRiskDays}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {predictions.slice(0, 21).map((prediction) => (
              <div
                key={prediction.day}
                className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${getRiskColor(prediction.risk_level)}`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Day {prediction.day}</span>
                  </div>
                  
                  <div className="text-xs text-gray-300 mb-2">
                    {new Date(prediction.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-lg font-bold">
                      {prediction.probability_percent.toFixed(1)}%
                    </div>
                    
                    <div className="text-xs">
                      M{prediction.magnitude_estimate.toFixed(1)}
                    </div>
                    
                    <div className={`text-xs font-medium ${getConfidenceColor(prediction.confidence_level)}`}>
                      {prediction.confidence_level.toUpperCase()}
                    </div>
                    
                    <div className="text-xs font-semibold">
                      {prediction.risk_level}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Risk Distribution
          </h4>
          <div className="space-y-2">
            {['HIGH', 'ELEVATED', 'MODERATE', 'LOW'].map(level => {
              const count = predictions.filter(p => p.risk_level.toUpperCase() === level).length;
              const percentage = (count / predictions.length) * 100;
              
              return (
                <div key={level} className="flex items-center justify-between">
                  <span className={`text-sm ${getRiskColor(level).split(' ')[0]}`}>
                    {level}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getRiskColor(level).split(' ')[1]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Key Insights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Risk Day:</span>
              <span className="text-white">
                Day {predictions.find(p => p.probability_percent === maxProbability)?.day || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Risk Date:</span>
              <span className="text-white">
                {predictions.find(p => p.probability_percent === maxProbability)?.date || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Trend:</span>
              <span className="text-white">
                {predictions[0]?.probability_percent < predictions[predictions.length - 1]?.probability_percent 
                  ? 'Increasing' : 'Decreasing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertTriangle className="w-5 h-5 text-blue-400 mr-2" />
          <span className="text-blue-200 font-medium">Important Notice</span>
        </div>
        <p className="text-blue-100 text-sm">
          These predictions are based on real-time {window.location.search.includes('volcanic') ? 'chamber dynamics, thermal electromagnetic coupling, and atmospheric monitoring' : 'electromagnetic and geological'} data analysis. 
          They should be used as supplementary information alongside official {window.location.search.includes('volcanic') ? 'volcanic monitoring services' : 'seismic monitoring services'}. 
          Always follow local emergency guidelines and official {window.location.search.includes('volcanic') ? 'volcanic hazard' : 'earthquake'} warnings.
        </p>
      </div>
    </div>
  );
};

export default PredictionDisplay;

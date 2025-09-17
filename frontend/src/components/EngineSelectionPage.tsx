import React, { useState } from 'react';
import { Zap, Rocket, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useData } from '../contexts/DataContext';

interface EngineSelectionPageProps {
  onNext: () => void;
}

const EngineSelectionPage: React.FC<EngineSelectionPageProps> = ({ onNext }) => {
  const { location, setPredictions } = useData();
  const [selectedEngine, setSelectedEngine] = useState<'brettearth' | 'brettcombo' | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleEngineActivation = async (engine: 'brettearth' | 'brettcombo') => {
    if (!location) return;

    setSelectedEngine(engine);
    setIsCalculating(true);
    setError('');

    try {
      const endpoint = engine === 'brettearth' ? 'brettearth' : 'brettcombo';
      
      const locationName = location.location_name || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      
      const response = await axios.post(`${API_BASE_URL}/api/prediction/${endpoint}`, {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius_km: location.radius_km,
          location_name: locationName
        },
        engine_type: engine.toUpperCase(),
        live_mode: true
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (engine === 'brettcombo') {
        setPredictions(response.data.combined_predictions);
      } else {
        setPredictions(response.data.predictions);
      }
      
      onNext();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || `${engine.toUpperCase()} calculation failed`;
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setIsCalculating(false);
    }
  };

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
        .progress-step.active {
          color: #3b82f6;
          font-weight: 600;
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
        .progress-step.active .progress-step-number {
          background: #3b82f6;
          color: white;
        }
        .progress-step.completed .progress-step-number {
          background: #10b981;
          color: white;
        }
        .progress-step:not(.active):not(.completed) .progress-step-number {
          background: rgba(148, 163, 184, 0.3);
          color: #94a3b8;
        }
        .main-container {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-width: 900px;
          margin: 4rem auto;
        }
        .engine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
        .engine-card {
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(148, 163, 184, 0.3);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .engine-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .engine-card.earth {
          border-color: rgba(34, 197, 94, 0.5);
        }
        .engine-card.earth:hover {
          border-color: rgba(34, 197, 94, 0.8);
          box-shadow: 0 20px 40px rgba(34, 197, 94, 0.2);
        }
        .engine-card.combo {
          border-color: rgba(168, 85, 247, 0.5);
        }
        .engine-card.combo:hover {
          border-color: rgba(168, 85, 247, 0.8);
          box-shadow: 0 20px 40px rgba(168, 85, 247, 0.2);
        }
        .engine-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .engine-icon {
          margin-right: 1rem;
        }
        .engine-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }
        .engine-description {
          color: #94a3b8;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .engine-features {
          list-style: none;
          padding: 0;
          margin-bottom: 2rem;
        }
        .engine-features li {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: #e2e8f0;
          font-size: 0.875rem;
        }
        .feature-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.75rem;
        }
        .earth .feature-dot {
          background: #22c55e;
        }
        .combo .feature-dot {
          background: #a855f7;
        }
        .activate-btn {
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .activate-btn.earth {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }
        .activate-btn.earth:hover:not(:disabled) {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: translateY(-2px);
        }
        .activate-btn.combo {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
        }
        .activate-btn.combo:hover:not(:disabled) {
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          transform: translateY(-2px);
        }
        .activate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .comparison-section {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .comparison-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        .comparison-item {
          font-size: 0.875rem;
        }
        .comparison-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .comparison-label.earth {
          color: #22c55e;
        }
        .comparison-label.combo {
          color: #a855f7;
        }
        .comparison-text {
          color: #94a3b8;
          line-height: 1.5;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .error-message .icon {
          color: #ef4444;
        }
        .error-message .text {
          color: #fecaca;
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
          <div className="progress-step active">
            <div className="progress-step-number">3</div>
            <span>Engine Selection</span>
          </div>
          <div className="progress-step">
            <div className="progress-step-number">4</div>
            <span>Engine Activation</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="main-container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Engine Selection and Activation
            </h1>
            <p className="text-slate-300">
              Choose between BRETTEARTH or BRETTCOMBO engines for earthquake prediction analysis.
            </p>
          </div>

          <div className="engine-grid">
            <div className="engine-card earth">
              <div className="engine-header">
                <Zap className="engine-icon w-8 h-8 text-green-400" />
                <h2 className="engine-title">BRETTEARTH</h2>
              </div>
              <p className="engine-description">
                Terrestrial earthquake prediction using 24 earth resonance layers and electromagnetic field analysis with advanced geological data integration.
              </p>
              <ul className="engine-features">
                <li>
                  <div className="feature-dot"></div>
                  24 Earth Resonance Layers
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Magnetometer Analysis
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Schumann Resonance Monitoring
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Lightning Activity Analysis
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Geological Data Integration
                </li>
              </ul>
              <button
                className="activate-btn earth"
                onClick={() => handleEngineActivation('brettearth')}
                disabled={isCalculating && selectedEngine === 'brettearth'}
              >
                {isCalculating && selectedEngine === 'brettearth' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Activate BRETTEARTH
                  </>
                )}
              </button>
            </div>

            <div className="engine-card combo">
              <div className="engine-header">
                <Rocket className="engine-icon w-8 h-8 text-purple-400" />
                <h2 className="engine-title">BRETTCOMBO</h2>
              </div>
              <p className="engine-description">
                Combined BRETTEARTH + BRETTSPACE engines with 12 space correlation variables, harmonic amplification, and advanced quantum validation.
              </p>
              <ul className="engine-features">
                <li>
                  <div className="feature-dot"></div>
                  All BRETTEARTH Features
                </li>
                <li>
                  <div className="feature-dot"></div>
                  12 Space Correlation Variables
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Space Weather Analysis
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Solar Activity Monitoring
                </li>
                <li>
                  <div className="feature-dot"></div>
                  Harmonic Amplification (26.565°/54.74°)
                </li>
              </ul>
              <button
                className="activate-btn combo"
                onClick={() => handleEngineActivation('brettcombo')}
                disabled={isCalculating && selectedEngine === 'brettcombo'}
              >
                {isCalculating && selectedEngine === 'brettcombo' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    Activate BRETTCOMBO
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertTriangle className="icon w-5 h-5" />
              <div>
                <div className="text font-semibold">Calculation Error</div>
                <div className="text text-sm mt-1">{error}</div>
              </div>
            </div>
          )}

          <div className="comparison-section">
            <h3 className="comparison-title">Engine Comparison</h3>
            <div className="comparison-grid">
              <div className="comparison-item">
                <div className="comparison-label earth">BRETTEARTH:</div>
                <div className="comparison-text">
                  Focuses on terrestrial electromagnetic and geological data for earthquake prediction using 24 earth resonance layers.
                </div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label combo">BRETTCOMBO:</div>
                <div className="comparison-text">
                  Combines terrestrial and space weather data with 12 space variables for enhanced prediction accuracy and harmonic amplification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineSelectionPage;

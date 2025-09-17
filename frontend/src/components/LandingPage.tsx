import React, { useEffect } from 'react';

interface LandingPageProps {
  onEnterSystem: () => void;
  onBackToUnified?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {
  useEffect(() => {
    document.title = 'BRETTEARTHQUAKE';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <style>{`
        .landing-container {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 24px;
          padding: 4rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          max-width: 1000px;
          margin: 2rem auto;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin: 3rem 0;
        }
        .feature-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }
        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
        }
        .feature-description {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        .enter-system-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 1.25rem 3rem;
          border-radius: 16px;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          margin: 3rem 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .enter-system-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.5);
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }
        .system-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          font-size: 0.875rem;
          color: #94a3b8;
          flex-wrap: wrap;
        }
        .system-info span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
      
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="landing-container text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            BRETT EARTHQUAKE SYSTEM
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-slate-200">
            Geological &amp; Electromagnetic Earthquake Prediction System
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Real-time dual-engine earthquake probability computation platform integrating Earth-based geophysical data and space weather analysis for advanced seismic prediction.
          </p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">🌍</span>
              <h3 className="feature-title">BRETTEARTH Engine</h3>
              <p className="feature-description">
                Advanced terrestrial electromagnetic field analysis with 24-variable earth resonance monitoring
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3 className="feature-title">Real-time Analytics</h3>
              <p className="feature-description">
                Live data integration from USGS, EMSC, NASA, and NOAA for comprehensive seismic analysis
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🔬</span>
              <h3 className="feature-title">Quantum Validation</h3>
              <p className="feature-description">
                12-dimensional space correlation engine with harmonic amplification calculations
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🌊</span>
              <h3 className="feature-title">Cymatic Visualization</h3>
              <p className="feature-description">
                3D resonance pattern visualization with 21-day prediction window and phase lock analysis
              </p>
            </div>
          </div>
          
          <button className="enter-system-btn" onClick={onEnterSystem}>
            Enter System
          </button>
          
          <div className="system-info">
            <span>🌍 BRETTEARTH Engine</span>
            <span>🚀 BRETTSPACE Engine</span>
            <span>⚡ Real-time Data</span>
            <span>📡 Multi-Source Integration</span>
            <span>⚡ 21-Day Predictions</span>
          </div>
          
          <div className="mt-8 text-sm text-slate-400">
            <p>Advanced electromagnetic field analysis • Cymatic visualization • Blockchain authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

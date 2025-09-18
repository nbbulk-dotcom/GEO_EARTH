import React, { useEffect } from 'react';

interface LandingPageProps {
  onEnterSystem: () => void;
  onBackToUnified?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {
  useEffect(() => {
    document.title = 'BRETT System Interface';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <style>{`
        .header {
          background: rgba(30, 41, 59, 0.8);
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
          padding: 1rem 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fbbf24;
        }
        .user-info {
          font-size: 0.875rem;
          color: #94a3b8;
        }
        .main-content {
          padding-top: 5rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          padding: 4rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-width: 1000px;
          margin: 2rem auto;
          text-align: center;
        }
        .title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle {
          font-size: 1.125rem;
          color: #94a3b8;
          margin-bottom: 3rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }
        .feature-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(251, 191, 36, 0.5);
        }
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
        }
        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
        }
        .feature-description {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        .enter-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1e293b;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
          margin: 2rem 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .enter-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(251, 191, 36, 0.5);
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        .version-info {
          margin-top: 2rem;
          font-size: 0.875rem;
          color: #64748b;
        }
      `}</style>

      <div className="header">
        <div className="header-content">
          <div className="logo">BRETT System Interface</div>
          <div className="user-info">
            <div>User: Guest</div>
            <div>Session Active</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <h1 className="title">BRETT EARTHQUAKE SYSTEM</h1>
          <p className="subtitle">12-Dimensional GAL-CRM Framework v4.0</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <h3 className="feature-title">21-Day Predictions</h3>
              <p className="feature-description">
                Advanced seismic forecasting with daily magnitude and confidence analysis
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📡</span>
              <h3 className="feature-title">Real-time Monitoring</h3>
              <p className="feature-description">
                Live electromagnetic field analysis and geological data integration
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🔬</span>
              <h3 className="feature-title">Multi-Source Analysis</h3>
              <p className="feature-description">
                USGS, EMSC, NASA, and NOAA data fusion for comprehensive predictions
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🌊</span>
              <h3 className="feature-title">Cymatic Visualization</h3>
              <p className="feature-description">
                3D wave field rendering with harmonic resonance pattern analysis
              </p>
            </div>
          </div>
          
          <button className="enter-btn" onClick={onEnterSystem}>
            Enter System
          </button>
          
          <div className="version-info">
            Version 4.0.0 | Build 2025.09.17
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

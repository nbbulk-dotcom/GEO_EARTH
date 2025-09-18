import React from 'react';

interface LandingPageProps {
  onEnterSystem: () => void;
  onBackToUnified?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #000000 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Main Title */}
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #fbbf24, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          letterSpacing: '2px'
        }}>BRETT EARTHQUAKE</h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#cbd5e1',
          marginBottom: '1rem'
        }}>Breakthrough Research in Earth Threat Technology</p>
        
        <p style={{
          fontSize: '1.125rem',
          color: '#94a3b8',
          maxWidth: '48rem',
          margin: '0 auto 4rem auto',
          lineHeight: '1.6'
        }}>
          Advanced seismic prediction system utilizing 12-dimensional GAL-CRM framework 
          for comprehensive earthquake monitoring and threat assessment.
        </p>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.3)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>📅</div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>21-Day Predictions</h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>Advanced forecasting with daily earthquake probability assessments</p>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.3)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>📊</div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>Real-time Monitoring</h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>Continuous seismic data integration from global sensor networks</p>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.3)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>🔬</div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>Multi-source Analysis</h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>Comprehensive data fusion from terrestrial and space-based sources</p>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.3)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>🌊</div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>Cymatic Visualization</h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>3D wave field rendering and interactive seismic pattern analysis</p>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          background: 'rgba(30, 58, 138, 0.3)',
          border: '2px solid #3b82f6',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#fbbf24' }}>System Access</h2>
          <p style={{ marginBottom: '2rem', color: '#cbd5e1' }}>
            Enter the BRETT Earthquake prediction system to begin seismic analysis and monitoring
          </p>
          <button 
            onClick={onEnterSystem}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1rem 2rem',
              background: 'linear-gradient(to right, #fbbf24, #f97316)',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(251, 191, 36, 0.3)',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            🌍 ENTER SYSTEM →
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.875rem'
        }}>
          <p>BRETT Earthquake System v4.0 | 12-Dimensional GAL-CRM Framework</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

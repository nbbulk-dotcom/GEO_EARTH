import React from 'react';

interface EngineSelectionPageProps {
  onNext: () => void;
}

const EngineSelectionPage: React.FC<EngineSelectionPageProps> = ({ onNext }) => {
  const handleEngineActivation = () => {
    onNext();
  };

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
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            color: '#fbbf24',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>← Back to Location</div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #fbbf24, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>BRETT System Interface</h1>
            <p style={{
              color: '#cbd5e1',
              margin: 0
            }}>12-Dimensional GAL-CRM Framework v4.0</p>
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '0.875rem',
            color: '#94a3b8'
          }}>
            <p>User: Guest</p>
            <p>Session Active</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#10b981'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>✓</div>
              <span>Location Input</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#fbbf24',
              fontWeight: '600'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#fbbf24',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>3</div>
              <span>Engine Selection</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94a3b8'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(148, 163, 184, 0.3)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>4</div>
              <span>Prediction Display</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0.75rem',
          padding: '2rem',
          border: '1px solid #475569',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#cbd5e1'
          }}>
            ⚙️ Engine Selection
          </h2>

          {/* Engine Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* BRETTEARTH Engine */}
            <div style={{
              position: 'relative',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '2px solid #475569',
              background: 'rgba(30, 41, 59, 0.5)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  background: 'linear-gradient(to right, #22c55e, #10b981)'
                }}>🌍</div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>BRETTEARTH</h3>
                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.875rem'
                  }}>Earth-based seismic analysis using terrestrial data sources</p>
                </div>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 1rem 0'
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Terrestrial seismic monitoring
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Local geological analysis
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Regional fault mapping
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Ground-based sensors
                </li>
              </ul>

              <button 
                onClick={() => handleEngineActivation()}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #22c55e, #10b981)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ⚡ Activate BRETTEARTH
              </button>
            </div>

            {/* BRETTCOMBO Engine */}
            <div style={{
              position: 'relative',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '2px solid #475569',
              background: 'rgba(30, 41, 59, 0.5)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  background: 'linear-gradient(to right, #8b5cf6, #6366f1)'
                }}>🚀</div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>BRETTCOMBO</h3>
                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.875rem'
                  }}>Combined Earth and Space analysis for comprehensive prediction</p>
                </div>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 1rem 0'
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Satellite data integration
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Ionospheric monitoring
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Solar activity correlation
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>
                  Multi-dimensional analysis
                </li>
              </ul>

              <button 
                onClick={() => handleEngineActivation()}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ⚡ Activate BRETTCOMBO
              </button>
            </div>
          </div>

          {/* Engine Comparison */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1rem'
            }}>Engine Comparison</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#22c55e'
                }}>BRETTEARTH:</div>
                <div style={{
                  color: '#94a3b8',
                  lineHeight: '1.5',
                  fontSize: '0.875rem'
                }}>
                  Focuses on terrestrial electromagnetic and geological data for earthquake prediction using 24 earth resonance layers.
                </div>
              </div>
              <div>
                <div style={{
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#8b5cf6'
                }}>BRETTCOMBO:</div>
                <div style={{
                  color: '#94a3b8',
                  lineHeight: '1.5',
                  fontSize: '0.875rem'
                }}>
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

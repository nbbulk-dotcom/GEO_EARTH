import React from 'react';

interface PredictionDisplayPageProps {
  onNext: () => void;
  onChangeLocation: () => void;
}

const PredictionDisplayPage: React.FC<PredictionDisplayPageProps> = ({ onNext, onChangeLocation }) => {
  const predictions = [
    { day: 1, mag: 2.3, conf: 78, risk: 'low' },
    { day: 2, mag: 2.8, conf: 82, risk: 'low' },
    { day: 3, mag: 4.2, conf: 65, risk: 'medium' },
    { day: 4, mag: 3.1, conf: 71, risk: 'low' },
    { day: 5, mag: 2.9, conf: 85, risk: 'low' },
    { day: 6, mag: 4.7, conf: 58, risk: 'medium' },
    { day: 7, mag: 3.4, conf: 76, risk: 'low' },
    { day: 8, mag: 2.1, conf: 89, risk: 'low' },
    { day: 9, mag: 3.8, conf: 73, risk: 'low' },
    { day: 10, mag: 5.2, conf: 45, risk: 'medium' },
    { day: 11, mag: 2.7, conf: 91, risk: 'low' },
    { day: 12, mag: 3.3, conf: 68, risk: 'low' },
    { day: 13, mag: 4.1, conf: 62, risk: 'medium' },
    { day: 14, mag: 2.5, conf: 87, risk: 'low' },
    { day: 15, mag: 6.1, conf: 38, risk: 'high' },
    { day: 16, mag: 3.9, conf: 74, risk: 'low' },
    { day: 17, mag: 2.2, conf: 93, risk: 'low' },
    { day: 18, mag: 4.5, conf: 56, risk: 'medium' },
    { day: 19, mag: 3.7, conf: 79, risk: 'low' },
    { day: 20, mag: 2.8, conf: 84, risk: 'low' },
    { day: 21, mag: 3.2, conf: 77, risk: 'low' }
  ];

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
          }}>← Back to Engine</div>
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
            📊 21-Day Earthquake Predictions
          </h2>

          {/* Location Info */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid #3b82f6',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>Location:</strong> 40.7128°N, -74.0060°W
            </div>
            <div>
              <strong>Radius:</strong> 200 km
            </div>
            <div>
              <strong>Engine:</strong> BRETTEARTH
            </div>
          </div>

          {/* Risk Legend */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '0.25rem',
                background: 'linear-gradient(to right, #3b82f6, #0ea5e9)'
              }}></div>
              <span>Low Risk (MAG 2.0-4.0)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '0.25rem',
                background: 'linear-gradient(to right, #f59e0b, #fbbf24)'
              }}></div>
              <span>Medium Risk (MAG 4.0-6.0)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '0.25rem',
                background: 'linear-gradient(to right, #ef4444, #dc2626)'
              }}></div>
              <span>High Risk (MAG 6.0+)</span>
            </div>
          </div>

          {/* Week 1 */}
          <div style={{
            gridColumn: 'span 7',
            textAlign: 'center',
            fontWeight: '600',
            color: '#fbbf24',
            padding: '0.5rem',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '0.25rem',
            marginBottom: '0.5rem'
          }}>Week 1 - September 17-23, 2025</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            {predictions.slice(0, 7).map((prediction) => (
              <div key={prediction.day} style={{
                background: prediction.risk === 'low' 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1))'
                  : prediction.risk === 'medium'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: `1px solid ${
                  prediction.risk === 'low' ? '#3b82f6' 
                  : prediction.risk === 'medium' ? '#f59e0b' 
                  : '#ef4444'
                }`,
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  marginBottom: '0.5rem'
                }}>Day {prediction.day}</div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}>MAG {prediction.mag}</div>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}>NN {prediction.conf}%</div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  marginTop: '0.5rem',
                  background: prediction.risk === 'low' 
                    ? 'linear-gradient(to right, #3b82f6, #0ea5e9)'
                    : prediction.risk === 'medium'
                    ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                    : 'linear-gradient(to right, #ef4444, #dc2626)'
                }}></div>
              </div>
            ))}
          </div>

          {/* Week 2 */}
          <div style={{
            gridColumn: 'span 7',
            textAlign: 'center',
            fontWeight: '600',
            color: '#fbbf24',
            padding: '0.5rem',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '0.25rem',
            marginBottom: '0.5rem'
          }}>Week 2 - September 24-30, 2025</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            {predictions.slice(7, 14).map((prediction) => (
              <div key={prediction.day} style={{
                background: prediction.risk === 'low' 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1))'
                  : prediction.risk === 'medium'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: `1px solid ${
                  prediction.risk === 'low' ? '#3b82f6' 
                  : prediction.risk === 'medium' ? '#f59e0b' 
                  : '#ef4444'
                }`,
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  marginBottom: '0.5rem'
                }}>Day {prediction.day}</div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}>MAG {prediction.mag}</div>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}>NN {prediction.conf}%</div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  marginTop: '0.5rem',
                  background: prediction.risk === 'low' 
                    ? 'linear-gradient(to right, #3b82f6, #0ea5e9)'
                    : prediction.risk === 'medium'
                    ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                    : 'linear-gradient(to right, #ef4444, #dc2626)'
                }}></div>
              </div>
            ))}
          </div>

          {/* Week 3 */}
          <div style={{
            gridColumn: 'span 7',
            textAlign: 'center',
            fontWeight: '600',
            color: '#fbbf24',
            padding: '0.5rem',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '0.25rem',
            marginBottom: '0.5rem'
          }}>Week 3 - October 1-7, 2025</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            {predictions.slice(14, 21).map((prediction) => (
              <div key={prediction.day} style={{
                background: prediction.risk === 'low' 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1))'
                  : prediction.risk === 'medium'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: `1px solid ${
                  prediction.risk === 'low' ? '#3b82f6' 
                  : prediction.risk === 'medium' ? '#f59e0b' 
                  : '#ef4444'
                }`,
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  marginBottom: '0.5rem'
                }}>Day {prediction.day}</div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}>MAG {prediction.mag}</div>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}>NN {prediction.conf}%</div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  marginTop: '0.5rem',
                  background: prediction.risk === 'low' 
                    ? 'linear-gradient(to right, #3b82f6, #0ea5e9)'
                    : prediction.risk === 'medium'
                    ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                    : 'linear-gradient(to right, #ef4444, #dc2626)'
                }}></div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={onNext}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🌊 View Cymatic Visualization
            </button>
            <button 
              onClick={onChangeLocation}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(75, 85, 99, 0.8)',
                color: 'white',
                border: '1px solid #6b7280',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📍 Change Location
            </button>
            <button 
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(75, 85, 99, 0.8)',
                color: 'white',
                border: '1px solid #6b7280',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📊 Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplayPage;

import React, { useState } from 'react';

interface CymaticVisualizationPageProps {
  onBack: () => void;
}

const CymaticVisualizationPage: React.FC<CymaticVisualizationPageProps> = ({ onBack }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [waveAmplitude, setWaveAmplitude] = useState(75);
  const [frequencyRange, setFrequencyRange] = useState('0-50');
  const [visualizationMode, setVisualizationMode] = useState('3D Wave Field');
  const [timeWindow, setTimeWindow] = useState('Real-time');

  return (
    <div style={{
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #000000 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes waveAnimation {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.1) rotate(180deg); opacity: 1; }
        }
      `}</style>
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <a href="#" onClick={onBack} style={{
            color: '#fbbf24',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>← Back to Predictions</a>
          <div>
            <h1 style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #fbbf24, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>BRETT System Interface</h1>
            <p style={{
              textAlign: 'center',
              color: '#cbd5e1',
              marginBottom: '2rem'
            }}>12-Dimensional GAL-CRM Framework v4.0</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#94a3b8' }}>
            <p>User: Guest</p>
            <p>Session Active</p>
          </div>
        </div>

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
            🌊 Cymatic Wave Field Visualization
          </h2>

          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #8b5cf6',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            minHeight: '400px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)
              `,
              animation: 'waveAnimation 4s ease-in-out infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginBottom: '0.5rem'
              }}>3D Seismic Wave Field</div>
              <div style={{
                color: '#cbd5e1',
                fontSize: '1rem'
              }}>Real-time cymatic pattern analysis</div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8b5cf6',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#8b5cf6'
              }}>7.83 Hz</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#cbd5e1',
                marginTop: '0.25rem'
              }}>Schumann Resonance</div>
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8b5cf6',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#8b5cf6'
              }}>14.3 Hz</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#cbd5e1',
                marginTop: '0.25rem'
              }}>Second Mode</div>
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8b5cf6',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#8b5cf6'
              }}>20.8 Hz</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#cbd5e1',
                marginTop: '0.25rem'
              }}>Third Mode</div>
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8b5cf6',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#8b5cf6'
              }}>27.3 Hz</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#cbd5e1',
                marginTop: '0.25rem'
              }}>Fourth Mode</div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#cbd5e1'
              }}>Wave Amplitude</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={waveAmplitude}
                onChange={(e) => setWaveAmplitude(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              />
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#cbd5e1'
              }}>Frequency Range</label>
              <select 
                value={frequencyRange}
                onChange={(e) => setFrequencyRange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              >
                <option value="0-50">0-50 Hz (Full Spectrum)</option>
                <option value="7-15">7-15 Hz (Schumann)</option>
                <option value="15-30">15-30 Hz (Higher Modes)</option>
              </select>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#cbd5e1'
              }}>Visualization Mode</label>
              <select 
                value={visualizationMode}
                onChange={(e) => setVisualizationMode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              >
                <option value="3D Wave Field">3D Wave Field</option>
                <option value="Frequency Spectrum">Frequency Spectrum</option>
                <option value="Time Series">Time Series</option>
                <option value="Phase Space">Phase Space</option>
              </select>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#cbd5e1'
              }}>Time Window</label>
              <select 
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              >
                <option value="Real-time">Real-time</option>
                <option value="Last 24 hours">Last 24 hours</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="21-day prediction">21-day prediction</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>21-Day Selection Range</h3>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedDay === day ? '#8b5cf6' : 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid #475569',
                    borderColor: selectedDay === day ? '#8b5cf6' : '#475569',
                    borderRadius: '0.25rem',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (selectedDay !== day) {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedDay !== day) {
                      e.currentTarget.style.borderColor = '#475569';
                    }
                  }}
                >
                  Day {day}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
              color: 'white'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              📊 Export Visualization
            </button>
            <button style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(75, 85, 99, 0.8)',
              color: 'white',
              border: '1px solid #6b7280'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              ⚙️ Advanced Settings
            </button>
            <button style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(75, 85, 99, 0.8)',
              color: 'white',
              border: '1px solid #6b7280'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              📈 View Raw Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CymaticVisualizationPage;

import React, { useState } from 'react';

interface LocationInputPageProps {
  onNext: () => void;
}

const LocationInputPage: React.FC<LocationInputPageProps> = ({ onNext }) => {
  const [locationType, setLocationType] = useState<'coordinates' | 'city'>('coordinates');
  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [radius, setRadius] = useState(200);

  const handleAutoDetect = () => {
    setLocationType('coordinates');
    setLatitude('34.052235');
    setLongitude('-118.243685');
  };

  const handleResetDefault = () => {
    setLocationType('coordinates');
    setLatitude('40.7128');
    setLongitude('-74.0060');
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
          }}>← Back to Landing</div>
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
              <span>Landing Page</span>
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
              }}>2</div>
              <span>Location Input</span>
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
            📍 Location Configuration
          </h2>

          {/* Location Type Toggle */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <button 
              onClick={() => setLocationType('coordinates')}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #475569',
                background: locationType === 'coordinates' ? '#fbbf24' : 'rgba(30, 41, 59, 0.5)',
                color: locationType === 'coordinates' ? 'black' : 'white',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Coordinates
            </button>
            <button 
              onClick={() => setLocationType('city')}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #475569',
                background: locationType === 'city' ? '#fbbf24' : 'rgba(30, 41, 59, 0.5)',
                color: locationType === 'city' ? 'black' : 'white',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              City
            </button>
            <button 
              onClick={handleAutoDetect}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(59, 130, 246, 0.8)',
                color: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Auto-Detect Location
            </button>
          </div>

          {/* Input Fields */}
          {locationType === 'coordinates' ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#cbd5e1'
                }}>Latitude (-90 to 90)</label>
                <input 
                  type="number" 
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., 34.052235" 
                  step="any"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#cbd5e1'
                }}>Longitude (-180 to 180)</label>
                <input 
                  type="number" 
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., -118.243685" 
                  step="any"
                />
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#cbd5e1'
                }}>City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter city name"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#cbd5e1'
                }}>Country</label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter country name"
                />
              </div>
            </div>
          )}

          {/* Monitoring Radius */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#cbd5e1'
            }}>Monitoring Radius</label>
            <select 
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="100">100 km</option>
              <option value="200">200 km</option>
              <option value="500">500 km</option>
              <option value="1000">1000 km</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button 
              onClick={handleResetDefault}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(75, 85, 99, 0.8)',
                color: 'white',
                border: '1px solid #6b7280',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Reset to Default
            </button>
            <button 
              onClick={onNext}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #fbbf24, #f97316)',
                color: 'black',
                fontWeight: '600',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInputPage;

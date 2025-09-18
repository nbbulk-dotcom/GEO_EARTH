import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isEarthquake = urlParams.get('earthquake') === 'true'
    
    if (isEarthquake) {
      showPage('landing')
    }
  }, [])

  const showPage = (pageId: string) => {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active')
    })
    
    const targetPage = document.getElementById(pageId)
    if (targetPage) {
      targetPage.classList.add('active')
    }
  }

  const handleLocationTypeChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const cityInputs = document.getElementById('cityInputs')
    const coordinateInputs = document.getElementById('coordinateInputs')
    
    if (target.value === 'city') {
      if (cityInputs) cityInputs.style.display = 'block'
      if (coordinateInputs) coordinateInputs.style.display = 'none'
    } else {
      if (cityInputs) cityInputs.style.display = 'none'
      if (coordinateInputs) coordinateInputs.style.display = 'block'
    }
  }

  const handleAutoDetect = () => {
    const button = document.querySelector('.btn-secondary') as HTMLButtonElement
    if (button && button.textContent?.includes('Auto-Detect')) {
      button.textContent = 'Detecting...'
      button.disabled = true
      
      setTimeout(() => {
        const coordRadio = document.querySelector('input[value="coordinates"]') as HTMLInputElement
        const latInput = document.querySelector('input[placeholder*="34.052235"]') as HTMLInputElement
        const lonInput = document.querySelector('input[placeholder*="-118.243685"]') as HTMLInputElement
        
        if (coordRadio) {
          coordRadio.checked = true
          coordRadio.dispatchEvent(new Event('change'))
        }
        if (latInput) latInput.value = '34.052235'
        if (lonInput) lonInput.value = '-118.243685'
        
        button.textContent = 'Auto-Detect Location'
        button.disabled = false
      }, 2000)
    }
  }

  useEffect(() => {
    const radioButtons = document.querySelectorAll('input[name="locationType"]')
    radioButtons.forEach(radio => {
      radio.addEventListener('change', handleLocationTypeChange)
    })

    const autoDetectBtn = document.querySelector('.btn-secondary')
    if (autoDetectBtn) {
      autoDetectBtn.addEventListener('click', handleAutoDetect)
    }

    return () => {
      radioButtons.forEach(radio => {
        radio.removeEventListener('change', handleLocationTypeChange)
      })
      if (autoDetectBtn) {
        autoDetectBtn.removeEventListener('click', handleAutoDetect)
      }
    }
  }, [])

  return (
    <div className="App">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #000000 100%);
          min-height: 100vh;
          color: white;
        }

        .page {
          display: none;
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        .page.active {
          display: block;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .card {
          background: rgba(30, 41, 59, 0.3);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(59, 130, 246, 0.5);
          margin-bottom: 1.5rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2rem;
          background: linear-gradient(to right, #fbbf24, #f97316);
          color: black;
          font-weight: bold;
          font-size: 1.125rem;
          border-radius: 0.75rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
        }

        .btn:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(251, 191, 36, 0.4);
        }

        .btn-secondary {
          background: rgba(59, 130, 246, 0.9);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(59, 130, 246, 1);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          width: 25%;
          transition: width 0.3s ease;
        }

        .step-indicator {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .step {
          display: flex;
          align-items: center;
          color: #94a3b8;
        }

        .step.active {
          color: #3b82f6;
          font-weight: 600;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.5rem;
          font-size: 0.75rem;
        }

        .step.active .step-number {
          background: #3b82f6;
          color: white;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #e2e8f0;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .radio-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .radio-group label {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #e2e8f0;
        }

        .radio-group input[type="radio"] {
          margin-right: 0.5rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .feature-card {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.5);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .feature-icon {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-desc {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .title {
          font-size: 4rem;
          font-weight: bold;
          background: linear-gradient(to right, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          text-align: center;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
          text-align: center;
        }

        .description {
          font-size: 1.125rem;
          color: #94a3b8;
          max-width: 48rem;
          margin: 0 auto 3rem auto;
          text-align: center;
        }

        .cta-section {
          text-align: center;
          background: rgba(30, 58, 138, 0.3);
          border: 2px solid #3b82f6;
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .footer {
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        }

        .engine-card {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.5);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .engine-card:hover {
          transform: translateY(-2px);
          border-color: #3b82f6;
        }

        .engine-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .engine-earth .engine-title {
          background: linear-gradient(to right, #22c55e, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .engine-combo .engine-title {
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .engine-features {
          list-style: none;
          margin-bottom: 1.5rem;
        }

        .engine-features li {
          margin-bottom: 0.5rem;
          color: #94a3b8;
        }

        .engine-features li::before {
          content: "✓";
          color: #22c55e;
          font-weight: bold;
          margin-right: 0.5rem;
        }

        .activate-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .engine-earth .activate-btn {
          background: linear-gradient(to right, #22c55e, #10b981);
          color: white;
        }

        .engine-combo .activate-btn {
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          color: white;
        }

        .prediction-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .prediction-card {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
        }

        .risk-low {
          border-color: #3b82f6;
        }

        .risk-medium {
          border-color: #f59e0b;
        }

        .risk-high {
          border-color: #ef4444;
        }

        .wave-field {
          width: 100%;
          height: 400px;
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%);
          border-radius: 1rem;
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .wave-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          animation: wave-pulse 2s infinite;
        }

        @keyframes wave-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .controls-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .control-group {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .control-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .control-input {
          width: 100%;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.25rem;
          color: white;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2.5rem;
          }
          
          .prediction-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .controls-panel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Landing Page */}
      <div id="landing" className="page active">
        <div className="container">
          <div className="header">
            <h1 className="title">BRETT EARTHQUAKE</h1>
            <p className="subtitle">Breakthrough Research in Earth Threat Technology</p>
            <p className="description">
              Advanced seismic prediction system utilizing 12-dimensional GAL-CRM framework 
              for comprehensive earthquake monitoring and threat assessment.
            </p>
          </div>

          <div className="grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">21-Day Predictions</h3>
              <p className="feature-desc">Advanced forecasting with daily earthquake probability assessments</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Real-time Monitoring</h3>
              <p className="feature-desc">Continuous seismic data integration from global sensor networks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3 className="feature-title">Multi-source Analysis</h3>
              <p className="feature-desc">Comprehensive data fusion from terrestrial and space-based sources</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌊</div>
              <h3 className="feature-title">Cymatic Visualization</h3>
              <p className="feature-desc">3D wave field rendering and interactive seismic pattern analysis</p>
            </div>
          </div>

          <div className="cta-section">
            <h2 style={{marginBottom: '1rem', color: '#fbbf24'}}>System Access</h2>
            <p style={{marginBottom: '2rem', color: '#cbd5e1'}}>
              Enter the BRETT Earthquake prediction system to begin seismic analysis and monitoring
            </p>
            <button className="btn" onClick={() => showPage('location')}>
              🌍 ENTER SYSTEM →
            </button>
          </div>

          <div className="footer">
            <p>BRETT Earthquake System v4.0 | 12-Dimensional GAL-CRM Framework</p>
          </div>
        </div>
      </div>

      {/* Location Input Page */}
      <div id="location" className="page">
        <div className="container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '25%'}}></div>
          </div>
          
          <div className="step-indicator">
            <div className="step active">
              <div className="step-number">1</div>
              Location Input
            </div>
            <div className="step">
              <div className="step-number">2</div>
              Engine Selection
            </div>
            <div className="step">
              <div className="step-number">3</div>
              Prediction Display
            </div>
            <div className="step">
              <div className="step-number">4</div>
              Cymatic Visualization
            </div>
          </div>

          <div className="card">
            <h2 style={{color: '#60a5fa', marginBottom: '1.5rem'}}>Location Input and Confirmation</h2>
            
            <div className="radio-group">
              <label>
                <input type="radio" name="locationType" value="coordinates" defaultChecked />
                Coordinates
              </label>
              <label>
                <input type="radio" name="locationType" value="city" />
                City/Country
              </label>
            </div>

            <button className="btn-secondary" style={{marginBottom: '1.5rem'}}>
              📍 Auto-Detect Location
            </button>

            <div id="coordinateInputs">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>
            </div>

            <div id="cityInputs" style={{display: 'none'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., New York"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., United States"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Monitoring Radius</label>
              <select className="form-input">
                <option value="100">100 km</option>
                <option value="200">200 km</option>
                <option value="500">500 km</option>
                <option value="1000">1000 km</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <button className="btn-secondary" onClick={() => showPage('landing')}>
                ← Back
              </button>
              <button className="btn" onClick={() => showPage('engine')}>
                🔍 Confirm Location →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Engine Selection Page */}
      <div id="engine" className="page">
        <div className="container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '50%'}}></div>
          </div>
          
          <div className="step-indicator">
            <div className="step">
              <div className="step-number">✓</div>
              Location Input
            </div>
            <div className="step active">
              <div className="step-number">2</div>
              Engine Selection
            </div>
            <div className="step">
              <div className="step-number">3</div>
              Prediction Display
            </div>
            <div className="step">
              <div className="step-number">4</div>
              Cymatic Visualization
            </div>
          </div>

          <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#60a5fa'}}>
            Select Prediction Engine
          </h2>

          <div className="grid">
            <div className="engine-card engine-earth">
              <h3 className="engine-title">BRETTEARTH</h3>
              <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
                Earth-based geological prediction engine focusing on terrestrial seismic patterns
              </p>
              <ul className="engine-features">
                <li>Geological Data Analysis</li>
                <li>Tectonic Plate Monitoring</li>
                <li>Ground-based Sensors</li>
                <li>Historical Pattern Recognition</li>
                <li>Regional Fault Analysis</li>
              </ul>
              <button className="activate-btn" onClick={() => showPage('prediction')}>
                Activate BRETTEARTH
              </button>
            </div>

            <div className="engine-card engine-combo">
              <h3 className="engine-title">BRETTCOMBO</h3>
              <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
                Combined Earth-Space prediction engine with electromagnetic correlation analysis
              </p>
              <ul className="engine-features">
                <li>Quantum Coherence Analysis</li>
                <li>Space Resonance Correlation</li>
                <li>Earth Resonance Integration</li>
                <li>12-Dimensional Framework</li>
                <li>Enhanced Accuracy</li>
              </ul>
              <button className="activate-btn" onClick={() => showPage('prediction')}>
                Activate BRETTCOMBO
              </button>
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <button className="btn-secondary" onClick={() => showPage('location')}>
              ← Back to Location
            </button>
          </div>
        </div>
      </div>

      {/* Prediction Display Page */}
      <div id="prediction" className="page">
        <div className="container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '75%'}}></div>
          </div>
          
          <div className="step-indicator">
            <div className="step">
              <div className="step-number">✓</div>
              Location Input
            </div>
            <div className="step">
              <div className="step-number">✓</div>
              Engine Selection
            </div>
            <div className="step active">
              <div className="step-number">3</div>
              Prediction Display
            </div>
            <div className="step">
              <div className="step-number">4</div>
              Cymatic Visualization
            </div>
          </div>

          <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#60a5fa'}}>
            21-Day Earthquake Predictions
          </h2>

          <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <div>
                <strong>Location:</strong> 40.7128, -74.0060 | <strong>Radius:</strong> 200km | <strong>Engine:</strong> BRETTEARTH
              </div>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <span style={{color: '#3b82f6'}}>● Low Risk</span>
                <span style={{color: '#f59e0b'}}>● Medium Risk</span>
                <span style={{color: '#ef4444'}}>● High Risk</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem'}}>Week 1</h3>
            <div className="prediction-grid">
              {Array.from({length: 7}, (_, i) => (
                <div key={i} className={`prediction-card risk-${i % 3 === 0 ? 'low' : i % 3 === 1 ? 'medium' : 'high'}`}>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Day {i + 1}</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
                    M{(2.1 + Math.random() * 2).toFixed(1)}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                    {Math.floor(20 + Math.random() * 60)}% confidence
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem'}}>Week 2</h3>
            <div className="prediction-grid">
              {Array.from({length: 7}, (_, i) => (
                <div key={i + 7} className={`prediction-card risk-${(i + 1) % 3 === 0 ? 'low' : (i + 1) % 3 === 1 ? 'medium' : 'high'}`}>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Day {i + 8}</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
                    M{(2.0 + Math.random() * 2.5).toFixed(1)}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                    {Math.floor(15 + Math.random() * 70)}% confidence
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem'}}>Week 3</h3>
            <div className="prediction-grid">
              {Array.from({length: 7}, (_, i) => (
                <div key={i + 14} className={`prediction-card risk-${(i + 2) % 3 === 0 ? 'low' : (i + 2) % 3 === 1 ? 'medium' : 'high'}`}>
                  <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Day {i + 15}</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
                    M{(1.8 + Math.random() * 3).toFixed(1)}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                    {Math.floor(10 + Math.random() * 80)}% confidence
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
            <button className="btn-secondary" onClick={() => showPage('location')}>
              📍 Change Location
            </button>
            <button className="btn" onClick={() => showPage('cymatic')}>
              🌊 View Cymatic Visualization →
            </button>
          </div>
        </div>
      </div>

      {/* Cymatic Visualization Page */}
      <div id="cymatic" className="page">
        <div className="container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '100%'}}></div>
          </div>
          
          <div className="step-indicator">
            <div className="step">
              <div className="step-number">✓</div>
              Location Input
            </div>
            <div className="step">
              <div className="step-number">✓</div>
              Engine Selection
            </div>
            <div className="step">
              <div className="step-number">✓</div>
              Prediction Display
            </div>
            <div className="step active">
              <div className="step-number">4</div>
              Cymatic Visualization
            </div>
          </div>

          <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#60a5fa'}}>
            Cymatic Wave Field Visualization
          </h2>

          <div className="card">
            <div className="wave-field">
              <div className="wave-animation"></div>
              <div className="wave-animation" style={{animationDelay: '0.5s', width: '150px', height: '150px'}}></div>
              <div className="wave-animation" style={{animationDelay: '1s', width: '100px', height: '100px'}}></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem'}}>Frequency Analysis</h3>
            <div className="grid">
              <div style={{background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem'}}>
                <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Primary Frequency</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6'}}>7.83 Hz</div>
                <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>Schumann Resonance</div>
              </div>
              <div style={{background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem'}}>
                <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Secondary Frequency</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981'}}>14.3 Hz</div>
                <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>Harmonic Resonance</div>
              </div>
              <div style={{background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '0.5rem'}}>
                <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>Tertiary Frequency</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b'}}>20.8 Hz</div>
                <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>Cavity Resonance</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem'}}>Wave Controls</h3>
            <div className="controls-panel">
              <div className="control-group">
                <label className="control-label">Wave Amplitude</label>
                <input type="range" className="control-input" min="0" max="100" defaultValue="75" />
              </div>
              <div className="control-group">
                <label className="control-label">Frequency Range</label>
                <select className="control-input">
                  <option>1-30 Hz (Full Spectrum)</option>
                  <option>1-10 Hz (Low Frequency)</option>
                  <option>10-20 Hz (Mid Frequency)</option>
                  <option>20-30 Hz (High Frequency)</option>
                </select>
              </div>
              <div className="control-group">
                <label className="control-label">Visualization Mode</label>
                <select className="control-input">
                  <option>Wave Field</option>
                  <option>Frequency Spectrum</option>
                  <option>3D Resonance</option>
                  <option>Harmonic Analysis</option>
                </select>
              </div>
              <div className="control-group">
                <label className="control-label">Time Window</label>
                <select className="control-input">
                  <option>Real-time</option>
                  <option>Last Hour</option>
                  <option>Last 24 Hours</option>
                  <option>Last Week</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem'}}>21-Day Selector</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem'}}>
              {Array.from({length: 21}, (_, i) => (
                <button 
                  key={i}
                  style={{
                    padding: '0.5rem',
                    background: i === 0 ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
            <button className="btn-secondary" onClick={() => showPage('prediction')}>
              ← Back to Predictions
            </button>
            <button className="btn-secondary">
              📊 Export Visualization
            </button>
            <button className="btn-secondary">
              ⚙️ Advanced Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

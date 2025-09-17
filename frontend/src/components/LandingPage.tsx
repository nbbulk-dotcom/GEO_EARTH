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
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950">
      <style>{`
        .main-container {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-width: 900px;
          margin: 2rem auto;
        }
        .enter-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
          margin: 2rem 0;
        }
        .enter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }
        .features {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 1.5rem 0;
          font-size: 0.875rem;
          color: #94a3b8;
          text-align: center;
        }
        .pdf-section {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(148, 163, 184, 0.3);
        }
        .pdf-section h3 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          color: #e2e8f0;
          text-align: center;
        }
        #pdf-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          overflow: hidden;
        }
        #pdf-table th, #pdf-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }
        #pdf-table th {
          background: rgba(59, 130, 246, 0.4);
          color: #f1f5f9;
          font-weight: 600;
        }
        #pdf-table tr:nth-child(even) {
          background: rgba(255,255,255,0.05);
        }
        #pdf-table tr:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        #pdf-table td a {
          color: #93c5fd;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }
        #pdf-table td a:hover {
          color: #dbeafe;
          text-decoration: underline;
        }
      `}</style>
      
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="main-container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            BRETT EARTHQUAKE SYSTEM
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-slate-200">
            Geological &amp; Electromagnetic Earthquake Prediction System
          </h2>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            Real-time dual-engine earthquake probability computation platform integrating Earth-based geophysical data and space weather analysis for advanced seismic prediction.
          </p>
          
          <div className="features">
            <span>🌍 BRETTEARTH Engine &nbsp; 🚀 BRETTSPACE Engine &nbsp; ⚡ Real-time Data</span>
            <span>📡 USGS • EMSC • GFZ &nbsp; 🛰️ NASA • NOAA &nbsp; ⚡ 21-Day Predictions</span>
          </div>
          
          <button className="enter-btn" onClick={onEnterSystem}>
            Enter System
          </button>
          
          <div className="mt-6 text-sm text-slate-400">
            <p>Advanced electromagnetic field analysis • Cymatic visualization • Blockchain authentication</p>
          </div>

          <div className="pdf-section">
            <h3>Download PDF Files</h3>
            <table id="pdf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><a href="https://app.devin.ai/attachments/c0f5fe27-a0c5-4b6d-acbf-b76400a1c6b0/BRETT_EARTH_SANITIZED_VALIDATION_REPORT_1755347333.pdf" download="BRETT_Earth_Validation_v3.0.0.pdf">Earth System Validation</a></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><a href="https://app.devin.ai/attachments/fed018e4-64fd-471c-bf36-f425953362ae/brett_sanitized_validation_dataset_1755347405.json" download="BRETT_Validation_Dataset_v3.0.0.json">Independent Test Dataset</a></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td><a href="#" download="BRETT_Technical_Specifications_v3.0.0.pdf">Technical Specifications</a></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td><a href="#" download="BRETT_User_Manual_v3.0.0.pdf">User Manual</a></td>
                </tr>
                <tr>
                  <td>5</td>
                  <td><a href="#" download="BRETT_API_Documentation_v3.0.0.pdf">API Documentation</a></td>
                </tr>
                <tr>
                  <td>6</td>
                  <td><a href="#" download="BRETT_Installation_Guide_v3.0.0.pdf">Installation Guide</a></td>
                </tr>
                <tr>
                  <td>7</td>
                  <td><a href="#" download="BRETT_Troubleshooting_Guide_v3.0.0.pdf">Troubleshooting Guide</a></td>
                </tr>
                <tr>
                  <td>8</td>
                  <td><a href="#" download="BRETT_Performance_Metrics_v3.0.0.pdf">Performance Metrics</a></td>
                </tr>
                <tr>
                  <td>9</td>
                  <td><a href="#" download="BRETT_Compliance_Report_v3.0.0.pdf">Compliance Report</a></td>
                </tr>
                <tr>
                  <td>10</td>
                  <td><a href="#" download="BRETT_Security_Analysis_v3.0.0.pdf">Security Analysis</a></td>
                </tr>
                <tr>
                  <td>11</td>
                  <td><a href="#" download="BRETT_Deployment_Guide_v3.0.0.pdf">Deployment Guide</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

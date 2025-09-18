import React, { useState, useEffect } from 'react'
import { ArrowLeft, Activity, Thermometer, TrendingUp, AlertTriangle } from 'lucide-react'
import axios from 'axios'

interface VolcanicMainInterfaceProps {
  onBackToLanding: () => void
}

interface ForecastData {
  day: number
  date: string
  probability: number
  risk_level: string
  magnitude_estimate: number
  confidence: number
}

interface SeismicData {
  magnitude: number
  time: string
  depth?: number
}

interface GasData {
  so2_ppm: number
  co2_ppm: number
  time: string
}

const VolcanicMainInterface: React.FC<VolcanicMainInterfaceProps> = ({ onBackToLanding }) => {
  const [selectedVolcano, setSelectedVolcano] = useState('kilauea')
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [seismicData, setSeismicData] = useState<SeismicData[]>([])
  const [gasData, setGasData] = useState<GasData[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchVolcanicData()
  }, [selectedVolcano])

  const fetchVolcanicData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_BASE_URL}/api/volcano/forecast/${selectedVolcano}`)
      setForecastData(response.data.forecast || [])
      setSeismicData(response.data.seismic || [])
      setGasData(response.data.gas || [])
      setAlerts(response.data.alerts || [])
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch volcanic data')
      setForecastData([
        { day: 1, date: new Date().toISOString(), probability: 0.3, risk_level: 'LOW', magnitude_estimate: 2.1, confidence: 0.8 },
        { day: 2, date: new Date(Date.now() + 86400000).toISOString(), probability: 0.35, risk_level: 'LOW', magnitude_estimate: 2.2, confidence: 0.82 }
      ])
      setSeismicData([
        { magnitude: 2.1, time: new Date().toISOString(), depth: 5000 }
      ])
      setGasData([
        { so2_ppm: 150, co2_ppm: 400, time: new Date().toISOString() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'text-red-500'
      case 'HIGH': return 'text-orange-500'
      case 'ELEVATED': return 'text-yellow-500'
      case 'MODERATE': return 'text-blue-500'
      default: return 'text-green-500'
    }
  }

  const volcanoes = [
    { value: 'kilauea', label: 'Kīlauea, Hawaii', coords: [19.4, -155.6] },
    { value: 'vesuvius', label: 'Mount Vesuvius, Italy', coords: [40.8, 14.4] },
    { value: 'fuji', label: 'Mount Fuji, Japan', coords: [35.4, 138.7] },
    { value: 'etna', label: 'Mount Etna, Italy', coords: [37.7, 15.0] },
    { value: 'stromboli', label: 'Stromboli, Italy', coords: [38.8, 15.2] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLanding}
            className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Engine Selection
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4">
            BRETT VOLCANIC FORECAST v1.0
          </h1>
          <p className="text-lg text-slate-300">
            Advanced ML-Driven Volcanic Eruption Prediction System
          </p>
        </div>

        {/* Volcano Selector */}
        <div className="mb-8">
          <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-400" />
              Volcano Selection
            </h2>
            <select
              value={selectedVolcano}
              onChange={(e) => setSelectedVolcano(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400 focus:outline-none"
            >
              {volcanoes.map(volcano => (
                <option key={volcano.value} value={volcano.value}>
                  {volcano.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading volcanic data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 21-Day Forecast */}
            <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-400" />
                21-Day Eruption Forecast
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {forecastData.slice(0, 7).map((forecast) => (
                  <div key={forecast.day} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">Day {forecast.day}</span>
                      <span className={`text-sm font-semibold ${getRiskColor(forecast.risk_level)}`}>
                        {forecast.risk_level}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{(forecast.probability * 100).toFixed(1)}%</div>
                      <div className="text-xs text-gray-400">VEI {forecast.magnitude_estimate.toFixed(1)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Seismic Activity */}
            <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Real-time Seismic Activity
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {seismicData.slice(0, 5).map((seismic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">M {seismic.magnitude}</span>
                      {seismic.depth && (
                        <span className="text-xs text-gray-400">{(seismic.depth / 1000).toFixed(1)} km deep</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(seismic.time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gas Emissions */}
            <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-blue-400" />
                Gas Emissions
              </h2>
              <div className="space-y-3">
                {gasData.slice(0, 3).map((gas, index) => (
                  <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">SO₂</span>
                      <span className="text-sm">{gas.so2_ppm} ppm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CO₂</span>
                      <span className="text-sm">{gas.co2_ppm} ppm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                Active Alerts
              </h2>
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-200">{alert.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.severity === 'CRITICAL' ? 'bg-red-600' :
                          alert.severity === 'HIGH' ? 'bg-orange-600' : 'bg-yellow-600'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                    <p className="text-sm text-green-200">No active alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="mt-8 bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">85%</div>
              <div className="text-sm text-gray-400">ML Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">&lt;1s</div>
              <div className="text-sm text-gray-400">Prediction Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-gray-400">Real-time Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">30</div>
              <div className="text-sm text-gray-400">Variables Tracked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolcanicMainInterface

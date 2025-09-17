import React from 'react'
import { ArrowLeft, Globe, Rocket, Zap } from 'lucide-react'

interface VolcanicUIProps {
  onBackToLanding: () => void
  onSelectEarth: () => void
  onSelectCombo: () => void
}

const VolcanicUI: React.FC<VolcanicUIProps> = ({ 
  onBackToLanding, 
  onSelectEarth, 
  onSelectCombo 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLanding}
            className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Landing
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Volcanic Engine Selection
          </h1>
          <p className="text-lg text-slate-300">
            Choose your volcanic monitoring and prediction engine
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">EARTH ENGINE</h2>
                <p className="text-slate-300">Terrestrial volcanic monitoring</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Ground-based sensor networks</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Thermal imaging analysis</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Seismic activity correlation</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Gas emission monitoring</span>
              </li>
            </ul>

            <button
              onClick={onSelectEarth}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
            >
              Deploy Earth Engine
            </button>
          </div>

          <div className="bg-red-900/20 border border-red-500 rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 mr-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">COMBO ENGINE</h2>
                <p className="text-slate-300">Earth + Space integration</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Satellite thermal monitoring</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Atmospheric analysis</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Multi-spectral imaging</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span>Global pattern recognition</span>
              </li>
            </ul>

            <button
              onClick={onSelectCombo}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-400 hover:to-indigo-500 transition-all duration-300"
            >
              Deploy Combo Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolcanicUI

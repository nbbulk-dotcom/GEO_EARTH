import React from 'react'
import { Mountain, ArrowLeft, ArrowRight, Thermometer, Wind, AlertTriangle } from 'lucide-react'

interface VolcanicLandingPageProps {
  onEnterSystem: () => void
  onBackToUnified: () => void
}

const VolcanicLandingPage: React.FC<VolcanicLandingPageProps> = ({ 
  onEnterSystem, 
  onBackToUnified 
}) => {
  const features = [
    {
      icon: Thermometer,
      title: 'Thermal Monitoring',
      description: 'Real-time temperature analysis and thermal anomaly detection'
    },
    {
      icon: Wind,
      title: 'Gas Emission Analysis',
      description: 'Comprehensive monitoring of volcanic gas compositions and emissions'
    },
    {
      icon: Mountain,
      title: 'Deformation Tracking',
      description: 'Ground deformation and structural change monitoring'
    },
    {
      icon: AlertTriangle,
      title: 'Risk Assessment',
      description: 'Advanced threat evaluation and early warning systems'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToUnified}
            className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Systems
          </button>
        </div>

        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-red-500 to-orange-600 mr-4">
              <Mountain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              BRETT VOLCANIC
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Advanced Volcanic Activity Monitoring & Prediction System
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Comprehensive volcanic threat assessment using multi-sensor data integration, 
            thermal analysis, and predictive modeling for early warning and risk mitigation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 hover:border-red-400 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 w-fit mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/30 border border-red-500 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">System Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-3">Monitoring Features</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Real-time thermal imaging analysis</li>
                  <li>• Seismic activity correlation</li>
                  <li>• Gas composition monitoring</li>
                  <li>• Ground deformation tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-3">Prediction Capabilities</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Eruption probability forecasting</li>
                  <li>• Risk zone mapping</li>
                  <li>• Early warning alerts</li>
                  <li>• Impact assessment modeling</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onEnterSystem}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-red-400 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              <Mountain className="w-6 h-6 mr-3" />
              Enter Volcanic System
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-500 text-sm">
            BRETT Volcanic System v4.0 | Advanced Threat Assessment Framework
          </p>
        </div>
      </div>
    </div>
  )
}

export default VolcanicLandingPage

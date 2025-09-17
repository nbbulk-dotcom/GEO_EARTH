import React from 'react'
import { Globe, Mountain, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'

const UnifiedLandingPage: React.FC = () => {
  const handleSystemSelection = (systemType: 'earthquake' | 'volcanic') => {
    const params = new URLSearchParams()
    params.set(systemType, 'true')
    window.location.href = `${window.location.pathname}?${params.toString()}`
  }

  const systems = [
    {
      id: 'earthquake',
      title: 'BRETT Earthquake System',
      description: 'Advanced seismic prediction using 12-dimensional GAL-CRM framework',
      icon: Globe,
      features: [
        '21-day prediction window',
        'Real-time seismic monitoring',
        'Multi-source data integration',
        'Cymatic visualization'
      ],
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500'
    },
    {
      id: 'volcanic',
      title: 'BRETT Volcanic System',
      description: 'Comprehensive volcanic activity monitoring and prediction',
      icon: Mountain,
      features: [
        'Volcanic eruption forecasting',
        'Thermal anomaly detection',
        'Gas emission analysis',
        'Risk assessment mapping'
      ],
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
            BRETT SYSTEMS
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            Breakthrough Research in Earth Threat Technology
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Advanced prediction systems utilizing cutting-edge algorithms and multi-dimensional analysis 
            for comprehensive geological monitoring and threat assessment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {systems.map((system) => {
            const IconComponent = system.icon
            return (
              <div
                key={system.id}
                className={`${system.bgColor} border-2 ${system.borderColor} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                onClick={() => handleSystemSelection(system.id as 'earthquake' | 'volcanic')}
              >
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${system.color} mr-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{system.title}</h2>
                    <p className="text-slate-300">{system.description}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {system.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center group-hover:scale-105">
                  <span>Enter {system.title}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-600">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Reliable</h3>
            <p className="text-slate-400 text-sm">
              Proven algorithms with high accuracy rates and continuous validation
            </p>
          </div>
          
          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-600">
            <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
            <p className="text-slate-400 text-sm">
              Multi-dimensional data processing with real-time analysis capabilities
            </p>
          </div>
          
          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-600">
            <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Global Coverage</h3>
            <p className="text-slate-400 text-sm">
              Worldwide monitoring network with comprehensive data integration
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-500 text-sm">
            BRETT Systems v4.0 | 12-Dimensional GAL-CRM Framework
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnifiedLandingPage

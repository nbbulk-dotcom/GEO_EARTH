import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface VolcanicMainInterfaceProps {
  onBackToLanding: () => void
}

const VolcanicMainInterface: React.FC<VolcanicMainInterfaceProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLanding}
            className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Engine Selection
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Volcanic Main Interface
          </h1>
          <p className="text-lg text-slate-300">
            Volcanic monitoring interface - Coming Soon
          </p>
        </div>
      </div>
    </div>
  )
}

export default VolcanicMainInterface

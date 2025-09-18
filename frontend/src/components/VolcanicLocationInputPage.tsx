import React from 'react';
import VlocationInput from './VolcanicLocationInput';

interface VolcanicLocationInputPageProps {
  onNext: () => void;
}

const VolcanicLocationInputPage: React.FC<VolcanicLocationInputPageProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4">
              BRETT VOLCANIC FORECAST v1.0
            </h1>
            <p className="text-lg text-slate-300">
              Advanced ML-Driven Volcanic Eruption Prediction System
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20">
            <VlocationInput />
            
            <div className="mt-8 text-center">
              <button
                onClick={onNext}
                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
              >
                Continue to Engine Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolcanicLocationInputPage;

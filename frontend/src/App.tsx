import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import UnifiedLandingPage from './components/UnifiedLandingPage'
import LandingPage from './components/LandingPage'
import VolcanicLandingPage from './components/VolcanicLandingPage'
import VolcanicUI from './components/VolcanicUI'
import MainInterface from './components/MainInterface'
import VolcanicMainInterface from './components/VolcanicMainInterface'
import './App.css'

function App() {
  const [showMainInterface, setShowMainInterface] = useState(false)
  const [showVolcanicUI, setShowVolcanicUI] = useState(false)
  const [systemType, setSystemType] = useState<'earthquake' | 'volcanic' | 'unified'>('unified')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isVolcanic = urlParams.get('volcanic') === 'true'
    const isEarthquake = urlParams.get('earthquake') === 'true'
    
    if (isVolcanic) {
      setSystemType('volcanic')
      setShowMainInterface(false)
      } else if (isEarthquake) {
      setSystemType('earthquake')
      setShowMainInterface(false)
      } else {
      setSystemType('unified')
      setShowMainInterface(false)
      }
  }, [])

  const handleEnterSystem = (type: 'earthquake' | 'volcanic' = 'earthquake') => {
    setSystemType(type)
    if (type === 'volcanic') {
      setShowVolcanicUI(true)
    } else {
      setShowMainInterface(true)
    }
  }

  const handleBackToLanding = () => {
    setShowMainInterface(false)
    setShowVolcanicUI(false)
  }

  const handleBackToUnified = () => {
    setSystemType('unified')
    setShowMainInterface(false)
    setShowVolcanicUI(false)
    window.history.pushState({}, '', window.location.pathname)
  }

  const handleVolcanicEngineSelection = () => {
    setShowVolcanicUI(false)
    setShowMainInterface(true)
  }

  const handleBackToVolcanicUI = () => {
    setShowMainInterface(false)
    setShowVolcanicUI(true)
  }

  return (
    <AuthProvider>
      <DataProvider>
        <div className="App">
          {systemType === 'unified' && !showMainInterface && !showVolcanicUI ? (
            <UnifiedLandingPage />
          ) : systemType === 'volcanic' && !showMainInterface && !showVolcanicUI ? (
            <VolcanicLandingPage onEnterSystem={() => handleEnterSystem('volcanic')} onBackToUnified={handleBackToUnified} />
          ) : systemType === 'earthquake' && !showMainInterface && !showVolcanicUI ? (
            <LandingPage onEnterSystem={() => handleEnterSystem('earthquake')} onBackToUnified={handleBackToUnified} />
          ) : systemType === 'volcanic' && showVolcanicUI && !showMainInterface ? (
            <VolcanicUI 
              onBackToLanding={handleBackToLanding}
              onSelectEarth={() => handleVolcanicEngineSelection()}
              onSelectCombo={() => handleVolcanicEngineSelection()}
            />
          ) : systemType === 'volcanic' && showMainInterface ? (
            <VolcanicMainInterface 
              onBackToLanding={handleBackToVolcanicUI}
            />
          ) : systemType === 'earthquake' && showMainInterface ? (
            <MainInterface onBackToLanding={handleBackToLanding} />
          ) : (
            <UnifiedLandingPage />
          )}
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

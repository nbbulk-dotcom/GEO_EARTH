import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import UnifiedLandingPage from './components/UnifiedLandingPage'
import LandingPage from './components/LandingPage'
import VolcanicLandingPage from './components/VolcanicLandingPage'
import VolcanicUI from './components/VolcanicUI'
import MainInterface from './components/MainInterface'
import VolcanicMainInterface from './components/VolcanicMainInterface'
import LocationInputPage from './components/LocationInputPage'
import EngineSelectionPage from './components/EngineSelectionPage'
import PredictionDisplayPage from './components/PredictionDisplayPage'
import CymaticVisualizationPage from './components/CymaticVisualizationPage'
import './App.css'

type PageType = 'landing' | 'location' | 'engine' | 'prediction' | 'cymatic'

function App() {
  const [showMainInterface, setShowMainInterface] = useState(false)
  const [showVolcanicUI, setShowVolcanicUI] = useState(false)
  const [systemType, setSystemType] = useState<'earthquake' | 'volcanic' | 'unified'>('unified')
  const [currentPage, setCurrentPage] = useState<PageType>('landing')

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
      setCurrentPage('landing')
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
      setCurrentPage('location')
    }
  }

  const handleBackToLanding = () => {
    setShowMainInterface(false)
    setShowVolcanicUI(false)
    setCurrentPage('landing')
  }

  const handleBackToUnified = () => {
    setSystemType('unified')
    setShowMainInterface(false)
    setShowVolcanicUI(false)
    setCurrentPage('landing')
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

  const handleNextPage = () => {
    switch (currentPage) {
      case 'location':
        setCurrentPage('engine')
        break
      case 'engine':
        setCurrentPage('prediction')
        break
      case 'prediction':
        setCurrentPage('cymatic')
        break
    }
  }

  const handlePreviousPage = () => {
    switch (currentPage) {
      case 'location':
        setCurrentPage('landing')
        break
      case 'engine':
        setCurrentPage('location')
        break
      case 'prediction':
        setCurrentPage('engine')
        break
      case 'cymatic':
        setCurrentPage('prediction')
        break
    }
  }

  const handleChangeLocation = () => {
    setCurrentPage('location')
  }

  const renderEarthquakeSystem = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onEnterSystem={() => handleEnterSystem('earthquake')} onBackToUnified={handleBackToUnified} />
      case 'location':
        return <LocationInputPage onNext={handleNextPage} />
      case 'engine':
        return <EngineSelectionPage onNext={handleNextPage} />
      case 'prediction':
        return <PredictionDisplayPage onNext={handleNextPage} onChangeLocation={handleChangeLocation} />
      case 'cymatic':
        return <CymaticVisualizationPage onBack={handlePreviousPage} />
      default:
        return <LandingPage onEnterSystem={() => handleEnterSystem('earthquake')} onBackToUnified={handleBackToUnified} />
    }
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
            renderEarthquakeSystem()
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

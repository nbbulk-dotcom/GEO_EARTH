import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import LandingPage from './components/LandingPage'
import MainInterface from './components/MainInterface'

function App() {
  const [showMainInterface, setShowMainInterface] = useState(false)
  const [systemType, setSystemType] = useState<'earthquake'>('earthquake')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isEarthquake = urlParams.get('earthquake') === 'true'
    
    if (isEarthquake) {
      setSystemType('earthquake')
      setShowMainInterface(false)
    }
  }, [])

  const handleEnterSystem = (type: 'earthquake' = 'earthquake') => {
    setSystemType(type)
    setShowMainInterface(true)
  }

  const handleBackToLanding = () => {
    setShowMainInterface(false)
  }

  const handleBackToUnified = () => {
    setSystemType('earthquake')
    setShowMainInterface(false)
    window.history.pushState({}, '', window.location.pathname)
  }

  return (
    <AuthProvider>
      <DataProvider>
        <div className="App">
          {systemType === 'earthquake' && !showMainInterface ? (
            <LandingPage onEnterSystem={() => handleEnterSystem('earthquake')} onBackToUnified={handleBackToUnified} />
          ) : systemType === 'earthquake' && showMainInterface ? (
            <MainInterface onBackToLanding={handleBackToLanding} />
          ) : (
            <LandingPage onEnterSystem={() => handleEnterSystem('earthquake')} onBackToUnified={handleBackToUnified} />
          )}
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

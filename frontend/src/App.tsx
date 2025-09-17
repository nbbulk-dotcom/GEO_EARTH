import { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import LandingPage from './components/LandingPage'
import MainInterface from './components/MainInterface'

function App() {
  const [showMainInterface, setShowMainInterface] = useState(false)

  const handleEnterSystem = () => {
    setShowMainInterface(true)
  }

  const handleBackToLanding = () => {
    setShowMainInterface(false)
  }

  return (
    <AuthProvider>
      <DataProvider>
        <div className="App">
          {!showMainInterface ? (
            <LandingPage onEnterSystem={handleEnterSystem} />
          ) : (
            <MainInterface onBackToLanding={handleBackToLanding} />
          )}
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

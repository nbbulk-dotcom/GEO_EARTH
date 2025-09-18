import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import HistoricalDashboard from './components/HistoricalDashboard';
import './App.css';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#ff6b35',
          colorBgBase: darkMode ? '#1a1a1a' : '#ffffff',
        },
      }}
    >
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <HistoricalDashboard 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)} 
        />
      </div>
    </ConfigProvider>
  );
};

export default App;

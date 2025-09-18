import React from 'react';

interface ModeSelectorProps {
  value: string;
  onChange: (mode: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ value, onChange }) => {
  const modes = [
    {
      value: 'earth',
      label: 'Earth-based',
      description: 'Analysis using terrestrial variables only'
    },
    {
      value: 'combined',
      label: 'Combined',
      description: 'Includes space-based variables and 26.57° angle effects'
    }
  ];

  return (
    <div>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Analysis Mode</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        {modes.map((mode) => (
          <label key={mode.value} style={{ 
            color: 'white', 
            display: 'block', 
            marginBottom: '1rem',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              checked={value === mode.value}
              onChange={() => onChange(mode.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{mode.label}</div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#b0b0b0',
                marginTop: '0.25rem'
              }}>
                {mode.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={{ 
        color: '#b0b0b0', 
        fontSize: '0.9rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Selected:</strong> {modes.find(m => m.value === value)?.label}
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
          {value === 'combined' 
            ? 'Enhanced accuracy with space-based correlations'
            : 'Traditional terrestrial analysis approach'
          }
        </p>
      </div>
    </div>
  );
};

export default ModeSelector;

import React from 'react';
import { Slider, Card, Typography, Space } from 'antd';

const { Text } = Typography;

interface TimelineSliderProps {
  range: [number, number];
  onChange: (range: [number, number]) => void;
  min: number;
  max: number;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  range,
  onChange,
  min,
  max,
}) => {
  const handleChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      onChange([value[0], value[1]]);
    }
  };

  const formatTooltip = (value?: number) => {
    return value ? `${value}` : '';
  };

  return (
    <Card size="small" title="Time Range Selection">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <Text strong>
            {range[0]} - {range[1]} ({range[1] - range[0]} years)
          </Text>
        </div>
        
        <Slider
          range
          min={min}
          max={max}
          value={range}
          onChange={handleChange}
          tooltip={{ formatter: formatTooltip }}
          marks={{
            [min]: `${min}`,
            1850: '1850',
            1900: '1900',
            1950: '1950',
            2000: '2000',
            [max]: `${max}`,
          }}
          step={1}
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#666'
        }}>
          <span>Industrial Era</span>
          <span>Modern Era</span>
          <span>Digital Era</span>
        </div>
      </Space>
    </Card>
  );
};

export default TimelineSlider;

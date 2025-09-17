import React from 'react';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';

interface RadiusSelectorProps {
  value: number;
  onChange: (radius: number) => void;
  disabled?: boolean;
  variant?: string;
}

const RadiusSelector: React.FC<RadiusSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getRadiusDescription = (value: number) => {
    if (value <= 50) return 'Local area monitoring';
    if (value <= 100) return 'Regional monitoring';
    if (value <= 200) return 'Extended regional monitoring';
    if (value <= 500) return 'Wide area monitoring';
    return 'Continental monitoring';
  };

  const getRadiusColor = (value: number) => {
    if (value <= 50) return 'text-green-600';
    if (value <= 100) return 'text-blue-600';
    if (value <= 200) return 'text-yellow-600';
    if (value <= 500) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Monitoring Radius
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{value} km</span>
            <span className={`text-xs ${getRadiusColor(value)}`}>
              {getRadiusDescription(value)}
            </span>
          </div>
          
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            max={1000}
            min={10}
            step={10}
            disabled={disabled}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>10 km</span>
            <span>1000 km</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <p>
            <strong>Coverage:</strong> Approximately {Math.round(Math.PI * value * value).toLocaleString()} km² area
          </p>
          <p className="mt-1">
            Larger radius increases data collection but may reduce prediction accuracy for local events.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadiusSelector;

import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Tag, Tabs } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { HistoricalData, VolcanoLocation } from '../types/historical';

const { TabPane } = Tabs;

interface HistoricalViewProps {
  historicalData: HistoricalData | null;
  timeRange: [number, number];
  selectedVolcano: VolcanoLocation | null;
}

const HistoricalView: React.FC<HistoricalViewProps> = ({
  historicalData,
  timeRange,
  selectedVolcano,
}) => {
  const [activeTab, setActiveTab] = useState('timeline');

  if (!historicalData || !selectedVolcano) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Select a volcano and time range to view historical analysis
        </div>
      </Card>
    );
  }

  const simulation = historicalData.simulation;
  const interferencePatterns = simulation?.interference_patterns;
  const historicalCorrelation = simulation?.historical_correlation;
  const predictionAccuracy = simulation?.prediction_accuracy;

  const timelineData = interferencePatterns?.interference_events?.map((event, index) => ({
    year: new Date(event.date).getFullYear(),
    intensity: event.intensity,
    type: event.interference_type,
    angle_difference: event.space_sun_diff,
  })) || [];

  const heatmapData = interferencePatterns?.peak_interference_periods?.map(period => ({
    year: period.year,
    intensity: period.average_intensity,
    events: period.event_count,
  })) || [];

  const renderTimelineTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Statistic
            title="Total Interference Events"
            value={interferencePatterns?.interference_events_count || 0}
            suffix="events"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Interference Ratio"
            value={(interferencePatterns?.interference_ratio || 0) * 100}
            suffix="%"
            precision={2}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Historical Correlation"
            value={(historicalCorrelation?.correlation_ratio || 0) * 100}
            suffix="%"
            precision={2}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Prediction Accuracy"
            value={(predictionAccuracy?.overall_accuracy || 0) * 100}
            suffix="%"
            precision={2}
          />
        </Col>
      </Row>

      <Card title="Interference Events Timeline" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                typeof value === 'number' ? value.toFixed(4) : value,
                name
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="intensity" 
              stroke="#ff6b35" 
              strokeWidth={2}
              dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Timeline mode="left">
        {interferencePatterns?.peak_interference_periods?.slice(0, 5).map((period, index) => (
          <Timeline.Item
            key={period.year}
            color={period.average_intensity > 0.7 ? 'red' : period.average_intensity > 0.5 ? 'orange' : 'blue'}
          >
            <div>
              <strong>{period.year}</strong> - Peak Interference Period
              <br />
              <Tag color="volcano">Intensity: {(period.average_intensity * 100).toFixed(1)}%</Tag>
              <Tag color="geekblue">Events: {period.event_count}</Tag>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );

  const renderHeatmapTab = () => (
    <div>
      <Card title="Intensity Heatmap by Year" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={heatmapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis dataKey="intensity" />
            <Tooltip 
              formatter={(value, name) => [
                typeof value === 'number' ? value.toFixed(4) : value,
                name
              ]}
            />
            <Scatter dataKey="intensity" fill="#ff6b35">
              {heatmapData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(${20 - entry.intensity * 20}, 100%, ${50 + entry.intensity * 30}%)`}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Seasonal Patterns">
            {interferencePatterns?.seasonal_patterns && (
              <div>
                <p><strong>Peak Activity Month:</strong> {interferencePatterns.seasonal_patterns.peak_activity_month}</p>
                <p><strong>Peak Intensity Month:</strong> {interferencePatterns.seasonal_patterns.peak_intensity_month}</p>
                <p><strong>Seasonal Variation:</strong> {interferencePatterns.seasonal_patterns.seasonal_variation}</p>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Correlation Analysis">
            {historicalCorrelation && (
              <div>
                <p><strong>Total Historical Events:</strong> {historicalCorrelation.total_historical_events}</p>
                <p><strong>Correlated Events:</strong> {historicalCorrelation.correlated_events}</p>
                <p><strong>Average Time Difference:</strong> {historicalCorrelation.average_time_difference} days</p>
                <Progress 
                  percent={(historicalCorrelation.correlation_ratio * 100)} 
                  strokeColor="#ff6b35"
                  format={percent => `${percent?.toFixed(1)}%`}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderAccuracyTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Precision"
              value={(predictionAccuracy?.precision || 0) * 100}
              suffix="%"
              precision={2}
            />
            <Progress 
              percent={(predictionAccuracy?.precision || 0) * 100} 
              strokeColor="#52c41a"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Recall"
              value={(predictionAccuracy?.recall || 0) * 100}
              suffix="%"
              precision={2}
            />
            <Progress 
              percent={(predictionAccuracy?.recall || 0) * 100} 
              strokeColor="#1890ff"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="F1 Score"
              value={(predictionAccuracy?.f1_score || 0) * 100}
              suffix="%"
              precision={2}
            />
            <Progress 
              percent={(predictionAccuracy?.f1_score || 0) * 100} 
              strokeColor="#ff6b35"
              showInfo={false}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Framework Parameters">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p><strong>Methodology:</strong> {simulation?.methodology}</p>
            <p><strong>Sun Positions Analyzed:</strong> {simulation?.sun_positions_analyzed}</p>
            <p><strong>Prediction Window:</strong> {predictionAccuracy?.prediction_window_days} days</p>
          </Col>
          <Col span={12}>
            <p><strong>Planetary Angle:</strong> {simulation?.simulation_parameters?.planetary_angle}°</p>
            <p><strong>Earth Surface Angle:</strong> {simulation?.simulation_parameters?.earth_surface_angle}°</p>
            <p><strong>Firmament Height:</strong> {simulation?.simulation_parameters?.firmament_height} km</p>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane tab="Timeline Analysis" key="timeline">
        {renderTimelineTab()}
      </TabPane>
      <TabPane tab="Intensity Heatmap" key="heatmap">
        {renderHeatmapTab()}
      </TabPane>
      <TabPane tab="Accuracy Metrics" key="accuracy">
        {renderAccuracyTab()}
      </TabPane>
    </Tabs>
  );
};

export default HistoricalView;

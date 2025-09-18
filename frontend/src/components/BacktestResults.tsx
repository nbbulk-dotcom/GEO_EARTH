import React from 'react';
import { Card, Statistic, Row, Col, Progress, Tag, Typography } from 'antd';
import { TrophyOutlined, ExperimentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { HistoricalData } from '../types/historical';

const { Text } = Typography;

interface BacktestResultsProps {
  data: HistoricalData | null;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ data }) => {
  if (!data || !data.simulation) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">Run a simulation to see backtest results</Text>
        </div>
      </Card>
    );
  }

  const simulation = data.simulation;
  const accuracy = simulation.prediction_accuracy;
  const interference = simulation.interference_patterns;
  const correlation = simulation.historical_correlation;

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };

  const getAccuracyLevel = (value: number) => {
    if (value >= 0.8) return { level: 'Excellent', color: '#52c41a' };
    if (value >= 0.6) return { level: 'Good', color: '#1890ff' };
    if (value >= 0.4) return { level: 'Fair', color: '#faad14' };
    return { level: 'Poor', color: '#ff4d4f' };
  };

  const overallAccuracy = accuracy?.overall_accuracy || 0;
  const accuracyLevel = getAccuracyLevel(overallAccuracy);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Overall Performance */}
      <Card size="small" title={<><TrophyOutlined /> Overall Performance</>}>
        <Statistic
          title="System Accuracy"
          value={overallAccuracy * 100}
          suffix="%"
          precision={1}
          valueStyle={{ color: accuracyLevel.color }}
        />
        <Progress
          percent={overallAccuracy * 100}
          strokeColor={accuracyLevel.color}
          format={() => accuracyLevel.level}
        />
        <div style={{ marginTop: 10 }}>
          <Tag color={getConfidenceColor(accuracy?.confidence_level || 'medium')}>
            {accuracy?.confidence_level?.toUpperCase()} CONFIDENCE
          </Tag>
        </div>
      </Card>

      {/* Interference Analysis */}
      <Card size="small" title={<><ThunderboltOutlined /> Interference Analysis</>}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Statistic
              title="Events Detected"
              value={interference?.interference_events_count || 0}
              suffix="events"
            />
          </Col>
          <Col span={24}>
            <Text type="secondary">Interference Ratio</Text>
            <Progress
              percent={(interference?.interference_ratio || 0) * 100}
              size="small"
              strokeColor="#ff6b35"
              format={percent => `${percent?.toFixed(1)}%`}
            />
          </Col>
        </Row>
      </Card>

      {/* Historical Correlation */}
      <Card size="small" title={<><ExperimentOutlined /> Historical Correlation</>}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Statistic
              title="Correlated Events"
              value={correlation?.correlated_events || 0}
              suffix={`/ ${correlation?.total_historical_events || 0}`}
            />
          </Col>
          <Col span={24}>
            <Text type="secondary">Correlation Strength</Text>
            <Progress
              percent={(correlation?.correlation_ratio || 0) * 100}
              size="small"
              strokeColor="#1890ff"
              format={percent => `${percent?.toFixed(1)}%`}
            />
          </Col>
        </Row>
      </Card>

      {/* Detailed Metrics */}
      <Card size="small" title="Detailed Metrics">
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Text type="secondary">Precision</Text>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
              {((accuracy?.precision || 0) * 100).toFixed(1)}%
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Recall</Text>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
              {((accuracy?.recall || 0) * 100).toFixed(1)}%
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">F1 Score</Text>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff6b35' }}>
              {((accuracy?.f1_score || 0) * 100).toFixed(1)}%
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Window</Text>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {accuracy?.prediction_window_days || 21} days
            </div>
          </Col>
        </Row>
      </Card>

      {/* Framework Info */}
      <Card size="small" title="Framework">
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          <Text type="secondary">
            BRETT VOLCANIC HISTORICAL v1.0<br />
            {simulation.methodology}<br />
            12 Space Variables + 24 Earth Resonance
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default BacktestResults;

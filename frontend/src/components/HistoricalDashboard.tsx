import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, Switch, Space, Typography, Spin } from 'antd';
import { SunOutlined, MoonOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import VolcanoSelector from './VolcanoSelector';
import HistoricalViz from './HistoricalViz';
import HistoricalView from './HistoricalView';
import TimelineSlider from './TimelineSlider';
import BacktestResults from './BacktestResults';
import { HistoricalData, VolcanoLocation } from '../types/historical';
import { historicalApi } from '../services/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface HistoricalDashboardProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const HistoricalDashboard: React.FC<HistoricalDashboardProps> = ({
  darkMode,
  onToggleDarkMode,
}) => {
  const [selectedVolcano, setSelectedVolcano] = useState<VolcanoLocation | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([1900, 2023]);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const handleVolcanoSelect = (volcano: VolcanoLocation) => {
    setSelectedVolcano(volcano);
    loadHistoricalData(volcano, timeRange);
  };

  const handleTimeRangeChange = (range: [number, number]) => {
    setTimeRange(range);
    if (selectedVolcano) {
      loadHistoricalData(selectedVolcano, range);
    }
  };

  const loadHistoricalData = async (volcano: VolcanoLocation, range: [number, number]) => {
    setLoading(true);
    try {
      const data = await historicalApi.simulateHistoricalPeriod(
        range[0],
        range[1],
        volcano.latitude,
        volcano.longitude
      );
      setHistoricalData(data);
    } catch (error) {
      console.error('Error loading historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runBacktest = async () => {
    if (!selectedVolcano) return;
    
    setSimulationRunning(true);
    try {
      const backtestData = await historicalApi.runBacktest(
        timeRange[0],
        timeRange[1],
        [selectedVolcano]
      );
      console.log('Backtest completed:', backtestData);
    } catch (error) {
      console.error('Backtest error:', error);
    } finally {
      setSimulationRunning(false);
    }
  };

  return (
    <Layout className="volcanic-container">
      <Header style={{ 
        background: 'transparent', 
        padding: '0 0 20px 0',
        height: 'auto'
      }}>
        <div className="dashboard-header">
          <Title level={1} className="dashboard-title">
            BRETT VOLCANIC HISTORICAL v1.0
          </Title>
          <Text className="dashboard-subtitle">
            Advanced ML-Driven Historical Eruption Analysis with Ideal UI
          </Text>
          <Space style={{ marginTop: 15 }}>
            <Switch
              checked={darkMode}
              onChange={onToggleDarkMode}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
            <Button
              type="primary"
              icon={simulationRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={runBacktest}
              disabled={!selectedVolcano || loading}
              loading={simulationRunning}
            >
              {simulationRunning ? 'Running Simulation' : 'Run Historical Simulation'}
            </Button>
          </Space>
        </div>
      </Header>

      <Content>
        <div className="dashboard-grid">
          {/* Left Panel - Controls */}
          <Card title="Volcano Selection & Controls" className="dashboard-panel">
            <div className="controls-panel">
              <VolcanoSelector onSelect={handleVolcanoSelect} />
              <TimelineSlider
                range={timeRange}
                onChange={handleTimeRangeChange}
                min={1800}
                max={2023}
              />
              {selectedVolcano && (
                <Card size="small" title="Selected Volcano">
                  <Text strong>{selectedVolcano.name}</Text><br />
                  <Text type="secondary">
                    {selectedVolcano.latitude.toFixed(4)}°, {selectedVolcano.longitude.toFixed(4)}°
                  </Text>
                </Card>
              )}
            </div>
          </Card>

          {/* Center Panel - 3D Visualization */}
          <Card title="Historical Cymatic Visualization" className="dashboard-panel">
            <div className="visualization-container">
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%' 
                }}>
                  <Spin size="large" />
                </div>
              ) : (
                <HistoricalViz 
                  historicalData={historicalData}
                  selectedVolcano={selectedVolcano}
                  timeRange={timeRange}
                />
              )}
            </div>
          </Card>

          {/* Right Panel - Results */}
          <Card title="Analysis Results" className="dashboard-panel">
            <div className="results-panel">
              <BacktestResults data={historicalData} />
            </div>
          </Card>
        </div>

        {/* Bottom Panel - Historical Analysis */}
        <Card title="Historical Timeline Analysis" className="timeline-container">
          <HistoricalView 
            historicalData={historicalData}
            timeRange={timeRange}
            selectedVolcano={selectedVolcano}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default HistoricalDashboard;

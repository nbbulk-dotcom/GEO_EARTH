import React, { useState } from 'react';
import { Select, Card, Row, Col, Typography } from 'antd';
import { VolcanoLocation } from '../types/historical';

const { Option } = Select;
const { Text } = Typography;

interface VolcanoSelectorProps {
  onSelect: (volcano: VolcanoLocation) => void;
}

const FAMOUS_VOLCANOES: VolcanoLocation[] = [
  {
    id: 'kilauea',
    name: 'Kīlauea',
    latitude: 19.4069,
    longitude: -155.2834,
    country: 'USA (Hawaii)',
    region: 'PACIFIC_RING',
    elevation: 1247,
    lastEruption: '2023-09-10',
    vei: 0,
  },
  {
    id: 'mount_st_helens',
    name: 'Mount St. Helens',
    latitude: 46.1914,
    longitude: -122.1956,
    country: 'USA (Washington)',
    region: 'PACIFIC_RING',
    elevation: 2549,
    lastEruption: '2008-07-10',
    vei: 2,
  },
  {
    id: 'vesuvius',
    name: 'Mount Vesuvius',
    latitude: 40.8218,
    longitude: 14.4289,
    country: 'Italy',
    region: 'MEDITERRANEAN',
    elevation: 1281,
    lastEruption: '1944-03-29',
    vei: 3,
  },
  {
    id: 'etna',
    name: 'Mount Etna',
    latitude: 37.7510,
    longitude: 14.9934,
    country: 'Italy',
    region: 'MEDITERRANEAN',
    elevation: 3357,
    lastEruption: '2023-12-01',
    vei: 2,
  },
  {
    id: 'fuji',
    name: 'Mount Fuji',
    latitude: 35.3606,
    longitude: 138.7274,
    country: 'Japan',
    region: 'PACIFIC_RING',
    elevation: 3776,
    lastEruption: '1707-12-16',
    vei: 5,
  },
  {
    id: 'krakatoa',
    name: 'Krakatoa',
    latitude: -6.1024,
    longitude: 105.4230,
    country: 'Indonesia',
    region: 'VOLCANIC_ARCS',
    elevation: 813,
    lastEruption: '2020-04-11',
    vei: 2,
  },
  {
    id: 'yellowstone',
    name: 'Yellowstone Caldera',
    latitude: 44.4280,
    longitude: -110.5885,
    country: 'USA (Wyoming)',
    region: 'PACIFIC_RING',
    elevation: 2805,
    lastEruption: '70000 years ago',
    vei: 8,
  },
  {
    id: 'santorini',
    name: 'Santorini',
    latitude: 36.4040,
    longitude: 25.3960,
    country: 'Greece',
    region: 'MEDITERRANEAN',
    elevation: 367,
    lastEruption: '1950-01-20',
    vei: 2,
  },
];

const VolcanoSelector: React.FC<VolcanoSelectorProps> = ({ onSelect }) => {
  const [selectedVolcano, setSelectedVolcano] = useState<VolcanoLocation | null>(null);

  const handleSelect = (volcanoId: string) => {
    const volcano = FAMOUS_VOLCANOES.find(v => v.id === volcanoId);
    if (volcano) {
      setSelectedVolcano(volcano);
      onSelect(volcano);
    }
  };

  return (
    <div>
      <Select
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Select a volcano for analysis"
        onChange={handleSelect}
        showSearch
        filterOption={(input, option) =>
          option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
        }
      >
        {FAMOUS_VOLCANOES.map(volcano => (
          <Option key={volcano.id} value={volcano.id}>
            {volcano.name} ({volcano.country})
          </Option>
        ))}
      </Select>

      {selectedVolcano && (
        <Card size="small" style={{ marginTop: 10 }}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Text strong>Region:</Text><br />
              <Text type="secondary">{selectedVolcano.region}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Elevation:</Text><br />
              <Text type="secondary">{selectedVolcano.elevation}m</Text>
            </Col>
            <Col span={12}>
              <Text strong>Last VEI:</Text><br />
              <Text type="secondary">{selectedVolcano.vei}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Last Eruption:</Text><br />
              <Text type="secondary">{selectedVolcano.lastEruption}</Text>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default VolcanoSelector;

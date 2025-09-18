import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Typography, List, Spin } from 'antd';
import { ArrowRight, FileText, Database, Settings, User, Phone, Mail, Globe } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

interface DocumentationData {
  manuals: Array<{ name: string; url: string }>;
  specifications: Record<string, any>;
  user_rights: Record<string, string>;
  admin_contact: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
}

const SubsystemLanding: React.FC = () => {
  const navigate = useNavigate();
  const { system } = useParams<{ system: string }>();
  const [documentation, setDocumentation] = useState<DocumentationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      const response = await axios.get('/api/docs');
      setDocumentation(response.data);
    } catch (error) {
      console.error('Failed to fetch documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterSystem = () => {
    navigate(`/dashboard/${system}`);
  };

  const systemConfig = {
    earthquake: {
      title: 'BRETT Earthquake System',
      description: 'Advanced seismic prediction and analysis platform',
      color: '#4CAF50',
      icon: <Globe size={48} />
    },
    volcanic: {
      title: 'BRETT Volcanic System', 
      description: 'Comprehensive volcanic monitoring and prediction system',
      color: '#FF5722',
      icon: <Globe size={48} />
    }
  };

  const config = systemConfig[system as keyof typeof systemConfig] || systemConfig.earthquake;

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: config.color, marginBottom: '1rem' }}>
            {config.icon}
          </div>
          <Title level={1} style={{ color: 'white', marginBottom: '0.5rem' }}>
            {config.title}
          </Title>
          <Paragraph style={{ color: '#b0b0b0', fontSize: '1.2rem' }}>
            {config.description}
          </Paragraph>
        </div>

        <Card
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          <Tabs defaultActiveKey="manuals" size="large">
            <TabPane 
              tab={
                <span style={{ color: 'white' }}>
                  <FileText size={16} style={{ marginRight: '8px' }} />
                  Manuals
                </span>
              } 
              key="manuals"
            >
              <div style={{ color: 'white' }}>
                <Title level={3} style={{ color: 'white', marginBottom: '1rem' }}>
                  System Documentation
                </Title>
                {documentation?.manuals && (
                  <List
                    dataSource={documentation.manuals}
                    renderItem={(manual) => (
                      <List.Item>
                        <Button 
                          type="link" 
                          href={manual.url}
                          target="_blank"
                          style={{ color: config.color, fontSize: '1.1rem' }}
                        >
                          <FileText size={16} style={{ marginRight: '8px' }} />
                          {manual.name}
                        </Button>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span style={{ color: 'white' }}>
                  <Database size={16} style={{ marginRight: '8px' }} />
                  Test Data
                </span>
              } 
              key="testdata"
            >
              <div style={{ color: 'white' }}>
                <Title level={3} style={{ color: 'white', marginBottom: '1rem' }}>
                  Test Datasets
                </Title>
                <Paragraph style={{ color: '#b0b0b0' }}>
                  Sample datasets for system testing and validation will be available here.
                  Contact the administrator for access to specific test scenarios.
                </Paragraph>
                <List>
                  <List.Item>
                    <Text style={{ color: '#b0b0b0' }}>• Historical validation datasets</Text>
                  </List.Item>
                  <List.Item>
                    <Text style={{ color: '#b0b0b0' }}>• Synthetic test scenarios</Text>
                  </List.Item>
                  <List.Item>
                    <Text style={{ color: '#b0b0b0' }}>• Benchmark comparison data</Text>
                  </List.Item>
                </List>
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span style={{ color: 'white' }}>
                  <Settings size={16} style={{ marginRight: '8px' }} />
                  Specifications
                </span>
              } 
              key="specifications"
            >
              <div style={{ color: 'white' }}>
                <Title level={3} style={{ color: 'white', marginBottom: '1rem' }}>
                  System Specifications
                </Title>
                {documentation?.specifications && (
                  <List>
                    {Object.entries(documentation.specifications).map(([key, value]) => (
                      <List.Item key={key}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                          {key.replace(/_/g, ' ').toUpperCase()}:
                        </Text>
                        <Text style={{ color: '#b0b0b0', marginLeft: '1rem' }}>
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                )}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span style={{ color: 'white' }}>
                  <User size={16} style={{ marginRight: '8px' }} />
                  User Rights
                </span>
              } 
              key="rights"
            >
              <div style={{ color: 'white' }}>
                <Title level={3} style={{ color: 'white', marginBottom: '1rem' }}>
                  User Rights & Permissions
                </Title>
                {documentation?.user_rights && (
                  <List>
                    {Object.entries(documentation.user_rights).map(([key, value]) => (
                      <List.Item key={key}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                          {key.replace(/_/g, ' ').toUpperCase()}:
                        </Text>
                        <Text style={{ color: '#b0b0b0', marginLeft: '1rem' }}>
                          {value}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                )}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span style={{ color: 'white' }}>
                  <Phone size={16} style={{ marginRight: '8px' }} />
                  Contact
                </span>
              } 
              key="contact"
            >
              <div style={{ color: 'white' }}>
                <Title level={3} style={{ color: 'white', marginBottom: '1rem' }}>
                  Administrator Contact
                </Title>
                {documentation?.admin_contact && (
                  <div style={{ fontSize: '1.1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <User size={20} style={{ marginRight: '12px', color: config.color }} />
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {documentation.admin_contact.name}
                      </Text>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <Phone size={20} style={{ marginRight: '12px', color: config.color }} />
                      <Text style={{ color: '#b0b0b0' }}>
                        {documentation.admin_contact.phone}
                      </Text>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <Mail size={20} style={{ marginRight: '12px', color: config.color }} />
                      <Text style={{ color: '#b0b0b0' }}>
                        {documentation.admin_contact.email}
                      </Text>
                    </div>
                    <div>
                      <Globe size={20} style={{ marginRight: '12px', color: config.color }} />
                      <Button 
                        type="link" 
                        href={documentation.admin_contact.website}
                        target="_blank"
                        style={{ color: config.color, padding: 0 }}
                      >
                        {documentation.admin_contact.website}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRight />}
              onClick={handleEnterSystem}
              style={{
                background: `linear-gradient(45deg, ${config.color}, ${config.color}dd)`,
                border: 'none',
                borderRadius: '8px',
                height: '56px',
                fontSize: '1.2rem',
                padding: '0 3rem'
              }}
            >
              Enter {system?.charAt(0).toUpperCase() + system?.slice(1)} System
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubsystemLanding;

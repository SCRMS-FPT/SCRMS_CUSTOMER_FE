import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '../../API/CourtApi';
import { 
  Layout, 
  Typography, 
  Card, 
  Button, 
  Row, 
  Col, 
  Divider, 
  Tag, 
  Spin, 
  Empty, 
  Carousel, 
  Tabs, 
  Badge, 
  Rate, 
  Avatar, 
  List, 
  Skeleton, 
  Tooltip, 
  Space, 
  Image, 
  Breadcrumb, 
  Alert, 
  Statistic
} from 'antd';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  WifiOutlined,
  CarOutlined,
  ShopOutlined,
  StarOutlined,
  TeamOutlined,
  AppstoreOutlined,
  HomeOutlined
} from '@ant-design/icons';

// API client instance
const apiClient = new Client();

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;
const { TabPane } = Tabs;

// Sport Icon Component
const SportIcon = ({ sportName }) => {
  const name = sportName?.toLowerCase() || '';
  let icon = <AppstoreOutlined />;
  let color = 'blue';
  
  if (name.includes('tennis')) {
    icon = <span role="img" aria-label="tennis">🎾</span>;
    color = 'green';
  } else if (name.includes('soccer') || name.includes('football')) {
    icon = <span role="img" aria-label="soccer">⚽</span>;
    color = 'volcano';
  } else if (name.includes('basketball')) {
    icon = <span role="img" aria-label="basketball">🏀</span>;
    color = 'orange';
  } else if (name.includes('swimming')) {
    icon = <span role="img" aria-label="swimming">🏊</span>;
    color = 'cyan';
  } else if (name.includes('badminton')) {
    icon = <span role="img" aria-label="badminton">🏸</span>;
    color = 'purple';
  }
  
  return (
    <Tag color={color} icon={icon} style={{ fontSize: '14px', padding: '4px 8px' }}>
      {sportName}
    </Tag>
  );
};

const SportCenterDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [sportCenter, setSportCenter] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  // Default amenities
  const amenities = [
    { icon: <ShopOutlined />, name: 'Changing Rooms' },
    { icon: <CarOutlined />, name: 'Parking Available' },
    { icon: <ShopOutlined />, name: 'Café & Refreshments' },
    { icon: <WifiOutlined />, name: 'Free Wi-Fi' }
  ];

  // Function to format the complete address
  const formatAddress = (sportCenter) => {
    if (!sportCenter) return '';
    const addressParts = [
      sportCenter.addressLine,
      sportCenter.commune,
      sportCenter.district,
      sportCenter.city
    ].filter(Boolean); // Remove any undefined or empty parts
    
    console.log(sportCenter.city + "completeAddress");
    return addressParts.join(', ');
  };

  // Fetch sport center details and courts
  useEffect(() => {
    const fetchSportCenterData = async () => {
      try {
        setLoading(true);
        // Fetch sport center details
        const centerData = await apiClient.getSportCenterById(id);
        if (!centerData) {
          setError('Sport center not found');
          return;
        }
        setSportCenter(centerData);
        console.log(centerData);
        // Fetch courts of this sport center
        const courtsData = await apiClient.getAllCourtsOfSportCenter(id);
        setCourts(courtsData?.courts || []);
        
      } catch (err) {
        console.error('Error fetching sport center data:', err);
        setError('Failed to load sport center details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSportCenterData();
    }
  }, [id]);

  // Group courts by sport
  const courtsBySport = courts.reduce((acc, court) => {
    const sportName = court.sportName || 'Other';
    if (!acc[sportName]) {
      acc[sportName] = [];
    }
    acc[sportName].push(court);
    return acc;
  }, {});

  // Handle court selection - navigate to court details
  const handleViewCourtDetails = (courtId) => {
    navigate(`/courts/${courtId}`);
  };

  // Handle booking navigation
  const handleBookNow = (courtId) => {
    navigate(`/book-court/${courtId}`);
  };

  // Preview image
  const handlePreview = (imgUrl) => {
    setPreviewImage(imgUrl);
    setPreviewVisible(true);
  };

  // Return to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Court status badge
  const getCourtStatusBadge = (status) => {
    let statusProps = {
      status: 'default',
      text: 'Unknown'
    };
    
    switch (status) {
      case 0:
        statusProps = { status: 'success', text: 'Available' };
        break;
      case 1:
        statusProps = { status: 'warning', text: 'Busy' };
        break;
      case 2:
        statusProps = { status: 'error', text: 'Maintenance' };
        break;
      default:
        break;
    }
    
    return <Badge status={statusProps.status} text={statusProps.text} />;
  };

  // Format court type
  const formatCourtType = (type) => {
    switch (type) {
      case 1:
        return 'Indoor';
      case 2:
        return 'Outdoor';
      case 3:
        return 'Hybrid';
      default:
        return 'Unknown';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>Loading sport center details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 16px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={handleGoBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // Empty state
  if (!sportCenter) {
    return (
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 16px', textAlign: 'center' }}>
        <Empty
          description="No sport center found with the provided ID"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/sport-centers')}>
            View All Sport Centers
          </Button>
        </Empty>
      </div>
    );
  }

  // Main gallery images
  const galleryImages = sportCenter.imageUrl || [];
  
  // Default image if no images are provided
  const defaultImage = 'https://source.unsplash.com/random?sports-center';

  // Format the complete address
  const completeAddress = formatAddress(sportCenter);

  return (
    <Layout className="sport-center-detail-layout" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '0', overflow: 'hidden' }}>
        {/* Hero Section with Image and Basic Info */}
        <div className="hero-section" style={{ 
          height: '400px', 
          position: 'relative', 
          backgroundImage: `url(${galleryImages[0] || defaultImage})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
          }}></div>

          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            padding: '24px',
            color: 'white'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              style={{ 
                marginBottom: 16, 
                color: 'white', 
                background: 'rgba(0,0,0,0.3)',
                border: 'none'
              }}
            >
              Back
            </Button>

            <Title level={2} style={{ color: 'white', margin: 0 }}>
              {sportCenter.name}
            </Title>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {completeAddress || sportCenter.address || 'Address not available'}
              </Text>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
              <Rate 
                disabled 
                defaultValue={sportCenter.rating || 4.5} 
                allowHalf 
                style={{ fontSize: 16, marginRight: 8 }}
              />
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                ({sportCenter.reviewCount || 23} reviews)
              </Text>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          {/* Breadcrumb navigation */}
          <Breadcrumb style={{ marginBottom: 24 }}>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/sport-centers">Sport Centers</Breadcrumb.Item>
            <Breadcrumb.Item>{sportCenter.name}</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={[24, 24]}>
            {/* Left Column - Main Content */}
            <Col xs={24} lg={16}>
              {/* About Section */}
              <Card 
                className="card-hover-effect" 
                style={{ marginBottom: 24, borderRadius: 8 }}
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    About This Venue
                  </Title>
                }
              >
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                  {sportCenter.description || 'This sports center offers top-quality facilities for various sports activities. Located in a convenient area, it provides a great environment for both casual players and serious athletes.'}
                </Paragraph>
                
                <Divider />
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <EnvironmentOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                      <div>
                        <Text type="secondary">Address</Text>
                        <div>{completeAddress || sportCenter.address || 'Address not available'}</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                      <div>
                        <Text type="secondary">Contact</Text>
                        <div>{sportCenter.phoneNumber || 'Contact information not available'}</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <Divider />
                
                <Title level={5}>Sports Available</Title>
                <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(sportCenter.sportNames?.length > 0 ? sportCenter.sportNames : Object.keys(courtsBySport)).map((sport, index) => (
                    <SportIcon key={index} sportName={sport} />
                  ))}
                </div>
                
                {galleryImages.length > 0 && (
                  <>
                    <Title level={5} style={{ marginTop: 24 }}>Gallery</Title>
                    <div style={{ marginBottom: 16 }}>
                      <Carousel autoplay effect="fade" style={{ borderRadius: 8, overflow: 'hidden' }}>
                        {galleryImages.map((image, index) => (
                          <div key={index}>
                            <div style={{ height: 300, background: '#f5f5f5' }}>
                              <img
                                src={image}
                                alt={`${sportCenter.name} - ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          </div>
                        ))}
                      </Carousel>
                    </div>
                    
                    <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                      {galleryImages.slice(0, 4).map((image, index) => (
                        <Col span={6} key={index}>
                          <div 
                            style={{ 
                              height: 80, 
                              cursor: 'pointer',
                              borderRadius: 4,
                              overflow: 'hidden'
                            }}
                            onClick={() => handlePreview(image)}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                transition: 'transform 0.3s',
                              }}
                              className="thumbnail-hover"
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </Card>

              {/* Amenities Section */}
              <Card 
                className="card-hover-effect" 
                style={{ marginBottom: 24, borderRadius: 8 }}
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    Venue Amenities
                  </Title>
                }
              >
                <Row gutter={[16, 16]}>
                  {amenities.map((amenity, index) => (
                    <Col xs={12} sm={6} key={index}>
                      <Card 
                        style={{ textAlign: 'center', height: '100%' }}
                        bodyStyle={{ padding: 16 }}
                        className="amenity-card"
                      >
                        <Avatar
                          size={48}
                          style={{ backgroundColor: '#f0f5ff', color: '#1890ff', marginBottom: 12 }}
                          icon={amenity.icon}
                        />
                        <div>{amenity.name}</div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>

{/* Modified Available Courts Section - Moved up in the layout */}
<Card 
  className="card-hover-effect" 
  style={{ marginBottom: 24, borderRadius: 8 }}
  title={
    <Title level={4} style={{ margin: 0 }}>
      <AppstoreOutlined style={{ marginRight: 8 }} />
      Available Courts
    </Title>
  }
>
  {courts.length === 0 ? (
    <Empty 
      description="No courts available for this sport center"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  ) : (
    <>
      <Tabs
        defaultActiveKey="all"
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 16 }}
      >
        <TabPane tab={`All Courts (${courts.length})`} key="all" />
        {Object.entries(courtsBySport).map(([sport, sportCourts]) => (
          <TabPane 
            tab={<span><SportIcon sportName={sport} /> {sport} ({sportCourts.length})</span>} 
            key={sport} 
          />
        ))}
      </Tabs>

      <List
        itemLayout="horizontal"
        dataSource={activeTab === 'all' ? courts : courtsBySport[activeTab] || []}
        renderItem={court => (
          <List.Item
            key={court.id}
            actions={[
              <Button 
                type="primary" 
                size="small" 
                disabled={court.status !== 0}
                onClick={() => handleBookNow(court.id)}
                style={{ width: 90 }}
              >
                Book Now
              </Button>,
              <Button 
                type="default" 
                size="small" 
                onClick={() => handleViewCourtDetails(court.id)}
                style={{ width: 90 }}
              >
                Details
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  size={48} 
                  style={{ 
                    backgroundColor: court.status === 0 ? '#f6ffed' : 
                                    court.status === 1 ? '#fffbe6' : '#fff1f0',
                    color: court.status === 0 ? '#52c41a' : 
                           court.status === 1 ? '#faad14' : '#f5222d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {court.sportName?.charAt(0).toUpperCase() || 'C'}
                </Avatar>
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>{court.courtName}</Text>
                    <span style={{ marginLeft: 8 }}>
                      {getCourtStatusBadge(court.status)}
                    </span>
                  </div>
                  <Text strong style={{ color: '#1890ff' }}>${court.pricePerHour || 45}/hr</Text>
                </div>
              }
              description={
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <SportIcon sportName={court.sportName} />
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {formatCourtType(court.courtType)}
                    </Tag>
                    <Tag color="purple" style={{ marginLeft: 8 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {court.slotDuration || 60} min
                    </Tag>
                  </div>
                  <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                    {court.description || 'Professional court with excellent facilities and equipment.'}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
        pagination={{
          onChange: page => {
            window.scrollTo(0, 0);
          },
          pageSize: 5,
          hideOnSinglePage: true,
          size: "small"
        }}
      />
    </>
  )}
</Card>
            </Col>

            {/* Right Column - Sidebar */}
            <Col xs={24} lg={8}>
              {/* Opening Hours Card */}
              <Card 
                className="card-hover-effect" 
                style={{ marginBottom: 24, borderRadius: 8 }}
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    Opening Hours
                  </Title>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { day: 'Weekdays', hours: '6:00 AM - 10:00 PM' },
                    { day: 'Weekends', hours: '8:00 AM - 8:00 PM' },
                    { day: 'Holidays', hours: '10:00 AM - 6:00 PM' },
                  ]}
                  renderItem={item => (
                    <List.Item style={{ padding: '8px 0' }}>
                      <List.Item.Meta
                        title={item.day}
                        description={item.hours}
                      />
                    </List.Item>
                  )}
                />
              </Card>

              {/* Quick Info Card */}
              <Card 
                className="card-hover-effect" 
                style={{ marginBottom: 24, borderRadius: 8, background: '#f0f5ff' }}
                bordered={false}
              >
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="Courts"
                      value={courts.length}
                      prefix={<AppstoreOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Rating"
                      value={sportCenter.rating || 4.5}
                      precision={1}
                      prefix={<StarOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Sports"
                      value={Object.keys(courtsBySport).length}
                      prefix={<TeamOutlined />}
                    />
                  </Col>
                </Row>
                <Divider style={{ margin: '16px 0' }} />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<CalendarOutlined />} 
                    size="large" 
                    block
                    onClick={() => courts.length > 0 ? handleBookNow(courts[0].id) : null}
                    disabled={courts.length === 0}
                  >
                    Book a Court
                  </Button>
                </Space>
              </Card>

              {/* Location Map Card - Added new card */}
              <Card 
                className="card-hover-effect" 
                style={{ marginBottom: 24, borderRadius: 8 }}
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    Location
                  </Title>
                }
              >
                <div style={{ 
                  height: 200, 
                  background: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginBottom: 16
                }}>
                  {sportCenter.latitude && sportCenter.longitude ? (
                    <iframe 
                      title="Sport Center Location"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src={`https://maps.google.com/maps?q=${sportCenter.latitude},${sportCenter.longitude}&z=15&output=embed`}
                      style={{ borderRadius: 8 }}
                    ></iframe>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <EnvironmentOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                      <div>Map location not available</div>
                    </div>
                  )}
                </div>
                
                <Paragraph>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {completeAddress || sportCenter.address || 'Address not available'}
                </Paragraph>
                
                <Button 
                  type="default" 
                  block
                  icon={<EnvironmentOutlined />}
                  onClick={() => {
                    if (sportCenter.latitude && sportCenter.longitude) {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${sportCenter.latitude},${sportCenter.longitude}`, '_blank');
                    } else if (completeAddress) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(completeAddress)}`, '_blank');
                    }
                  }}
                  disabled={!sportCenter.latitude && !sportCenter.longitude && !completeAddress}
                >
                  Get Directions
                </Button>
              </Card>
            </Col>
          </Row>

          
        </div>
      </Content>

      {/* Image Preview */}
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: vis => setPreviewVisible(vis),
            current: galleryImages.indexOf(previewImage),
          }}
        >
          {galleryImages.map((image, index) => (
            <Image key={index} src={image} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .card-hover-effect {
          transition: all 0.3s;
        }
        .card-hover-effect:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }
        .court-card {
          height: 100%;
          transition: all 0.3s;
        }
        .court-card:hover {
          transform: translateY(-6px);
        }
        .thumbnail-hover:hover {
          transform: scale(1.05);
        }
        .amenity-card {
          transition: all 0.3s;
        }
        .amenity-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Layout>
  );
};

export default SportCenterDetailView;
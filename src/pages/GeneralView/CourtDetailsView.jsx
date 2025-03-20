import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, Typography, Button, Tag, Divider, Row, Col, Skeleton, Tabs, 
  Rate, Image, Avatar, Carousel, DatePicker, Badge, Tooltip, List, message, Empty
} from "antd";
import { 
  EnvironmentOutlined, ClockCircleOutlined, DollarOutlined,
  CalendarOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ShopOutlined, PhoneOutlined, UserOutlined, CloseCircleOutlined,
  StarOutlined, LikeOutlined, TeamOutlined, ArrowLeftOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { format } from "date-fns";
import placeholderImage from "@/assets/image_error.png";
import { Client } from "@/API/CourtApi";

// Import any necessary images or assets
const dummyCourtImage1 ="https://images.unsplash.com/photo-1595435934819-5704dc335d9c";
const dummyCourtImage2 ="https://images.unsplash.com/photo-1622279488067-a1cd192d9462";
const dummyCourtImage3 ="https://images.unsplash.com/photo-1614715855229-a531c28d1e7e";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const SportCenterDetailView = () => {
  // Get sport center ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [sportCenter, setSportCenter] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [promotions, setPromotions] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState("details");

  // Create an instance of the API client
  const apiClient = new Client();

  // Fetch sport center details on component mount
  useEffect(() => {
    const fetchSportCenterDetails = async () => {
      try {
        setLoading(true);
        
        // Get sport center details with the id from URL params
        const response = await apiClient.getSportCenterById(id);
        
        if (!response) {
          console.error("Sport center not found:", response);
          message.error("Could not find sport center details");
          return;
        }
        
        setSportCenter(response);
        
        // Get all courts of this sport center using the proper API method
        try {
          const courtsResponse = await apiClient.getAllCourtsOfSportCenter(id);
          
          if (courtsResponse && courtsResponse.courts && courtsResponse.courts.length > 0) {
            setCourts(courtsResponse.courts);
            setSelectedCourt(courtsResponse.courts[0]); // Select the first court by default
            
            // When a court is selected, fetch court details for more comprehensive information
            try {
              const courtDetailsResponse = await apiClient.getCourtDetails(courtsResponse.courts[0].id);
              if (courtDetailsResponse && courtDetailsResponse.court) {
                // Merge the detailed court information with the selected court
                setSelectedCourt({...courtsResponse.courts[0], ...courtDetailsResponse.court});
              }
            } catch (courtDetailsError) {
              console.error("Error fetching detailed court information:", courtDetailsError);
            }
            
            // Get promotions for the first court
            try {
              const promotionsResponse = await apiClient.getCourtPromotions(courtsResponse.courts[0].id);
              setPromotions(promotionsResponse || []);
            } catch (promotionError) {
              console.error("Error fetching court promotions:", promotionError);
              setPromotions([]);
            }
            
            // Get availability for the first court
            try {
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + 7);
              
              const availabilityResponse = await apiClient.getCourtAvailability(
                courtsResponse.courts[0].id, 
                startDate, 
                endDate
              );
              setAvailabilityData(availabilityResponse?.schedule || []);
            } catch (availabilityError) {
              console.error("Error fetching court availability:", availabilityError);
              setAvailabilityData([]);
            }
          } else {
            setCourts([]);
            setSelectedCourt(null);
          }
        } catch (courtsError) {
          console.error("Error fetching courts for sport center:", courtsError);
          message.error("Failed to load courts for this sport center");
          setCourts([]);
          setSelectedCourt(null);
        }
      } catch (error) {
        console.error("Error fetching sport center details:", error);
        message.error("Failed to load sport center details");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSportCenterDetails();
  }, [id]);

  // Handle court selection
  const handleCourtSelection = async (court) => {
    setSelectedCourt(court);
    
    try {
      // Get detailed court information when selecting a court
      const courtDetailsResponse = await apiClient.getCourtDetails(court.id);
      if (courtDetailsResponse && courtDetailsResponse.court) {
        // Merge the detailed court information with the selected court
        setSelectedCourt({...court, ...courtDetailsResponse.court});
      }
      
      // Get promotions for selected court
      const promotionsResponse = await apiClient.getCourtPromotions(court.id);
      setPromotions(promotionsResponse || []);
      
      // Get availability for selected court
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      const availabilityResponse = await apiClient.getCourtAvailability(
        court.id, 
        startDate, 
        endDate
      );
      setAvailabilityData(availabilityResponse?.schedule || []);
    } catch (error) {
      console.error("Error fetching court details:", error);
    }
  };

  // Helper function to get time availability status
  const getTimeSlotStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'success';
      case 'booked':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Go back handler
  const handleGoBack = () => {
    navigate(-1);
  };

  // Book now handler
  const handleBookNow = () => {
    if (selectedCourt) {
      navigate(`/book-court/${selectedCourt.id}`);
    } else {
      message.warning("Please select a court to book");
    }
  };

  // Handler for date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Fallback images if API doesn't provide them
  const dummyImages = [dummyCourtImage1, dummyCourtImage2, dummyCourtImage3];

  // Format court facilities for display
  const formatFacilities = (facilities) => {
    return facilities?.map(facility => ({
      name: facility.name,
      description: facility.description
    })) || [];
  };

  // If still loading, show skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack} 
            className="mr-4" 
            type="text"
          />
          <Skeleton.Input active size="large" style={{ width: 300 }} />
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card>
              <Skeleton.Image active style={{ width: '100%', height: 400 }} />
              <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
              <div className="mt-6">
                <Skeleton.Button active size="large" style={{ width: '100%' }} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // If sport center doesn't exist
  if (!sportCenter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <InfoCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
        <Typography.Title level={3} className="mt-4">Sport Center Not Found</Typography.Title>
        <Typography.Paragraph>
          We couldn't find the sport center you're looking for.
        </Typography.Paragraph>
        <Button type="primary" onClick={handleGoBack}>
          Return to Sport Centers
        </Button>
      </div>
    );
  }

  // Find current day's availability for selected court
  const selectedDayAvailability = availabilityData.find(day => 
    new Date(day.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with sport center name and back button */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleGoBack} 
                className="mr-4" 
                type="text"
              />
              <div>
                <Title level={4} className="mb-0">{sportCenter.name}</Title>
                <Text type="secondary">
                  <EnvironmentOutlined className="mr-1" />
                  {sportCenter.address || `${sportCenter.addressLine}, ${sportCenter.city}`}
                </Text>
              </div>
            </div>
            <div>
              <Rate disabled defaultValue={sportCenter.rating || 4.5} allowHalf className="text-sm" />
              <div className="text-gray-500 text-xs text-right">
                {sportCenter.reviewCount || 23} reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Court selection section */}
        <div className="mb-8">
          <Title level={4} className="mb-4">Available Courts</Title>
          
          {courts.length === 0 ? (
            <Empty description="No courts available at this sport center" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court) => (
                <Card 
                  key={court.id} 
                  hoverable 
                  className={`cursor-pointer ${selectedCourt?.id === court.id ? 'border-blue-500 shadow-md' : ''}`}
                  onClick={() => handleCourtSelection(court)}
                  cover={
                    <div className="h-48 overflow-hidden">
                      <img
                        alt={court.courtName}
                        src={court.imageUrls?.[0] || dummyImages[0]}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = placeholderImage }}
                      />
                    </div>
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Title level={5} className="mb-1">{court.courtName}</Title>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Tag color="blue">
                          {court.courtType === 1 ? "Indoor" : court.courtType === 2 ? "Outdoor" : "Hybrid"}
                        </Tag>
                        <Tag color="green">{court.sportName}</Tag>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">${court.pricePerHour || 45}/hour</div>
                      <Text type="secondary" className="text-xs">
                        {court.slotDuration} min per slot
                      </Text>
                    </div>
                  </div>
                  
                  {selectedCourt?.id === court.id && (
                    <div className="mt-2 text-blue-600 text-sm font-medium flex items-center justify-center">
                      <CheckCircleOutlined className="mr-1" /> Selected
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {selectedCourt && (
          <Row gutter={[24, 24]}>
            {/* Court details - left column */}
            <Col xs={24} lg={16}>
              <Card className="mb-6 overflow-hidden">
                {/* Court photos carousel */}
                <Carousel autoplay className="mb-6 rounded-lg overflow-hidden">
                  {(selectedCourt.imageUrls?.length > 0 ? selectedCourt.imageUrls : dummyImages).map((image, index) => (
                    <div key={index} className="h-80">
                      <img 
                        src={image || placeholderImage} 
                        alt={`${selectedCourt.courtName} - ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = placeholderImage }}
                      />
                    </div>
                  ))}
                </Carousel>

                {/* Tabs for different sections */}
                <Tabs 
                  activeKey={activeTabKey} 
                  onChange={setActiveTabKey}
                  className="mt-4"
                >
                  <TabPane tab="Court Details" key="details">
                    <div className="py-4">
                      <Title level={5}>About this court</Title>
                      <Paragraph className="text-gray-700">
                        {selectedCourt.description || "Premium tennis court available for bookings. Enjoy a professional playing experience with top-grade facilities."}
                      </Paragraph>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <Tag color="blue">
                          {selectedCourt.courtType === 1 ? "Indoor" : selectedCourt.courtType === 2 ? "Outdoor" : "Hybrid"}
                        </Tag>
                        <Tag color="green">{selectedCourt.sportName}</Tag>
                        <Tag color="orange">{selectedCourt.slotDuration} minutes/slot</Tag>
                        <Tag color="purple">
                          {selectedCourt.status === 0 ? "Available" : selectedCourt.status === 1 ? "Busy" : "Maintenance"}
                        </Tag>
                      </div>

                      <Divider />

                      <Title level={5}>Facilities</Title>
                      <List
                        grid={{
                          gutter: 16,
                          xs: 1,
                          sm: 2,
                          md: 2,
                          lg: 3,
                          xl: 3,
                          xxl: 3,
                        }}
                        dataSource={formatFacilities(selectedCourt.facilities)}
                        renderItem={item => (
                          <List.Item>
                            <Card size="small" className="h-full">
                              <div className="flex items-start">
                                <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                                <div>
                                  <Text strong>{item.name}</Text>
                                  <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                              </div>
                            </Card>
                          </List.Item>
                        )}
                      />

                      <Divider />

                      <Title level={5}>Cancellation Policy</Title>
                      <Paragraph>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            Cancellations made within <Text strong>{selectedCourt.cancellationWindowHours || 24} hours</Text> of 
                            your booking will receive a <Text strong>{selectedCourt.refundPercentage || 50}%</Text> refund.
                          </li>
                          <li>
                            Booking requires a minimum deposit of <Text strong>{selectedCourt.minDepositPercentage || 20}%</Text> of the total amount.
                          </li>
                        </ul>
                      </Paragraph>
                    </div>
                  </TabPane>

                  <TabPane tab="Venue" key="venue">
                    <div className="py-4">
                      <div className="flex items-start mb-6">
                        <Avatar size={64} icon={<ShopOutlined />} shape="square" src={sportCenter.avatar} />
                        <div className="ml-4">
                          <Title level={5} className="mb-1">{sportCenter.name}</Title>
                          <div className="text-gray-500 flex items-center mb-1">
                            <EnvironmentOutlined className="mr-1" />
                            <span>{sportCenter.address || `${sportCenter.addressLine}, ${sportCenter.city}`}</span>
                          </div>
                          <div className="text-gray-500 flex items-center">
                            <PhoneOutlined className="mr-1" />
                            <span>{sportCenter.phoneNumber || "Contact venue for details"}</span>
                          </div>
                        </div>
                      </div>

                      <Paragraph className="mb-6">
                        {sportCenter.description || `${sportCenter.name} offers professional sports facilities and services for players of all levels.`}
                      </Paragraph>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                        <Title level={5} className="text-blue-700 mb-2">Venue Amenities</Title>
                        <Row gutter={[16, 16]}>
                          {sportCenter.amenities?.map((amenity, index) => (
                            <Col span={12} key={index}>
                              <div className="flex items-center">
                                <CheckCircleOutlined className="text-blue-500 mr-2" />
                                <span>{amenity.name}</span>
                              </div>
                            </Col>
                          )) || (
                            <>
                              <Col span={12}>
                                <div className="flex items-center">
                                  <CheckCircleOutlined className="text-blue-500 mr-2" />
                                  <span>Changing Rooms</span>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="flex items-center">
                                  <CheckCircleOutlined className="text-blue-500 mr-2" />
                                  <span>Parking Available</span>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="flex items-center">
                                  <CheckCircleOutlined className="text-blue-500 mr-2" />
                                  <span>Equipment Rental</span>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="flex items-center">
                                  <CheckCircleOutlined className="text-blue-500 mr-2" />
                                  <span>Refreshments</span>
                                </div>
                              </Col>
                            </>
                          )}
                        </Row>
                      </div>
                      
                      <div className="flex items-center">
                        <AppstoreOutlined className="text-blue-500 mr-2" />
                        <Text strong>All Courts: </Text>
                        <Text className="ml-1">{courts.length} courts available at this venue</Text>
                      </div>
                    </div>
                  </TabPane>

                  <TabPane tab="Reviews" key="reviews">
                    <div className="py-4">
                      <div className="flex items-center mb-6">
                        <div className="mr-6 text-center">
                          <div className="text-3xl font-bold text-blue-500">
                            {selectedCourt.rating || sportCenter.rating || 4.7}
                          </div>
                          <Rate disabled defaultValue={selectedCourt.rating || sportCenter.rating || 4.7} allowHalf />
                          <div className="text-gray-500 text-sm">
                            Based on {selectedCourt.reviewCount || sportCenter.reviewCount || 23} reviews
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <div className="w-20 text-sm">5 stars</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <div className="text-sm text-gray-500">75%</div>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="w-20 text-sm">4 stars</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                            <div className="text-sm text-gray-500">20%</div>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="w-20 text-sm">3 stars</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '5%' }}></div>
                            </div>
                            <div className="text-sm text-gray-500">5%</div>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="w-20 text-sm">2 stars</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                            <div className="text-sm text-gray-500">0%</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-20 text-sm">1 star</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                            <div className="text-sm text-gray-500">0%</div>
                          </div>
                        </div>
                      </div>

                      <Divider />

                      {/* Sample reviews */}
                      <List
                        itemLayout="horizontal"
                        dataSource={[
                          {
                            id: 1,
                            author: "Michael L.",
                            avatar: <UserOutlined />,
                            rating: 5,
                            date: "March 10, 2025",
                            content: "Excellent court with perfect playing conditions. The surface was well-maintained and staff were friendly.",
                          },
                          {
                            id: 2,
                            author: "Sarah J.",
                            avatar: <UserOutlined />,
                            rating: 4,
                            date: "February 28, 2025",
                            content: "Great experience overall. Court lighting is excellent, making evening play enjoyable.",
                          },
                          {
                            id: 3,
                            author: "David R.",
                            avatar: <UserOutlined />,
                            rating: 5,
                            date: "February 15, 2025",
                            content: "One of the best courts I've played on. The facilities are top-notch and the booking process was seamless.",
                          },
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={item.avatar} />}
                              title={
                                <div className="flex justify-between">
                                  <span>{item.author}</span>
                                  <span className="text-gray-500 text-sm">{item.date}</span>
                                </div>
                              }
                              description={
                                <div>
                                  <Rate disabled defaultValue={item.rating} className="text-sm mb-2" />
                                  <p>{item.content}</p>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            
            {/* Booking sidebar - right column */}
            <Col xs={24} lg={8}>
              <div className="sticky top-6">
                <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-4">
                    <Title level={4} className="mb-1">Book this court</Title>
                    <Text type="secondary">Select a date to check availability</Text>
                  </div>

                  <div className="mb-6">
                    <DatePicker 
                      className="w-full" 
                      size="large"
                      value={selectedDate}
                      onChange={handleDateChange}
                      disabledDate={(current) => {
                        // Can't select days before today
                        return current && current < new Date().setHours(0, 0, 0, 0);
                      }}
                    />
                  </div>

                  {selectedDayAvailability ? (
                    <div className="mb-6">
                      <Title level={5} className="mb-3">
                        Available Times on {format(new Date(selectedDayAvailability.date), "EEEE, MMMM d")}
                      </Title>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedDayAvailability.timeSlots.map((slot, index) => (
                          <Tooltip 
                            key={index}
                            title={slot.status === 'available' 
                              ? `$${slot.price}` 
                              : `${slot.status} ${slot.bookedBy ? `by ${slot.bookedBy}` : ''}`
                            }
                          >
                            <Button 
                              type={slot.status === 'available' ? "default" : "text"}
                              disabled={slot.status !== 'available'}
                              className="relative h-14 flex flex-col items-center justify-center"
                            >
                              <Badge 
                                status={getTimeSlotStatusColor(slot.status)} 
                                className="absolute top-2 right-2"
                              />
                              <span className="font-medium">{slot.startTime}</span>
                              <span className="text-xs">to {slot.endTime}</span>
                              {slot.status === 'available' && (
                                <span className="text-xs text-blue-600 font-semibold">${slot.price}</span>
                              )}
                            </Button>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 mb-6 bg-gray-50 rounded-lg">
                      <InfoCircleOutlined className="text-gray-400 text-4xl mb-3" />
                      <Paragraph className="text-gray-500">
                        No time slots available for this date.
                        <br />Please select another date or contact venue.
                      </Paragraph>
                    </div>
                  )}

                  <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <Text><ClockCircleOutlined className="mr-2 text-blue-500" />Duration</Text>
                      <Text strong>{selectedCourt.slotDuration || "60"} minutes</Text>
                    </div>
                    
                    <div className="flex justify-between">
                      <Text><DollarOutlined className="mr-2 text-green-500" />Price per slot</Text>
                      <Text strong className="text-green-600">
                        ${(selectedDayAvailability?.timeSlots[0]?.price || selectedCourt.pricePerHour || 45).toFixed(2)}
                      </Text>
                    </div>
                    
                    <div className="flex justify-between">
                      <Text><TeamOutlined className="mr-2 text-purple-500" />Court type</Text>
                      <Text strong>
                        {selectedCourt.courtType === 1 ? "Indoor" : selectedCourt.courtType === 2 ? "Outdoor" : "Hybrid"}
                      </Text>
                    </div>
                  </div>

                  {promotions.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6">
                      <div className="flex items-center">
                        <StarOutlined className="text-orange-500 mr-2" />
                        <Title level={5} className="mb-0 text-orange-700">Active Promotions</Title>
                      </div>
                      <Divider className="my-3" />
                      {promotions.map((promo, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="font-medium">{promo.description}</div>
                          <div className="text-sm text-orange-600">
                            {promo.discountType === 'Percentage' 
                              ? `${promo.discountValue}% off` 
                              : `$${promo.discountValue} off`
                            }
                          </div>
                          <div className="text-xs text-gray-500">
                            Valid until {format(new Date(promo.validTo), "MMM d, yyyy")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    type="primary" 
                    size="large" 
                    block 
                    onClick={handleBookNow}
                    className="bg-blue-600 h-12 text-base font-medium hover:bg-blue-700"
                    icon={<CalendarOutlined />}
                  >
                    Book Now
                  </Button>
                </Card>

                <Card className="shadow-sm">
                  <Title level={5} className="mb-4">Court policies</Title>
                  <div className="space-y-4">
                    <div className="flex items-start p-3 bg-red-50 rounded-lg">
                      <CloseCircleOutlined className="text-red-500 mt-1 mr-3 text-lg" />
                      <div>
                        <Text strong>Cancellation</Text>
                        <div className="text-sm text-gray-600">
                          {selectedCourt.cancellationWindowHours || 24} hours notice required for refunds
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <InfoCircleOutlined className="text-blue-500 mt-1 mr-3 text-lg" />
                      <div>
                        <Text strong>Check-in</Text>
                        <div className="text-sm text-gray-600">
                          Please arrive 15 minutes before your booked time
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-green-50 rounded-lg">
                      <CalendarOutlined className="text-green-500 mt-1 mr-3 text-lg" />
                      <div>
                        <Text strong>Booking window</Text>
                        <div className="text-sm text-gray-600">
                          Book up to 30 days in advance
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default SportCenterDetailView;
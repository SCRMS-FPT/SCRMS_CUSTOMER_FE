import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  TimePicker,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  message,
  Tabs,
  Tag,
  Spin,
  Space,
  Switch,
  Collapse,
} from "antd";
import {
  UploadOutlined,
  LeftOutlined,
  PlusOutlined,
  SnippetsOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Client } from "@/API/CourtApi";
import { Alert } from "@mui/material";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Default operating hours format
const defaultSchedules = [
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "07:00",
    endTime: "17:00",
    priceSlot: 150000,
    name: "Weekday Regular Hours",
  },
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "17:00",
    endTime: "22:00",
    priceSlot: 200000,
    name: "Weekday Evening Hours",
  },
  {
    days: [6, 7], // Saturday and Sunday (7 is Sunday)
    startTime: "08:00",
    endTime: "22:00",
    priceSlot: 250000,
    name: "Weekend Hours",
  },
];

const dayOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

const client = new Client();

const CourtOwnerCourtCreateView = () => {
  const { venueId, courtId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sports, setSports] = useState([]);
  const [venues, setVenues] = useState([]);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [schedules, setSchedules] = useState(defaultSchedules);

  // Fetch initial data: sports list and venue details if venueId is provided
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Get sports list
        const sportsResponse = await client.getSports();
        setSports(sportsResponse.sports || []);

        // If venue ID is provided, fetch that venue's details
        if (venueId) {
          const venueData = await client.getSportCenterById(venueId);
          setCurrentVenue(venueData);
          form.setFieldsValue({
            sportCenterId: venueId,
            venue_name: venueData.name,
          });
        } else {
          // Otherwise fetch all venues owned by the current user
          const venuesResponse = await client.getOwnedSportCenters(1, 100);
          setVenues(venuesResponse.sportCenters?.data || []);
        }

        // If we're in edit mode (courtId exists), fetch court details
        if (courtId) {
          setIsEditMode(true);
          const courtResponse = await client.getCourtDetails(courtId);
          const court = courtResponse.court;

          // Extract schedules from the court data
          if (court.courtSchedules && court.courtSchedules.length > 0) {
            setSchedules(
              court.courtSchedules.map((schedule, index) => ({
                id: schedule.id,
                days: schedule.dayOfWeek || [],
                startTime: schedule.startTime?.substring(0, 5) || "07:00",
                endTime: schedule.endTime?.substring(0, 5) || "22:00",
                priceSlot: schedule.priceSlot || 0,
                name: `Schedule ${index + 1}`,
              }))
            );
          }

          // Map API response to form fields
          const formData = {
            name: court.courtName,
            sport_type: court.sportId,
            sportCenterId: court.sportCenterId,
            description: court.description,
            slotDuration: court.slotDuration,
            courtType: court.courtType,
            minDepositPercentage: court.minDepositPercentage,
            cancellationWindowHours: court.cancellationWindowHours,
            refundPercentage: court.refundPercentage,
          };

          // Map facilities to form structure
          if (court.facilities && court.facilities.length > 0) {
            const features = {};
            court.facilities.forEach((facility) => {
              if (facility.name === "surface_type") {
                features.surface_type = facility.description;
              } else {
                features[facility.name] = true;
              }
            });
            formData.features = features;
          }

          form.setFieldsValue(formData);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [venueId, courtId, form]);

  const addSchedule = () => {
    const newSchedule = {
      days: [1, 2, 3, 4, 5],
      startTime: "08:00",
      endTime: "17:00",
      priceSlot: 150000,
      name: `Schedule ${schedules.length + 1}`,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const removeSchedule = (index) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
  };

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Transform form values to match the API request structure
      const facilities = [];
      if (values.features) {
        // Convert feature checkboxes to facility objects
        Object.entries(values.features)
          .filter(([key, value]) => value === true)
          .forEach(([key]) => {
            facilities.push({
              name: key,
              description: `Has ${key}`,
            });
          });
      }

      // Handle specific feature types
      if (values.features?.surface_type) {
        facilities.push({
          name: "surface_type",
          description: values.features.surface_type,
        });
      }

      // Add seating capacity if provided
      if (values.seating_capacity) {
        facilities.push({
          name: "seating_capacity",
          description: `${values.seating_capacity} seats`,
        });
      }

      // Prepare court schedules from the schedules state
      const courtSchedules = schedules.map((schedule) => ({
        dayOfWeek: schedule.days.map((day) => (day === 0 ? 7 : day)), // Replace 0 with 7
        startTime: `${schedule.startTime}:00`, // Add seconds to match API format
        endTime: `${schedule.endTime}:00`, // Add seconds to match API format
        priceSlot: schedule.priceSlot,
      }));

      // Create the request payload
      const requestData = {
        court: {
          courtName: values.name,
          sportId: values.sport_type,
          sportCenterId: venueId || values.venue_id,
          description: values.description || "",
          facilities: facilities,
          slotDuration: "01:00:00", // Format with seconds
          minDepositPercentage: values.minDepositPercentage || 0,
          courtType: values.courtType || 1,
          courtSchedules: courtSchedules,
          cancellationWindowHours: values.cancellationWindowHours || 24,
          refundPercentage: values.refundPercentage || 100,
        },
      };

      console.log("Sending court data to API:", requestData);

      // Call the API to create the court
      const response = await client.createCourt(requestData);
      console.log("API response:", response);

      message.success(
        isEditMode
          ? "Court updated successfully!"
          : "Court created successfully!"
      );

      // Navigate back to the venue details page or courts list
      if (venueId) {
        navigate(`/court-owner/venues/${venueId}`);
      } else {
        navigate("/court-owner/courts");
      }
    } catch (error) {
      console.error("Error creating court:", error);
      message.error(
        `Failed to ${isEditMode ? "update" : "create"} court: ${
          error.message || "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        courtType: 1,
        minDepositPercentage: 30,
        slotDuration: "01:00:00",
        cancellationWindowHours: 24,
        refundPercentage: 100,
      }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>
              {isEditMode ? "Edit Court" : "Create New Court"}
            </Title>
            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={() =>
                venueId
                  ? navigate(`/court-owner/venues/${venueId}`)
                  : navigate("/court-owner/courts")
              }
            >
              Go Back
            </Button>
          </div>
        }
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "General Info",
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Court Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter court name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter court name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="sport_type"
                        label="Sport Type"
                        rules={[
                          { required: true, message: "Please select a sport" },
                        ]}
                      >
                        <Select placeholder="Select a sport">
                          {sports.map((sport) => (
                            <Option key={sport.id} value={sport.id}>
                              {sport.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {venueId ? (
                    <Form.Item label="Venue">
                      <Input value={currentVenue?.name} disabled />
                      <Form.Item name="sportCenterId" hidden>
                        <Input />
                      </Form.Item>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="venue_id"
                      label="Venue"
                      rules={[
                        { required: true, message: "Please select a venue" },
                      ]}
                    >
                      <Select placeholder="Select a venue">
                        {venues.map((venue) => (
                          <Option key={venue.id} value={venue.id}>
                            {venue.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item name="description" label="Description">
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter court description"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="courtType"
                        label="Court Type"
                        rules={[
                          {
                            required: true,
                            message: "Please select court type",
                          },
                        ]}
                      >
                        <Select placeholder="Select court type">
                          <Option value={1}>Indoor</Option>
                          <Option value={2}>Outdoor</Option>
                          <Option value={3}>Mixed</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="minDepositPercentage"
                        label="Minimum Deposit (%)"
                        rules={[
                          {
                            required: true,
                            message: "Please enter minimum deposit",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 100,
                            message: "Percentage must be between 0 and 100",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Enter minimum deposit percentage"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="cancellationWindowHours"
                        label="Cancellation Window (hours)"
                        rules={[
                          {
                            required: true,
                            message: "Please enter cancellation window",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          min={1}
                          placeholder="Hours before booking"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "2",
              label: "Features & Amenities",
              children: (
                <>
                  <Title level={5}>Court Features</Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={["features", "surface_type"]}
                        label="Surface Type"
                      >
                        <Select placeholder="Select a surface type">
                          <Option value="Grass">Grass</Option>
                          <Option value="Clay">Clay</Option>
                          <Option value="Hardcourt">Hardcourt</Option>
                          <Option value="Astroturf">Astroturf</Option>
                          <Option value="Concrete">Concrete</Option>
                          <Option value="Wood">Wood</Option>
                          <Option value="Synthetic">Synthetic</Option>
                          <Option value="N/A">Not Applicable (N/A)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="seating_capacity"
                        label="Seating Capacity"
                      >
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter seating capacity"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Additional Features">
                    <Checkbox.Group>
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "indoor"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Indoor</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "lighting"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Lighting Available</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "has_parking"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Has Parking</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "has_showers"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Has Showers</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "floodlights"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Floodlights</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "scoreboard"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Scoreboard</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "audience_stands"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Audience Stands</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "climate_control"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Climate Control (AC/Heating)</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "water_fountains"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Water Fountains</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "wheelchair_accessible"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Wheelchair Accessible</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </>
              ),
            },
            {
              key: "3",
              label: "Pricing & Schedules",
              children: (
                <>
                  <Title level={5}>Court Schedules</Title>
                  <Text type="secondary" className="mb-4 block">
                    Set up operating hours and pricing for different days and
                    times
                  </Text>

                  <Collapse defaultActiveKey={["0"]} className="mb-4">
                    {schedules.map((schedule, index) => (
                      <Panel
                        header={
                          <div className="flex justify-between items-center">
                            <span>{schedule.name}</span>
                            <Tag color="blue">
                              {schedule.startTime} - {schedule.endTime}
                            </Tag>
                          </div>
                        }
                        key={index}
                        extra={
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSchedule(index);
                            }}
                            size="small"
                          >
                            Remove
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={24} className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {dayOptions.map((day) => (
                                <Tag
                                  key={day.value}
                                  color={
                                    schedule.days.includes(day.value)
                                      ? "blue"
                                      : "default"
                                  }
                                  className="cursor-pointer mb-2"
                                  onClick={() => {
                                    const newDays = schedule.days.includes(
                                      day.value
                                    )
                                      ? schedule.days.filter(
                                          (d) => d !== day.value
                                        )
                                      : [...schedule.days, day.value];
                                    updateSchedule(index, "days", newDays);
                                  }}
                                >
                                  {day.label}
                                </Tag>
                              ))}
                            </div>
                          </Col>
                          <Col span={8}>
                            <div className="mb-2">Start Time</div>
                            <TimePicker
                              value={dayjs(schedule.startTime, "HH:mm")}
                              format="HH:mm"
                              onChange={(time, timeString) =>
                                updateSchedule(index, "startTime", timeString)
                              }
                              className="w-full"
                            />
                          </Col>
                          <Col span={8}>
                            <div className="mb-2">End Time</div>
                            <TimePicker
                              value={dayjs(schedule.endTime, "HH:mm")}
                              format="HH:mm"
                              onChange={(time, timeString) =>
                                updateSchedule(index, "endTime", timeString)
                              }
                              className="w-full"
                            />
                          </Col>
                          <Col span={8}>
                            <div className="mb-2">Price (per hour)</div>
                            <Input
                              type="number"
                              min={0}
                              value={schedule.priceSlot}
                              onChange={(e) =>
                                updateSchedule(
                                  index,
                                  "priceSlot",
                                  Number(e.target.value)
                                )
                              }
                              addonBefore="₫"
                            />
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                  </Collapse>

                  <Button
                    type="dashed"
                    onClick={addSchedule}
                    className="w-full mb-4"
                    icon={<PlusCircleOutlined />}
                  >
                    Add Schedule
                  </Button>

                  <Alert
                    type="info"
                    message="Schedule Tips"
                    description={
                      <ul>
                        <li>
                          Set different prices for peak and off-peak hours
                        </li>
                        <li>
                          Weekend prices are typically higher than weekday
                          prices
                        </li>
                        <li>
                          You can create multiple schedules for the same day
                          with different times and prices
                        </li>
                      </ul>
                    }
                  />
                </>
              ),
            },
            {
              key: "4",
              label: "Rules & Policies",
              children: (
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Title level={5}>
                      <SnippetsOutlined /> Court Rules
                    </Title>
                    <Form.Item
                      name="rules"
                      label="Enter Rules (comma-separated)"
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="E.g., No metal cleats, Use designated entry points"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Title level={5}>
                      <ClockCircleOutlined /> Booking Rules
                    </Title>
                    <Form.Item
                      name="refundPercentage"
                      label="Refund Percentage on Cancellation"
                      rules={[
                        {
                          required: true,
                          message: "Please enter refund percentage",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Enter refund percentage"
                        addonAfter="%"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ),
            },
            {
              key: "5",
              label: "Images",
              children: (
                <>
                  <Form.Item label="Court Images">
                    <Upload
                      listType="picture-card"
                      fileList={imageList}
                      onChange={({ fileList }) => setImageList(fileList)}
                      beforeUpload={() => false} // Prevent auto-upload
                    >
                      {imageList.length < 5 && <PlusOutlined />}
                    </Upload>
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Card>
      <Form.Item style={{ marginTop: 16, marginLeft: 0 }}>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {isEditMode ? "Update Court" : "Create Court"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourtOwnerCourtCreateView;

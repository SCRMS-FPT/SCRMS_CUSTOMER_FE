import React, { useState, useEffect } from "react";
import {
  Typography as AntTypography,
  Button,
  Card,
  Form,
  Input,
  Upload,
  Select as AntSelect,
  InputNumber,
  Row,
  Col,
  Steps,
  message,
  Collapse,
  Space,
  Divider,
  Tag,
  List,
  TimePicker,
  Alert,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  PictureOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, useTheme, Paper } from "@mui/material";
import {
  SportsTennisOutlined,
  SportsBasketballOutlined,
  DirectionsRunOutlined,
  EmojiEventsOutlined,
} from "@mui/icons-material";
import { Client } from "@/API/CoachApi";
import dayjs from "dayjs";

const { Panel } = Collapse;
const { Title, Text } = AntTypography;
const { Option } = AntSelect;

// Day options for schedule selection
const dayOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

// Duration options for time slots
const durationOptions = [
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

// Define background patterns outside of the component
const backgroundPatterns = [
  {
    top: "5%",
    right: "10%",
    icon: <SportsTennisOutlined style={{ fontSize: 120, opacity: 0.07 }} />,
  },
  {
    bottom: "15%",
    left: "5%",
    icon: <SportsBasketballOutlined style={{ fontSize: 150, opacity: 0.07 }} />,
  },
  {
    top: "40%",
    left: "8%",
    icon: <DirectionsRunOutlined style={{ fontSize: 100, opacity: 0.05 }} />,
  },
  {
    bottom: "10%",
    right: "8%",
    icon: <EmojiEventsOutlined style={{ fontSize: 130, opacity: 0.07 }} />,
  },
];

const CoachOnboarding = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coach, setCoach] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    sportIds: [],
    ratePerHour: 200000,
  });

  // State variables for tracking actual files
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // State for tracking previews
  const [avatarPreview, setAvatarPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // State for schedule
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: 1,
    startTime: "08:00:00",
    endTime: "17:00:00",
    timeDuration: 60, // default to 1 hour
  });

  // Error state for time validation
  const [timeError, setTimeError] = useState("");

  const [sports, setSports] = useState([]);
  const [coachId, setCoachId] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userProfile);

  // Progress indicator
  const progress = ((activeStep + 1) / 4) * 100;

  useEffect(() => {
    // Fetch sports data
    const fetchSports = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/sports");
        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error("Error fetching sports:", error);
        message.error("Failed to load sports data");
      }
    };

    fetchSports();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Custom upload handler for avatar
  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      onSuccess("ok");
    } catch (error) {
      console.error("Error handling avatar:", error);
    }
  };

  // Custom upload handler for gallery images
  const customGalleryUpload = async ({ file, onSuccess }) => {
    try {
      setGalleryFiles([...galleryFiles, file]);
      setGalleryPreviews([...galleryPreviews, URL.createObjectURL(file)]);
      onSuccess("ok");
    } catch (error) {
      console.error("Error handling gallery image:", error);
    }
  };

  // Validate time range and duration
  const validateTimeRange = (startTime, endTime, duration) => {
    const start = dayjs(`2000-01-01T${startTime}`);
    const end = dayjs(`2000-01-01T${endTime}`);

    // Check if end time is after start time
    if (end.isBefore(start) || end.isSame(start)) {
      return "End time must be after start time";
    }

    // Calculate the difference in minutes
    const diffMinutes = end.diff(start, "minute");

    // Check if the time range is divisible by the duration
    if (diffMinutes % duration !== 0) {
      return `The time range (${diffMinutes} minutes) must be divisible by the selected duration (${duration} minutes)`;
    }

    return "";
  };

  // Add schedule to list
  const addSchedule = () => {
    // Validate time range
    const validationError = validateTimeRange(
      newSchedule.startTime,
      newSchedule.endTime,
      newSchedule.timeDuration
    );

    if (validationError) {
      setTimeError(validationError);
      return;
    }

    setTimeError("");

    // Get the selected day's display name
    const dayName =
      dayOptions.find((d) => d.value === newSchedule.dayOfWeek)?.label || "";

    // Calculate time slots based on duration
    const start = dayjs(`2000-01-01T${newSchedule.startTime}`);
    const end = dayjs(`2000-01-01T${newSchedule.endTime}`);
    const diffMinutes = end.diff(start, "minute");
    const slotCount = diffMinutes / newSchedule.timeDuration;

    const timeSlots = [];

    for (let i = 0; i < slotCount; i++) {
      const slotStart = start.add(i * newSchedule.timeDuration, "minute");
      const slotEnd = start.add((i + 1) * newSchedule.timeDuration, "minute");

      timeSlots.push({
        dayOfWeek: newSchedule.dayOfWeek,
        dayName: dayName,
        startTime: slotStart.format("HH:mm:00"),
        endTime: slotEnd.format("HH:mm:00"),
        // Include for UI display purposes
        displayTime: `${slotStart.format("HH:mm")} - ${slotEnd.format(
          "HH:mm"
        )}`,
      });
    }

    setSchedules([...schedules, ...timeSlots]);

    // Reset time error
    setTimeError("");

    // Notify user of created slots
    message.success(`Added ${timeSlots.length} schedule slots for ${dayName}`);
  };

  // Remove schedule from list
  const removeSchedule = (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
  };

  // Handle creating coach profile
  const handleCreateCoachProfile = async () => {
    try {
      setLoading(true);
      const client = new Client();

      // Create request object
      const request = {
        sportId: coach.sportIds[0], // For simplicity, using first selected sport
        fullName: coach.fullName,
        email: coach.email,
        phone: coach.phone,
        bio: coach.bio,
        ratePerHour: coach.ratePerHour,
        avatar: avatarFile,
        images: galleryFiles,
      };

      // Call API to create coach
      const response = await client.createCoach(request);

      // Set coach ID for next steps
      setCoachId(response.id);
      message.success("Coach profile created successfully!");
      handleNext();
    } catch (error) {
      console.error("Error creating coach profile:", error);
      message.error("Failed to create coach profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle creating coach schedules
  const handleCreateCoachSchedules = async () => {
    if (schedules.length === 0) {
      message.warning("Please add at least one schedule before proceeding.");
      return;
    }

    try {
      setLoading(true);
      const client = new Client();
      let successCount = 0;

      // Create each schedule separately
      for (const schedule of schedules) {
        const request = {
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        };

        try {
          await client.createCoachSchedule(request);
          successCount++;
        } catch (error) {
          console.error(
            `Error creating schedule: ${schedule.dayName} ${schedule.displayTime}`,
            error
          );
        }
      }

      if (successCount === schedules.length) {
        message.success("All schedules created successfully!");
      } else if (successCount > 0) {
        message.warning(
          `Created ${successCount} out of ${schedules.length} schedules. Some schedules failed to create.`
        );
      } else {
        message.error("Failed to create any schedules. Please try again.");
        return;
      }

      handleNext();
    } catch (error) {
      console.error("Error creating coach schedules:", error);
      message.error("Failed to create coach schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle finish button
  const handleFinish = () => {
    message.success("Onboarding completed successfully!");
    navigate("/coach/dashboard");
  };

  // Enhanced step title
  const StepTitle = ({ title }) => (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0px 0px 1px rgba(0,0,0,0.05)",
      }}
    >
      {title}
    </Typography>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "40px 0",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      {/* Background patterns */}
      {backgroundPatterns.map((pattern, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            ...pattern,
            zIndex: 0,
          }}
        >
          {pattern.icon}
        </Box>
      ))}

      <Box
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            mb: 3,
            background: theme.palette.background.paper,
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            Become a Coach
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Complete your profile and start coaching today
          </Typography>

          <Steps
            current={activeStep}
            items={[
              {
                title: "Profile",
                description: "Basic information",
              },
              {
                title: "Schedule",
                description: "Availability",
              },
              {
                title: "Review",
                description: "Check details",
              },
              {
                title: "Complete",
                description: "All set!",
              },
            ]}
          />

          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && (
              <>
                <StepTitle title="Personal Information" />
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Full Name"
                        rules={[
                          { required: true, message: "Please enter your name" },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Your full name"
                          value={coach.fullName}
                          onChange={(e) =>
                            setCoach({ ...coach, fullName: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your email",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Your email address"
                          value={coach.email}
                          onChange={(e) =>
                            setCoach({ ...coach, email: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Phone Number">
                        <Input
                          placeholder="Your phone number"
                          value={coach.phone}
                          onChange={(e) =>
                            setCoach({ ...coach, phone: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Sport"
                        rules={[
                          {
                            required: true,
                            message: "Please select at least one sport",
                          },
                        ]}
                      >
                        <AntSelect
                          mode="multiple"
                          placeholder="Select sports you coach"
                          value={coach.sportIds}
                          onChange={(values) =>
                            setCoach({ ...coach, sportIds: values })
                          }
                        >
                          {sports.map((sport) => (
                            <Option key={sport.id} value={sport.id}>
                              {sport.name}
                            </Option>
                          ))}
                        </AntSelect>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="About You"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a brief bio",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Share your experience, certifications, and coaching style"
                      value={coach.bio}
                      onChange={(e) =>
                        setCoach({ ...coach, bio: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Hourly Rate (VND)">
                        <InputNumber
                          style={{ width: "100%" }}
                          min={50000}
                          step={10000}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          value={coach.ratePerHour}
                          onChange={(value) =>
                            setCoach({ ...coach, ratePerHour: value })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Profile Picture">
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          showUploadList={false}
                          customRequest={customAvatarUpload}
                        >
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="avatar"
                              style={{ width: "100%" }}
                            />
                          ) : (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Gallery Images">
                        <Upload
                          name="gallery"
                          listType="picture-card"
                          fileList={galleryPreviews.map((preview, index) => ({
                            uid: `-${index}`,
                            name: `image-${index}`,
                            status: "done",
                            url: preview,
                          }))}
                          customRequest={customGalleryUpload}
                          onPreview={(file) => {
                            window.open(file.url || file.thumbUrl);
                          }}
                        >
                          {galleryPreviews.length >= 5 ? null : (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          )}
                        </Upload>
                        <Text type="secondary">
                          Upload up to 5 photos showcasing your coaching
                        </Text>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </>
            )}

            {activeStep === 1 && (
              <>
                <StepTitle title="Schedule & Availability" />
                <Typography variant="body1" gutterBottom color="text.secondary">
                  Set your weekly coaching schedule. You can add multiple time
                  slots for each day of the week.
                </Typography>

                <Card style={{ marginTop: 16, marginBottom: 24 }}>
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Form.Item label="Day of Week">
                          <AntSelect
                            placeholder="Select day"
                            value={newSchedule.dayOfWeek}
                            onChange={(value) =>
                              setNewSchedule({
                                ...newSchedule,
                                dayOfWeek: value,
                              })
                            }
                          >
                            {dayOptions.map((day) => (
                              <Option key={day.value} value={day.value}>
                                {day.label}
                              </Option>
                            ))}
                          </AntSelect>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="Time Duration">
                          <AntSelect
                            placeholder="Select duration"
                            value={newSchedule.timeDuration}
                            onChange={(value) =>
                              setNewSchedule({
                                ...newSchedule,
                                timeDuration: value,
                              })
                            }
                          >
                            {durationOptions.map((duration) => (
                              <Option
                                key={duration.value}
                                value={duration.value}
                              >
                                {duration.label}
                              </Option>
                            ))}
                          </AntSelect>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          label="Start Time"
                          help="Format: HH:MM (24h)"
                        >
                          <TimePicker
                            format="HH:mm"
                            value={dayjs(`2000-01-01T${newSchedule.startTime}`)}
                            onChange={(time) =>
                              setNewSchedule({
                                ...newSchedule,
                                startTime: time
                                  ? time.format("HH:mm:00")
                                  : "08:00:00",
                              })
                            }
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="End Time" help="Format: HH:MM (24h)">
                          <TimePicker
                            format="HH:mm"
                            value={dayjs(`2000-01-01T${newSchedule.endTime}`)}
                            onChange={(time) =>
                              setNewSchedule({
                                ...newSchedule,
                                endTime: time
                                  ? time.format("HH:mm:00")
                                  : "17:00:00",
                              })
                            }
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        md={8}
                        style={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <Form.Item>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={addSchedule}
                            style={{ width: "100%" }}
                          >
                            Add Time Slots
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>

                    {timeError && (
                      <Alert
                        message="Time Range Error"
                        description={timeError}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    )}

                    <Tooltip title="Your time range will be split into slots of your selected duration">
                      <Alert
                        message="Time Slot Information"
                        description={`Selected duration: ${newSchedule.timeDuration} minutes. The system will create individual slots based on this duration.`}
                        type="info"
                        showIcon
                        icon={<InfoCircleOutlined />}
                      />
                    </Tooltip>
                  </Form>
                </Card>

                <Divider orientation="left">Added Schedule Slots</Divider>

                {schedules.length === 0 ? (
                  <Alert
                    message="No schedules added yet"
                    description="Please add your available time slots above"
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                ) : (
                  <List
                    bordered
                    dataSource={schedules}
                    renderItem={(schedule, index) => (
                      <List.Item
                        actions={[
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeSchedule(index)}
                          >
                            Remove
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <ClockCircleOutlined
                              style={{
                                fontSize: 24,
                                color: theme.palette.primary.main,
                              }}
                            />
                          }
                          title={schedule.dayName}
                          description={schedule.displayTime}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </>
            )}

            {activeStep === 2 && (
              <>
                <StepTitle title="Review Your Information" />
                <Typography variant="body1" gutterBottom color="text.secondary">
                  Please review your profile information before finalizing your
                  coach registration.
                </Typography>

                <Collapse
                  defaultActiveKey={["1", "2", "3"]}
                  style={{ marginTop: 16 }}
                >
                  <Panel header="Personal Information" key="1">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Text type="secondary">Full Name</Text>
                        <Title level={5}>{coach.fullName}</Title>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Email</Text>
                        <Title level={5}>{coach.email}</Title>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Phone</Text>
                        <Title level={5}>{coach.phone || "Not provided"}</Title>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Rate per Hour</Text>
                        <Title level={5}>
                          {coach.ratePerHour?.toLocaleString()} VND
                        </Title>
                      </Col>
                      <Col span={24}>
                        <Text type="secondary">Sports</Text>
                        <div>
                          {coach.sportIds.map((sportId) => (
                            <Tag color="blue" key={sportId}>
                              {sports.find((s) => s.id === sportId)?.name ||
                                sportId}
                            </Tag>
                          ))}
                        </div>
                      </Col>
                      <Col span={24}>
                        <Text type="secondary">Bio</Text>
                        <Title level={5}>{coach.bio}</Title>
                      </Col>
                    </Row>
                  </Panel>

                  <Panel header="Schedule Information" key="2">
                    {schedules.length === 0 ? (
                      <Empty description="No schedules added" />
                    ) : (
                      <List
                        dataSource={schedules}
                        renderItem={(schedule) => (
                          <List.Item>
                            <Space>
                              <Tag color="blue">{schedule.dayName}</Tag>
                              <span>{schedule.displayTime}</span>
                            </Space>
                          </List.Item>
                        )}
                      />
                    )}
                  </Panel>

                  <Panel header="Images" key="3">
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Text type="secondary">Profile Picture</Text>
                        <div style={{ marginTop: 8 }}>
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Profile"
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <div>No profile picture uploaded</div>
                          )}
                        </div>
                      </Col>
                      <Col span={24}>
                        <Text type="secondary">Gallery</Text>
                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          {galleryPreviews.length > 0 ? (
                            galleryPreviews.map((preview, index) => (
                              <img
                                key={index}
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            ))
                          ) : (
                            <div>No gallery images uploaded</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </>
            )}

            {activeStep === 3 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CheckCircleOutlined
                  style={{ fontSize: 72, color: theme.palette.success.main }}
                />
                <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
                  Registration Complete!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
                  Your coach profile has been created successfully. You can now
                  start accepting bookings and managing your schedule.
                </Typography>
                <Button type="primary" size="large" onClick={handleFinish}>
                  Go to Dashboard
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <div>
              {activeStep === 0 && (
                <Button
                  type="primary"
                  onClick={handleCreateCoachProfile}
                  loading={loading}
                >
                  Continue
                </Button>
              )}
              {activeStep === 1 && (
                <Button
                  type="primary"
                  onClick={handleCreateCoachSchedules}
                  loading={loading}
                >
                  Continue
                </Button>
              )}
              {activeStep === 2 && (
                <Button type="primary" onClick={handleNext}>
                  Confirm & Complete
                </Button>
              )}
            </div>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CoachOnboarding;

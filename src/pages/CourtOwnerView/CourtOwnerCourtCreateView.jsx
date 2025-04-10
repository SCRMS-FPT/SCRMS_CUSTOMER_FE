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
  InputNumber,
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
    name: "Giờ làm việc ngày thường ban ngày",
  },
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "17:00",
    endTime: "22:00",
    priceSlot: 200000,
    name: "Giờ làm việc ngày thường buổi tối",
  },
  {
    days: [6, 7], // Saturday and Sunday (7 is Sunday)
    startTime: "08:00",
    endTime: "22:00",
    priceSlot: 250000,
    name: "Giờ làm việc cuối tuần",
  },
];

const dayOptions = [
  { label: "Thứ Hai", value: 1 },
  { label: "Thứ Ba", value: 2 },
  { label: "Thứ Tư", value: 3 },
  { label: "Thứ Năm", value: 4 },
  { label: "Thứ Sáu", value: 5 },
  { label: "Thứ Bảy", value: 6 },
  { label: "Chủ Nhật", value: 7 },
];

const client = new Client();

// Helper functions for time validation
const convertTimeToMinutes = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + (seconds || 0) / 60;
};

const isDivisibleBySlotDuration = (timeString, slotDuration) => {
  const timeMinutes = convertTimeToMinutes(timeString);
  const durationMinutes = convertTimeToMinutes(slotDuration);
  return timeMinutes % durationMinutes === 0;
};

const hasOverlap = (newSchedule, existingSchedules, excludeIndex = -1) => {
  const newStart = convertTimeToMinutes(newSchedule.startTime);
  const newEnd = convertTimeToMinutes(newSchedule.endTime);

  for (let i = 0; i < existingSchedules.length; i++) {
    if (i === excludeIndex) continue;

    const existingSchedule = existingSchedules[i];
    const hasCommonDay = existingSchedule.days.some((day) =>
      newSchedule.days.includes(day)
    );

    if (hasCommonDay) {
      const existingStart = convertTimeToMinutes(existingSchedule.startTime);
      const existingEnd = convertTimeToMinutes(existingSchedule.endTime);

      // Check time overlap
      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }
  }

  return false;
};

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
  const [scheduleErrors, setScheduleErrors] = useState([]);
  const [slotDurationError, setSlotDurationError] = useState("");

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
                name: `Lịch số ${index + 1}`,
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
        message.error(
          "Gặp lỗi trong quá trình lấy thông tin. Vui lòng thử lại."
        );
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
      name: `Lịch số ${schedules.length + 1}`,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const removeSchedule = (index) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
  };

  const validateScheduleTimes = (index, field, value) => {
    const newErrors = [...scheduleErrors];

    if (!newErrors[index]) {
      newErrors[index] = {};
    }

    const slotDuration = form.getFieldValue("slotDuration") || "01:00:00";

    // If updating startTime or endTime, check if divisible by slotDuration
    if (field === "startTime" || field === "endTime") {
      if (!isDivisibleBySlotDuration(`${value}:00`, slotDuration)) {
        newErrors[index][
          field
        ] = `Thời gian phải chia hết cho thời lượng slot (${slotDuration})`;
      } else {
        delete newErrors[index][field];
      }
    }

    // Check for schedule overlap
    const currentSchedule = { ...schedules[index] };
    currentSchedule[field] = value;

    if (hasOverlap(currentSchedule, schedules, index)) {
      newErrors[index].overlap =
        "Lịch này bị trùng với lịch khác trong cùng ngày";
    } else {
      delete newErrors[index].overlap;
    }

    setScheduleErrors(newErrors);
  };

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);

    // Validate the schedule after update
    validateScheduleTimes(index, field, value);
  };

  const handleSlotDurationChange = (e) => {
    const newSlotDuration = e.target.value;
    form.setFieldsValue({ slotDuration: newSlotDuration });

    // Revalidate all schedules when slot duration changes
    schedules.forEach((schedule, index) => {
      validateScheduleTimes(index, "startTime", schedule.startTime);
      validateScheduleTimes(index, "endTime", schedule.endTime);
    });
  };

  const handleSubmit = async (values) => {
    try {
      // Check for schedule validation errors before submitting
      let hasScheduleErrors = false;
      scheduleErrors.forEach((errors) => {
        if (errors && Object.keys(errors).length > 0) {
          hasScheduleErrors = true;
        }
      });

      if (hasScheduleErrors) {
        message.error(
          "Vui lòng sửa các lỗi trong lịch trình trước khi tiếp tục"
        );
        return;
      }

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
          description: `${values.seating_capacity} chỗ ngồi`,
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
          slotDuration: values.slotDuration, // Use the form's slotDuration value
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
          ? "Thông tin sân được cập nhật thành công!"
          : "Sân mới được tạo thành công!"
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
        `Gặp lỗi trong quá trình ${isEditMode ? "cập nhật" : "tạo mới"} sân: ${
          error.message || "Lỗi không xác định"
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
              {isEditMode ? "Cập nhật sân" : "Tạo mới sân"}
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
              Quay trở lại
            </Button>
          </div>
        }
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Thông tin cơ bản",
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Tên sân"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên sân",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập tên sân" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="sport_type"
                        label="Môn thể thao"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn môn thể thao",
                          },
                        ]}
                      >
                        <Select placeholder="Lựa chọn một môn thể thao">
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
                    <Form.Item label="Trung tâm thể thao">
                      <Input value={currentVenue?.name} disabled />
                      <Form.Item name="sportCenterId" hidden>
                        <Input />
                      </Form.Item>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="venue_id"
                      label="Trung tâm thể thao"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn một trung tâm thể thao",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn trung tâm thể thao">
                        {venues.map((venue) => (
                          <Option key={venue.id} value={venue.id}>
                            {venue.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item name="description" label="Thông tin mô tả">
                    <Input.TextArea
                      rows={4}
                      placeholder="Nhập thông tin mô tả sân"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="courtType"
                        label="Loại sân"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn một loại sân",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn loại sân">
                          <Option value={1}>Trong nhà</Option>
                          <Option value={2}>Ngoài trời</Option>
                          <Option value={3}>Hỗn hợp</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="slotDuration"
                        label="Thời lượng slot"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập thời lượng slot",
                          },
                          {
                            pattern: /^(\d{2}):(\d{2}):(\d{2})$/,
                            message:
                              "Định dạng thời gian không hợp lệ. Sử dụng định dạng HH:MM:SS",
                          },
                        ]}
                        tooltip="Định dạng: HH:MM:SS (ví dụ: 01:00:00 cho 1 giờ)"
                      >
                        <Input
                          placeholder="01:00:00"
                          onChange={handleSlotDurationChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="minDepositPercentage"
                        label="Mức đặt cọc tối thiểu (%)"
                        rules={[
                          {
                            required: true,
                            message:
                              "Vui lòng nhập mức đặt cọc tối thiểu của sân",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 100,
                            message:
                              "Giá trị phần trăm phải nằm trong khoảng từ 0 đến 100",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Nhập giá trị phần trăm đặt cọc tối thiểu"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "2",
              label: "Tính năng & Tiện ích",
              children: (
                <>
                  <Title level={5}>Các tính năng của sân</Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={["features", "surface_type"]}
                        label="Bề mặt sân"
                      >
                        <Select placeholder="Chọn một loại bề mặt sân">
                          <Option value="Grass">Cỏ</Option>
                          <Option value="Clay">Đất nện</Option>
                          <Option value="Hardcourt">Sân cứng</Option>
                          <Option value="Astroturf">Cỏ nhân tạo</Option>
                          <Option value="Concrete">Bê tông</Option>
                          <Option value="Wood">Gỗ</Option>
                          <Option value="Synthetic">Tổng hợp</Option>
                          <Option value="N/A">Không áp dụng (N/A)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="seating_capacity" label="Sức chứa">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Nhập sức chứa của sân"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Các tính năng khác">
                    <Checkbox.Group>
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "indoor"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Trong nhà</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "lighting"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Hệ thống chiếu sáng</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "has_parking"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Bãi đỗ xe</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "has_showers"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Khu tắm rửa</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "floodlights"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Đèn pha chiếu sáng</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "scoreboard"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Bảng điểm</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "audience_stands"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Khán đài</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "climate_control"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>
                              Hệ thống điều hòa không khí (máy lạnh/sưởi)
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "water_fountains"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Vòi uống nước</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["features", "wheelchair_accessible"]}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox>Hỗ trợ cho người dùng xe lăn</Checkbox>
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
              label: "Giá thuê & Lịch đặt sân",
              children: (
                <>
                  <Title level={5}>Lịch đặt sân</Title>
                  <Text type="secondary" className="mb-4 block">
                    Thiết lập giờ hoạt động và giá thuê cho các ngày và khung
                    giờ khác nhau
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
                            Xóa
                          </Button>
                        }
                      >
                        {scheduleErrors[index] &&
                          scheduleErrors[index].overlap && (
                            <Alert
                              message={scheduleErrors[index].overlap}
                              type="error"
                              showIcon
                              className="mb-3"
                            />
                          )}

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
                            <div className="mb-2">Thời gian bắt đầu</div>
                            <TimePicker
                              value={dayjs(schedule.startTime, "HH:mm")}
                              format="HH:mm"
                              onChange={(time, timeString) =>
                                updateSchedule(index, "startTime", timeString)
                              }
                              className="w-full"
                              status={
                                scheduleErrors[index]?.startTime ? "error" : ""
                              }
                            />
                            {scheduleErrors[index]?.startTime && (
                              <div className="text-red-500 text-xs mt-1">
                                {scheduleErrors[index].startTime}
                              </div>
                            )}
                          </Col>
                          <Col span={8}>
                            <div className="mb-2">Thời gian kết thúc</div>
                            <TimePicker
                              value={dayjs(schedule.endTime, "HH:mm")}
                              format="HH:mm"
                              onChange={(time, timeString) =>
                                updateSchedule(index, "endTime", timeString)
                              }
                              className="w-full"
                              status={
                                scheduleErrors[index]?.endTime ? "error" : ""
                              }
                            />
                            {scheduleErrors[index]?.endTime && (
                              <div className="text-red-500 text-xs mt-1">
                                {scheduleErrors[index].endTime}
                              </div>
                            )}
                          </Col>
                          <Col span={8}>
                            <div className="mb-2">Giá thuê (mỗi giờ)</div>
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
                    Thêm lịch
                  </Button>

                  <Alert
                    type="info"
                    message="Schedule Tips"
                    description={
                      <ul>
                        <li>
                          Thiết lập mức giá khác nhau cho giờ cao điểm và giờ
                          thấp điểm
                        </li>
                        <li>
                          Giá vào cuối tuần thường cao hơn so với các ngày trong
                          tuần
                        </li>
                        <li>
                          Bạn có thể tạo nhiều khung giờ trong cùng một ngày với
                          thời gian và mức giá khác nhau
                        </li>
                      </ul>
                    }
                  />
                </>
              ),
            },
            {
              key: "4",
              label: "Luật lệ & Quy định",
              children: (
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Title level={5}>
                      <SnippetsOutlined /> Luật lệ sân
                    </Title>
                    <Form.Item
                      name="rules"
                      label="Nhập Quy Định (cách nhau bằng dấu phẩy)"
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Ví dụ: Không mang giày đinh kim loại, Sử dụng các lối vào được chỉ định"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Title level={5}>
                      <ClockCircleOutlined /> Quy định đặt sân
                    </Title>
                    <Form.Item
                      name="refundPercentage"
                      label="Phần trăm hoàn tiền khi hủy đặt sân"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập phần trăm hoàn tiền",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Nhập phần trăm hoàn tiền"
                        addonAfter="%"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ),
            },
            {
              key: "5",
              label: "Hình ảnh",
              children: (
                <>
                  <Form.Item label="Hình ảnh sân">
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
          {isEditMode ? "Cập nhật sân" : "Tạo mới sân"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourtOwnerCourtCreateView;

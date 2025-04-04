"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Badge,
  Typography,
  Layout,
  Select,
  Input,
  Tabs,
  Table,
  Button,
  Alert,
  Spin,
  Empty,
  Card,
  Modal,
  Form,
  TimePicker,
  DatePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Client as CoachClient } from "../../API/CoachApi";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

const { Title, Text, Paragraph } = Typography;
const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Column } = Table;
const { TabPane } = Tabs;

const CoachSchedules = () => {
  // State for data
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  // State for date range and pagination
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  // State for add/edit schedule modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  // Create Client instance
  const coachClient = useRef(new CoachClient()).current;

  // Initial load and reload on date range change
  useEffect(() => {
    fetchSchedules();
  }, [dateRange]);

  // Function to fetch schedules from API
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = dateRange;

      const response = await coachClient.getCoachSchedules(
        startDate,
        endDate,
        pagination.current,
        pagination.pageSize
      );

      setSchedules(response.schedules || []);
      setPagination({
        ...pagination,
        total: response.totalRecords || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching coach schedules:", err);
      setError("Không thể tải lịch làm việc. Vui lòng thử lại sau.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new schedule
  const handleAddSchedule = async (values) => {
    try {
      setLoading(true);

      const request = {
        dayOfWeek: selectedDate.day(),
        startTime: values.timeRange[0].format("HH:mm:ss"),
        endTime: values.timeRange[1].format("HH:mm:ss"),
      };

      await coachClient.createCoachSchedule(request);
      message.success("Đã thêm lịch làm việc thành công");
      setIsModalVisible(false);
      form.resetFields();

      // Reload schedules
      fetchSchedules();
    } catch (err) {
      console.error("Error adding schedule:", err);
      message.error("Không thể thêm lịch làm việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a schedule
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await coachClient.deleteCoachSchedule(scheduleId);
      message.success("Đã xóa lịch làm việc thành công");

      // Reload schedules
      fetchSchedules();
    } catch (err) {
      console.error("Error deleting schedule:", err);
      message.error("Không thể xóa lịch làm việc. Vui lòng thử lại.");
    }
  };

  // Format schedule data for calendar
  const getScheduleData = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");

    // Filter schedules for this date
    const dateSchedules = schedules.filter(
      (schedule) => schedule.date === formattedDate
    );

    return dateSchedules.map((schedule) => ({
      type:
        schedule.status === "available"
          ? "success"
          : schedule.status === "booked"
          ? "warning"
          : "error",
      content: `${schedule.startTime} - ${schedule.endTime}`,
      id: schedule.id,
    }));
  };

  // Date cell renderer for calendar
  const dateCellRender = (value) => {
    const listData = getScheduleData(value);

    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  // Handle calendar date select
  const handleCalendarSelect = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);

    form.setFieldsValue({
      date: date,
      timeRange: [dayjs("09:00", "HH:mm"), dayjs("17:00", "HH:mm")],
    });
  };

  // Handle month change in calendar
  const handleCalendarPanelChange = (date) => {
    setDateRange({
      startDate: date.startOf("month").format("YYYY-MM-DD"),
      endDate: date.endOf("month").format("YYYY-MM-DD"),
    });
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Table columns for list view
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const date = dayjs(text);
        return (
          <span>
            {date.format("DD/MM/YYYY")} (
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.day()]})
          </span>
        );
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let text = "Không xác định";
        let icon = null;

        if (status === "available") {
          color = "success";
          text = "Có sẵn";
          icon = <CheckCircleOutlined />;
        } else if (status === "booked") {
          color = "warning";
          text = "Đã đặt";
          icon = <ClockCircleOutlined />;
        } else if (status === "unavailable") {
          color = "error";
          text = "Không khả dụng";
          icon = <CloseCircleOutlined />;
        }

        return <Badge status={color} text={text} icon={icon} />;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<CloseCircleOutlined />}
          onClick={() => handleDeleteSchedule(record.id)}
          disabled={record.status === "booked"}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="coach-schedules">
      <Card
        className="mb-4"
        title={
          <Title level={4}>
            <CalendarOutlined className="mr-2" />
            Lịch làm việc của huấn luyện viên
          </Title>
        }
      >
        <Paragraph className="mb-4">
          Quản lý lịch làm việc của bạn. Bạn có thể thêm, sửa, hoặc xóa các
          khung giờ làm việc. Khách hàng chỉ có thể đặt lịch trong các khung giờ
          bạn đã đăng ký.
        </Paragraph>

        <div className="flex justify-between items-center mb-4">
          <DatePicker.RangePicker
            value={[dayjs(dateRange.startDate), dayjs(dateRange.endDate)]}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setDateRange({
                  startDate: dates[0].format("YYYY-MM-DD"),
                  endDate: dates[1].format("YYYY-MM-DD"),
                });
              }
            }}
            locale={locale}
            className="mr-2"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedDate(dayjs());
              setIsModalVisible(true);
              form.setFieldsValue({
                date: dayjs(),
                timeRange: [dayjs("09:00", "HH:mm"), dayjs("17:00", "HH:mm")],
              });
            }}
          >
            Thêm lịch làm việc
          </Button>
        </div>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane
            tab={
              <span>
                <CalendarOutlined /> Lịch
              </span>
            }
            key="1"
          >
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              </div>
            ) : schedules.length === 0 ? (
              <Empty
                description="Không có lịch làm việc nào được tìm thấy"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Calendar
                  dateCellRender={dateCellRender}
                  onSelect={handleCalendarSelect}
                  onPanelChange={handleCalendarPanelChange}
                  locale={locale}
                />
              </motion.div>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <ClockCircleOutlined /> Danh sách
              </span>
            }
            key="2"
          >
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              </div>
            ) : schedules.length === 0 ? (
              <Empty
                description="Không có lịch làm việc nào được tìm thấy"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Table
                  columns={columns}
                  dataSource={schedules.map((s) => ({
                    ...s,
                    key: `${s.date}-${s.startTime}`,
                  }))}
                  pagination={{
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    current: pagination.current,
                    onChange: (page) => {
                      setPagination({ ...pagination, current: page });
                    },
                  }}
                />
              </motion.div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal for adding/editing schedule */}
      <Modal
        title={
          <div>
            <CalendarOutlined className="mr-2" />
            Thêm lịch làm việc
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSchedule}>
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              locale={locale}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Khung giờ làm việc"
            rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              className="w-full"
              minuteStep={15}
            />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm lịch
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CoachSchedules;

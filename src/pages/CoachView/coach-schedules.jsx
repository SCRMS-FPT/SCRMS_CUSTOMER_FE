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
  Radio,
  Divider,
  Tag,
  List,
  Avatar,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Client as CoachClient } from "../../API/CoachApi";
import { Client as CourtClient } from "../../API/CourtApi";
import { motion, AnimatePresence } from "framer-motion";
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
  const [weeklySchedules, setWeeklySchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [activeModalTab, setActiveModalTab] = useState("1");
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [sports, setSports] = useState([]);

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
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [form] = Form.useForm();
  const [blockScheduleForm] = Form.useForm();

  // Create Client instance
  const coachClient = useRef(new CoachClient()).current;
  const courtClient = useRef(new CourtClient()).current;

  // Initial load and reload on date range change
  useEffect(() => {
    fetchSchedules();
    fetchWeeklySchedules();
    fetchSports();
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
      console.error("Lỗi khi tải lịch làm việc:", err);
      setError("Không thể tải lịch làm việc. Vui lòng thử lại sau.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch weekly schedules
  const fetchWeeklySchedules = async () => {
    try {
      setLoading(true);
      const response = await coachClient.getMyCoachSchedules();
      setWeeklySchedules(response.schedules || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải lịch làm việc theo tuần:", err);
      setError("Không thể tải lịch làm việc theo tuần. Vui lòng thử lại sau.");
      setWeeklySchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch sports
  const fetchSports = async () => {
    try {
      const response = await courtClient.getSports();
      setSports(response.sports || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách môn thể thao:", err);
      message.error("Không thể tải danh sách môn thể thao. Vui lòng thử lại sau.");
    }
  };

  // Function to check schedule conflicts
  const checkScheduleConflict = (date, startTime, endTime) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const existingOnDay = schedules.filter(s => s.date === formattedDate);
    
    const newStart = dayjs(`${formattedDate} ${startTime}`);
    const newEnd = dayjs(`${formattedDate} ${endTime}`);
    
    return existingOnDay.some(schedule => {
      const existingStart = dayjs(`${formattedDate} ${schedule.startTime}`);
      const existingEnd = dayjs(`${formattedDate} ${schedule.endTime}`);
      
      return (
        (newStart.isAfter(existingStart) && newStart.isBefore(existingEnd)) ||
        (newEnd.isAfter(existingStart) && newEnd.isBefore(existingEnd)) ||
        (newStart.isBefore(existingStart) && newEnd.isAfter(existingEnd)) ||
        (newStart.isSame(existingStart) || newEnd.isSame(existingEnd))
      );
    });
  };

  // Add a new schedule
  const handleAddSchedule = async (values) => {
    try {
      setLoading(true);

      // Check for conflicts
      if (checkScheduleConflict(
        selectedDate,
        values.timeRange[0].format("HH:mm:ss"),
        values.timeRange[1].format("HH:mm:ss")
      )) {
        message.error("Lịch làm việc bị trùng với lịch khác. Vui lòng chọn thời gian khác.");
        return;
      }

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
      fetchWeeklySchedules();
    } catch (err) {
      console.error("Lỗi khi thêm lịch làm việc:", err);
      message.error("Không thể thêm lịch làm việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Block a schedule
  const handleBlockSchedule = async (values) => {
    try {
      setLoading(true);

      const request = {
        sportId: values.sportId,
        blockDate: selectedDate.format("YYYY-MM-DD"),
        startTime: dayjs(`${selectedDate.format("YYYY-MM-DD")} ${values.schedule.startTime}`).toDate(),
        endTime: dayjs(`${selectedDate.format("YYYY-MM-DD")} ${values.schedule.endTime}`).toDate(),
        notes: values.notes,
      };

      await coachClient.blockCoachSchedule(request);
      message.success("Đã đánh dấu lịch làm việc thành công");
      setIsModalVisible(false);
      blockScheduleForm.resetFields();

      // Reload schedules
      fetchSchedules();
    } catch (err) {
      console.error("Lỗi khi đánh dấu lịch làm việc:", err);
      message.error("Không thể đánh dấu lịch làm việc. Vui lòng thử lại.");
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
      fetchWeeklySchedules();
    } catch (err) {
      console.error("Lỗi khi xóa lịch làm việc:", err);
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
      schedule: schedule,
    }));
  };

  // Date cell renderer for calendar
  const dateCellRender = (value) => {
    const listData = getScheduleData(value);

    return (
      <ul className="schedules-list p-0 m-0 list-none max-h-[80px] overflow-y-auto">
        {listData.map((item, index) => (
          <li key={index} className="mb-1 text-xs cursor-pointer transition-all hover:opacity-80">
            <Badge 
              status={item.type} 
              text={
                <span className="flex items-center">
                  {item.content}
                  {item.type === "warning" && (
                    <Tooltip title="Đã được đặt">
                      <LockOutlined className="ml-1 text-yellow-500" />
                    </Tooltip>
                  )}
                </span>
              } 
              className={`
                py-0.5 px-1 rounded 
                ${item.type === 'success' ? 'bg-green-50' : ''}
                ${item.type === 'warning' ? 'bg-yellow-50' : ''}
                ${item.type === 'error' ? 'bg-red-50' : ''}
              `}
            />
          </li>
        ))}
      </ul>
    );
  };

  // Handle calendar date select
  const handleCalendarSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const dateSchedules = schedules.filter(schedule => schedule.date === formattedDate);
    
    setSelectedDate(date);
    setExistingSchedules(dateSchedules);
    setIsModalVisible(true);
    setActiveModalTab("1");

    form.setFieldsValue({
      date: date,
      timeRange: [dayjs("09:00", "HH:mm"), dayjs("17:00", "HH:mm")],
    });

    if (dateSchedules.length > 0) {
      blockScheduleForm.setFieldsValue({
        sportId: sports[0]?.id,
        schedule: null,
        notes: "",
      });
    }
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

  // Handle modal tab change
  const handleModalTabChange = (key) => {
    setActiveModalTab(key);
  };

  // Get day name in Vietnamese
  const getDayName = (day) => {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return days[day];
  };

  // Format weekly schedules
  const formatWeeklySchedules = () => {
    const days = [0, 1, 2, 3, 4, 5, 6];
    
    return days.map(day => {
      const schedulesForDay = weeklySchedules.filter(schedule => schedule.dayOfWeek === day);
      return {
        day,
        dayName: getDayName(day),
        schedules: schedulesForDay
      };
    });
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
          <span className="font-medium">
            {date.format("DD/MM/YYYY")} ({["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.day()]})
          </span>
        );
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => (
        <Tag color="blue" icon={<ClockCircleOutlined />} className="py-1 px-2">
          {text}
        </Tag>
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => (
        <Tag color="geekblue" icon={<ClockCircleOutlined />} className="py-1 px-2">
          {text}
        </Tag>
      ),
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

        return (
          <Tag 
            color={color} 
            icon={icon} 
            className="py-1 px-2 font-medium"
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.status === "available" && (
            <Tooltip title="Xóa lịch">
              <Button
                danger
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteSchedule(record.id)}
                className="shadow-sm hover:shadow-md transition-all"
              />
            </Tooltip>
          )}
          {record.status === "booked" && (
            <Tooltip title="Lịch đã được đặt không thể xóa">
              <Button
                disabled
                shape="circle"
                icon={<InfoCircleOutlined />}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="coach-schedules">
      <Card
        className="mb-4 shadow-md rounded-lg overflow-hidden border-0"
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-blue-500 text-xl" />
            <Title level={4} className="m-0">
              Lịch làm việc của huấn luyện viên
            </Title>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedDate(dayjs());
              setIsModalVisible(true);
              setActiveModalTab("1");
              form.setFieldsValue({
                date: dayjs(),
                timeRange: [dayjs("09:00", "HH:mm"), dayjs("17:00", "HH:mm")],
              });
            }}
            className="bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow transition-all"
          >
            Thêm lịch làm việc
          </Button>
        }
      >
        <Paragraph className="mb-4 text-gray-600">
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
            className="shadow-sm rounded-md border-gray-300 hover:border-blue-400 transition-colors"
          />
        </div>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            className="mb-4 rounded-md shadow-sm"
          />
        )}

        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          type="card"
          className="coach-schedule-tabs"
        >
          <TabPane
            tab={
              <span className="flex items-center gap-1 px-1">
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
                className="my-8"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="calendar-wrapper rounded-md overflow-hidden shadow-sm border border-gray-200"
              >
                <Calendar
                  dateCellRender={dateCellRender}
                  onSelect={handleCalendarSelect}
                  onPanelChange={handleCalendarPanelChange}
                  locale={locale}
                  className="coach-calendar"
                  headerRender={({ value, type, onChange, onTypeChange }) => {
                    const current = value.clone();
                    return (
                      <div className="calendar-header flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Button 
                            type="text" 
                            onClick={() => {
                              const newValue = current.clone().subtract(1, 'month');
                              onChange(newValue);
                              setDateRange({
                                startDate: newValue.startOf("month").format("YYYY-MM-DD"),
                                endDate: newValue.endOf("month").format("YYYY-MM-DD"),
                              });
                            }}
                            icon={<span className="font-medium">{"<"}</span>}
                            className="hover:bg-gray-200 transition-colors"
                          />
                          <span className="text-lg font-medium">{value.format('MMMM YYYY')}</span>
                          <Button 
                            type="text" 
                            onClick={() => {
                              const newValue = current.clone().add(1, 'month');
                              onChange(newValue);
                              setDateRange({
                                startDate: newValue.startOf("month").format("YYYY-MM-DD"),
                                endDate: newValue.endOf("month").format("YYYY-MM-DD"),
                              });
                            }}
                            icon={<span className="font-medium">{">"}</span>}
                            className="hover:bg-gray-200 transition-colors"
                          />
                        </div>
                        <Button 
                          type="default"
                          onClick={() => {
                            const today = dayjs();
                            onChange(today);
                            setDateRange({
                              startDate: today.startOf("month").format("YYYY-MM-DD"),
                              endDate: today.endOf("month").format("YYYY-MM-DD"),
                            });
                          }}
                          className="hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        >
                          Hôm nay
                        </Button>
                      </div>
                    );
                  }}
                />
              </motion.div>
            )}
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center gap-1 px-1">
                <AppstoreOutlined /> Danh sách
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
            ) : weeklySchedules.length === 0 ? (
              <Empty
                description="Không có lịch làm việc nào được tìm thấy"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-8"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="weekly-schedules grid grid-cols-1 gap-4 mb-8">
                  {formatWeeklySchedules().map((day) => (
                    <Card 
                      key={day.day}
                      title={
                        <div className="flex items-center gap-2">
                          <ScheduleOutlined className="text-blue-500" />
                          <span className="font-medium">{day.dayName}</span>
                        </div>
                      }
                      className={`
                        shadow-sm border border-gray-200 hover:shadow-md transition-all
                        ${day.schedules.length === 0 ? 'opacity-70' : 'border-l-4 border-l-blue-500'}
                      `}
                    >
                      {day.schedules.length === 0 ? (
                        <Empty 
                          description="Không có lịch làm việc" 
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className="my-3"
                        />
                      ) : (
                        <List
                          dataSource={day.schedules}
                          renderItem={item => (
                            <List.Item 
                              key={item.id}
                              className="hover:bg-gray-50 rounded-md transition-colors py-3 px-2"
                              actions={[
                                <Button
                                  key="delete"
                                  danger
                                  onClick={() => handleDeleteSchedule(item.id)}
                                  icon={<DeleteOutlined />}
                                  className="flex items-center gap-1"
                                >
                                  Xóa
                                </Button>
                              ]}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar 
                                  icon={<ClockCircleOutlined />} 
                                  className="bg-blue-100 text-blue-500 flex items-center justify-center"
                                />
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {item.startTime} - {item.endTime}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ID: {item.id?.substring(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      )}
                    </Card>
                  ))}
                </div>
              
                <Divider orientation="left">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    <span>Lịch theo tháng</span>
                  </div>
                </Divider>
                
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
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                  }}
                  className="rounded-lg overflow-hidden shadow-sm border border-gray-200"
                  rowClassName={(record) => 
                    record.status === 'available' ? 'bg-green-50 hover:bg-green-100' : 
                    record.status === 'booked' ? 'bg-yellow-50 hover:bg-yellow-100' : 
                    'bg-red-50 hover:bg-red-100'
                  }
                />
              </motion.div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal for adding/editing schedule */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-blue-500" />
            <span>
              Quản lý lịch làm việc: {selectedDate?.format("DD/MM/YYYY")}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        className="schedule-modal"
        destroyOnClose
      >
        <Tabs activeKey={activeModalTab} onChange={handleModalTabChange} className="mt-4">
          <TabPane 
            tab={
              <span className="flex items-center gap-1">
                <PlusOutlined /> Thêm lịch mới
              </span>
            } 
            key="1"
          >
            <Form form={form} layout="vertical" onFinish={handleAddSchedule} className="pt-4">
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
                extra="Lịch mới không được trùng với các lịch đã tồn tại"
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  className="w-full"
                  minuteStep={15}
                />
              </Form.Item>

              {existingSchedules.length > 0 && (
                <div className="mb-4">
                  <Divider orientation="left">Lịch đã tồn tại</Divider>
                  <div className="max-h-[200px] overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
                    {existingSchedules.map((schedule, index) => (
                      <Tag 
                        key={index}
                        className="m-1 py-1"
                        color={schedule.status === 'available' ? 'green' : 
                              schedule.status === 'booked' ? 'orange' : 'red'}
                        icon={<ClockCircleOutlined />}
                      >
                        {schedule.startTime} - {schedule.endTime}
                        {schedule.status === 'booked' && ' (Đã đặt)'}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <Button onClick={() => setIsModalVisible(false)} className="mr-2">
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Thêm lịch
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span className="flex items-center gap-1">
                <LockOutlined /> Đánh dấu lịch
              </span>
            } 
            key="2"
            disabled={existingSchedules.filter(s => s.status === 'available').length === 0}
          >
            <Form form={blockScheduleForm} layout="vertical" onFinish={handleBlockSchedule} className="pt-4">
              <Form.Item
                name="sportId"
                label="Môn thể thao"
                rules={[{ required: true, message: "Vui lòng chọn môn thể thao" }]}
              >
                <Select placeholder="Chọn môn thể thao">
                  {sports.map(sport => (
                    <Option key={sport.id} value={sport.id}>{sport.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="schedule"
                label="Lịch cần đánh dấu"
                rules={[{ required: true, message: "Vui lòng chọn lịch" }]}
              >
                <Radio.Group className="w-full">
                  <div className="grid grid-cols-1 gap-2">
                    {existingSchedules
                      .filter(s => s.status === 'available')
                      .map((schedule, index) => (
                        <Radio 
                          key={index} 
                          value={schedule}
                          className="w-full p-2 border border-gray-200 rounded-md hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ClockCircleOutlined className="text-blue-500" />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                        </Radio>
                      ))
                    }
                  </div>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="notes"
                label="Ghi chú (tùy chọn)"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Nhập ghi chú về việc đánh dấu lịch này"
                />
              </Form.Item>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setIsModalVisible(false)} className="mr-2">
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Đánh dấu lịch
                </Button>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>

      <style jsx global>{`
        .coach-calendar .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
          background-color: #4096ff;
        }
        
        .coach-calendar .ant-picker-cell:hover .ant-picker-cell-inner {
          background-color: rgba(64, 150, 255, 0.1);
        }
        
        .coach-calendar .ant-picker-calendar-date-content {
          height: 80px;
          overflow-y: auto;
        }
        
        .coach-schedule-tabs .ant-tabs-nav-list {
          background-color: #f5f5f5;
          border-radius: 4px;
          padding: 2px;
        }
        
        .coach-schedule-tabs .ant-tabs-tab {
          border-radius: 4px !important;
          margin: 0 2px !important;
          padding: 6px 12px;
          transition: all 0.3s;
        }
        
        .coach-schedule-tabs .ant-tabs-tab-active {
          background-color: white !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .schedules-list::-webkit-scrollbar {
          width: 4px;
        }
        
        .schedules-list::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .schedules-list::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        
        .schedule-modal .ant-modal-content {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CoachSchedules;

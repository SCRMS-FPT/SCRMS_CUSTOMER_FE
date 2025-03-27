"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { coachSchedulesData } from "../../data/coachSchedulesData"
import { userData } from "../../data/userData"
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Checkbox,
  Avatar,
  Divider,
  Alert,
  Modal,
  Form,
  TimePicker,
  Skeleton,
  Tooltip,
  Badge,
  Space,
  Typography,
  Breadcrumb,
  Spin,
  Empty,
  message,
  Pagination,
  Layout,
  theme,
  Row,
  Col,
} from "antd"
import {
  ClockCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  CalendarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import locale from "antd/es/date-picker/locale/vi_VN"

const { Title, Text, Paragraph } = Typography
const { Header, Sider, Content } = Layout
const { Option } = Select
const { TextArea } = Input
const { Column } = Table

// Khởi tạo dữ liệu từ localStorage hoặc từ dữ liệu mẫu
let localSchedulesData = JSON.parse(localStorage.getItem("coachSchedulesData")) || [...coachSchedulesData]

// Background image URL
const backgroundImageUrl =
  "https://img.freepik.com/free-photo/soccer-players-action-professional-stadium_654080-1820.jpg"

export default function CoachSchedules() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const componentKey = location.pathname + location.search
  const { token } = theme.useToken()

  // Xác định các chế độ xem
  const isDetailView = id === "new" || (id && id.startsWith("uuid-schedule-"))
  const isNewSchedule = id === "new"
  const isCoachView = id && id.startsWith("uuid-coach-")

  // Lấy coach_id từ query params nếu có
  const queryParams = new URLSearchParams(location.search)
  const coachIdFromQuery = queryParams.get("coach")

  // State cho layout
  const [collapsed, setCollapsed] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // State cho danh sách lịch
  const [schedules, setSchedules] = useState([])
  const [filteredSchedules, setFilteredSchedules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentCoach, setCurrentCoach] = useState(null)

  // State cho chi tiết lịch
  const [isEditing, setIsEditing] = useState(isNewSchedule)
  const [schedule, setSchedule] = useState(null)
  const [editedSchedule, setEditedSchedule] = useState(null)
  const [coach, setCoach] = useState(null)
  const [coaches, setCoaches] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [note, setNote] = useState("")
  const [form] = Form.useForm()

  // Hàm để cập nhật dữ liệu cục bộ và lưu vào localStorage
  const updateLocalData = useCallback((newData) => {
    localSchedulesData = newData
    localStorage.setItem('coachSchedulesData', JSON.stringify(newData))
  }, [])

  // Lấy dữ liệu khi component mount hoặc khi id thay đổi
  useEffect(() => {
    setIsLoading(true)

    // Lấy danh sách coaches
    const coachList = userData.filter((user) => user.roles === "coach")
    setCoaches(coachList)

    if (isDetailView) {
      if (isNewSchedule) {
        // Xác định coach_id từ query params hoặc từ URL path
        const effectiveCoachId = coachIdFromQuery || (isCoachView ? id : "")

        // Tạo lịch mới với giá trị mặc định
        const newSchedule = {
          id: `uuid-schedule-${Date.now()}`,
          coach_id: effectiveCoachId,
          day_of_week: [],
          start_time: "08:00:00",
          end_time: "12:00:00",
          status: "available",
          created_at: new Date().toISOString(),
        }

        setSchedule(newSchedule)
        setEditedSchedule(newSchedule)
        setSelectedDays([])

        // Nếu có coach_id, tự động chọn coach đó
        if (effectiveCoachId) {
          const selectedCoach = userData.find((user) => user.id === effectiveCoachId)
          setCoach(selectedCoach)
        }

        // Khởi tạo form
        form.setFieldsValue({
          coach_id: effectiveCoachId,
          status: "available",
          start_time: dayjs("08:00:00", "HH:mm:ss"),
          end_time: dayjs("12:00:00", "HH:mm:ss"),
          day_of_week: [],
          note: "",
        })
      } else {
        // Tìm lịch theo ID
        const foundSchedule = localSchedulesData.find((s) => s.id === id)

        if (foundSchedule) {
          setSchedule(foundSchedule)
          setEditedSchedule(foundSchedule)
          setSelectedDays(foundSchedule.day_of_week)

          // Tìm thông tin coach
          const foundCoach = userData.find((user) => user.id === foundSchedule.coach_id)
          setCoach(foundCoach)

          // Khởi tạo form
          form.setFieldsValue({
            coach_id: foundSchedule.coach_id,
            status: foundSchedule.status,
            start_time: dayjs(foundSchedule.start_time, "HH:mm:ss"),
            end_time: dayjs(foundSchedule.end_time, "HH:mm:ss"),
            day_of_week: foundSchedule.day_of_week,
            note: "",
          })
        } else {
          // Không tìm thấy lịch, quay về trang danh sách
          navigate(isCoachView ? `/coach-schedules/${id}` : "/coach-schedules")
        }
      }
    } else {
      // Kết hợp dữ liệu lịch với thông tin coach cho trang danh sách
      let schedulesWithCoachInfo = localSchedulesData.map((schedule) => {
        const coach = userData.find((user) => user.id === schedule.coach_id)
        return {
          ...schedule,
          coachName: coach ? `${coach.firstName} ${coach.lastName}` : "Unknown Coach",
          key: schedule.id, // Thêm key cho Ant Design Table
        }
      })

      // Nếu đang ở chế độ xem lịch của một coach cụ thể
      if (isCoachView) {
        schedulesWithCoachInfo = schedulesWithCoachInfo.filter((schedule) => schedule.coach_id === id)

        // Lấy thông tin coach hiện tại
        const foundCoach = userData.find((user) => user.id === id)
        setCurrentCoach(foundCoach)
      }

      setSchedules(schedulesWithCoachInfo)
      setFilteredSchedules(schedulesWithCoachInfo)
      setTotalItems(schedulesWithCoachInfo.length)
    }

    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [
    id,
    isDetailView,
    isNewSchedule,
    isCoachView,
    navigate,
    coachIdFromQuery,
    updateLocalData,
    form,
    location.pathname,
  ])

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    if (!isDetailView && schedules.length > 0) {
      let result = [...schedules]

      // Tìm kiếm theo tên coach
      if (searchTerm) {
        result = result.filter((schedule) => schedule.coachName.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      // Lọc theo trạng thái
      if (statusFilter !== "all") {
        result = result.filter((schedule) => schedule.status === statusFilter)
      }

      // Lọc theo ngày trong tuần
      if (dayFilter !== "all") {
        const day = Number.parseInt(dayFilter)
        result = result.filter((schedule) => schedule.day_of_week.includes(day))
      }

      setFilteredSchedules(result)
      setTotalItems(result.length)
      setCurrentPage(1) // Reset về trang đầu tiên khi lọc
    }
  }, [schedules, searchTerm, statusFilter, dayFilter, isDetailView])

  // Chuyển đổi số ngày sang tên ngày
  const getDayName = (day) => {
    const days = {
      1: "Chủ nhật",
      2: "Thứ 2",
      3: "Thứ 3",
      4: "Thứ 4",
      5: "Thứ 5",
      6: "Thứ 6",
      7: "Thứ 7",
    }
    return days[day] || day
  }

  // Format thời gian
  const formatTime = (timeString) => {
    return timeString.substring(0, 5)
  }

  // Render badge trạng thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Có sẵn
          </Tag>
        )
      case "booked":
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Đã đặt
          </Tag>
        )
      default:
        return <Tag color="default">{status}</Tag>
    }
  }

  // Xử lý chỉnh sửa
  const handleEditToggle = () => {
    if (isEditing) {
      // Nếu đang ở chế độ chỉnh sửa và nhấn Cancel, reset lại dữ liệu
      setEditedSchedule(schedule)
      setSelectedDays(schedule.day_of_week)
      setNote("")
      form.resetFields()
    }
    setIsEditing(!isEditing)
  }

  // Xử lý lưu thay đổi
  const handleSaveChanges = () => {
    form
      .validateFields()
      .then((values) => {
        // Cập nhật ngày trong tuần từ selectedDays
        const updatedSchedule = {
          ...editedSchedule,
          coach_id: values.coach_id,
          status: values.status,
          start_time: values.start_time.format("HH:mm:ss"),
          end_time: values.end_time.format("HH:mm:ss"),
          day_of_week: values.day_of_week,
        }

        // Trong thực tế, đây là nơi bạn sẽ gọi API để lưu thay đổi
        if (isNewSchedule) {
          // Thêm lịch mới vào danh sách
          const newScheduleWithCoachInfo = {
            ...updatedSchedule,
            coachName: coach ? `${coach.firstName} ${coach.lastName}` : "Unknown Coach",
            key: updatedSchedule.id,
          }

          // Cập nhật dữ liệu cục bộ và lưu vào localStorage
          const newLocalData = [newScheduleWithCoachInfo, ...localSchedulesData]
          updateLocalData(newLocalData)

          // Đảm bảo dữ liệu được lưu trước khi chuyển trang
          localStorage.setItem('coachSchedulesData', JSON.stringify(newLocalData))

          messageApi.success({
            content: "Đã tạo lịch làm việc mới!",
            duration: 2,
          })

          // Sử dụng window.location.href để force reload component
          window.location.href = `/coach-schedules/${updatedSchedule.coach_id}`
        } else {
          // Cập nhật lịch hiện có
          const updatedLocalData = localSchedulesData.map((s) =>
            s.id === updatedSchedule.id ? { ...s, ...updatedSchedule } : s,
          )
          updateLocalData(updatedLocalData)

          // Đảm bảo dữ liệu được lưu trước khi chuyển trang
          localStorage.setItem('coachSchedulesData', JSON.stringify(updatedLocalData))

          setSchedule(updatedSchedule)
          setIsEditing(false)

          messageApi.success({
            content: "Đã cập nhật lịch làm việc!",
            duration: 2,
          })

          // Sử dụng window.location.href để force reload component
          window.location.href = `/coach-schedules/${updatedSchedule.coach_id}`
        }
      })
      .catch((errorInfo) => {
        messageApi.error({
          content: "Vui lòng kiểm tra lại thông tin!",
          duration: 2,
        })
      })
  }

  // Xử lý xóa lịch
  const handleDelete = () => {
    const coach_id = schedule.coach_id

    // Xóa lịch và cập nhật localStorage
    const updatedLocalData = localSchedulesData.filter((s) => s.id !== schedule.id)
    updateLocalData(updatedLocalData)

    // Đảm bảo dữ liệu được lưu trước khi chuyển trang
    localStorage.setItem('coachSchedulesData', JSON.stringify(updatedLocalData))

    setDeleteModalVisible(false)

    messageApi.success({
      content: "Đã xóa lịch làm việc!",
      duration: 2,
    })

    // Sử dụng window.location.href để force reload component
    window.location.href = `/coach-schedules/${coach_id}`
  }

  // Xử lý thay đổi coach
  const handleCoachChange = (coachId) => {
    // Cập nhật thông tin coach
    const selectedCoach = userData.find((user) => user.id === coachId)
    setCoach(selectedCoach)
  }

  // Xử lý tạo lịch mới
  const handleCreateNew = (e) => {
    e.preventDefault()
    const targetUrl = isCoachView ? `/coach-schedules/new?coach=${id}` : "/coach-schedules/new"

    // Đặt loading trước khi điều hướng
    setIsLoading(true)

    // Sử dụng setTimeout để đảm bảo UI được cập nhật trước khi điều hướng
    setTimeout(() => {
      // Sử dụng window.location.href để force reload component
      window.location.href = targetUrl
    }, 100)
  }

  // Xử lý phân trang
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page)
    setItemsPerPage(pageSize)
  }

  // Xử lý reset bộ lọc
  const handleResetFilters = () => {
    setStatusFilter("all")
    setDayFilter("all")
    setSearchTerm("")
  }

  // Lấy dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredSchedules.slice(startIndex, endIndex)
  }

  // Render skeleton loading
  const renderSkeleton = () => (
    <div className="schedule-skeleton">
      <Skeleton active avatar paragraph={{ rows: 4 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  )

  // Hiển thị chi tiết lịch làm việc
  if (isDetailView) {
    return (
      <Layout className="min-h-screen">
        {contextHolder}
        <div
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "200px",
            position: "relative",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "20px",
            }}
          >
            <Title level={2} style={{ color: "white", margin: 0 }}>
              {isNewSchedule ? "Tạo Lịch Làm Việc Mới" : "Chi Tiết Lịch Làm Việc"}
            </Title>
            <Breadcrumb
              style={{ marginTop: "10px" }}
              items={[
                {
                  title: (
                    <Link to="/coach-schedules" style={{ color: "rgba(255,255,255,0.8)" }}>
                      <HomeOutlined /> Trang chủ
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link
                      to={isCoachView ? `/coach-schedules/${id}` : "/coach-schedules"}
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      <ScheduleOutlined /> Lịch làm việc
                    </Link>
                  ),
                },
                {
                  title: (
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>{isNewSchedule ? "Tạo mới" : "Chi tiết"}</span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <Content className="px-6 pb-6">
          <Card
            bordered={false}
            className="shadow-md rounded-lg overflow-hidden"
            loading={isLoading}
            extra={
              <Space>
                {!isNewSchedule && (
                  <>
                    {!isEditing ? (
                      <Button type="primary" ghost icon={<EditOutlined />} onClick={handleEditToggle}>
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <Button danger ghost onClick={handleEditToggle}>
                        Hủy
                      </Button>
                    )}

                    {!isEditing && (
                      <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteModalVisible(true)}>
                        Xóa
                      </Button>
                    )}
                  </>
                )}

                {isEditing && (
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveChanges}>
                    {isNewSchedule ? "Tạo lịch" : "Lưu thay đổi"}
                  </Button>
                )}
              </Space>
            }
          >
            {isLoading ? (
              renderSkeleton()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Thông tin coach */}
                <div className="md:col-span-1">
                  <Card
                    className="shadow-sm"
                    cover={<div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500" />}
                  >
                    <div className="-mt-12 mb-4 flex justify-center">
                      {isEditing ? (
                        <Form form={form} layout="vertical" className="w-full">
                          <Form.Item
                            name="coach_id"
                            label="Chọn Coach"
                            rules={[{ required: true, message: "Vui lòng chọn coach!" }]}
                          >
                            <Select
                              placeholder="Chọn coach"
                              onChange={handleCoachChange}
                              disabled={isCoachView}
                              className="w-full"
                            >
                              {coaches.map((coach) => (
                                <Option key={coach.id} value={coach.id}>
                                  {coach.firstName} {coach.lastName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                          >
                            <Select placeholder="Chọn trạng thái">
                              <Option value="available">Có sẵn</Option>
                              <Option value="booked">Đã đặt</Option>
                            </Select>
                          </Form.Item>
                        </Form>
                      ) : coach ? (
                        <div className="text-center">
                          <Badge count={renderStatusBadge(schedule.status)} offset={[0, 80]}>
                            <Avatar
                              size={80}
                              icon={<UserOutlined />}
                              src={coach.avatar}
                              className="border-4 border-white shadow-lg"
                            />
                          </Badge>
                          <Title level={4} className="mt-2 mb-0">
                            {coach.firstName} {coach.lastName}
                          </Title>
                          <Link to={`/coach-profile/${coach.id}`} className="text-blue-500 hover:text-blue-700">
                            Xem hồ sơ
                          </Link>
                        </div>
                      ) : (
                        <Empty description="Chưa chọn coach" />
                      )}
                    </div>
                  </Card>

                  {/* Thông tin thêm */}
                  <Card className="mt-4 shadow-sm">
                    <Title level={5}>Thông tin thêm</Title>
                    <Divider className="my-3" />
                    <div className="space-y-4">
                      {!isNewSchedule && (
                        <div>
                          <Text type="secondary">ID lịch</Text>
                          <Paragraph copyable className="font-medium">
                            {schedule.id}
                          </Paragraph>
                        </div>
                      )}

                      <div>
                        <Text type="secondary">Ngày tạo</Text>
                        <Paragraph>
                          {dayjs(isNewSchedule ? new Date() : schedule.created_at).format("DD/MM/YYYY HH:mm")}
                        </Paragraph>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Chi tiết lịch */}
                <div className="md:col-span-3">
                  <Card className="shadow-sm">
                    <Title level={5}>Chi tiết lịch làm việc</Title>
                    <Divider className="my-3" />

                    {isEditing ? (
                      <Form form={form} layout="vertical" className="w-full">
                        <Form.Item
                          name="day_of_week"
                          label="Ngày trong tuần"
                          rules={[{ required: true, message: "Vui lòng chọn ít nhất một ngày!" }]}
                        >
                          <Checkbox.Group className="w-full">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[2, 3, 4, 5, 6, 7, 1].map((day) => (
                                <Checkbox key={day} value={day}>
                                  {getDayName(day)}
                                </Checkbox>
                              ))}
                            </div>
                          </Checkbox.Group>
                        </Form.Item>

                        <Divider className="my-4" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Form.Item
                            name="start_time"
                            label="Thời gian bắt đầu"
                            rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" }]}
                          >
                            <TimePicker
                              format="HH:mm"
                              className="w-full"
                              locale={locale}
                              placeholder="Chọn giờ bắt đầu"
                            />
                          </Form.Item>

                          <Form.Item
                            name="end_time"
                            label="Thời gian kết thúc"
                            rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc!" }]}
                          >
                            <TimePicker
                              format="HH:mm"
                              className="w-full"
                              locale={locale}
                              placeholder="Chọn giờ kết thúc"
                            />
                          </Form.Item>
                        </div>

                        <Divider className="my-4" />

                        <Form.Item name="note" label="Ghi chú">
                          <TextArea
                            placeholder="Nhập ghi chú về lịch làm việc này..."
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </Form.Item>
                      </Form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <Text strong>Ngày trong tuần</Text>
                          <div className="mt-2">
                            {schedule.day_of_week && schedule.day_of_week.length > 0 ? (
                              <Space size={[0, 8]} wrap>
                                {schedule.day_of_week.map((day) => (
                                  <Tag key={day} color="blue">
                                    {getDayName(day)}
                                  </Tag>
                                ))}
                              </Space>
                            ) : (
                              <Text type="secondary" italic>
                                Chưa chọn ngày
                              </Text>
                            )}
                          </div>
                        </div>

                        <Divider className="my-4" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Text strong>Thời gian bắt đầu</Text>
                            <div className="mt-2 flex items-center">
                              <ClockCircleOutlined className="mr-2 text-blue-500" />
                              <Text>{formatTime(schedule.start_time)}</Text>
                            </div>
                          </div>

                          <div>
                            <Text strong>Thời gian kết thúc</Text>
                            <div className="mt-2 flex items-center">
                              <ClockCircleOutlined className="mr-2 text-blue-500" />
                              <Text>{formatTime(schedule.end_time)}</Text>
                            </div>
                          </div>
                        </div>

                        <Divider className="my-4" />

                        <div>
                          <Text strong>Ghi chú</Text>
                          <div className="mt-2 p-3 bg-gray-50 rounded-md min-h-[80px]">
                            <Text type="secondary" italic>
                              Chưa có ghi chú
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Thông tin bổ sung */}
                  <Alert
                    className="mt-4"
                    message="Lưu ý về lịch làm việc"
                    description="Lịch làm việc sẽ được áp dụng hàng tuần. Nếu có thay đổi đột xuất, vui lòng cập nhật trước ít nhất 24 giờ."
                    type="info"
                    showIcon
                    icon={<CalendarOutlined />}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Modal xác nhận xóa */}
          <Modal
            title="Xác nhận xóa lịch làm việc"
            open={deleteModalVisible}
            onOk={handleDelete}
            onCancel={() => setDeleteModalVisible(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <p>Bạn có chắc chắn muốn xóa lịch làm việc này? Hành động này không thể hoàn tác.</p>
          </Modal>
        </Content>
      </Layout>
    );
  }

  // Hiển thị danh sách lịch làm việc
  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Layout>
        {/* Header với background image */}
        <div
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "250px",
            position: "relative",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 40px",
            }}
          >
            <div>
              <Title level={2} style={{ color: "white", margin: 0 }}>
                {isCoachView && currentCoach
                  ? `Lịch Làm Việc của ${currentCoach.firstName} ${currentCoach.lastName}`
                  : "Lịch Làm Việc Coach"}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                {isCoachView
                  ? `Quản lý lịch làm việc của coach ${currentCoach?.firstName || ""} ${currentCoach?.lastName || ""}`
                  : "Quản lý lịch làm việc của các huấn luyện viên"}
              </Text>
            </div>
            <Space>
              {isCoachView && (
                <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate("/coach-schedules")}>
                  Tất cả lịch
                </Button>
              )}
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew}>
                Tạo lịch mới
              </Button>
              <Button
                danger
                onClick={() => {
                  localStorage.removeItem('coachSchedulesData');
                  window.location.reload();
                }}
              >
                Reset dữ liệu
              </Button>
            </Space>
          </div>
        </div>

        <Content className="px-6 pb-6">
          {/* Bộ lọc hiển thị trực tiếp */}
          <Card bordered={false} className="shadow-md rounded-lg mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8} lg={6}>
                <Text strong>Tìm kiếm:</Text>
                <Input
                  placeholder="Tìm kiếm theo tên coach..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full mt-2"
                  allowClear
                />
              </Col>

              <Col xs={24} md={8} lg={5}>
                <Text strong>Trạng thái:</Text>
                <Select
                  className="w-full mt-2"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Chọn trạng thái"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="available">Có sẵn</Option>
                  <Option value="booked">Đã đặt</Option>
                </Select>
              </Col>

              <Col xs={24} md={8} lg={5}>
                <Text strong>Ngày trong tuần:</Text>
                <Select className="w-full mt-2" value={dayFilter} onChange={setDayFilter} placeholder="Chọn ngày">
                  <Option value="all">Tất cả</Option>
                  <Option value="1">Chủ nhật</Option>
                  <Option value="2">Thứ 2</Option>
                  <Option value="3">Thứ 3</Option>
                  <Option value="4">Thứ 4</Option>
                  <Option value="5">Thứ 5</Option>
                  <Option value="6">Thứ 6</Option>
                  <Option value="7">Thứ 7</Option>
                </Select>
              </Col>

              <Col xs={24} md={8} lg={5}>
                <Text strong>Số lượng hiển thị:</Text>
                <Select
                  className="w-full mt-2"
                  value={itemsPerPage.toString()}
                  onChange={(value) => setItemsPerPage(Number.parseInt(value))}
                  placeholder="Số lượng mỗi trang"
                >
                  <Option value="5">5 lịch</Option>
                  <Option value="10">10 lịch</Option>
                  <Option value="15">15 lịch</Option>
                  <Option value="20">20 lịch</Option>
                </Select>
              </Col>

              <Col xs={24} md={8} lg={3}>
                <Button type="primary" icon={<ReloadOutlined />} onClick={handleResetFilters} className="mt-6 w-full">
                  Đặt lại
                </Button>
              </Col>
            </Row>
          </Card>

          <Card bordered={false} className="shadow-md rounded-lg">
            {isLoading ? (
              <div className="py-10">
                <Spin tip="Đang tải..." size="large">
                  <div className="p-12 bg-gray-50 rounded-lg" />
                </Spin>
              </div>
            ) : (
              <>
                <Table dataSource={getCurrentPageData()} pagination={false} className="shadow-sm">
                  <Column
                    title="Coach"
                    key="coach"
                    render={(text, record) => (
                      <div className="flex items-center">
                        <Avatar icon={<UserOutlined />} className="mr-2" />
                        <Link to={`/coach-profile/${record.coach_id}`} className="text-blue-600 hover:text-blue-800">
                          {record.coachName}
                        </Link>
                      </div>
                    )}
                  />
                  <Column
                    title="Ngày trong tuần"
                    key="days"
                    render={(text, record) => (
                      <Space size={[0, 4]} wrap>
                        {record.day_of_week.map((day) => (
                          <Tag key={day} color="blue">
                            {getDayName(day)}
                          </Tag>
                        ))}
                      </Space>
                    )}
                  />
                  <Column
                    title="Thời gian"
                    key="time"
                    render={(text, record) => (
                      <div className="flex items-center">
                        <ClockCircleOutlined className="mr-2 text-blue-500" />
                        <span>
                          {formatTime(record.start_time)} - {formatTime(record.end_time)}
                        </span>
                      </div>
                    )}
                  />
                  <Column title="Trạng thái" key="status" render={(text, record) => renderStatusBadge(record.status)} />
                  <Column
                    title="Thao tác"
                    key="action"
                    align="right"
                    render={(text, record) => (
                      <Space>
                        <Tooltip title="Xem chi tiết">
                          <Button
                            type="primary"
                            ghost
                            icon={<EyeOutlined />}
                            onClick={() => {
                              setIsLoading(true)
                              // Đảm bảo dữ liệu hiện tại được lưu trước khi chuyển trang
                              localStorage.setItem('coachSchedulesData', JSON.stringify(localSchedulesData))
                              // Sử dụng window.location.href để force reload component
                              window.location.href = `/coach-schedules/${record.id}`
                            }}
                          >
                            Chi tiết
                          </Button>
                        </Tooltip>
                        {!isCoachView && (
                          <Tooltip title="Xem hồ sơ coach">
                            <Button
                              type="default"
                              icon={<UserOutlined />}
                              onClick={() => navigate(`/coach-profile/${record.coach_id}`)}
                            >
                              Xem coach
                            </Button>
                          </Tooltip>
                        )}
                      </Space>
                    )}
                  />
                </Table>

                {filteredSchedules.length === 0 && (
                  <Empty description="Không tìm thấy lịch làm việc nào phù hợp với bộ lọc" className="my-10" />
                )}

                {filteredSchedules.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Pagination
                      current={currentPage}
                      pageSize={itemsPerPage}
                      total={totalItems}
                      onChange={handlePageChange}
                      showSizeChanger
                      showQuickJumper
                      showTotal={(total) => `Tổng ${total} lịch`}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}


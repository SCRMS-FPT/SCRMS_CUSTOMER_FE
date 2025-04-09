import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Tabs,
  Tag,
  List,
  Typography,
  Image,
  Divider,
  Button,
  Rate,
  Row,
  Col,
  Avatar,
  Space,
  Table,
  Spin,
  Empty,
  message,
  Alert,
  Skeleton,
  Form,
  Input,
  Tooltip,
  Modal,
  Badge,
  Pagination,
} from "antd";
import {
  LeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  SnippetsOutlined,
  CalendarOutlined,
  MessageOutlined,
  FlagOutlined,
  UserOutlined,
  WarningOutlined,
  SendOutlined,
  CommentOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Client } from "@/API/CourtApi";
import {
  Client as ReviewClient,
  ReplyToReviewRequest,
  FlagReviewRequest,
} from "../../API/ReviewApi";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

// Define enums according to backend
const CourtStatus = {
  Open: 0,
  Closed: 1,
  Maintenance: 2,
};

const CourtType = {
  Indoor: 1,
  Outdoor: 2,
  Covered: 3,
};

const CourtScheduleStatus = {
  Available: 0,
  Booked: 1,
  Maintenance: 2,
};

const CourtOwnerCourtDetailView = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [court, setCourt] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [courtSchedules, setCourtSchedules] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [replyForm] = Form.useForm();
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [flagModalVisible, setFlagModalVisible] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flaggedReviewId, setFlaggedReviewId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submittingFlag, setSubmittingFlag] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Fetch court data when component mounts
  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = new Client();

        // Fetch court details
        const courtResponse = await client.getCourtDetails(courtId);
        setCourt(courtResponse.court);

        // Fetch court schedules
        const schedulesResponse = await client.getCourtSchedulesByCourtId(
          courtId
        );
        setCourtSchedules(schedulesResponse);

        // Fetch court availability (schedules)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const availabilityResponse = await client.getCourtAvailability(
          courtId,
          today,
          nextWeek
        );
        setAvailability(availabilityResponse);
      } catch (err) {
        console.error("Error fetching court details:", err);
        setError("Failed to load court details. Please try again later.");
        message.error(
          "Gặp lỗi trong quá trình tải thông tin sân. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courtId) {
      fetchCourtDetails();
    }
  }, [courtId]);

  // Fetch reviews
  const fetchReviews = useCallback(
    async (page = 1, pageSize = 10) => {
      if (!courtId) return;

      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const reviewClient = new ReviewClient();
        const response = await reviewClient.getReviews(
          "court",
          courtId,
          page,
          pageSize
        );

        setReviews(response.data || []);
        setTotalReviews(response.totalItems || 0);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching court reviews:", err);
        setReviewsError("Không thể tải đánh giá. Vui lòng thử lại sau.");
      } finally {
        setReviewsLoading(false);
      }
    },
    [courtId]
  );

  useEffect(() => {
    if (court && activeTab === "7") {
      fetchReviews();
    }
  }, [courtId, activeTab, fetchReviews]);

  // Format address display
  const formatAddress = (sportCenter) => {
    if (!sportCenter) return "";
    return `${sportCenter.addressLine || ""}, ${sportCenter.city || ""}, ${
      sportCenter.district || ""
    }, ${sportCenter.commune || ""}`;
  };

  // Format operating hours from court schedules
  const formatOperatingHours = () => {
    if (!courtSchedules || courtSchedules.length === 0) return [];

    // Group schedules by day
    const schedulesByDay = {};
    const dayNames = [
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
      "Chủ Nhật",
    ];

    courtSchedules.forEach((schedule) => {
      schedule.dayOfWeek.forEach((day) => {
        const dayName = dayNames[day - 1]; // Convert 1-based to 0-based index
        if (!schedulesByDay[dayName]) {
          schedulesByDay[dayName] = [];
        }

        schedulesByDay[dayName].push({
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          price: schedule.priceSlot,
        });
      });
    });

    // Convert to array for Table component
    return Object.entries(schedulesByDay).map(([day, schedules]) => {
      // Sort schedules by start time
      schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));

      // Combine consecutive schedules with the same price
      const combinedSchedules = [];
      let currentSchedule = null;

      schedules.forEach((schedule) => {
        if (!currentSchedule) {
          currentSchedule = { ...schedule };
        } else if (
          currentSchedule.endTime === schedule.startTime &&
          currentSchedule.price === schedule.price
        ) {
          // Extend the current schedule
          currentSchedule.endTime = schedule.endTime;
        } else {
          // Save the current schedule and start a new one
          combinedSchedules.push(currentSchedule);
          currentSchedule = { ...schedule };
        }
      });

      if (currentSchedule) {
        combinedSchedules.push(currentSchedule);
      }

      return {
        key: day,
        day: day,
        schedules: combinedSchedules,
        hoursText: combinedSchedules
          .map(
            (s) =>
              `${s.startTime.substring(0, 5)} - ${s.endTime.substring(
                0,
                5
              )} (${(s.price || 0).toLocaleString()}₫)`
          )
          .join(", "),
      };
    });
  };

  // Get status text and color based on status code
  const getStatusDisplay = (status) => {
    switch (status) {
      case CourtStatus.Open:
        return { text: "Mở cửa", color: "green" };
      case CourtStatus.Closed:
        return { text: "Đóng cửa", color: "red" };
      case CourtStatus.Maintenance:
        return { text: "Đang bảo trì", color: "orange" };
      default:
        return { text: "Không có thông tin", color: "default" };
    }
  };

  // Get court type text based on type code
  const getCourtTypeDisplay = (type) => {
    switch (type) {
      case CourtType.Indoor:
        return { text: "Trong nhà", color: "blue" };
      case CourtType.Outdoor:
        return { text: "Ngoài trời", color: "green" };
      case CourtType.Covered:
        return { text: "Có mái che", color: "purple" };
      default:
        return { text: "Không có thông tin", color: "default" };
    }
  };

  // Handle replying to a review
  const handleReply = async (reviewId) => {
    try {
      setSubmittingReply(true);

      const values = await replyForm.validateFields();
      const reviewClient = new ReviewClient();

      await reviewClient.replyToReview(reviewId, {
        replyText: values.reply,
      });

      // Clear form and refresh reviews
      replyForm.resetFields();
      setActiveReplyId(null);
      message.success("Phản hồi đã được gửi thành công");
      fetchReviews(currentPage);
    } catch (err) {
      console.error("Error replying to review:", err);
      message.error("Không thể gửi phản hồi. Vui lòng thử lại.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Handle flagging a review
  const handleFlagReview = async () => {
    if (!flaggedReviewId || !flagReason.trim()) {
      return;
    }

    try {
      setSubmittingFlag(true);

      const reviewClient = new ReviewClient();
      await reviewClient.flagReview(flaggedReviewId, {
        flagReason: flagReason,
      });

      setFlagModalVisible(false);
      setFlaggedReviewId(null);
      setFlagReason("");
      message.success("Báo cáo đã được gửi thành công");
    } catch (err) {
      console.error("Error flagging review:", err);
      message.error("Không thể gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setSubmittingFlag(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <Card>
        <Alert
          message="Lỗi Tải Thông Tin"
          description={error}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/courts")}
          style={{ marginTop: 16 }}
        >
          Quay trở lại
        </Button>
      </Card>
    );
  }

  // If no court data, show empty state
  if (!court) {
    return (
      <Card>
        <Empty description="No court information available" />
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/courts")}
          style={{ marginTop: 16, textAlign: "center" }}
        >
          Quay trở lại
        </Button>
      </Card>
    );
  }

  // Format facilities for display
  const facilities = court.facilities || [];
  const operatingHours = formatOperatingHours();
  const statusDisplay = getStatusDisplay(court.status);
  const courtTypeDisplay = getCourtTypeDisplay(court.courtType);

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: "20px" }}>
            {court.courtName}
          </Text>
          <Space>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => navigate(`/court-owner/courts/update/${court.id}`)}
            >
              Chỉnh sửa thông tin
            </Button>

            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={() => navigate("/court-owner/courts")}
            >
              Quay lại
            </Button>
          </Space>
        </div>
      }
      style={{ width: "100%" }}
    >
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          {
            key: "1",
            label: "Tổng quan",
            children: (
              <>
                <Title level={4}>{court.courtName}</Title>
                <Text type="secondary">{court.sportCenterName}</Text>
                <Divider />

                <List>
                  <List.Item>
                    <Text strong>Môn thể thao:</Text>{" "}
                    <Tag color="blue">{court.sportName}</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Loại sân:</Text>{" "}
                    <Tag color={courtTypeDisplay.color}>
                      {courtTypeDisplay.text}
                    </Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Trạng thái:</Text>{" "}
                    <Tag color={statusDisplay.color}>{statusDisplay.text}</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Mức đặt cọc tối thiểu:</Text>{" "}
                    <Tag color={statusDisplay.color}>
                      {court.minDepositPercentage}%
                    </Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Thởi lượng slot:</Text> {court.slotDuration}
                  </List.Item>
                  <List.Item>
                    <Text strong>Giới hạn thời gian hủy đặt sân:</Text>{" "}
                    <span className="text-blue-500 font-semibold">
                      {court.cancellationWindowHours}
                    </span>{" "}
                    giờ trước giờ đặt sân
                  </List.Item>
                  <List.Item>
                    <Text strong>Phần trăm hoàn tiền:</Text>{" "}
                    {court.refundPercentage}%
                  </List.Item>
                </List>
              </>
            ),
          },
          {
            key: "2",
            label: "TÍnh năng & Tiện ích",
            children: (
              <>
                <Title level={5}>Tiện ích sân</Title>
                {facilities.length > 0 ? (
                  facilities.map((facility, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <Tag color="blue" style={{ marginRight: 8 }}>
                        {facility.name}
                      </Tag>
                      {facility.description && (
                        <Text type="secondary">{facility.description}</Text>
                      )}
                    </div>
                  ))
                ) : (
                  <Text>Không có thông tin tiện ích khả dụng.</Text>
                )}

                <Divider />

                <Title level={5}>Thông tin mô tả</Title>
                <Paragraph>
                  {court.description || "Không có thông tin mô tả."}
                </Paragraph>
              </>
            ),
          },
          {
            key: "3",
            label: "Giá thuê & Lịch đặt sân",
            children: (
              <>
                <Title level={5}>
                  <DollarOutlined /> Giá thuê & Lịch đặt sân
                </Title>

                {operatingHours.length > 0 ? (
                  <Table
                    dataSource={operatingHours}
                    columns={[
                      {
                        title: "Ngày",
                        dataIndex: "day",
                        key: "day",
                        render: (text) => <Text strong>{text}</Text>,
                      },
                      {
                        title: "Giá tiền & Thời gian",
                        dataIndex: "hoursText",
                        key: "hoursText",
                        render: (text, record) => (
                          <div>
                            {record.schedules.map((schedule, index) => (
                              <Tag
                                key={index}
                                color="blue"
                                style={{ marginBottom: 4 }}
                              >
                                {schedule.startTime.substring(0, 5)} -{" "}
                                {schedule.endTime.substring(0, 5)}
                                <span style={{ marginLeft: 8 }}>
                                  {(schedule.price || 0).toLocaleString()}₫
                                </span>
                              </Tag>
                            ))}
                          </div>
                        ),
                      },
                    ]}
                    pagination={false}
                    bordered
                  />
                ) : (
                  <Empty description="Không có thông tin về lịch khả dụng." />
                )}
              </>
            ),
          },
          {
            key: "4",
            label: "Chính sách đặt sân",
            children: (
              <>
                <Title level={5}>
                  <SnippetsOutlined /> Chính sách đặt sân
                </Title>
                <List>
                  <List.Item>
                    <Text strong>Mức đặt cọc sân tối thiểu:</Text>{" "}
                    {court.minDepositPercentage}% của tổng chi phí đặt sân
                  </List.Item>
                  <List.Item>
                    <Text strong>Khung thời gian giới hạn hủy đặt sân:</Text>{" "}
                    {court.cancellationWindowHours} giờ trước lịch đặt sân
                  </List.Item>
                  <List.Item>
                    <Text strong>Lượng hoàn tiền:</Text>{" "}
                    {court.refundPercentage}% của tổng chi phí đặt sân nếu hủy
                    đặt sân trong khung thời gian cho phép
                  </List.Item>
                </List>
              </>
            ),
          },
          {
            key: "5",
            label: "Lịch khả dụng",
            children: (
              <>
                <Title level={5}>
                  <CalendarOutlined /> Lịch đặt sân khả dụng
                </Title>

                {availability && availability.schedule ? (
                  <div>
                    {availability.schedule.map((day, dayIndex) => (
                      <div key={dayIndex} style={{ marginBottom: 24 }}>
                        <Title level={5}>
                          {new Date(day.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Title>

                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                          {day.timeSlots &&
                            day.timeSlots.map((slot, slotIndex) => (
                              <Tag
                                key={slotIndex}
                                color={
                                  slot.status === "Available" ? "green" : "red"
                                }
                                style={{ padding: "4px 8px", marginBottom: 8 }}
                              >
                                {slot.startTime.substring(0, 5)} -{" "}
                                {slot.endTime.substring(0, 5)}
                                <div>
                                  <small>{slot.status}</small>
                                  {slot.price && (
                                    <div>{slot.price.toLocaleString()}₫</div>
                                  )}
                                </div>
                              </Tag>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="Không có thông tin lịch đặt sân khả dụng" />
                )}
              </>
            ),
          },
          {
            key: "6",
            label: "Khuyễn mãi",
            children: (
              <>
                <Title level={5}>
                  <StarOutlined /> Khuyến mãi
                </Title>

                {court.promotions && court.promotions.length > 0 ? (
                  <List
                    dataSource={court.promotions}
                    renderItem={(promotion) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div>
                              <Tag color="orange">
                                {promotion.discountType === "Percentage"
                                  ? `${promotion.discountValue}% Giảm giá`
                                  : `${promotion.discountValue.toLocaleString()}₫ giảm giá`}
                              </Tag>
                              <Text style={{ marginLeft: 8 }}>
                                {promotion.description}
                              </Text>
                            </div>
                          }
                          description={
                            <Text type="secondary">
                              Có hiệu lực từ{" "}
                              {new Date(
                                promotion.validFrom
                              ).toLocaleDateString()}
                              đến{" "}
                              {new Date(promotion.validTo).toLocaleDateString()}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="Không có khuyến mãi nào khả dụng cho sân này." />
                )}

                <div style={{ marginTop: 16, textAlign: "right" }}>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate("/court-owner/promotions/create", {
                        state: { courtId: court.id },
                      })
                    }
                  >
                    Tạo khuyến mãi mới
                  </Button>
                </div>
              </>
            ),
          },
          {
            key: "7",
            label: (
              <span>
                <CommentOutlined /> Đánh giá
              </span>
            ),
            children: (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4"
              >
                <div className="flex items-center gap-2 mb-6">
                  <MessageOutlined className="text-lg text-blue-500" />
                  <Typography.Title level={5} className="m-0">
                    Đánh giá của khách hàng
                  </Typography.Title>

                  {totalReviews > 0 && (
                    <Tag color="blue" className="ml-2">
                      {totalReviews} đánh giá
                    </Tag>
                  )}
                </div>

                {reviewsError && (
                  <Alert
                    message="Lỗi tải đánh giá"
                    description={reviewsError}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}

                {reviewsLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-center mb-4">
                          <Skeleton.Avatar active size={40} />
                          <div className="ml-3 flex-grow">
                            <Skeleton active paragraph={{ rows: 0 }} />
                          </div>
                        </div>
                        <Skeleton active paragraph={{ rows: 2 }} />
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-8">
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="review-card"
                      >
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:border-blue-200 transition-all duration-300">
                          <div className="flex items-start">
                            <Badge
                              dot={review.verifiedBooking}
                              color="green"
                              title={
                                review.verifiedBooking
                                  ? "Đã xác thực từ đặt sân"
                                  : "Chưa xác thực"
                              }
                            >
                              <Avatar
                                src={review.userAvatarUrl || null}
                                icon={<UserOutlined />}
                                className="border-2 border-blue-100"
                              />
                            </Badge>

                            <div className="ml-3 flex-grow">
                              <div className="flex items-center flex-wrap gap-2">
                                <span className="font-medium text-gray-800">
                                  {review.userName || "Người dùng ẩn danh"}
                                </span>

                                {review.verifiedBooking && (
                                  <Tooltip title="Đánh giá từ người đã đặt sân">
                                    <Tag color="green" className="text-xs">
                                      Đã xác thực
                                    </Tag>
                                  </Tooltip>
                                )}

                                <span className="text-xs text-gray-500 ml-auto">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>

                              <div className="my-1">
                                <Rate
                                  disabled
                                  value={review.rating}
                                  className="text-amber-400 text-sm"
                                />
                              </div>

                              <div className="text-gray-700 mt-2 whitespace-pre-line">
                                {review.comment}
                              </div>

                              {/* Review Replies Section */}
                              {review.reviewReplyResponses &&
                                review.reviewReplyResponses.length > 0 && (
                                  <div className="mt-4 pl-4 border-l-2 border-gray-100">
                                    <AnimatePresence>
                                      {review.reviewReplyResponses.map(
                                        (reply) => (
                                          <motion.div
                                            key={reply.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="mb-3 bg-gray-50 p-3 rounded-lg"
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              <Avatar
                                                size="small"
                                                icon={<ShopOutlined />}
                                                className="bg-blue-500"
                                              />
                                              <span className="font-medium text-blue-600">
                                                {reply.responderName ||
                                                  court?.sportCenterName ||
                                                  "Chủ sân"}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {formatDate(reply.createdAt)}
                                              </span>
                                            </div>
                                            <div className="text-gray-700 ml-6">
                                              {reply.replyText}
                                            </div>
                                          </motion.div>
                                        )
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}

                              {/* Reply and Report Actions */}
                              <div className="mt-3 flex items-center gap-2">
                                <Tooltip title="Phản hồi đánh giá">
                                  <Button
                                    type="text"
                                    icon={<MessageOutlined />}
                                    onClick={() =>
                                      setActiveReplyId(
                                        review.id === activeReplyId
                                          ? null
                                          : review.id
                                      )
                                    }
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    Phản hồi
                                  </Button>
                                </Tooltip>

                                <Tooltip title="Báo cáo đánh giá không phù hợp">
                                  <Button
                                    type="text"
                                    icon={<FlagOutlined />}
                                    onClick={() => {
                                      setFlaggedReviewId(review.id);
                                      setFlagModalVisible(true);
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    Báo cáo
                                  </Button>
                                </Tooltip>
                              </div>

                              {/* Reply Form */}
                              <AnimatePresence>
                                {activeReplyId === review.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-3 overflow-hidden"
                                  >
                                    <Form
                                      form={replyForm}
                                      onFinish={() => handleReply(review.id)}
                                      layout="vertical"
                                    >
                                      <Form.Item
                                        name="reply"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Vui lòng nhập nội dung phản hồi",
                                          },
                                        ]}
                                      >
                                        <Input.TextArea
                                          rows={2}
                                          placeholder="Nhập phản hồi của bạn..."
                                          className="rounded-lg resize-none"
                                          autoFocus
                                        />
                                      </Form.Item>
                                      <Form.Item className="mb-0 text-right">
                                        <Button
                                          onClick={() => setActiveReplyId(null)}
                                          className="mr-2"
                                        >
                                          Hủy
                                        </Button>
                                        <Button
                                          type="primary"
                                          htmlType="submit"
                                          loading={submittingReply}
                                          icon={<SendOutlined />}
                                        >
                                          Gửi phản hồi
                                        </Button>
                                      </Form.Item>
                                    </Form>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Pagination */}
                    {totalReviews > 10 && (
                      <div className="flex justify-center mt-6">
                        <Pagination
                          current={currentPage}
                          pageSize={10}
                          total={totalReviews}
                          onChange={(page) => fetchReviews(page - 1, 10)} // Converting 1-based UI page to 0-based API page
                          showSizeChanger={false}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Empty
                    description="Chưa có đánh giá nào cho sân này"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="py-10"
                  />
                )}

                {/* Flag Review Modal */}
                <Modal
                  title={
                    <div className="flex items-center gap-2 text-red-500">
                      <WarningOutlined /> Báo cáo đánh giá
                    </div>
                  }
                  open={flagModalVisible}
                  onCancel={() => {
                    setFlagModalVisible(false);
                    setFlaggedReviewId(null);
                    setFlagReason("");
                  }}
                  footer={[
                    <Button
                      key="cancel"
                      onClick={() => {
                        setFlagModalVisible(false);
                        setFlaggedReviewId(null);
                        setFlagReason("");
                      }}
                    >
                      Hủy
                    </Button>,
                    <Button
                      key="submit"
                      danger
                      type="primary"
                      loading={submittingFlag}
                      onClick={handleFlagReview}
                      disabled={!flagReason.trim()}
                    >
                      Gửi báo cáo
                    </Button>,
                  ]}
                >
                  <Alert
                    message="Tại sao bạn muốn báo cáo đánh giá này?"
                    description="Vui lòng cho chúng tôi biết lý do bạn cho rằng đánh giá này không phù hợp hoặc vi phạm quy định."
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                  <Input.TextArea
                    rows={4}
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Nhập lý do báo cáo..."
                    className="rounded-lg"
                  />
                </Modal>
              </motion.div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default CourtOwnerCourtDetailView;

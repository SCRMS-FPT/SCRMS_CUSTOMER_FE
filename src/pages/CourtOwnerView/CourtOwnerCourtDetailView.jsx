import React, { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import { Client } from "@/API/CourtApi";

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
  const [courtSchedules, setCourtSchedules] = useState([]); // New state for court schedules

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
        message.error("Gặp lỗi trong quá trình tải thông tin sân. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (courtId) {
      fetchCourtDetails();
    }
  }, [courtId]);

  // Format address display
  const formatAddress = (sportCenter) => {
    if (!sportCenter) return "";
    return `${sportCenter.addressLine || ""}, ${sportCenter.city || ""}, ${sportCenter.district || ""
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
                    <Tag color={statusDisplay.color}>{court.minDepositPercentage}%</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Thởi lượng slot:</Text> {court.slotDuration}
                  </List.Item>
                  <List.Item>
                    <Text strong>Giới hạn thời gian hủy đặt sân:</Text>{" "}
                    <span className="text-blue-500 font-semibold">{court.cancellationWindowHours}</span> giờ trước giờ đặt sân
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
                    <Text strong>Lượng hoàn tiền:</Text> {court.refundPercentage}%
                    của tổng chi phí đặt sân nếu hủy đặt sân trong khung thời gian cho phép
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
        ]}
      />
    </Card>
  );
};

export default CourtOwnerCourtDetailView;

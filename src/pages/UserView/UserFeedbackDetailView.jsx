import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Skeleton,
  Rate,
  Space,
  Tag,
  Divider,
  Avatar,
  Row,
  Col,
  Form,
  Input,
  notification,
  Alert,
  Popconfirm,
  Modal,
  Tooltip,
  Breadcrumb,
} from "antd";
import {
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  BuildOutlined,
  HomeOutlined,
  TagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Client as ReviewClient } from "@/API/ReviewApi";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const UserFeedbackDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.search.includes("edit=true");

  // State
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  // Fetch review details on component mount
  useEffect(() => {
    fetchReviewDetails();
  }, [id]);

  const fetchReviewDetails = async () => {
    try {
      setLoading(true);
      const client = new ReviewClient();
      const response = await client.getReviewDetail(id);

      if (response) {
        setReview(response);
        // Initialize form with review data
        form.setFieldsValue({
          rating: response.rating,
          comment: response.comment,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching review details:", error);
      setError("Không thể tải thông tin đánh giá. Vui lòng thử lại sau.");
      setLoading(false);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin đánh giá. Vui lòng thử lại sau.",
      });
    }
  };

  const fetchReplies = async () => {
    try {
      setLoadingReplies(true);
      const client = new ReviewClient();
      const response = await client.getReviewReplies(id, 1, 50);

      if (response && response.data) {
        setReplies(response.data);
      } else {
        setReplies([]);
      }
      setLoadingReplies(false);
    } catch (error) {
      console.error("Error fetching review replies:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải phản hồi cho đánh giá này.",
      });
      setLoadingReplies(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const client = new ReviewClient();
      await client.updateReview(id, {
        rating: values.rating,
        comment: values.comment,
      });

      // Update local state
      setReview({
        ...review,
        rating: values.rating,
        comment: values.comment,
        updatedAt: new Date().toISOString(),
      });

      setSaving(false);
      setEditing(false);

      notification.success({
        message: "Cập nhật thành công",
        description: "Đánh giá của bạn đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error("Error updating review:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật đánh giá. Vui lòng thử lại sau.",
      });
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment,
    });
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const client = new ReviewClient();
      await client.deleteReview(id);

      notification.success({
        message: "Xóa thành công",
        description: "Đánh giá đã được xóa thành công.",
      });

      // Navigate back to the reviews list
      navigate("/user/feedbacks");
    } catch (error) {
      console.error("Error deleting review:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa đánh giá. Vui lòng thử lại sau.",
      });
      setLoading(false);
      setDeleteConfirmVisible(false);
    }
  };

  const handleShowReplies = () => {
    if (!repliesVisible) {
      fetchReplies();
    }
    setRepliesVisible(!repliesVisible);
  };

  const goBack = () => {
    navigate("/user/feedbacks");
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    out: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const staggeredItemsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Generate status tag based on review status
  const getStatusTag = (status) => {
    let color = "default";
    let text = status;
    let icon = null;

    switch (status) {
      case "Published":
        color = "green";
        text = "Đã đăng";
        icon = <CheckCircleOutlined />;
        break;
      case "Pending":
        color = "orange";
        text = "Chờ duyệt";
        icon = <ClockCircleOutlined />;
        break;
      case "Rejected":
        color = "red";
        text = "Bị từ chối";
        icon = <CloseCircleOutlined />;
        break;
      default:
        break;
    }

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className="shadow-md">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="shadow-md">
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={fetchReviewDetails}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="review-detail-container"
    >
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item href="/user/dashboard">
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/user/feedbacks">
          <StarOutlined /> Đánh giá
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết đánh giá</Breadcrumb.Item>
      </Breadcrumb>

      {/* Page header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="text-blue-800 m-0">
          Chi tiết đánh giá
        </Title>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={goBack}
          className="hover:bg-blue-50 transition-colors"
        >
          Quay lại danh sách
        </Button>
      </div>

      {/* Status alert for rejected reviews */}
      {review?.status === "Rejected" && (
        <Alert
          message="Đánh giá bị từ chối"
          description={
            review.rejectionReason ||
            "Đánh giá này đã bị từ chối bởi quản trị viên."
          }
          type="warning"
          showIcon
          className="mb-6"
          closable
        />
      )}

      {/* Main review card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          className="review-card shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden"
          bordered={false}
        >
          {/* Review header */}
          <motion.div variants={staggeredItemsVariants} className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={20}>
                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center">
                    <Text strong className="text-lg mr-2">
                      Đánh giá cho:
                    </Text>
                    <Text className="text-lg">{review?.subjectName}</Text>
                    <Tag
                      color={review?.subjectType === "Coach" ? "green" : "blue"}
                      className="ml-2"
                    >
                      {review?.subjectType === "Coach"
                        ? "Huấn luyện viên"
                        : "Sân thể thao"}
                    </Tag>
                  </div>

                  <Space align="center">
                    <Tag icon={<CalendarOutlined />} color="blue">
                      Đăng vào:{" "}
                      {format(new Date(review?.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </Tag>
                    {review?.updatedAt &&
                      review?.updatedAt !== review?.createdAt && (
                        <Tag icon={<ClockCircleOutlined />} color="cyan">
                          Cập nhật:{" "}
                          {format(
                            new Date(review?.updatedAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </Tag>
                      )}
                    {getStatusTag(review?.status)}
                  </Space>
                </Space>
              </Col>
              <Col xs={24} sm={4} className="text-right">
                {!editing && review?.status !== "Rejected" && (
                  <Space>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteConfirmVisible(true)}
                    >
                      Xóa
                    </Button>
                  </Space>
                )}
              </Col>
            </Row>
          </motion.div>

          <Divider className="my-4" />

          {/* Review content */}
          {editing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  rating: review?.rating || 0,
                  comment: review?.comment || "",
                }}
              >
                <Form.Item
                  name="rating"
                  label="Đánh giá"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn số sao đánh giá!",
                    },
                  ]}
                  className="mb-6"
                >
                  <Rate
                    character={<StarOutlined />}
                    allowHalf
                    className="text-2xl"
                  />
                </Form.Item>

                <Form.Item
                  name="comment"
                  label="Bình luận"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung đánh giá!",
                    },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập đánh giá của bạn ở đây..."
                    maxLength={1000}
                    showCount
                    className="text-base"
                  />
                </Form.Item>

                <Form.Item className="flex justify-end">
                  <Space>
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      loading={saving}
                      icon={<SaveOutlined />}
                    >
                      Lưu thay đổi
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              variants={staggeredItemsVariants}
              className="review-content"
            >
              <div className="mb-6">
                <Text strong className="text-base">
                  Đánh giá:
                </Text>
                <div className="mt-2">
                  <Rate disabled value={review?.rating} className="text-2xl" />
                  <Text className="ml-2 text-lg">({review?.rating}/5)</Text>
                </div>
              </div>

              <div className="mb-6">
                <Text strong className="text-base">
                  Bình luận:
                </Text>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Paragraph className="text-base whitespace-pre-wrap">
                    {review?.comment || "Không có nội dung đánh giá."}
                  </Paragraph>
                </div>
              </div>
            </motion.div>
          )}

          {/* Replies section */}
          {review?.repliesCount > 0 && !editing && (
            <motion.div variants={staggeredItemsVariants}>
              <Divider orientation="left" className="my-6">
                <Space>
                  <span>Phản hồi</span>
                  <Tag color="blue">{review.repliesCount}</Tag>
                </Space>
              </Divider>

              <Button
                type="dashed"
                onClick={handleShowReplies}
                block
                className="mb-4"
              >
                {repliesVisible ? "Ẩn phản hồi" : "Xem phản hồi"}
              </Button>

              {repliesVisible && (
                <div className="replies-container pl-4 border-l-4 border-blue-100">
                  {loadingReplies ? (
                    <Skeleton active avatar paragraph={{ rows: 2 }} />
                  ) : replies.length > 0 ? (
                    replies.map((reply) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="reply-item mb-4 p-4 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center mb-2">
                          <Avatar
                            src={reply.authorAvatar}
                            icon={!reply.authorAvatar && <UserOutlined />}
                            size="small"
                            className="mr-2"
                          />
                          <Text strong>{reply.authorName}</Text>
                          <Text type="secondary" className="ml-2 text-xs">
                            {formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </Text>
                        </div>
                        <Paragraph className="mb-0 pl-8">
                          {reply.content}
                        </Paragraph>
                      </motion.div>
                    ))
                  ) : (
                    <Empty description="Không có phản hồi nào" />
                  )}
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        title={
          <div className="flex items-center text-red-500">
            <DeleteOutlined className="text-lg mr-2" />
            Xác nhận xóa đánh giá
          </div>
        }
        open={deleteConfirmVisible}
        onCancel={() => setDeleteConfirmVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteConfirmVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDelete}
            loading={loading}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
        <p className="mt-4 text-yellow-600">
          <ExclamationCircleOutlined className="mr-2" />
          Hành động này không thể hoàn tác!
        </p>
      </Modal>

      {/* CSS for additional styling */}
      <style jsx>{`
        .review-card {
          transition: all 0.3s ease;
        }

        .review-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .replies-container {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .replies-container::-webkit-scrollbar {
          width: 6px;
        }

        .replies-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .replies-container::-webkit-scrollbar-thumb {
          background: #a0aec0;
          border-radius: 10px;
        }

        .replies-container::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .reply-item {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </motion.div>
  );
};

export default UserFeedbackDetailView;

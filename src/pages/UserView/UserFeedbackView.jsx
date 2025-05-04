import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Skeleton,
  Input,
  Space,
  Spin,
  Empty,
  notification,
  Rate,
  Typography,
  Tooltip,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import {
  StarOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Client as ReviewClient } from "@/API/ReviewApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const { Title, Text } = Typography;

const UserFeedbackView = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterType, setFilterType] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page, pageSize, filterType]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const client = new ReviewClient();
      const response = await client.getReviewsSubmittedByUser(page, pageSize);

      if (response && response.data) {
        setReviews(response.data);
        setTotalRecords(response.totalRecords || response.data.length);
      } else {
        setReviews([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
      setLoading(false);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải đánh giá. Vui lòng thử lại sau.",
      });
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const client = new ReviewClient();
      await client.deleteReview(reviewId);

      notification.success({
        message: "Xóa thành công",
        description: "Đánh giá đã được xóa thành công",
      });

      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa đánh giá. Vui lòng thử lại sau.",
      });
    }
    setDeleteConfirmVisible(false);
  };

  const showDeleteConfirm = (review) => {
    setSelectedReview(review);
    setDeleteConfirmVisible(true);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      !searchText ||
      review.subjectName?.toLowerCase().includes(searchText.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = !filterType || review.subjectType === filterType;

    return matchesSearch && matchesType;
  });

  const handleViewDetails = (reviewId) => {
    navigate(`/user/feedbacks/${reviewId}`);
  };

  const handleEdit = (reviewId) => {
    navigate(`/user/feedbacks/${reviewId}?edit=true`);
  };

  const columns = [
    {
      title: "Đánh giá cho",
      dataIndex: "subjectName",
      key: "subjectName",
      render: (text, record) => (
        <Space>
          <span className="font-medium">{text}</span>
          <Tag color={record.subjectType === "Coach" ? "green" : "blue"}>
            {record.subjectType === "Coach" ? "HLV" : "Sân"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      ellipsis: {
        showTitle: false,
      },
      render: (comment) => (
        <Tooltip placement="topLeft" title={comment}>
          <div className="max-w-xs truncate">{comment}</div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={new Date(date).toLocaleString("vi-VN")}>
          {formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })}
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record.id)}
            className="hover:opacity-80 transition-opacity"
          >
            Xem
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record.id)}
                >
                  Chỉnh sửa
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<DeleteOutlined />}
                  onClick={() => showDeleteConfirm(record)}
                  danger
                >
                  Xóa
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button
              icon={<MoreOutlined />}
              size="small"
              className="hover:bg-gray-100 transition-colors"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="feedback-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Title level={2} className="text-blue-800">
          Đánh giá của bạn
        </Title>
        <Text className="text-gray-600">
          Danh sách các đánh giá bạn đã gửi cho huấn luyện viên và sân thể thao
        </Text>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Input
              placeholder="Tìm kiếm theo tên hoặc bình luận..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              className="flex-1 min-w-[200px]"
              style={{ maxWidth: "400px" }}
            />

            <Space>
              <Dropdown
                overlay={
                  <Menu
                    selectedKeys={[filterType]}
                    onClick={({ key }) =>
                      setFilterType(key === "all" ? null : key)
                    }
                  >
                    <Menu.Item key="all">Tất cả loại</Menu.Item>
                    <Menu.Item key="Coach">Huấn luyện viên</Menu.Item>
                    <Menu.Item key="Court">Sân</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button icon={<FilterOutlined />}>
                  {!filterType
                    ? "Lọc theo loại"
                    : filterType === "Coach"
                    ? "HLV"
                    : "Sân"}
                </Button>
              </Dropdown>

              <Button
                type="primary"
                ghost
                onClick={() => {
                  setSearchText("");
                  setFilterType(null);
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </Space>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          {loading ? (
            <Spin tip="Đang tải...">
              <Skeleton active paragraph={{ rows: 5 }} />
            </Spin>
          ) : error ? (
            <Empty
              description={
                <span className="text-red-500">
                  {error}{" "}
                  <Button type="link" onClick={fetchReviews}>
                    Thử lại
                  </Button>
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Table
                  dataSource={filteredReviews}
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalRecords,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    showTotal: (total) => `Tổng số: ${total} đánh giá`,
                    onChange: (p, ps) => {
                      setPage(p);
                      setPageSize(ps);
                    },
                  }}
                  className="reviews-table"
                  rowClassName="hover:bg-blue-50 transition-colors cursor-pointer"
                  onRow={(record) => ({
                    onClick: () => handleViewDetails(record.id),
                  })}
                  locale={{
                    emptyText: (
                      <Empty
                        description="Không có đánh giá nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    ),
                  }}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </Card>
      </motion.div>

      <Modal
        title={
          <div className="flex items-center text-red-500">
            <ExclamationCircleOutlined className="mr-2 text-lg" />
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
            onClick={() => handleDelete(selectedReview?.id)}
            loading={loading}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
        {selectedReview && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p>
              <strong>Đánh giá cho:</strong> {selectedReview.subjectName}
            </p>
            <p>
              <strong>Đánh giá:</strong>{" "}
              <Rate disabled value={selectedReview.rating} />
            </p>
            <p>
              <strong>Bình luận:</strong> {selectedReview.comment}
            </p>
          </div>
        )}
        <p className="mt-4 text-yellow-600">
          <ExclamationCircleOutlined className="mr-2" />
          Hành động này không thể hoàn tác!
        </p>
      </Modal>

      <style jsx>{`
        .reviews-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(59, 130, 246, 0.1);
        }

        .reviews-table .ant-pagination-item-active {
          border-color: #1890ff;
        }

        .reviews-table .ant-pagination-item-active a {
          color: #1890ff;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </motion.div>
  );
};

export default UserFeedbackView;

import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Tag,
  Button,
  Progress,
  Tooltip,
  Typography,
  Card,
  Space,
  Alert,
} from "antd";
import { Client } from "../../API/CoachApi";
import {
  ShoppingOutlined,
  HistoryOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const UserPurchasedPackagesView = () => {
  const [loading, setLoading] = useState(true);
  const [purchasedPackages, setPurchasedPackages] = useState([]);
  const [error, setError] = useState(null);

  const client = new Client();

  useEffect(() => {
    const fetchPurchasedPackages = async () => {
      try {
        setLoading(true);
        // Get purchased packages from API
        const response = await client.getHistoryPurchase(false, false, 1, 100);
        setPurchasedPackages(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching purchased packages:", err);
        setError("Failed to load purchased packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedPackages();
  }, []);

  const fetchPackageDetail = async (packageId) => {
    try {
      const detail = await client.getPurchaseDetail(packageId);
      return detail;
    } catch (err) {
      console.error("Error fetching package detail:", err);
      return null;
    }
  };

  const columns = [
    {
      title: "Gói",
      dataIndex: "packageName",
      key: "packageName",
      render: (_, record) => (
        <Space direction="vertical">
          <Text strong>{record.packageName || "Standard Package"}</Text>
          <Text type="secondary">ID: {record.id.substring(0, 8)}...</Text>
        </Space>
      ),
    },
    {
      title: "Huấn luyện viên",
      dataIndex: "coachName",
      key: "coachName",
      render: (_, record) => (
        <Space direction="vertical">
          <Text>{record.coachName || "Coach Information"}</Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const sessionsLeft = record.sessionCount - record.sessionUsed;
        const isExpired =
          record.expiryDate && dayjs(record.expiryDate).isBefore(dayjs());
        const percentUsed = Math.round(
          (record.sessionUsed / record.sessionCount) * 100
        );

        return (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Text strong>
                {sessionsLeft} / {record.sessionCount} buổi
              </Text>
              {isExpired && <Tag color="red">Expired</Tag>}
              {!isExpired && sessionsLeft === 0 && (
                <Tag color="orange">Đã sử dụng hết</Tag>
              )}
              {!isExpired && sessionsLeft > 0 && (
                <Tag color="green">Hoạt động</Tag>
              )}
            </Space>
            <Progress
              percent={percentUsed}
              size="small"
              status={sessionsLeft === 0 ? "exception" : "active"}
              strokeColor={sessionsLeft === 0 ? "#ff4d4f" : "#1890ff"}
            />
            <Text type="secondary">
              {isExpired
                ? `Hết hạn vào ngày ${dayjs(record.expiryDate).format("MMM D, YYYY")}`
                : record.expiryDate
                  ? `Khả dụng đến ngày ${dayjs(record.expiryDate).format(
                    "MMM D, YYYY"
                  )}`
                  : "Không giới hạn ngày"}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Ngày mua",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        const sessionsLeft = record.sessionCount - record.sessionUsed;
        const isExpired =
          record.expiryDate && dayjs(record.expiryDate).isBefore(dayjs());

        return (
          <Space>
            <Button
              icon={<FileProtectOutlined />}
              onClick={() => fetchPackageDetail(record.id)}
            >
              Xem chi tiêt
            </Button>
            {!isExpired && sessionsLeft > 0 && (
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                onClick={() => (window.location.href = "/coaches")}
              >
                Đặt lịch tập
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Title level={4}>Những gói bạn đã mua</Title>
        <Text type="secondary">
          Xem và quản lý các gói huấn luyện viên bạn đã mua. Sử dụng các buổi tập còn lại để đặt lịch hẹn với huấn luyện viên.
        </Text>
      </Space>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : purchasedPackages.length > 0 ? (
        <Table
          dataSource={purchasedPackages}
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender: (record) => (
              <Card size="small" title="Thông tin gói">
                <p>
                  <strong>ID gói:</strong> {record.id}
                </p>
                <p>
                  <strong>ID gói huấn luyện viên:</strong> {record.coachPackageId}
                </p>
                <p>
                  <strong>Số buổi:</strong> {record.sessionUsed} đã sử dụng trên tổng số {" "}
                  {record.sessionCount} buổi
                </p>
                <p>
                  <strong>Còn lại:</strong>{" "}
                  {record.sessionCount - record.sessionUsed} buổi
                </p>
              </Card>
            ),
          }}
        />
      ) : (
        <Card>
          <Space
            direction="vertical"
            align="center"
            style={{ width: "100%", padding: "40px 0" }}
          >
            <ShoppingOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
            <Title level={4}>Chưa mua gói huấn luyện nào</Title>
            <Text type="secondary">
              Bạn chưa mua gói huấn luyện viên nào. Hãy duyệt qua các huấn luyện viên của chúng tôi để tìm huấn luyện viên phù hợp với bạn.
            </Text>
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => (window.location.href = "/coaches")}
              style={{ marginTop: 16 }}
            >
              Tìm kiếm huấn luyện viên
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default UserPurchasedPackagesView;

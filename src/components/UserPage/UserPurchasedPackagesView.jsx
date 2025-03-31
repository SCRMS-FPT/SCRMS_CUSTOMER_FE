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
      title: "Package",
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
      title: "Coach",
      dataIndex: "coachName",
      key: "coachName",
      render: (_, record) => (
        <Space direction="vertical">
          <Text>{record.coachName || "Coach Information"}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
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
                {sessionsLeft} / {record.sessionCount} sessions left
              </Text>
              {isExpired && <Tag color="red">Expired</Tag>}
              {!isExpired && sessionsLeft === 0 && (
                <Tag color="orange">Used Up</Tag>
              )}
              {!isExpired && sessionsLeft > 0 && (
                <Tag color="green">Active</Tag>
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
                ? `Expired on ${dayjs(record.expiryDate).format("MMM D, YYYY")}`
                : record.expiryDate
                ? `Valid until ${dayjs(record.expiryDate).format(
                    "MMM D, YYYY"
                  )}`
                : "No expiry date"}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Actions",
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
              View Details
            </Button>
            {!isExpired && sessionsLeft > 0 && (
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                onClick={() => (window.location.href = "/coaches")}
              >
                Book Session
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
        <Title level={4}>Your Purchased Packages</Title>
        <Text type="secondary">
          View and manage your purchased coaching packages. Use remaining
          sessions to book appointments with coaches.
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
              <Card size="small" title="Package Information">
                <p>
                  <strong>Package ID:</strong> {record.id}
                </p>
                <p>
                  <strong>Coach Package ID:</strong> {record.coachPackageId}
                </p>
                <p>
                  <strong>Sessions:</strong> {record.sessionUsed} used of{" "}
                  {record.sessionCount} total
                </p>
                <p>
                  <strong>Remaining:</strong>{" "}
                  {record.sessionCount - record.sessionUsed} sessions
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
            <Title level={4}>No Packages Purchased Yet</Title>
            <Text type="secondary">
              You haven't purchased any coaching packages yet. Browse our
              coaches to find the perfect coach for you.
            </Text>
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => (window.location.href = "/coaches")}
              style={{ marginTop: 16 }}
            >
              Browse Coaches
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default UserPurchasedPackagesView;

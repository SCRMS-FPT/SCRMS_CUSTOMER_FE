import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Divider,
  Tag,
  Skeleton,
  Alert,
  Empty,
  Space,
  Modal,
  message,
  Tooltip,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RightCircleOutlined,
  CrownOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Client as IdentityClient, SubscribeRequest } from "@/API/IdentityApi";
import {
  Client as PaymentClient,
  ProcessPaymentRequest,
} from "@/API/PaymentApi";
import {
  format,
  formatDistance,
  addDays,
  isBefore,
  differenceInDays,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Icon } from "@iconify/react";
import { LinearProgress } from "@mui/material";

const { Title, Text, Paragraph } = Typography;

const UserSubscriptionsView = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch subscriptions and wallet balance when component mounts
  useEffect(() => {
    fetchSubscriptions();
    fetchWalletBalance();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const client = new IdentityClient();
      const response = await client.getUserDashboard();

      if (response && response.subscriptions) {
        setSubscriptions(response.subscriptions);
      } else {
        setSubscriptions([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError("Không thể tải thông tin gói dịch vụ. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    setBalanceLoading(true);
    try {
      const client = new PaymentClient();
      const response = await client.getWalletBalance();
      setWalletBalance(response);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleRenew = (packageData) => {
    setSelectedPackage(packageData);
    setRenewModalVisible(true);
  };

  const confirmRenew = async () => {
    if (!selectedPackage) return;

    setProcessing(true);

    try {
      // Step 1: Process payment
      const paymentClient = new PaymentClient();
      const paymentRequest = new ProcessPaymentRequest({
        amount: selectedPackage.price,
        description: `Gia hạn gói ${selectedPackage.name}`,
        paymentType: "ServicePackage",
        packageId: selectedPackage.id,
        referenceId: selectedPackage.id,
      });

      const response = await paymentClient.processBookingPayment(
        paymentRequest
      );

      // Step 2: Call the subscribe API to register the subscription
      const identityClient = new IdentityClient();
      const subscribeRequest = new SubscribeRequest({
        packageId: selectedPackage.id,
      });

      await identityClient.subscribe(subscribeRequest);

      // Step 3: Refresh wallet balance and subscriptions data
      await fetchWalletBalance();
      await fetchSubscriptions();

      message.success("Gia hạn gói dịch vụ thành công!");
      setRenewModalVisible(false);
    } catch (err) {
      console.error("Error renewing subscription:", err);
      message.error(
        "Không thể gia hạn gói dịch vụ. Vui lòng thử lại sau hoặc kiểm tra số dư của bạn."
      );
    } finally {
      setProcessing(false);
    }
  };

  const cancelRenew = () => {
    setRenewModalVisible(false);
    setSelectedPackage(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const translateRole = (role) => {
    switch (role) {
      case "Coach":
        return "Huấn Luyện Viên";
      case "CourtOwner":
        return "Chủ Sân";
      default:
        return role;
    }
  };

  const hasEnoughBalance = () => {
    if (!walletBalance || !selectedPackage) return false;
    return walletBalance.balance >= selectedPackage.price;
  };

  // Calculate subscription status
  const getSubscriptionStatus = (subscription) => {
    const now = new Date();
    const expiryDate = new Date(subscription.endDate);

    if (isBefore(expiryDate, now)) {
      return {
        status: "expired",
        text: "Hết hạn",
        color: "red",
        icon: <ClockCircleOutlined />,
        description: `Đã hết hạn vào ${format(expiryDate, "dd/MM/yyyy", {
          locale: vi,
        })}`,
      };
    }

    const daysRemaining = differenceInDays(expiryDate, now);

    if (daysRemaining <= 7) {
      return {
        status: "expiring",
        text: "Sắp hết hạn",
        color: "orange",
        icon: <WarningOutlined />,
        description: `Còn ${daysRemaining} ngày sử dụng`,
      };
    }

    return {
      status: "active",
      text: "Đang hoạt động",
      color: "green",
      icon: <CheckCircleOutlined />,
      description: `Còn ${daysRemaining} ngày sử dụng`,
    };
  };

  const getExpiredText = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);

    if (isBefore(expiry, now)) {
      return `Đã hết hạn ${formatDistance(expiry, now, {
        addSuffix: true,
        locale: vi,
      })}`;
    } else {
      return `Hết hạn ${formatDistance(expiry, now, {
        addSuffix: true,
        locale: vi,
      })}`;
    }
  };

  // Calculate progress percentage
  const calculateProgress = (subscription) => {
    const startDate = new Date(subscription.startDate);
    const expiryDate = new Date(subscription.endDate);
    const now = new Date();

    const totalDuration = expiryDate - startDate;
    const elapsed = now - startDate;

    let percentage = (elapsed / totalDuration) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100

    return percentage;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
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
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 1 }} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton active paragraph={{ rows: 6 }} />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Có lỗi xảy ra"
        description={error}
        className="m-6"
        action={
          <Button type="primary" onClick={fetchSubscriptions}>
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="subscription-container p-4">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="mb-2 flex items-center">
          <Icon
            icon="mdi:package-variant-closed"
            className="mr-3 text-blue-500"
            style={{ fontSize: "28px" }}
          />
          Gói dịch vụ đã đăng ký
        </Title>
        <Paragraph className="text-gray-500">
          Quản lý các gói dịch vụ bạn đã đăng ký và gia hạn khi cần thiết.
        </Paragraph>
      </div>
      {/* No subscriptions message */}
      {subscriptions.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="mt-4">
              <Text style={{ fontSize: 16 }}>
                Bạn chưa đăng ký gói dịch vụ nào
              </Text>
              <div className="mt-4">
                <Button
                  type="primary"
                  size="large"
                  icon={
                    <Icon icon="mdi:package-variant-plus" className="mr-1" />
                  }
                  onClick={() => navigate("/pricing")}
                >
                  Xem các gói dịch vụ
                </Button>
              </div>
            </div>
          }
        />
      ) : (
        /* Subscriptions list */
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {subscriptions.map((subscription) => {
              const status = getSubscriptionStatus(subscription);
              const progressPercentage = calculateProgress(subscription);

              return (
                <motion.div
                  key={subscription.id}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <Card
                    className="h-full"
                    bodyStyle={{ padding: "24px", height: "100%" }}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    bordered={false}
                    className="shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col h-full">
                      {/* Header with name and price */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge.Ribbon
                            text={status.text}
                            color={status.color}
                            className="right-0"
                          >
                            <div className="flex items-center mb-2">
                              <CrownOutlined
                                className="mr-2 text-yellow-500"
                                style={{ fontSize: "20px" }}
                              />
                              <Title level={3} className="m-0">
                                {subscription.name}
                              </Title>
                            </div>
                          </Badge.Ribbon>

                          <div className="flex items-center mt-2">
                            <Tag
                              color="blue"
                              icon={
                                <Icon
                                  icon="mdi:briefcase-variant"
                                  className="mr-1"
                                />
                              }
                            >
                              {translateRole(subscription.associatedRole)}
                            </Tag>
                            <Text className="ml-2 font-medium text-lg text-blue-600">
                              {formatPrice(subscription.price)}
                            </Text>
                          </div>
                        </div>
                      </div>

                      {/* Package details */}
                      <div className="flex-grow">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <Text type="secondary">Tiến trình sử dụng</Text>
                            <Text
                              strong
                              className={`${
                                progressPercentage > 80
                                  ? "text-red-500"
                                  : progressPercentage > 50
                                  ? "text-orange-500"
                                  : "text-green-500"
                              }`}
                            >
                              {Math.round(progressPercentage)}%
                            </Text>
                          </div>

                          <LinearProgress
                            variant="determinate"
                            value={progressPercentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "#e0e0e0",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                backgroundColor:
                                  progressPercentage > 80
                                    ? "#f44336"
                                    : progressPercentage > 50
                                    ? "#ff9800"
                                    : "#4caf50",
                              },
                            }}
                          />

                          <div className="flex justify-between mt-2">
                            <Text type="secondary" className="text-xs">
                              {format(
                                new Date(subscription.startDate),
                                "dd/MM/yyyy"
                              )}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {format(
                                new Date(subscription.endDate),
                                "dd/MM/yyyy"
                              )}
                            </Text>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center">
                            <CalendarOutlined className="text-blue-500 mr-3" />
                            <Text>
                              Thời hạn: {subscription.durationDays} ngày
                            </Text>
                          </div>

                          <div className="flex items-center">
                            <ClockCircleOutlined
                              className={`mr-3 ${
                                status.color === "green"
                                  ? "text-green-500"
                                  : status.color === "orange"
                                  ? "text-orange-500"
                                  : "text-red-500"
                              }`}
                            />
                            <Text>{status.description}</Text>
                          </div>

                          {subscription.features &&
                            subscription.features.length > 0 && (
                              <div className="flex items-start">
                                <Icon
                                  icon="mdi:feature-search"
                                  className="text-blue-500 mr-3 mt-1"
                                />
                                <div>
                                  <Text strong>Tính năng:</Text>
                                  <ul className="list-disc list-inside ml-2 mt-1 text-gray-600">
                                    {subscription.features.map(
                                      (feature, index) => (
                                        <li key={index} className="mt-1">
                                          {feature}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <Text strong>
                              {getExpiredText(subscription.endDate)}
                            </Text>
                          </div>
                          <div className="space-x-2">
                            <Button
                              type="primary"
                              icon={<ReloadOutlined />}
                              onClick={() => handleRenew(subscription)}
                              disabled={
                                status.status === "active" &&
                                differenceInDays(
                                  new Date(subscription.endDate),
                                  new Date()
                                ) > 7
                              }
                            >
                              Gia hạn
                            </Button>
                            <Tooltip title="Xem chi tiết quyền lợi">
                              <Button
                                type="default"
                                icon={<RightCircleOutlined />}
                                onClick={() =>
                                  navigate(
                                    `/pricing?highlight=${subscription.id}`
                                  )
                                }
                              >
                                Chi tiết
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
      {/* Renewal confirmation modal */}
      <Modal
        title={
          <div className="flex items-center">
            <Icon
              icon="mdi:package-variant-closed"
              className="mr-2 text-blue-500"
            />
            <span>Gia hạn gói dịch vụ</span>
          </div>
        }
        open={renewModalVisible}
        onCancel={cancelRenew}
        footer={[
          <Button key="cancel" onClick={cancelRenew}>
            Hủy
          </Button>,
          <Button
            key="renew"
            type="primary"
            loading={processing}
            disabled={!hasEnoughBalance()}
            onClick={confirmRenew}
          >
            Xác nhận gia hạn
          </Button>,
        ]}
      >
        {selectedPackage && (
          <div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <Text strong>Gói dịch vụ:</Text>
                <Text>{selectedPackage.name}</Text>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Text strong>Giá:</Text>
                <Text className="text-blue-600 font-medium">
                  {formatPrice(selectedPackage.price)}
                </Text>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Text strong>Thời hạn:</Text>
                <Text>{selectedPackage.durationDays} ngày</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text strong>Quyền lợi:</Text>
                <Tag color="blue">
                  {translateRole(selectedPackage.associatedRole)}
                </Tag>
              </div>
            </div>

            <div className="mb-4">
              <Alert
                message="Thông tin ví"
                description={
                  <div className="flex justify-between items-center">
                    <Text>Số dư hiện tại:</Text>
                    {balanceLoading ? (
                      <Skeleton.Button active size="small" />
                    ) : (
                      <Text strong className="text-green-600">
                        {formatPrice(walletBalance?.balance || 0)}
                      </Text>
                    )}
                  </div>
                }
                type="info"
                showIcon
              />
            </div>

            {!hasEnoughBalance() && (
              <Alert
                message="Số dư không đủ"
                description={
                  <div>
                    <p>Số dư trong ví của bạn không đủ để thanh toán.</p>
                    <Button
                      type="primary"
                      size="small"
                      className="mt-2"
                      onClick={() => {
                        setRenewModalVisible(false);
                        navigate("/wallet/deposit");
                      }}
                    >
                      Nạp tiền ngay
                    </Button>
                  </div>
                }
                type="warning"
                showIcon
              />
            )}
          </div>
        )}
      </Modal>
      {/* Custom CSS */}
      <style jsx>{`
        .subscription-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default UserSubscriptionsView;

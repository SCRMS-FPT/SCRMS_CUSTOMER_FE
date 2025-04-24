import React, { useState } from "react";
import { Input, Button, notification, Result } from "antd";
import { MailOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Client } from "@/API/IdentityApi";
import { API_IDENTITY_URL } from "@/API/config";

const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const client = new Client(API_IDENTITY_URL);

  // Get user login status from Redux store
  const { userProfile } = useSelector((state) => state.user);
  const isLoggedIn = !!userProfile;

  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      showNotification(
        "warning",
        "Thiếu Email",
        "Vui lòng nhập email của bạn để tiếp tục."
      );
      return;
    }

    setLoading(true);
    try {
      await client.resetPassword({ email });
      showNotification(
        "success",
        "Đã gửi liên kết đặt lại mật khẩu",
        "Hãy kiểm tra email của bạn để nhận liên kết đặt lại mật khẩu."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      showNotification(
        "error",
        "Đặt lại thất bại",
        "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show message if user is already logged in
  if (isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <Result
            status="info"
            title="Bạn đã đăng nhập"
            subTitle={`Xin chào, ${userProfile.firstName || ""} ${
              userProfile.lastName || ""
            }! Bạn đã đăng nhập vào hệ thống nên không cần đặt lại mật khẩu.`}
            extra={[
              <Button
                type="primary"
                key="home"
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
              >
                Về Trang Chủ
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100 bg-[url('/src/assets/soccer.jpg')] bg-cover bg-center"
      // style={{ marginTop: "2rem", marginBottom: "2rem" }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Quên Mật Khẩu
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Nhập email đã đăng ký của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

        <div className="mt-6">
          <label className="block text-gray-700">Email</label>
          <Input
            type="email"
            size="large"
            placeholder="Nhập email của bạn"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          size="large"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={handleResetPassword}
          loading={loading}
        >
          {loading ? "Đang xử lý..." : "Gửi Liên Kết Đặt Lại"}
        </Button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Quay lại Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;

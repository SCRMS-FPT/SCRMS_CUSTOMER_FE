import React, { useState } from "react";
import { Input, Button, notification } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Client } from "@/API/IdentityApi";
import { API_IDENTITY_URL } from "@/API/config";

const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const client = new Client(API_IDENTITY_URL); // Initialize API client

  // Show notifications
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
  };

  // Handle Reset Password Request
  const handleResetPassword = async () => {
    if (!email.trim()) {
      showNotification("warning", "Missing Email", "Please enter your email to proceed.");
      return;
    }

    setLoading(true);
    try {
      await client.resetPassword({ email }); // Call API function
      showNotification("success", "Reset Link Sent", "Check your email for the password reset link.");
      setTimeout(() => navigate("/login"), 3000); // Redirect to Login after success
    } catch (error) {
      console.error("Reset password error:", error);
      showNotification("error", "Reset Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-center text-gray-600 mt-2">
          Enter your registered email to receive a password reset link.
        </p>

        {/* Email Input */}
        <div className="mt-6">
          <label className="block text-gray-700">Email</label>
          <Input
            type="email"
            size="large"
            placeholder="Enter your email"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          size="large"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={handleResetPassword}
          loading={loading}
        >
          {loading ? "Processing..." : "Send Reset Link"}
        </Button>

        {/* Back to Login */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;

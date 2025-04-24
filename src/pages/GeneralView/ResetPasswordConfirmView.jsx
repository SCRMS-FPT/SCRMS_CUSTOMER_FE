import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  notification,
  ConfigProvider,
} from "antd";
import locale from "antd/lib/locale/vi_VN";
import { LockOutlined } from "@ant-design/icons";
import { Box, Container, Paper, Avatar } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { ApiException, Client } from "@/API/IdentityApi";

const { Title } = Typography;

const client = new Client();

export default function ResetPasswordConfirmPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  const handleFinish = async (values) => {
    setLoading(true);

    const resetPasswordRequest = {
      newPassword: values.newPassword,
      token: token,
    };

    try {
      await client.resetPasswordConfirm(resetPasswordRequest);
      notification.success({
        message: "Thành công",
        description: "Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.",
      });
    } catch (error) {
      let errorMsg =
        "Đã xảy ra lỗi trong quá trình đổi mật khẩu. Vui lòng thử lại.";

      if (error instanceof ApiException) {
        try {
          const errorResponse = JSON.parse(error.response);
          errorMsg = errorResponse.detail || errorMsg;
        } catch (e) {
          errorMsg = e.message || errorMsg;
        }
      }

      notification.error({
        message: "Thất bại",
        description: errorMsg,
      });
    }
    setLoading(false);
  };

  const validatePasswords = (_, value) => {
    if (!value || form.getFieldValue("newPassword") === value) {
      return Promise.resolve();
    }
    return Promise.reject("Mật khẩu xác nhận không khớp");
  };

  return (
    <ConfigProvider locale={locale}>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <Paper elevation={3} style={{ padding: 32, width: "100%" }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <LockOutlined />
              </Avatar>
            </Box>
            <Title level={3} style={{ textAlign: "center" }}>
              Đặt lại mật khẩu
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                  {
                    pattern:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/,
                    message:
                      "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ số và một ký tự đặc biệt",
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận lại mật khẩu",
                  },
                  {
                    validator: validatePasswords,
                  },
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Paper>
        </Box>
      </Container>
    </ConfigProvider>
  );
}

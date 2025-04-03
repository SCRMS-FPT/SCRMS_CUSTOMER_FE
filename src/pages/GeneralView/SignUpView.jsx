import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Ant Design imports
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  notification,
  Spin,
  Alert,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import {
  FacebookOutlined,
  GoogleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
// MUI imports
import { Box, Container, Paper, Avatar } from "@mui/material";
import { blue } from "@mui/material/colors";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// API import
import { Client, RegisterUserRequest, ApiException } from "@/API/IdentityApi";

const { Title, Text } = Typography;
const { Option } = Select;

const SignUpView = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const showUnavailableNotification = () => {
    notification.info({
      message: "Tính năng chưa khả dụng",
      description:
        "Phương thức đăng nhập này hiện chưa khả dụng. Vui lòng sử dụng email và mật khẩu.",
      placement: "topRight",
    });
  };

  const handleSignUp = async (values) => {
    if (values.password !== values.confirmPassword) {
      setErrorMessage("Mật khẩu không khớp");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const client = new Client();

      // Create a RegisterUserRequest object with all required fields
      const registerRequest = new RegisterUserRequest({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate ? values.birthDate.toDate() : new Date(),
        gender: values.gender,
        password: values.password,
      });

      // Call the register API
      await client.register(registerRequest);

      notification.success({
        message: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
        placement: "topRight",
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMsg = "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.";

      if (error instanceof ApiException) {
        try {
          const errorResponse = JSON.parse(error.response);
          errorMsg = errorResponse.detail || errorMsg;

          // Handle specific error messages
          if (errorMsg.includes("already taken")) {
            errorMsg =
              "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.";
          } else if (errorMsg.includes("password")) {
            errorMsg =
              "Vui lòng cung cấp mật khẩu hợp lệ (ít nhất 8 ký tự bao gồm chữ và số).";
          }
        } catch (e) {
          errorMsg = e.message || errorMsg;
        }
      }

      setErrorMessage(errorMsg);
      notification.error({
        message: "Đăng ký thất bại",
        description: errorMsg,
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/src/assets/soccer.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: blue[600], mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>

          <Title level={3} style={{ margin: "0 0 8px 0" }}>
            Courtsite
          </Title>

          <Title level={4} style={{ margin: "0 0 16px 0" }}>
            Đăng ký
          </Title>

          <Text type="secondary" style={{ marginBottom: 24 }}>
            Đã có tài khoản?{" "}
            <Link to="/login" style={{ color: blue[600], fontWeight: 500 }}>
              Đăng nhập
            </Link>
          </Text>

          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 16, width: "100%" }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSignUp}
            style={{ width: "100%" }}
            initialValues={{ gender: "Male" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Họ"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ của bạn" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên của bạn" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tên" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn" },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlinedIcon fontSize="small" />}
                placeholder="Mật khẩu"
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlinedIcon fontSize="small" />}
                placeholder="Xác nhận mật khẩu"
                visibilityToggle={{
                  visible: showConfirmPassword,
                  onVisibleChange: setShowConfirmPassword,
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="birthDate"
                  label="Ngày sinh"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày sinh",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Ngày sinh"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Option value="Male">Nam</Option>
                    <Option value="Female">Nữ</Option>
                    <Option value="Other">Khác</Option>
                    <Option value="Undisclosed">Không tiết lộ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                style={{
                  backgroundColor: blue[600],
                  height: 46,
                  marginTop: 16,
                }}
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>hoặc</Divider>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              icon={<FacebookOutlined style={{ color: blue[600] }} />}
              block
              size="large"
              onClick={showUnavailableNotification}
              style={{ height: 46 }}
            >
              Tiếp tục với Facebook
            </Button>
            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              onClick={showUnavailableNotification}
              style={{ height: 46 }}
            >
              Tiếp tục với Google
            </Button>
          </Space>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpView;
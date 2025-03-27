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
      message: "Feature Unavailable",
      description:
        "This login method is currently unavailable. Please use email and password.",
      placement: "topRight",
    });
  };

  const handleSignUp = async (values) => {
    if (values.password !== values.confirmPassword) {
      setErrorMessage("Passwords do not match");
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
        message: "Registration Successful",
        description: "Your account has been created. Please log in.",
        placement: "topRight",
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMsg = "An error occurred during registration. Please try again.";

      if (error instanceof ApiException) {
        try {
          const errorResponse = JSON.parse(error.response);
          errorMsg = errorResponse.detail || errorMsg;

          // Handle specific error messages
          if (errorMsg.includes("already taken")) {
            errorMsg =
              "This email is already registered. Please use a different email or login.";
          } else if (errorMsg.includes("password")) {
            errorMsg =
              "Please provide a valid password (at least 8 characters with letters and numbers).";
          }
        } catch (e) {
          errorMsg = e.message || errorMsg;
        }
      }

      setErrorMessage(errorMsg);
      notification.error({
        message: "Registration Failed",
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
            courtsite
          </Title>

          <Title level={4} style={{ margin: "0 0 16px 0" }}>
            Sign Up
          </Title>

          <Text type="secondary" style={{ marginBottom: 24 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: blue[600], fontWeight: 500 }}>
              Log In
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
                  label="First Name"
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: "Please enter your last name" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlinedIcon fontSize="small" />}
                placeholder="Password"
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlinedIcon fontSize="small" />}
                placeholder="Confirm Password"
                visibilityToggle={{
                  visible: showConfirmPassword,
                  onVisibleChange: setShowConfirmPassword,
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="birthDate"
                  label="Birth Date"
                  rules={[
                    {
                      required: true,
                      message: "Please select your birth date",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Birth Date"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    { required: true, message: "Please select your gender" },
                  ]}
                >
                  <Select placeholder="Select gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                    <Option value="Undisclosed">Prefer not to say</Option>
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
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>or</Divider>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              icon={<FacebookOutlined style={{ color: blue[600] }} />}
              block
              size="large"
              onClick={showUnavailableNotification}
              style={{ height: 46 }}
            >
              Continue with Facebook
            </Button>
            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              onClick={showUnavailableNotification}
              style={{ height: 46 }}
            >
              Continue with Google
            </Button>
          </Space>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpView;

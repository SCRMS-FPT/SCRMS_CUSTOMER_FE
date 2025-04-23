import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Ant Design imports
import {
  Select,
  Divider,
  notification,
  Alert,
  Typography,
  Row,
  Col,
  Radio,
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/lib/locale/vi_VN";
import {
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
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { API_GATEWAY_URL } from "@/API/config";

const { Title, Text } = Typography;
const { Option } = Select;

dayjs.locale("vi");

const GOOGLE_CLIENT_ID =
  "698950573891-c4q4ig6r5pm95tj2tro79j4ktnsbh7fj.apps.googleusercontent.com";

const client = new Client(API_GATEWAY_URL, null);

const SignUpView = () => {
  const [form] = Form.useForm();
  const [additionForm] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogGoogle, setDialogGoogle] = useState(false);
  const [googleResponse, setGoogleResponse] = useState(null);

  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    setGoogleResponse(response);
    setDialogGoogle(true);
  };
  const handleSubmit = () => {
    additionForm
      .validateFields()
      .then((values) => {
        sendRequestViaAPI(values);
        additionForm.resetFields();
      })
      .catch((info) => {
        notification.error({
          message: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin.",
          placement: "topRight",
        });
      });
  };

  const sendRequestViaAPI = async (formData) => {
    try {
      setDialogGoogle(false);

      if (googleResponse == null) {
        notification.error({
          message: "Lỗi",
          description: "Không có phản hồi từ Google.",
          placement: "topRight",
        });
        return;
      }

      const googleToken = googleResponse.credential;
      const obj = {
        token: googleToken,
        birthDate: formData.birthdate,
        phone: formData.phone,
        gender: formData.gender,
      };
      await client.registerWithGoogle(obj);

      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký bằng Google.",
        placement: "topRight",
      });

      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      let errorMsg = "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.";

      if (error instanceof ApiException) {
        try {
          const errorResponse = JSON.parse(error.response);
          errorMsg = errorResponse.detail || errorMsg;

          if (errorMsg.includes("existing")) {
            errorMsg =
              "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.";
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
    }
  };

  const handleGoogleFailure = () => {
    notification.error({
      message: "Đăng ký bằng Google thất bại",
      description: "Đã xảy ra lỗi khi đăng ký bằng Google.",
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
      const registerRequest = new RegisterUserRequest({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate ? values.birthDate.toDate() : new Date(),
        gender: values.gender,
        password: values.password,
      });

      await client.register(registerRequest);

      notification.success({
        message: "Đăng ký thành công",
        description:
          "Tin nhắn chứa đường dẫn xác thực đã gửi vào tài khoản gmail. Vui lòng xác thực.",
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

  const radioStyle = {
    display: "flex",
    alignItems: "center",
    height: "50px",
    lineHeight: "50px",
    padding: "0 16px",
    marginBottom: "8px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    width: "100%",
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ConfigProvider locale={locale}>
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <UserOutlined />
              <span>Thông Tin Cá Nhân</span>
            </div>
          }
          open={dialogGoogle}
          zIndex={2000}
          onCancel={() => {
            setDialogGoogle(false);
            additionForm.resetFields();
          }}
          footer={null}
          width={500}
          centered
        >
          <Form
            form={additionForm}
            layout="vertical"
            style={{ marginTop: 24 }}
            initialValues={{
              gender: undefined,
              phone: "",
              birthdate: null,
            }}
          >
            {/* Gender selection */}
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Radio.Group style={{ width: "100%" }}>
                <Radio value="male" style={radioStyle}>
                  Nam
                </Radio>
                <Radio value="female" style={radioStyle}>
                  Nữ
                </Radio>
                <Radio value="other" style={radioStyle}>
                  Khác
                </Radio>
              </Radio.Group>
            </Form.Item>

            {/* Phone number */}
            <Form.Item
              name="phone"
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <PhoneOutlined />
                  <span>Số điện thoại</span>
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^\d{10}$/,
                  message: "Số điện thoại phải có đúng 10 chữ số",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại của bạn" size="large" />
            </Form.Item>

            {/* Birthdate */}
            <Form.Item
              name="birthdate"
              label="Ngày sinh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày sinh",
                  type: "object",
                },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject("Ngày sinh không hợp lệ");
                    }
                    if (value.isAfter(dayjs())) {
                      return Promise.reject(
                        "Ngày sinh không được lớn hơn ngày hiện tại"
                      );
                    }
                    if (dayjs().diff(value, "year") < 18) {
                      return Promise.reject("Bạn phải đủ 18 tuổi để đăng ký");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                size="large"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>

            {/* Submit buttons */}
            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
              <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setDialogGoogle(false);
                    additionForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                  Xác Nhận
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
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
                  {
                    pattern:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/,
                    message:
                      "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ số và một ký tự đặc biệt",
                  },
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
                  {
                    pattern: /^\d{10}$/,
                    message: "Số điện thoại phải có đúng 10 chữ số",
                  },
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
                        type: "object",
                      },
                      {
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject("Ngày sinh không hợp lệ");
                          }
                          if (value.isAfter(dayjs())) {
                            return Promise.reject(
                              "Ngày sinh không được lớn hơn ngày hiện tại"
                            );
                          }
                          if (dayjs().diff(value, "year") < 18) {
                            return Promise.reject(
                              "Bạn phải đủ 18 tuổi để đăng ký"
                            );
                          }
                          return Promise.resolve();
                        },
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
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </Space>
          </Paper>
        </Container>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default SignUpView;

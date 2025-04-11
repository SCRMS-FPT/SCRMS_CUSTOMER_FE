import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  notification,
  Radio,
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  ConfigProvider,
} from "antd";
import { useAuth } from "@/hooks/useAuth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/lib/locale/vi_VN";
import { Client, ApiException } from "@/API/IdentityApi";
import { API_GATEWAY_URL } from "@/API/config";

const GOOGLE_CLIENT_ID =
  "698950573891-c4q4ig6r5pm95tj2tro79j4ktnsbh7fj.apps.googleusercontent.com";
dayjs.locale("vi");

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [additionForm] = Form.useForm();
  const [dialogGoogle, setDialogGoogle] = useState(false);
  const [googleResponse, setGoogleResponse] = useState(null);
  const { login, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const { status } = useSelector((state) => state.user);

  const client = new Client(API_GATEWAY_URL);

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

  const handleSubmit = () => {
    additionForm
      .validateFields()
      .then((values) => {
        sendRequestViaAPI(values);
        setDialogGoogle(false);
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
      const obj = {
        token: googleResponse.credential,
        phone: formData.phone,
        birthDate: formData.birthdate,
        gender: formData.gender,
      };
      await client.registerWithGoogle(obj);
      await loginWithGoogle(googleResponse.credential);

      notification.success({
        message: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập bằng Google.",
        placement: "topRight",
      });

      navigate("/");
    } catch (error) {
      let errorMsg =
        "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.";

      if (error instanceof ApiException) {
        try {
          const errorResponse = JSON.parse(error.response);
          errorMsg = errorResponse.detail || errorMsg;
        } catch (e) {
          errorMsg = e.message || errorMsg;
        }
      }

      setErrorMessage(errorMsg);
      notification.error({
        message: "Đăng nhập thất bại",
        description: errorMsg,
        placement: "topRight",
      });
    }
  };

  const handleGoogleSuccess = async (response) => {
    const googleToken = response.credential;
    setGoogleResponse(response);
    const loginResponse = await loginWithGoogle(googleToken);
    if (loginResponse.error) {
      const { payload } = loginResponse;

      const [statusCode, errorMessage, errorDetail] = payload.split(": ", 3);

      switch (parseInt(statusCode)) {
        case 401:
          notification.error({
            message: "Đăng nhập thất bại",
            description: "Mật khẩu hoặc tài khoản không đúng.",
            placement: "topRight",
          });
          break;
        default: {
          if (errorDetail.includes("existed")) {
            // HANDLE REGISTER
            setDialogGoogle(true);
          } else {
            notification.error({
              message: "Đăng nhập thất bại",
              description: errorMessage,
              placement: "topRight",
            });
          }
        }
      }
      return;
    }
    notification.success({
      message: "Đăng nhập thành công",
      description: "Bạn đã đăng nhập bằng Google.",
      placement: "topRight",
    });

    navigate("/");
  };

  const handleGoogleFailure = () => {
    notification.error({
      message: "Đăng nhập bằng Google thất bại",
      description: "Đã xảy ra lỗi khi đăng nhập bằng Google.",
      placement: "topRight",
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      notification.warning({
        message: "Điền thiếu thông tin",
        description: "Vui lòng điền lại email và mật khẩu.",
        placement: "topRight",
      });
      return;
    }

    const response = await login(email, password);

    if (response.error) {
      const { payload } = response;

      const [statusCode, errorMessage] = payload.split(": ", 2);

      switch (parseInt(statusCode)) {
        case 401:
          notification.error({
            message: "Đăng nhập thất bại",
            description: "Mật khẩu hoặc tài khoản không đúng.",
            placement: "topRight",
          });
          break;
        default:
          notification.error({
            message: "Đăng nhập thất bại",
            description: "Lỗi hệ thống, vui lòng thử lại sau.",
            placement: "topRight",
          });
      }
      return;
    }

    notification.success({
      message: "Đăng nhập thành công",
      description: "Bạn đã đăng nhập thành công!",
      placement: "topRight",
    });
    navigate("/");
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
                { required: true, message: "Vui lòng chọn ngày sinh" },
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

      <div className="relative flex justify-center items-center min-h-screen bg-gray-100 bg-[url('/src/assets/soccer.jpg')] bg-cover bg-center">
        {/* <div className="absolute inset-0 backdrop-blur-sm"></div> */}
        <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10">
          <h2 className="text-2xl font-semibold text-center">Đăng Nhập</h2>
          <p className="text-center text-gray-500 mt-2">
            Chưa có tài khoản Courtsite?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Đăng Ký
            </Link>
          </p>

          <div className="mt-6">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mt-4 relative">
            <label className="block text-gray-600">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-blue-300"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>

          <Link to="/forgot-password">
            <p className="text-right text-blue-500 text-sm mt-2 cursor-pointer">
              Quên mật khẩu?
            </p>
          </Link>

          {/* {error && <p className="text-red-500 text-center mt-2">{error}</p>} */}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
            disabled={status === "loading"}
          >
            Đăng Nhập
          </button>

          <p className="text-xs text-center text-gray-500 mt-2">
            Khi đăng nhập, tôi đồng ý với{" "}
            <span className="text-blue-500">Điều khoản sử dụng</span> và{" "}
            <span className="text-blue-500">Chính sách bảo mật</span> của
            Courtsite.
          </p>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">hoặc</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginView;

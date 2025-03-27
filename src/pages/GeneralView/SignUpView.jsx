import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Client, RegisterUserRequest, ApiException } from "@/API/IdentityApi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "698950573891-c4q4ig6r5pm95tj2tro79j4ktnsbh7fj.apps.googleusercontent.com";

const SignUpView = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "Male", // Default selection
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleGoogleSuccess = async (response) => {
    try {
      const client = new Client("http://localhost:6001", null);
      const googleToken = response.credential;

      await client.registerWithGoogle(googleToken);

      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký bằng Google.",
        placement: "topRight",
      });

      navigate("/login");
    } catch (error) {
      notification.error({
        message: "Đăng ký Google thất bại",
        description: `Lỗi: ${error.response}`,
        placement: "topRight",
      });
    }
  };

  const handleGoogleFailure = () => {
    notification.error({
      message: "Đăng ký Google thất bại",
      description: "Đã xảy ra lỗi khi đăng ký bằng Google.",
      placement: "topRight",
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const client = new Client("http://localhost:6001", null);

      const registerRequest = new RegisterUserRequest({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate
          ? new Date(formData.birthDate)
          : new Date(),
        gender: formData.gender,
        password: formData.password,
      });

      await client.register(registerRequest);

      notification.success({
        message: "Đăng ký thành công",
        description:
          "Tài khoản của bạn đã được tạo. Vui lòng xác minh ở mail bạn đã đăng ký.",
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

          if (errorMsg.includes("already taken")) {
            errorMsg =
              "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.";
          } else if (errorMsg.includes("password")) {
            errorMsg =
              "Vui lòng nhập mật khẩu hợp lệ (ít nhất 8 ký tự bao gồm chữ và số).";
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-[url('/src/assets/soccer.jpg')] bg-cover bg-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold text-center mb-4">Đăng ký</h2>
          <p className="text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Đăng nhập
            </Link>
          </p>

          {/* Biểu mẫu đăng ký */}
          <form onSubmit={handleSignUp} className="mt-6">
            {/* Họ */}
            <label className="block text-gray-700">Họ</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ của bạn"
              required
            />

            <label className="block text-gray-700 mt-4">Tên</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên của bạn"
              required
            />

            <label className="block text-gray-700 mt-4">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email của bạn"
              required
            />

            <label className="block text-gray-700 mt-4">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu của bạn"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>

            <label className="block text-gray-700 mt-4">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại của bạn"
              required
            />

            <div className="flex space-x-4 mt-4">
              <div className="flex-1">
                <label className="block text-gray-700">Ngày sinh</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">hoặc</div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            scope="profile email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUpView;

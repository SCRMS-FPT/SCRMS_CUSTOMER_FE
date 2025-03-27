import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Client } from "@/API/IdentityApi";
import { API_IDENTITY_URL } from "@/API/config";
import { notification } from "antd";
import { useAuth } from "@/features/auth/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "698950573891-c4q4ig6r5pm95tj2tro79j4ktnsbh7fj.apps.googleusercontent.com";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);

  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      await loginWithGoogle(googleToken);
      notification.success({
        message: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập bằng Google.",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Đăng nhập Google thất bại",
        description: `Lỗi: ${error.response}`,
        placement: "topRight",
      });
    }
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

    try {
      await login(email, password);
      notification.success({
        message: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập thành công!",
        placement: "topRight",
      });
      navigate("/");
    } catch (errorMessage) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: errorMessage.message || "Thông tin không hợp lệ.",
        placement: "topRight",
      });
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

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
            useOneTap
            scope="profile email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginView;

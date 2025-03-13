import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Client } from "../API/IdentityApi";
import { API_IDENTITY_URL } from "../API/config";
import { notification } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);

  const showUnavailableNotification = () => {
    notification.info({
      message: "Feature Unavailable",
      description: "This login method is currently unavailable. Please use email and password.",
      placement: "topRight",
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      notification.warning({
        message: "Missing Credentials",
        description: "Please enter your email and password.",
        placement: "topRight",
      });
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap(); // Dispatch login action
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in!",
        placement: "topRight",
      });
      navigate("/"); // Redirect to home page
    } catch (errorMessage) {
      notification.error({
        message: "Login Failed",
        description: errorMessage || "Invalid credentials.",
        placement: "topRight",
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 bg-[url('/src/assets/soccer.jpg')] bg-cover bg-center">
      {/* <div className="absolute inset-0 backdrop-blur-sm"></div> */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10">
        <h2 className="text-2xl font-semibold text-center">Log In</h2>
        <p className="text-center text-gray-500 mt-2">
          Don&#39;t have a Courtsite account yet?{" "}
          <Link to="/signup" className="text-blue-600 font-medium">
            Sign Up
          </Link>
        </p>

        <div className="mt-6">
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1 focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mt-4 relative">
          <label className="block text-gray-600">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

        <Link to="/forgot-password" >
          <p className="text-right text-blue-500 text-sm mt-2 cursor-pointer">Forgot Password?</p>
        </Link>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
          disabled={status === "loading"}
        >
          Log In
        </button>

        <p className="text-xs text-center text-gray-500 mt-2">
          By logging in, I agree to the Courtsite{" "}
          <span className="text-blue-500">Terms of Use</span> and{" "}
          <span className="text-blue-500">Privacy Policy</span>.
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full flex items-center justify-center border p-2 rounded mt-2 hover:bg-gray-100" onClick={showUnavailableNotification}>
          <FaFacebook size={20} className="text-blue-600 mr-2" /> Continue with
          Facebook
        </button>
        <button className="w-full flex items-center justify-center border p-2 rounded mt-2 hover:bg-gray-100" onClick={showUnavailableNotification}>
          <FcGoogle size={20} className="mr-2" /> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

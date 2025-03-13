import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd"; 
import { Client } from "../API/IdentityApi";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showUnavailableNotification = () => {
    notification.info({
      message: "Feature Unavailable",
      description: "This login method is currently unavailable. Please use email and password.",
      placement: "topRight",
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const userData = {
      email,
      name,
      phoneNumber,
      password,
      role: "customer",
    };

    try {
      const client = new Client(); // ✅ Create API client instance
      await client.register(userData); // ✅ Call register API

      notification.success({
        message: "Registration Successful",
        description: "Your account has been created. Please log in.",
        placement: "topRight",
      });

      navigate("/login"); // ✅ Redirect to login page
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      notification.error({
        message: "Registration Failed",
        description: error.message || "An error occurred. Please try again.",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-[url('/src/assets/soccer.jpg')] bg-cover bg-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">courtsite</h2>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Log In
          </Link>
        </p>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="mt-6">
          {/* Email Input */}
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />

          {/* Name Input */}
          <label className="block text-gray-700 mt-4">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            required
          />

          {/* Phone Number Input */}
          <label className="block text-gray-700 mt-4">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            required
          />

          {/* Password Input */}
          <label className="block text-gray-700 mt-4">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6 text-center text-gray-500">or</div>
        <button className="flex items-center justify-center w-full mt-4 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"   onClick={showUnavailableNotification}>
          <FaFacebook className="text-blue-600 mr-2" />
          Continue with Facebook
        </button>
        <button className="flex items-center justify-center w-full mt-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"   onClick={showUnavailableNotification}>
          <FcGoogle className="mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;

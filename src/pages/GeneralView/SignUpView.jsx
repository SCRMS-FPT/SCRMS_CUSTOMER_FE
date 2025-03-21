import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Client, RegisterUserRequest, ApiException } from "@/API/IdentityApi";

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

  const showUnavailableNotification = () => {
    notification.info({
      message: "Feature Unavailable",
      description:
        "This login method is currently unavailable. Please use email and password.",
      placement: "topRight",
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const client = new Client();

      // Create a RegisterUserRequest object with all required fields
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
          errorMsg = error.message || errorMsg;
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
          {/* First Name Input */}
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your first name"
            required
          />

          {/* Last Name Input */}
          <label className="block text-gray-700 mt-4">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your last name"
            required
          />

          {/* Email Input */}
          <label className="block text-gray-700 mt-4">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
          {/* Password Input */}
          <label className="block text-gray-700 mt-4">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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
          {/* Phone Number Input */}
          <label className="block text-gray-700 mt-4">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            required
          />

          {/* Birth Date and Gender Inputs in the same row */}
          <div className="flex space-x-4 mt-4">
            {/* Birth Date Input */}
            <div className="flex-1">
              <label className="block text-gray-700">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Gender Selection */}
            <div className="flex-1">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Undisclosed">Prefer not to say</option>
              </select>
            </div>
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
        <button
          className="flex items-center justify-center w-full mt-4 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
          onClick={showUnavailableNotification}
        >
          <FaFacebook className="text-blue-600 mr-2" />
          Continue with Facebook
        </button>
        <button
          className="flex items-center justify-center w-full mt-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
          onClick={showUnavailableNotification}
        >
          <FcGoogle className="mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignUpView;

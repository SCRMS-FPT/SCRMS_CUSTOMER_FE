import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
        <form className="mt-6">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />

          <label className="block text-gray-700 mt-4">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>

          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6 text-center text-gray-500">or</div>
        <button className="flex items-center justify-center w-full mt-4 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
          <FaFacebook className="text-blue-600 mr-2" />
          Continue with Facebook
        </button>
        <button className="flex items-center justify-center w-full mt-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
          <FcGoogle className="mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;

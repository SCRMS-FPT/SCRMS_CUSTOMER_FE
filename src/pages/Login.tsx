import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';  // Adjust this import according to your store setup
import { AnyAction } from 'redux';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>(); // Type the dispatch
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      try {
        // Dispatch the login action and await the result
        await dispatch(login({ email, password })).unwrap();
        navigate('/'); 
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Login failed:', error.message); // Log the error message
        } else {
          console.error('Login failed: Unknown error');
        }
        // Handle error display, e.g., show a toast or alert
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 bg-[url('/src/assets/soccer.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10">
        <h2 className="text-2xl font-semibold text-center">Log In</h2>
        <p className="text-center text-gray-500 mt-2">
          Don't have a Courtsite account yet? <span className="text-blue-500 cursor-pointer">Sign Up</span>
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
            type={showPassword ? 'text' : 'password'}
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
            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>

        <p className="text-right text-blue-500 text-sm mt-2 cursor-pointer">Forgot Password?</p>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
        >
          Log In
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          By logging in, I agree to the Courtsite <span className="text-blue-500">Terms of Use</span> and <span className="text-blue-500">Privacy Policy</span>.
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full flex items-center justify-center border p-2 rounded mt-2 hover:bg-gray-100">
          <FaFacebook size={20} className="text-blue-600 mr-2" /> Continue with Facebook
        </button>
        <button className="w-full flex items-center justify-center border p-2 rounded mt-2 hover:bg-gray-100">
          <FcGoogle size={20} className="mr-2" /> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

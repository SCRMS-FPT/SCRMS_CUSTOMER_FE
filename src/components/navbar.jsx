import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.svg";
import defaultAvatar from "../assets/default_avatar.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 md:px-12 py-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-6 relative">
        {/* Logo */}
        <Link to="/" className="text-blue-600 text-xl font-bold flex items-center">
          <img src={logo} alt="Courtsite" className="h-8 mr-2" />
          Courtsite
        </Link>

        {/* Clickable Dropdown Section */}
        <div className="relative">
          <button
            className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Discover
            <FaChevronDown
              className={`ml-2 text-sm transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
              <Link
                to="/browse-courts"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Browse Courts
              </Link>
              <Link
                to="/coaches"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Coaches
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/support" className="text-gray-700 hover:text-blue-600">
          Support
        </Link>

        {/* If user is logged in, show profile dropdown */}
        {user ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={user.profileImage || defaultAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-gray-700">{user.name}</span>
              <FaChevronDown
                className={`ml-2 text-sm transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  View Profile
                </Link>
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Log In
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-700 text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 md:hidden">
          <Link to="/support" className="text-gray-700 hover:text-blue-600">
            Support
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                View Profile
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-gray-700 hover:text-blue-600">
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

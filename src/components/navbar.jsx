import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { FaBars, FaTimes } from "react-icons/fa";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import logo from "../assets/logo.svg";
import defaultAvatar from "../assets/default_avatar.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Discover Dropdown Menu
  const discoverMenu = (
    <Menu>
      <Menu.Item key="courts">
        <Link to="/browse-courts">Browse Courts</Link>
      </Menu.Item>
      <Menu.Item key="coaches">
        <Link to="/coaches">Coaches</Link>
      </Menu.Item>
    </Menu>
  );

  // User Profile Dropdown Menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">View Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <button className="w-full text-left" onClick={handleLogout}>Log Out</button>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md px-6 md:px-12 py-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link to="/" className="text-blue-600 text-xl font-bold flex items-center">
          <img src={logo} alt="Courtsite" className="h-8 mr-2" />
          Courtsite
        </Link>

        {/* Discover Dropdown */}
        <Dropdown overlay={discoverMenu} trigger={["click"]}>
          <Button type="text" className="text-gray-700 hover:text-blue-600">
            Discover <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/support" className="text-gray-700 hover:text-blue-600">Support</Link>

        {/* User Profile Dropdown */}
        {user ? (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <button className="flex items-center space-x-2 focus:outline-none">
              <img
                src={user.profileImage || defaultAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-gray-700">{user.name}</span>
              <DownOutlined />
            </button>
          </Dropdown>
        ) : (
          <>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
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
          <Link to="/support" className="text-gray-700 hover:text-blue-600">Support</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">View Profile</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
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

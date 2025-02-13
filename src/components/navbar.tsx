import { useState } from "react";
import { Link } from "react-router-dom"; // Optional: If using React Router
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 md:px-12 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-blue-600 text-xl font-bold flex items-center">
        <img src={logo} alt="Courtsite" className="h-8 mr-2" />
        Courtsite
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/support" className="text-gray-700 hover:text-blue-600">
          Support
        </Link>
        <Link to="/signup" className="text-gray-700 hover:text-blue-600">
          Sign Up
        </Link>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Log In
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 md:hidden">
          <Link to="/support" className="text-gray-700 hover:text-blue-600">
            Support
          </Link>
          <Link to="/signup" className="text-gray-700 hover:text-blue-600">
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Log In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

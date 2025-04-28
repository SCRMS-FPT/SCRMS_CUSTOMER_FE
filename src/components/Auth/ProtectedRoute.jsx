import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowModal(true);
    }
  }, [token]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1); // Go back to previous page
  };

  if (!token) {
    return (
      <>
        <LoginModal
          isOpen={showModal}
          onClose={handleCloseModal}
          redirectPath={location.pathname}
        />
        {/* Render nothing else when not authenticated */}
        <div style={{ display: "none" }}></div>
      </>
    );
  }

  return children;
};

export default ProtectedRoute;

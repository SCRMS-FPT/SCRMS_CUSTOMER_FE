import React from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, isTokenExpired } = useAuth();
  console.log("ProtectedRoute: token =", token);
  console.log("ProtectedRoute: isExpired =", isTokenExpired());
  if (!token || isTokenExpired()) {
    console.log("Redirecting to /login because token is missing");
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;

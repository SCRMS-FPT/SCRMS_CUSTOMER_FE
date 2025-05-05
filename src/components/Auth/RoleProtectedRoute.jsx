import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleProtectedRoute = ({ children, requiredRoles }) => {
  const user = useSelector((state) => state.user.userProfile);

  // Check if user has any of the required roles
  const hasRequiredRole =
    user && requiredRoles.some((role) => user.roles?.includes(role));

  if (!hasRequiredRole) {
    // If user doesn't have the required role, redirect to forbidden
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

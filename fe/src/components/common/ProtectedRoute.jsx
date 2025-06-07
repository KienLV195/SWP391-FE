import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import { ROLES } from "../../services/mockData";

// Component to protect routes based on authentication and roles
const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isUserAuthenticated();
  const userRole = authService.getUserRole();

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;

// Specific route protection components for different roles
export const GuestRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
);

export const MemberRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>{children}</ProtectedRoute>
);

export const DoctorRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>{children}</ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>{children}</ProtectedRoute>
);

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.DOCTOR]}>
    {children}
  </ProtectedRoute>
);

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/components/LogoutButton.scss";

const LogoutButton = ({ className = "", variant = "default" }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Call logout API
      const result = await authService.logout();

      if (result.success) {
        // Redirect to home page
        navigate("/", { replace: true });
      } else {
        console.error("Logout failed:", result.error);
        // Still redirect even if logout fails
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      className={`logout-button logout-button--${variant} ${className}`}
      onClick={handleLogout}
      disabled={isLoggingOut}
      title="Đăng xuất"
    >
      {isLoggingOut ? (
        <>
          <span className="logout-button__spinner"></span>
          Đang đăng xuất...
        </>
      ) : (
        <>
          <span className="logout-button__icon">🚪</span>
          Đăng xuất
        </>
      )}
    </button>
  );
};

export default LogoutButton;

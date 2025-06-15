import React from "react";
import { FiUser, FiClock } from "react-icons/fi";
import "../../../styles/components/admin/WelcomeBanner.scss";

const WelcomeBanner = ({ adminName = "Quản trị viên" }) => {
  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-text">
          <div className="greeting">
            <FiUser className="greeting-icon" />
            <span className="greeting-message">
              👋 {getCurrentTime()}, {adminName}!
            </span>
          </div>
          <div className="welcome-subtitle">
            Chào mừng bạn đã quay trở lại hệ thống quản trị hiến máu
          </div>
        </div>

        <div className="welcome-info">
          <div className="date-time">
            <FiClock className="time-icon" />
            <span className="current-date">{getCurrentDate()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

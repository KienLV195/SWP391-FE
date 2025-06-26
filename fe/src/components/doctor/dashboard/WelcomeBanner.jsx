import React from "react";
import { FiUser, FiClock } from "react-icons/fi";
import "../../../styles/components/manager/WelcomeBanner.scss";

const WelcomeBanner = ({ doctorName = "Bác sĩ" }) => {
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
              👋 {getCurrentTime()}, {doctorName}!
            </span>
          </div>
          <div className="welcome-subtitle">
            Chào mừng bạn đã quay trở lại hệ thống quản lý hiến máu dành cho bác
            sĩ
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

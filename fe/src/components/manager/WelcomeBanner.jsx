import React from 'react';
import { FiUser, FiClock } from 'react-icons/fi';
import '../../styles/components/WelcomeBanner.scss';

const WelcomeBanner = ({ managerName = "Quản lý" }) => {
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours < 12) return "Chào buổi sáng";
    if (hours < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-text">
          <div className="greeting">
            <FiUser className="greeting-icon" />
            <span className="greeting-message">
              👋 {getCurrentTime()}, {managerName}!
            </span>
          </div>
          <div className="welcome-subtitle">
            Chào mừng quay trở lại hệ thống quản lý
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

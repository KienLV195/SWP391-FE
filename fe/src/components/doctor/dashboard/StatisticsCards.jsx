import React from "react";
import { FiDroplet, FiClipboard, FiAlertCircle } from "react-icons/fi";
import "../../../styles/components/manager/StatisticsCards.scss";

const StatisticsCards = ({ statistics }) => {
  const {
    myRequests = 0,
    pendingRequests = 0,
    urgentNotifications = 0,
  } = statistics;

  const cards = [
    {
      id: "my-requests",
      title: "Yêu cầu của tôi",
      value: myRequests,
      subtitle: "Tổng số yêu cầu",
      icon: FiClipboard,
      color: "primary",
    },
    {
      id: "pending-requests",
      title: "Chờ duyệt",
      value: pendingRequests,
      subtitle: "Yêu cầu đang chờ",
      icon: FiDroplet,
      color: "warning",
    },
    {
      id: "urgent-notifications",
      title: "Thông báo khẩn",
      value: urgentNotifications,
      subtitle: "Khẩn cấp",
      icon: FiAlertCircle,
      color: "danger",
    },
  ];

  return (
    <div className="statistics-cards">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div key={card.id} className={`stat-card ${card.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <IconComponent />
              </div>
              <div className="stat-title">{card.title}</div>
            </div>

            <div className="stat-content">
              <div className="stat-value">
                {card.value.toLocaleString("vi-VN")}
              </div>
              <div className="stat-subtitle">{card.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;

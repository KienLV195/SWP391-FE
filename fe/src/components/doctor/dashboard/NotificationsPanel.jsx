import React from "react";
import { FiBell, FiAlertCircle, FiInfo, FiCheckCircle } from "react-icons/fi";
import "../../../styles/components/manager/NotificationsPanel.scss";

const NotificationsPanel = ({ notifications = [] }) => {
  // Mock notifications if none provided
  const defaultNotifications = [
    {
      id: 1,
      type: "emergency",
      title: "Thiếu máu O- khẩn cấp",
      message: "Kho máu đang thiếu máu O- nghiêm trọng",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: 2,
      type: "info",
      title: "Cập nhật quy trình mới",
      message: "Quy trình yêu cầu máu đã được cập nhật",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];

  const displayNotifications =
    notifications.length > 0 ? notifications : defaultNotifications;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "emergency":
        return FiAlertCircle;
      case "warning":
        return FiAlertCircle;
      case "success":
        return FiCheckCircle;
      case "info":
      default:
        return FiInfo;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <div className="notifications-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FiBell className="title-icon" />
          <span>Thông báo hệ thống</span>
        </div>
        <div className="notification-count">
          {displayNotifications.filter((n) => !n.isRead).length} mới
        </div>
      </div>

      <div className="notifications-list">
        {displayNotifications.map((notification) => {
          const IconComponent = getNotificationIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`notification-item ${notification.type} ${
                notification.isRead ? "read" : "unread"
              }`}
            >
              <div className="notification-icon">
                <IconComponent />
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>

              {!notification.isRead && <div className="unread-indicator"></div>}
            </div>
          );
        })}
      </div>

      <div className="panel-footer">
        <button className="view-all-btn">Xem tất cả thông báo</button>
      </div>
    </div>
  );
};

export default NotificationsPanel;

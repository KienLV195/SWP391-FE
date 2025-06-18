import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MemberNavbar from "../../components/member/MemberNavbar";
import NotificationService from "../../services/notificationService";
import authService from "../../services/authService";
import "../../styles/pages/NotificationsPage.scss";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all");
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, filter, typeFilter]);

  const loadNotifications = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const data = await NotificationService.getNotifications(currentUser.id);
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filter by read status
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (filter === "read") {
      filtered = filtered.filter((n) => n.isRead);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(currentUser.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationAction = (notification) => {
    switch (notification.type) {
      case "urgent_request":
        return (
          <Link to="/member/blood-requests" className="notification-action">
            Xem yêu cầu máu
          </Link>
        );
      case "appointment_reminder":
        return (
          <Link to="/member/appointments" className="notification-action">
            Xem lịch hẹn
          </Link>
        );
      case "donation_reminder":
        return (
          <Link
            to="/member/donation-registration"
            className="notification-action"
          >
            Đăng ký hiến máu
          </Link>
        );
      case "health_check":
        return (
          <Link to="/member/health-records" className="notification-action">
            Xem kết quả
          </Link>
        );
      default:
        return null;
    }
  };

  const notificationTypes = [
    { value: "all", label: "Tất cả" },
    { value: "donation_reminder", label: "Nhắc nhở hiến máu" },
    { value: "urgent_request", label: "Yêu cầu khẩn cấp" },
    { value: "appointment_reminder", label: "Nhắc nhở lịch hẹn" },
    { value: "health_check", label: "Khám sức khỏe" },
    { value: "donation_thanks", label: "Cảm ơn hiến máu" },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      <MemberNavbar />

      <div className="notifications-content">
        <div className="page-header">
          <div>
            <h1>🔔 Thông báo</h1>
            <p>Quản lý tất cả thông báo của bạn</p>
            {unreadCount > 0 && (
              <div className="unread-summary">
                Bạn có {unreadCount} thông báo chưa đọc
              </div>
            )}
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="btn btn-primary" onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="unread">Chưa đọc ({unreadCount})</option>
              <option value="read">Đã đọc</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Loại thông báo:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {notificationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải thông báo...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>Không có thông báo nào</h3>
              <p>
                {filter === "unread"
                  ? "Bạn đã đọc hết tất cả thông báo!"
                  : "Chưa có thông báo nào được gửi đến bạn."}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${!notification.isRead ? "unread" : ""
                    }`}
                >
                  <div className="notification-header">
                    <div className="notification-icon-title">
                      <span
                        className="notification-icon"
                        style={{
                          color: NotificationService.getNotificationColor(
                            notification.type
                          ),
                        }}
                      >
                        {NotificationService.getNotificationIcon(
                          notification.type
                        )}
                      </span>
                      <div className="notification-title">
                        {notification.title}
                      </div>
                      {!notification.isRead && (
                        <div className="unread-indicator">●</div>
                      )}
                    </div>
                    <div className="notification-time">
                      {NotificationService.formatNotificationTime(
                        notification.createdAt
                      )}
                    </div>
                  </div>

                  <div className="notification-body">
                    <div className="notification-message">
                      {notification.message}
                    </div>

                    {notification.data && (
                      <div className="notification-details">
                        {notification.type === "donation_reminder" &&
                          notification.data.daysUntilEligible !== undefined && (
                            <div className="detail-item">
                              <strong>Thời gian còn lại:</strong>{" "}
                              {notification.data.daysUntilEligible === 0
                                ? "Có thể hiến ngay"
                                : `${notification.data.daysUntilEligible} ngày`}
                            </div>
                          )}
                        {notification.data.bloodType && (
                          <div className="detail-item">
                            <strong>Nhóm máu:</strong>
                            <span className="blood-type-badge">
                              {notification.data.bloodType}
                            </span>
                          </div>
                        )}
                        {notification.data.quantity && (
                          <div className="detail-item">
                            <strong>Số lượng:</strong>{" "}
                            {notification.data.quantity}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="notification-actions">
                      {getNotificationAction(notification)}

                      <div className="action-buttons">
                        {!notification.isRead && (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="notification-stats">
          <div className="stat-card">
            <h3>Tổng thông báo</h3>
            <p className="stat-number">{notifications.length}</p>
          </div>
          <div className="stat-card">
            <h3>Chưa đọc</h3>
            <p className="stat-number unread">{unreadCount}</p>
          </div>
          <div className="stat-card">
            <h3>Đã đọc</h3>
            <p className="stat-number read">
              {notifications.length - unreadCount}
            </p>
          </div>
          <div className="stat-card">
            <h3>Khẩn cấp</h3>
            <p className="stat-number urgent">
              {notifications.filter((n) => n.type === "urgent_request").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

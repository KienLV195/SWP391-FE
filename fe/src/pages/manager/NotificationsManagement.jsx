import React, { useState, useEffect } from "react";
import { Button, Space } from "antd";
import { BellOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import PageHeader from "../../components/manager/PageHeader";
import { mockUsers } from "../../services/mockData";
import "../../styles/pages/NotificationsManagement.scss";
import "../../styles/components/PageHeader.scss";

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    recipient: "all",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    recipients: "all",
    urgency: "normal",
    scheduledTime: "",
    isScheduled: false,
  });

  const NOTIFICATION_TYPES = {
    INFO: "info",
    WARNING: "warning",
    EMERGENCY: "emergency",
    REMINDER: "reminder",
    ANNOUNCEMENT: "announcement",
  };

  const NOTIFICATION_STATUS = {
    PENDING: "pending",
    SENT: "sent",
    SCHEDULED: "scheduled",
    FAILED: "failed",
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // TODO_API_REPLACE: Replace with actual API call - GET /api/manager/notifications
    const mockNotifications = [
      {
        id: 1,
        title: "Thiếu máu O- khẩn cấp",
        message:
          "Bệnh viện đang thiếu máu O- nghiêm trọng. Cần người hiến máu khẩn cấp.",
        type: NOTIFICATION_TYPES.EMERGENCY,
        recipients: "donors",
        recipientCount: 45,
        status: NOTIFICATION_STATUS.SENT,
        urgency: "high",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        readCount: 32,
        responseCount: 8,
      },
      {
        id: 2,
        title: "Lịch hiến máu định kỳ tháng 12",
        message:
          "Thông báo lịch hiến máu định kỳ tháng 12/2024. Đăng ký tại website hoặc hotline.",
        type: NOTIFICATION_TYPES.ANNOUNCEMENT,
        recipients: "all",
        recipientCount: 150,
        status: NOTIFICATION_STATUS.SENT,
        urgency: "normal",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        readCount: 89,
        responseCount: 23,
      },
      {
        id: 3,
        title: "Nhắc nhở khám sức khỏe định kỳ",
        message:
          "Đã đến thời gian khám sức khỏe định kỳ cho người hiến máu thường xuyên.",
        type: NOTIFICATION_TYPES.REMINDER,
        recipients: "donors",
        recipientCount: 67,
        status: NOTIFICATION_STATUS.SCHEDULED,
        urgency: "normal",
        createdAt: new Date().toISOString(),
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        readCount: 0,
        responseCount: 0,
      },
      {
        id: 4,
        title: "Cập nhật quy trình hiến máu mới",
        message:
          "Thông báo về quy trình hiến máu mới có hiệu lực từ ngày 15/12/2024.",
        type: NOTIFICATION_TYPES.INFO,
        recipients: "staff",
        recipientCount: 25,
        status: NOTIFICATION_STATUS.PENDING,
        urgency: "normal",
        createdAt: new Date().toISOString(),
        readCount: 0,
        responseCount: 0,
      },
    ];

    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  };

  useEffect(() => {
    // Apply filters
    let filtered = notifications;

    if (filters.type !== "all") {
      filtered = filtered.filter((notif) => notif.type === filters.type);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((notif) => notif.status === filters.status);
    }

    if (filters.recipient !== "all") {
      filtered = filtered.filter(
        (notif) => notif.recipients === filters.recipient
      );
    }

    setFilteredNotifications(filtered);
  }, [filters, notifications]);

  const getTypeText = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.INFO:
        return "Thông tin";
      case NOTIFICATION_TYPES.WARNING:
        return "Cảnh báo";
      case NOTIFICATION_TYPES.EMERGENCY:
        return "Khẩn cấp";
      case NOTIFICATION_TYPES.REMINDER:
        return "Nhắc nhở";
      case NOTIFICATION_TYPES.ANNOUNCEMENT:
        return "Thông báo";
      default:
        return "Khác";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case NOTIFICATION_STATUS.PENDING:
        return "Chờ gửi";
      case NOTIFICATION_STATUS.SENT:
        return "Đã gửi";
      case NOTIFICATION_STATUS.SCHEDULED:
        return "Đã lên lịch";
      case NOTIFICATION_STATUS.FAILED:
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const getRecipientText = (recipients) => {
    switch (recipients) {
      case "all":
        return "Tất cả";
      case "donors":
        return "Người hiến máu";
      case "recipients":
        return "Người cần máu";
      case "staff":
        return "Nhân viên";
      default:
        return "Khác";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.INFO:
        return "info";
      case NOTIFICATION_TYPES.WARNING:
        return "warning";
      case NOTIFICATION_TYPES.EMERGENCY:
        return "danger";
      case NOTIFICATION_TYPES.REMINDER:
        return "primary";
      case NOTIFICATION_TYPES.ANNOUNCEMENT:
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case NOTIFICATION_STATUS.PENDING:
        return "warning";
      case NOTIFICATION_STATUS.SENT:
        return "success";
      case NOTIFICATION_STATUS.SCHEDULED:
        return "info";
      case NOTIFICATION_STATUS.FAILED:
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleCreateNotification = () => {
    const notification = {
      id: notifications.length + 1,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      recipients: newNotification.recipients,
      recipientCount: getRecipientCount(newNotification.recipients),
      status: newNotification.isScheduled
        ? NOTIFICATION_STATUS.SCHEDULED
        : NOTIFICATION_STATUS.PENDING,
      urgency: newNotification.urgency,
      createdAt: new Date().toISOString(),
      scheduledTime: newNotification.isScheduled
        ? newNotification.scheduledTime
        : null,
      readCount: 0,
      responseCount: 0,
    };

    setNotifications((prev) => [...prev, notification]);
    setShowCreateModal(false);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      recipients: "all",
      urgency: "normal",
      scheduledTime: "",
      isScheduled: false,
    });
  };

  const getRecipientCount = (recipients) => {
    switch (recipients) {
      case "all":
        return 200;
      case "donors":
        return 120;
      case "recipients":
        return 55;
      case "staff":
        return 25;
      default:
        return 0;
    }
  };

  const handleSendNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? {
              ...notif,
              status: NOTIFICATION_STATUS.SENT,
              sentAt: new Date().toISOString(),
            }
          : notif
      )
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  return (
    <div className="notifications-management">
      <ManagerSidebar />

      <div className="notifications-content">
        <PageHeader
          title="Quản lý Thông báo"
          description="Tạo và gửi thông báo đến người dùng hệ thống"
          icon={BellOutlined}
          actions={[
            {
              label: "Tạo thông báo",
              type: "primary",
              icon: <PlusOutlined />,
              onClick: () => setShowCreateModal(true),
              style: { backgroundColor: "#D93E4C", borderColor: "#D93E4C" },
            },
            {
              label: "Làm mới",
              icon: <ReloadOutlined />,
              onClick: loadNotifications,
            },
          ]}
        />

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Loại thông báo:</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="all">Tất cả</option>
              <option value={NOTIFICATION_TYPES.INFO}>Thông tin</option>
              <option value={NOTIFICATION_TYPES.WARNING}>Cảnh báo</option>
              <option value={NOTIFICATION_TYPES.EMERGENCY}>Khẩn cấp</option>
              <option value={NOTIFICATION_TYPES.REMINDER}>Nhắc nhở</option>
              <option value={NOTIFICATION_TYPES.ANNOUNCEMENT}>Thông báo</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="all">Tất cả</option>
              <option value={NOTIFICATION_STATUS.PENDING}>Chờ gửi</option>
              <option value={NOTIFICATION_STATUS.SENT}>Đã gửi</option>
              <option value={NOTIFICATION_STATUS.SCHEDULED}>Đã lên lịch</option>
              <option value={NOTIFICATION_STATUS.FAILED}>Thất bại</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Người nhận:</label>
            <select
              value={filters.recipient}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, recipient: e.target.value }))
              }
            >
              <option value="all">Tất cả</option>
              <option value="donors">Người hiến máu</option>
              <option value="recipients">Người cần máu</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${getTypeColor(notification.type)}`}
            >
              <div className="card-header">
                <div className="notification-info">
                  <h3 className="notification-title">{notification.title}</h3>
                  <div className="notification-meta">
                    <span
                      className={`type-badge ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {getTypeText(notification.type)}
                    </span>
                    <span
                      className={`status-badge ${getStatusColor(
                        notification.status
                      )}`}
                    >
                      {getStatusText(notification.status)}
                    </span>
                    <span className="recipient-info">
                      👥 {getRecipientText(notification.recipients)} (
                      {notification.recipientCount})
                    </span>
                  </div>
                </div>
                <div className="notification-actions">
                  {notification.status === NOTIFICATION_STATUS.PENDING && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSendNotification(notification.id)}
                    >
                      Gửi ngay
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="card-body">
                <p className="notification-message">{notification.message}</p>

                <div className="notification-stats">
                  <div className="stat-item">
                    <span className="stat-label">Tạo lúc:</span>
                    <span className="stat-value">
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  {notification.sentAt && (
                    <div className="stat-item">
                      <span className="stat-label">Gửi lúc:</span>
                      <span className="stat-value">
                        {new Date(notification.sentAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}

                  {notification.scheduledTime && (
                    <div className="stat-item">
                      <span className="stat-label">Lên lịch:</span>
                      <span className="stat-value">
                        {new Date(notification.scheduledTime).toLocaleString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}

                  {notification.status === NOTIFICATION_STATUS.SENT && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Đã đọc:</span>
                        <span className="stat-value">
                          {notification.readCount}/{notification.recipientCount}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Phản hồi:</span>
                        <span className="stat-value">
                          {notification.responseCount}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="notification-stats-summary">
          <div className="stat-card">
            <h3>Tổng thông báo</h3>
            <p className="stat-number">{notifications.length}</p>
          </div>
          <div className="stat-card">
            <h3>Chờ gửi</h3>
            <p className="stat-number warning">
              {
                notifications.filter(
                  (n) => n.status === NOTIFICATION_STATUS.PENDING
                ).length
              }
            </p>
          </div>
          <div className="stat-card">
            <h3>Đã gửi</h3>
            <p className="stat-number success">
              {
                notifications.filter(
                  (n) => n.status === NOTIFICATION_STATUS.SENT
                ).length
              }
            </p>
          </div>
          <div className="stat-card">
            <h3>Khẩn cấp</h3>
            <p className="stat-number danger">
              {
                notifications.filter(
                  (n) => n.type === NOTIFICATION_TYPES.EMERGENCY
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo thông báo mới</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Nhập tiêu đề thông báo..."
                />
              </div>

              <div className="form-group">
                <label>Nội dung:</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Nhập nội dung thông báo..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loại thông báo:</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  >
                    <option value={NOTIFICATION_TYPES.INFO}>Thông tin</option>
                    <option value={NOTIFICATION_TYPES.WARNING}>Cảnh báo</option>
                    <option value={NOTIFICATION_TYPES.EMERGENCY}>
                      Khẩn cấp
                    </option>
                    <option value={NOTIFICATION_TYPES.REMINDER}>
                      Nhắc nhở
                    </option>
                    <option value={NOTIFICATION_TYPES.ANNOUNCEMENT}>
                      Thông báo
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Người nhận:</label>
                  <select
                    value={newNotification.recipients}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        recipients: e.target.value,
                      }))
                    }
                  >
                    <option value="all">Tất cả</option>
                    <option value="donors">Người hiến máu</option>
                    <option value="recipients">Người cần máu</option>
                    <option value="staff">Nhân viên</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newNotification.isScheduled}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        isScheduled: e.target.checked,
                      }))
                    }
                  />
                  Lên lịch gửi
                </label>
              </div>

              {newNotification.isScheduled && (
                <div className="form-group">
                  <label>Thời gian gửi:</label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledTime}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        scheduledTime: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateNotification}
                  disabled={!newNotification.title || !newNotification.message}
                >
                  {newNotification.isScheduled ? "Lên lịch" : "Tạo thông báo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;

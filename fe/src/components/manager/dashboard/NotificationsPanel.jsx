import React from 'react';
import { FiBell, FiAlertCircle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import '../../../styles/components/manager/NotificationsPanel.scss';

const NotificationsPanel = ({ notifications = [] }) => {
  // Mock notifications if none provided
  const defaultNotifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Cảnh báo kho máu',
      message: 'Nhóm máu O- sắp hết, chỉ còn 2 đơn vị',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Yêu cầu máu mới',
      message: 'Có 3 yêu cầu máu khẩn cấp cần xử lý',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Hiến máu thành công',
      message: 'Hoàng Văn E đã hoàn thành hiến máu O-',
      timestamp: '2024-01-15T08:45:00Z',
      isRead: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Lịch hẹn sắp tới',
      message: 'Có 5 lịch hẹn hiến máu trong ngày mai',
      timestamp: '2024-01-14T16:00:00Z',
      isRead: true
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return FiAlertCircle;
      case 'warning':
        return FiAlertCircle;
      case 'success':
        return FiCheckCircle;
      case 'info':
      default:
        return FiInfo;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xong';
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
          <span>Thông báo nội bộ</span>
        </div>
        <div className="notification-count">
          {displayNotifications.filter(n => !n.isRead).length} mới
        </div>
      </div>

      <div className="notifications-list">
        {displayNotifications.map((notification) => {
          const IconComponent = getNotificationIcon(notification.type);
          return (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.type} ${notification.isRead ? 'read' : 'unread'}`}
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
        <button className="view-all-btn">
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;

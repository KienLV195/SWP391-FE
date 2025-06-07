import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotificationService from '../../services/notificationService';
import authService from '../../services/authService';
import '../../styles/components/NotificationDropdown.scss';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications(currentUser.id);
      setNotifications(data.slice(0, 10)); // Show only latest 10
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!currentUser) return;
    
    try {
      const count = await NotificationService.getUnreadCount(currentUser.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      loadUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationAction = (notification) => {
    switch (notification.type) {
      case 'urgent_request':
        return (
          <Link 
            to="/member/blood-requests" 
            className="notification-action"
            onClick={() => setIsOpen(false)}
          >
            Xem chi tiết
          </Link>
        );
      case 'appointment_reminder':
        return (
          <Link 
            to="/member/appointments" 
            className="notification-action"
            onClick={() => setIsOpen(false)}
          >
            Xem lịch hẹn
          </Link>
        );
      case 'donation_reminder':
        return (
          <Link 
            to="/member/donation-registration" 
            className="notification-action"
            onClick={() => setIsOpen(false)}
          >
            Đăng ký hiến máu
          </Link>
        );
      default:
        return null;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className="notification-trigger"
        onClick={handleToggleDropdown}
        aria-label="Thông báo"
      >
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="notification-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thông báo...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="empty-icon">📭</span>
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <div className="notification-icon-wrapper">
                      <span 
                        className="notification-type-icon"
                        style={{ color: NotificationService.getNotificationColor(notification.type) }}
                      >
                        {NotificationService.getNotificationIcon(notification.type)}
                      </span>
                      {!notification.isRead && <div className="unread-dot"></div>}
                    </div>

                    <div className="notification-body">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {NotificationService.formatNotificationTime(notification.createdAt)}
                      </div>
                      
                      {getNotificationAction(notification)}
                    </div>

                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button
                          className="mark-read-btn"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Đánh dấu đã đọc"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Xóa thông báo"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <Link 
              to="/member/notifications" 
              className="view-all-link"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

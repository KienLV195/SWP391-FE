import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import authService from '../../services/authService';
import { 
  BLOOD_GROUPS, 
  URGENCY_LEVELS,
  DOCTOR_TYPES 
} from '../../services/mockData';
import '../../styles/pages/DoctorDashboard.scss';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    myRequests: [],
    recentActivity: [],
    bloodInventory: [],
    notifications: []
  });

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment = currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Mock dashboard data
    const mockData = {
      myRequests: [
        {
          requestID: 1,
          bloodType: 'O+',
          quantity: 2,
          urgencyLevel: URGENCY_LEVELS.URGENT,
          status: isBloodDepartment ? 'approved' : 'pending',
          createdTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reason: 'Phẫu thuật khẩn cấp'
        },
        {
          requestID: 2,
          bloodType: 'A-',
          quantity: 1,
          urgencyLevel: URGENCY_LEVELS.NORMAL,
          status: 'approved',
          createdTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          reason: 'Điều trị ung thư'
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'request_created',
          message: 'Tạo yêu cầu máu O+ - 2 đơn vị',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'request_approved',
          message: 'Yêu cầu máu A- đã được duyệt',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: 'notification',
          message: 'Thông báo: Thiếu máu O- khẩn cấp',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ],
      bloodInventory: [
        { bloodType: 'O+', quantity: 45, status: 'normal' },
        { bloodType: 'O-', quantity: 8, status: 'low' },
        { bloodType: 'A+', quantity: 32, status: 'normal' },
        { bloodType: 'A-', quantity: 12, status: 'normal' },
        { bloodType: 'B+', quantity: 28, status: 'normal' },
        { bloodType: 'B-', quantity: 5, status: 'critical' },
        { bloodType: 'AB+', quantity: 15, status: 'normal' },
        { bloodType: 'AB-', quantity: 3, status: 'critical' }
      ],
      notifications: [
        {
          id: 1,
          title: 'Thiếu máu O- khẩn cấp',
          message: 'Kho máu đang thiếu máu O- nghiêm trọng',
          type: 'emergency',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: 2,
          title: 'Cập nhật quy trình mới',
          message: 'Quy trình yêu cầu máu đã được cập nhật',
          type: 'info',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true
        }
      ]
    };

    setDashboardData(mockData);
  }, [isBloodDepartment]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'processing': return 'info';
      case 'completed': return 'primary';
      default: return 'secondary';
    }
  };

  const getInventoryStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success';
      case 'low': return 'warning';
      case 'critical': return 'danger';
      default: return 'secondary';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'request_created': return '📝';
      case 'request_approved': return '✅';
      case 'notification': return '🔔';
      default: return '📋';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="doctor-dashboard">
      <DoctorSidebar />
      
      <div className="doctor-dashboard-content">
        <div className="page-header">
          <div>
            <h1>🏥 Dashboard Bác sĩ</h1>
            <p>Chào mừng, BS. {currentUser?.name}</p>
            <div className="doctor-type-badge">
              {isBloodDepartment ? '🩸 Khoa Huyết học' : '🏥 Khoa khác'}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Yêu cầu của tôi</h3>
              <p className="stat-number">{dashboardData.myRequests.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Chờ duyệt</h3>
              <p className="stat-number warning">
                {dashboardData.myRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Đã duyệt</h3>
              <p className="stat-number success">
                {dashboardData.myRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-info">
              <h3>Thông báo mới</h3>
              <p className="stat-number info">
                {dashboardData.notifications.filter(n => !n.isRead).length}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* My Recent Requests */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📋 Yêu cầu máu gần đây</h2>
              <a href="/doctor/blood-requests" className="view-all-link">Xem tất cả</a>
            </div>
            <div className="card-body">
              {dashboardData.myRequests.length > 0 ? (
                <div className="requests-list">
                  {dashboardData.myRequests.slice(0, 3).map(request => (
                    <div key={request.requestID} className="request-item">
                      <div className="request-info">
                        <div className="blood-type">{request.bloodType}</div>
                        <div className="request-details">
                          <div className="quantity">{request.quantity} đơn vị</div>
                          <div className="reason">{request.reason}</div>
                        </div>
                      </div>
                      <div className="request-status">
                        <span className={`status-badge status-${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        <small>{new Date(request.createdTime).toLocaleDateString('vi-VN')}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Chưa có yêu cầu máu nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Blood Inventory Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🏦 Tình trạng kho máu</h2>
              <a href="/doctor/blood-inventory" className="view-all-link">Xem chi tiết</a>
            </div>
            <div className="card-body">
              <div className="inventory-grid">
                {dashboardData.bloodInventory.map(item => (
                  <div key={item.bloodType} className={`inventory-item ${getInventoryStatusColor(item.status)}`}>
                    <div className="blood-type">{item.bloodType}</div>
                    <div className="quantity">{item.quantity}</div>
                    <div className={`status ${item.status}`}>
                      {item.status === 'normal' ? 'Bình thường' : 
                       item.status === 'low' ? 'Thấp' : 'Cực thấp'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📊 Hoạt động gần đây</h2>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {dashboardData.recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                    <div className="activity-content">
                      <div className="activity-message">{activity.message}</div>
                      <div className="activity-time">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🔔 Thông báo</h2>
            </div>
            <div className="card-body">
              <div className="notifications-list">
                {dashboardData.notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                    <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {new Date(notification.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>⚡ Thao tác nhanh</h2>
          <div className="actions-grid">
            <a href="/doctor/blood-requests" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-title">Tạo yêu cầu máu</div>
              <div className="action-description">Tạo yêu cầu máu mới cho bệnh nhân</div>
            </a>
            
            {isBloodDepartment && (
              <a href="/doctor/external-requests" className="action-card">
                <div className="action-icon">🌐</div>
                <div className="action-title">Duyệt yêu cầu bên ngoài</div>
                <div className="action-description">Xem và duyệt yêu cầu từ bên ngoài</div>
              </a>
            )}
            
            <a href="/doctor/blood-inventory" className="action-card">
              <div className="action-icon">🏦</div>
              <div className="action-title">Xem kho máu</div>
              <div className="action-description">Kiểm tra tình trạng kho máu hiện tại</div>
            </a>
            
            <a href="/doctor/reports" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-title">Báo cáo</div>
              <div className="action-description">Xem báo cáo và thống kê</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

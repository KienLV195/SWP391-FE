import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberNavbar from '../../components/member/MemberNavbar';
import authService from '../../services/authService';
import '../../styles/pages/ActivityHistory.scss';

const ActivityHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all'); // all, donation, request
  const [sortBy, setSortBy] = useState('date'); // date, type, status

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setActivities(currentUser.activityHistory || []);
    }
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'donation':
        return '🩸';
      case 'request':
        return '🏥';
      default:
        return '📋';
    }
  };

  const getActivityTypeText = (type) => {
    switch (type) {
      case 'donation':
        return 'Hiến máu';
      case 'request':
        return 'Yêu cầu máu';
      default:
        return 'Hoạt động';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed':
        return { text: 'Hoàn thành', color: 'success' };
      case 'pending':
        return { text: 'Đang xử lý', color: 'warning' };
      case 'approved':
        return { text: 'Đã duyệt', color: 'info' };
      case 'rejected':
        return { text: 'Từ chối', color: 'danger' };
      case 'medical_checked':
        return { text: 'Đã khám sàng lọc', color: 'info' };
      default:
        return { text: 'Chưa xác định', color: 'secondary' };
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MemberNavbar />
      <div className="activity-history">
        <div className="activity-header">
          <h1>Lịch sử hoạt động</h1>
          <p>Theo dõi tất cả các hoạt động hiến máu và yêu cầu máu của bạn</p>
        </div>

        <div className="activity-content">
          {/* Filters and Sort */}
          <div className="activity-controls">
            <div className="filter-group">
              <label>Lọc theo loại:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả</option>
                <option value="donation">Hiến máu</option>
                <option value="request">Yêu cầu máu</option>
              </select>
            </div>

            <div className="sort-group">
              <label>Sắp xếp theo:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Ngày</option>
                <option value="type">Loại</option>
                <option value="status">Trạng thái</option>
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="activity-stats">
            <div className="stat-card">
              <div className="stat-icon">🩸</div>
              <div className="stat-info">
                <h3>Lần hiến máu</h3>
                <div className="stat-number">
                  {activities.filter(a => a.type === 'donation').length}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <h3>Yêu cầu máu</h3>
                <div className="stat-number">
                  {activities.filter(a => a.type === 'request').length}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Hoàn thành</h3>
                <div className="stat-number">
                  {activities.filter(a => a.status === 'completed').length}
                </div>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="activity-list">
            {sortedActivities.length > 0 ? (
              sortedActivities.map(activity => {
                const statusInfo = getStatusDisplay(activity.status);
                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="activity-main">
                      <div className="activity-header-item">
                        <h3>{getActivityTypeText(activity.type)}</h3>
                        <span className={`status status-${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <div className="activity-details">
                        <div className="detail-row">
                          <span className="label">Ngày:</span>
                          <span>{new Date(activity.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Nhóm máu:</span>
                          <span className="blood-type">{activity.bloodType}</span>
                        </div>
                        {activity.type === 'donation' && (
                          <>
                            <div className="detail-row">
                              <span className="label">Số lượng:</span>
                              <span>{activity.quantity}ml</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Địa điểm:</span>
                              <span>{activity.location}</span>
                            </div>
                          </>
                        )}
                        {activity.type === 'request' && (
                          <>
                            <div className="detail-row">
                              <span className="label">Số lượng:</span>
                              <span>{activity.quantity} đơn vị</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Lý do:</span>
                              <span>{activity.reason}</span>
                            </div>
                          </>
                        )}
                        {activity.notes && (
                          <div className="detail-row">
                            <span className="label">Ghi chú:</span>
                            <span>{activity.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-activities">
                <div className="no-activities-icon">📋</div>
                <h3>Chưa có hoạt động nào</h3>
                <p>Bạn chưa có hoạt động hiến máu hoặc yêu cầu máu nào.</p>
                <div className="no-activities-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/member/blood-donation-form')}
                  >
                    Đăng ký hiến máu
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/member/blood-request-form')}
                  >
                    Yêu cầu máu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={() => navigate('/member/blood-donation-form')}
              >
                <span className="action-icon">🩸</span>
                Đăng ký hiến máu mới
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => navigate('/member/blood-request-form')}
              >
                <span className="action-icon">🏥</span>
                Tạo yêu cầu máu
              </button>
              <button 
                className="action-btn info"
                onClick={() => navigate('/member/profile')}
              >
                <span className="action-icon">👤</span>
                Cập nhật hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityHistory;

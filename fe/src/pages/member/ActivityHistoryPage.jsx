import React, { useState, useEffect } from 'react';
import MemberNavbar from '../../components/member/MemberNavbar';
import StatusWorkflowTracker from '../../components/common/StatusWorkflowTracker';
import StatusWorkflowService from '../../services/statusWorkflowService';
import authService from '../../services/authService';
import '../../styles/pages/ActivityHistoryPage.scss';

const ActivityHistoryPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, donations, requests
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadActivityHistory();
  }, []);

  const loadActivityHistory = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - GET /api/member/activity-history
      const mockActivities = [
        {
          id: 1,
          type: 'donation',
          title: 'Hiến máu tình nguyện',
          status: StatusWorkflowService.DONATION_STATUSES.COMPLETED,
          bloodType: 'O+',
          quantity: '450ml',
          appointmentDate: '2024-12-10',
          timeSlot: 'morning',
          location: 'Bệnh viện XYZ - Tầng 2',
          notes: 'Hiến máu thành công, sức khỏe tốt',
          createdAt: '2024-12-05T08:00:00Z',
          completedAt: '2024-12-10T10:30:00Z'
        },
        {
          id: 2,
          type: 'request',
          title: 'Yêu cầu máu cho gia đình',
          status: StatusWorkflowService.REQUEST_STATUSES.FULFILLED,
          bloodType: 'A+',
          quantity: '2 đơn vị',
          urgency: 'urgent',
          patientName: 'Nguyễn Thị B',
          hospitalName: 'Bệnh viện ABC',
          notes: 'Đã xuất kho thành công',
          createdAt: '2024-11-20T14:00:00Z',
          completedAt: '2024-11-21T09:15:00Z'
        },
        {
          id: 3,
          type: 'donation',
          title: 'Hiến máu khẩn cấp',
          status: StatusWorkflowService.DONATION_STATUSES.DONATED,
          bloodType: 'O+',
          quantity: '450ml',
          appointmentDate: '2024-11-15',
          timeSlot: 'afternoon',
          location: 'Bệnh viện XYZ - Tầng 2',
          notes: 'Đang chờ xét nghiệm',
          createdAt: '2024-11-14T16:00:00Z',
          completedAt: null
        },
        {
          id: 4,
          type: 'donation',
          title: 'Hiến máu định kỳ',
          status: StatusWorkflowService.DONATION_STATUSES.NOT_ELIGIBLE,
          bloodType: 'O+',
          quantity: '450ml',
          appointmentDate: '2024-10-20',
          timeSlot: 'morning',
          location: 'Bệnh viện XYZ - Tầng 2',
          notes: 'Huyết áp cao, không đủ điều kiện',
          createdAt: '2024-10-18T10:00:00Z',
          completedAt: '2024-10-20T09:45:00Z'
        },
        {
          id: 5,
          type: 'request',
          title: 'Yêu cầu máu khẩn cấp',
          status: StatusWorkflowService.REQUEST_STATUSES.PENDING,
          bloodType: 'AB-',
          quantity: '1 đơn vị',
          urgency: 'emergency',
          patientName: 'Trần Văn C',
          hospitalName: 'Bệnh viện DEF',
          notes: 'Đang chờ duyệt',
          createdAt: '2024-12-15T20:00:00Z',
          completedAt: null
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading activity history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredActivities = () => {
    switch (filter) {
      case 'donations':
        return activities.filter(a => a.type === 'donation');
      case 'requests':
        return activities.filter(a => a.type === 'request');
      default:
        return activities;
    }
  };

  const handleViewWorkflow = (activity) => {
    setSelectedActivity(activity);
    setShowWorkflowModal(true);
  };

  const getActivityIcon = (type) => {
    return type === 'donation' ? '🩸' : '📋';
  };

  const getStatusColor = (status, type) => {
    const statusInfo = StatusWorkflowService.getStatusInfo(status, type);
    return statusInfo.color;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return '#dc3545';
      case 'urgent': return '#fd7e14';
      default: return '#28a745';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'emergency': return '🚨 Cấp cứu';
      case 'urgent': return '⚡ Khẩn cấp';
      default: return '📋 Bình thường';
    }
  };

  const filteredActivities = getFilteredActivities();
  const donationCount = activities.filter(a => a.type === 'donation').length;
  const requestCount = activities.filter(a => a.type === 'request').length;
  const completedCount = activities.filter(a => 
    [StatusWorkflowService.DONATION_STATUSES.COMPLETED, 
     StatusWorkflowService.REQUEST_STATUSES.COMPLETED].includes(a.status)
  ).length;

  return (
    <div className="activity-history-page">
      <MemberNavbar />
      
      <div className="activity-content">
        <div className="page-header">
          <div className="header-content">
            <h1>Lịch sử hoạt động</h1>
            <p>Theo dõi lịch sử hiến máu và yêu cầu máu của bạn</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={loadActivityHistory}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card total">
            <div className="stat-number">{activities.length}</div>
            <div className="stat-label">Tổng hoạt động</div>
          </div>
          
          <div className="stat-card donations">
            <div className="stat-number">{donationCount}</div>
            <div className="stat-label">Lần hiến máu</div>
          </div>
          
          <div className="stat-card requests">
            <div className="stat-number">{requestCount}</div>
            <div className="stat-label">Yêu cầu máu</div>
          </div>
          
          <div className="stat-card completed">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Hoàn thành</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Lọc theo:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả ({activities.length})</option>
              <option value="donations">Hiến máu ({donationCount})</option>
              <option value="requests">Yêu cầu máu ({requestCount})</option>
            </select>
          </div>
        </div>

        {/* Activities List */}
        <div className="activities-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải lịch sử hoạt động...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📜</span>
              <h3>Chưa có hoạt động nào</h3>
              <p>
                {filter === 'donations' ? 'Bạn chưa có lần hiến máu nào.' :
                 filter === 'requests' ? 'Bạn chưa có yêu cầu máu nào.' :
                 'Bạn chưa có hoạt động nào.'}
              </p>
            </div>
          ) : (
            <div className="activities-list">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-header">
                    <div className="activity-info">
                      <div className="activity-title">
                        {getActivityIcon(activity.type)} {activity.title}
                      </div>
                      <div className="activity-date">
                        {new Date(activity.createdAt).toLocaleDateString('vi-VN')}
                        {activity.completedAt && (
                          <span className="completed-date">
                            → {new Date(activity.completedAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="activity-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(activity.status, activity.type) }}
                      >
                        {StatusWorkflowService.getStatusInfo(activity.status, activity.type).text}
                      </span>
                    </div>
                  </div>

                  <div className="activity-details">
                    <div className="detail-section">
                      <h4>Thông tin máu</h4>
                      <div className="blood-info">
                        <span className="blood-type-badge">{activity.bloodType}</span>
                        <span className="quantity-info">{activity.quantity}</span>
                        {activity.urgency && (
                          <span 
                            className="urgency-badge"
                            style={{ backgroundColor: getUrgencyColor(activity.urgency) }}
                          >
                            {getUrgencyText(activity.urgency)}
                          </span>
                        )}
                      </div>
                    </div>

                    {activity.type === 'donation' && (
                      <div className="detail-section">
                        <h4>Thông tin lịch hẹn</h4>
                        <div className="appointment-info">
                          <span>Ngày: {new Date(activity.appointmentDate).toLocaleDateString('vi-VN')}</span>
                          <span>Khung giờ: {activity.timeSlot === 'morning' ? '7:00-11:00' : '13:00-17:00'}</span>
                          <span>Địa điểm: {activity.location}</span>
                        </div>
                      </div>
                    )}

                    {activity.type === 'request' && (
                      <div className="detail-section">
                        <h4>Thông tin bệnh nhân</h4>
                        <div className="patient-info">
                          <span>Bệnh nhân: {activity.patientName}</span>
                          <span>Bệnh viện: {activity.hospitalName}</span>
                        </div>
                      </div>
                    )}

                    {activity.notes && (
                      <div className="detail-section">
                        <h4>Ghi chú</h4>
                        <div className="notes">{activity.notes}</div>
                      </div>
                    )}
                  </div>

                  <div className="activity-actions">
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewWorkflow(activity)}
                    >
                      Xem tiến trình
                    </button>
                    
                    {activity.type === 'donation' && activity.status === StatusWorkflowService.DONATION_STATUSES.COMPLETED && (
                      <button className="btn btn-success">
                        Giấy chứng nhận
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workflow Modal */}
      {showWorkflowModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowWorkflowModal(false)}>
          <div className="workflow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tiến trình {selectedActivity.type === 'donation' ? 'hiến máu' : 'yêu cầu máu'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowWorkflowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="activity-summary">
                <h4>{getActivityIcon(selectedActivity.type)} {selectedActivity.title}</h4>
                <p>{new Date(selectedActivity.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              
              <StatusWorkflowTracker
                currentStatus={selectedActivity.status}
                userRole={StatusWorkflowService.USER_ROLES.MEMBER}
                workflowType={selectedActivity.type}
                itemId={selectedActivity.id}
                showActions={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberNavbar from '../../components/member/MemberNavbar';
import authService from '../../services/authService';
import { getBloodRequestsByRole, REQUEST_STATUS } from '../../services/mockData';
import '../../styles/pages/BloodRecipientDashboard.scss';

const BloodRecipientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bloodRequests, setBloodRequests] = useState([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const requests = getBloodRequestsByRole(currentUser.role, currentUser.id);
      setBloodRequests(requests);
    }
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return { text: 'Đang chờ xử lý', color: 'warning' };
      case REQUEST_STATUS.APPROVED:
        return { text: 'Đã duyệt', color: 'success' };
      case REQUEST_STATUS.REJECTED:
        return { text: 'Từ chối', color: 'danger' };
      case REQUEST_STATUS.COMPLETED:
        return { text: 'Hoàn thành', color: 'info' };
      default:
        return { text: 'Chưa xác định', color: 'secondary' };
    }
  };

  const handleNewRequest = () => {
    navigate('/member/blood-request-form');
  };

  const handleViewRequest = (requestId) => {
    navigate(`/member/blood-request/${requestId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MemberNavbar />
      <div className="blood-recipient-dashboard">
        <div className="dashboard-header">
          <h1>Bảng điều khiển người cần máu</h1>
          <p>Chào mừng, {user.profile.fullName}</p>
        </div>

        <div className="dashboard-content">
          {/* Quick Request Card */}
          <div className="quick-request-card">
            <h2>Yêu cầu máu khẩn cấp</h2>
            <p>Tạo yêu cầu máu mới cho trường hợp khẩn cấp hoặc điều trị</p>
            <button
              className="btn btn-danger"
              onClick={handleNewRequest}
            >
              Tạo yêu cầu mới
            </button>
          </div>

          {/* Profile Summary */}
          <div className="profile-summary">
            <h2>Thông tin cá nhân</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Nhóm máu:</label>
                <span className="blood-type">
                  {user.profile.bloodType || 'Chưa xác định'}
                </span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{user.profile.phone}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.profile.email}</span>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <span>{user.profile.address}</span>
              </div>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/member/profile')}
            >
              Cập nhật thông tin
            </button>
          </div>

          {/* Blood Requests History */}
          <div className="blood-requests">
            <h2>Lịch sử yêu cầu máu</h2>
            {bloodRequests.length > 0 ? (
              <div className="requests-list">
                {bloodRequests.map(request => {
                  const statusInfo = getStatusDisplay(request.status);
                  return (
                    <div key={request.id} className="request-item">
                      <div className="request-header">
                        <span className="request-date">
                          {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className={`status status-${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="request-details">
                        <div className="detail-row">
                          <span className="label">Nhóm máu:</span>
                          <span className="blood-type">{request.bloodType}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Thành phần:</span>
                          <span>{request.component === 'whole_blood' ? 'Máu toàn phần' : 'Tiểu cầu'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Số lượng:</span>
                          <span>{request.quantity} đơn vị</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Mức độ:</span>
                          <span className={`urgency ${request.urgency}`}>
                            {request.urgency === 'emergency' ? 'Khẩn cấp' : 'Bình thường'}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Lý do:</span>
                          <span>{request.reason}</span>
                        </div>
                      </div>
                      <div className="request-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewRequest(request.id)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-requests">
                <p>Chưa có yêu cầu máu nào</p>
                <button
                  className="btn btn-primary"
                  onClick={handleNewRequest}
                >
                  Tạo yêu cầu đầu tiên
                </button>
              </div>
            )}
          </div>

          {/* Blood Compatibility Tool */}
          <div className="compatibility-tool">
            <h2>Tra cứu nhóm máu tương thích</h2>
            <p>Tìm hiểu về các nhóm máu có thể tương thích với nhóm máu của bạn</p>
            <button
              className="btn btn-info"
              onClick={() => navigate('/member/blood-compatibility')}
            >
              Tra cứu ngay
            </button>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() => navigate('/member/blood-info')}
              >
                <i className="icon-info"></i>
                Tài liệu về máu
              </button>
              <button
                className="action-btn"
                onClick={() => navigate('/member/blog')}
              >
                <i className="icon-blog"></i>
                Tin tức
              </button>
              <button
                className="action-btn"
                onClick={() => navigate('/member/notifications')}
              >
                <i className="icon-notification"></i>
                Thông báo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodRecipientDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { mockBloodRequests, REQUEST_STATUS, DOCTOR_TYPES } from '../../services/mockData';
import '../../styles/pages/DoctorDashboard.scss';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Filter requests based on doctor type
      const pending = mockBloodRequests.filter(req => req.status === REQUEST_STATUS.PENDING);
      const processed = mockBloodRequests.filter(req => req.status !== REQUEST_STATUS.PENDING);
      
      setPendingRequests(pending);
      setProcessedRequests(processed);
    }
  }, []);

  const handleApproveRequest = (requestId) => {
    // In real app, this would call API
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    setProcessedRequests(prev => [...prev, {
      ...mockBloodRequests.find(req => req.id === requestId),
      status: REQUEST_STATUS.APPROVED
    }]);
  };

  const handleRejectRequest = (requestId, note) => {
    // In real app, this would call API
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    setProcessedRequests(prev => [...prev, {
      ...mockBloodRequests.find(req => req.id === requestId),
      status: REQUEST_STATUS.REJECTED,
      rejectionNote: note
    }]);
  };

  const handleViewRequest = (requestId) => {
    navigate(`/doctor/request/${requestId}`);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return { text: 'Đang chờ xử lý', color: 'warning' };
      case REQUEST_STATUS.APPROVED:
        return { text: 'Đã chấp nhận', color: 'success' };
      case REQUEST_STATUS.REJECTED:
        return { text: 'Đã từ chối', color: 'danger' };
      case REQUEST_STATUS.COMPLETED:
        return { text: 'Hoàn thành', color: 'info' };
      default:
        return { text: 'Chưa xác định', color: 'secondary' };
    }
  };

  const getDoctorTypeDisplay = (doctorType) => {
    return doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT ? 'Khoa Huyết học' : 'Khoa khác';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển bác sĩ</h1>
        <div className="doctor-info">
          <p><strong>{user.profile.fullName}</strong></p>
          <p>{user.profile.department} - {getDoctorTypeDisplay(user.doctorType)}</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Statistics Cards */}
        <div className="stats-cards">
          <div className="stat-card pending">
            <h3>Yêu cầu chờ xử lý</h3>
            <div className="stat-number">{pendingRequests.length}</div>
          </div>
          <div className="stat-card approved">
            <h3>Đã chấp nhận</h3>
            <div className="stat-number">
              {processedRequests.filter(req => req.status === REQUEST_STATUS.APPROVED).length}
            </div>
          </div>
          <div className="stat-card rejected">
            <h3>Đã từ chối</h3>
            <div className="stat-number">
              {processedRequests.filter(req => req.status === REQUEST_STATUS.REJECTED).length}
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="pending-requests-section">
          <h2>Yêu cầu cần xử lý</h2>
          {pendingRequests.length > 0 ? (
            <div className="requests-list">
              {pendingRequests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-info">
                      <span className="request-id">#{request.id}</span>
                      <span className="request-date">
                        {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <span className={`urgency ${request.urgency}`}>
                      {request.urgency === 'emergency' ? 'KHẨN CẤP' : 'BÌNH THƯỜNG'}
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
                      <span className="label">Lý do:</span>
                      <span>{request.reason}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Bác sĩ yêu cầu:</span>
                      <span>{request.doctorInfo.name} - {request.doctorInfo.department}</span>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewRequest(request.id)}
                    >
                      Xem chi tiết
                    </button>
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleApproveRequest(request.id)}
                    >
                      Chấp nhận
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        const note = prompt('Nhập lý do từ chối:');
                        if (note) {
                          handleRejectRequest(request.id, note);
                        }
                      }}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-requests">
              <p>Không có yêu cầu nào cần xử lý</p>
            </div>
          )}
        </div>

        {/* Recent Processed Requests */}
        <div className="processed-requests-section">
          <h2>Yêu cầu đã xử lý gần đây</h2>
          {processedRequests.length > 0 ? (
            <div className="requests-list">
              {processedRequests.slice(0, 5).map(request => {
                const statusInfo = getStatusDisplay(request.status);
                return (
                  <div key={request.id} className="request-card processed">
                    <div className="request-header">
                      <div className="request-info">
                        <span className="request-id">#{request.id}</span>
                        <span className="request-date">
                          {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <span className={`status status-${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <div className="request-summary">
                      <span className="blood-type">{request.bloodType}</span>
                      <span className="quantity">{request.quantity} đơn vị</span>
                      <span className="reason">{request.reason}</span>
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
              <p>Chưa có yêu cầu nào được xử lý</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

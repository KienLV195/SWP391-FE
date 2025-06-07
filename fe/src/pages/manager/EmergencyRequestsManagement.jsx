import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { 
  mockBloodRequests, 
  REQUEST_STATUS, 
  URGENCY_LEVELS,
  BLOOD_GROUPS,
  RH_TYPES 
} from '../../services/mockData';
import '../../styles/pages/EmergencyRequestsManagement.scss';

const EmergencyRequestsManagement = () => {
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [publicRequests, setPublicRequests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bloodGroup: '',
    rhType: '',
    quantity: 1,
    urgencyLevel: URGENCY_LEVELS.URGENT,
    reason: '',
    deadline: '',
    isPublic: true,
    contactInfo: ''
  });

  useEffect(() => {
    // Load emergency requests (urgent and critical)
    const urgent = mockBloodRequests.filter(req => 
      req.urgencyLevel >= URGENCY_LEVELS.URGENT
    );
    setEmergencyRequests(urgent);

    // Mock public emergency requests
    const publicEmergency = [
      {
        id: 1,
        bloodType: 'O-',
        quantity: 3,
        urgencyLevel: URGENCY_LEVELS.CRITICAL,
        reason: 'Tai nạn giao thông nghiêm trọng',
        deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
        isRare: true,
        contactInfo: 'Khoa Cấp cứu - ĐT: 0123456789',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 2,
        bloodType: 'AB-',
        quantity: 2,
        urgencyLevel: URGENCY_LEVELS.URGENT,
        reason: 'Phẫu thuật tim khẩn cấp',
        deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        isRare: true,
        contactInfo: 'Khoa Tim mạch - ĐT: 0987654321',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'active'
      }
    ];
    setPublicRequests(publicEmergency);
  }, []);

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.URGENT: return 'Khẩn cấp';
      case URGENCY_LEVELS.CRITICAL: return 'Cực kỳ khẩn cấp';
      default: return 'Bình thường';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.URGENT: return 'warning';
      case URGENCY_LEVELS.CRITICAL: return 'danger';
      default: return 'info';
    }
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleCreatePublicRequest = () => {
    const request = {
      id: publicRequests.length + 1,
      bloodType: `${newRequest.bloodGroup}${newRequest.rhType}`,
      quantity: newRequest.quantity,
      urgencyLevel: newRequest.urgencyLevel,
      reason: newRequest.reason,
      deadline: newRequest.deadline,
      isRare: ['AB-', 'B-', 'O-'].includes(`${newRequest.bloodGroup}${newRequest.rhType}`),
      contactInfo: newRequest.contactInfo,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setPublicRequests(prev => [...prev, request]);
    setShowCreateModal(false);
    setNewRequest({
      bloodGroup: '',
      rhType: '',
      quantity: 1,
      urgencyLevel: URGENCY_LEVELS.URGENT,
      reason: '',
      deadline: '',
      isPublic: true,
      contactInfo: ''
    });
  };

  const handleDeactivateRequest = (requestId) => {
    setPublicRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'completed' } : req
    ));
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="emergency-requests-management">
      <ManagerSidebar />
      
      <div className="emergency-requests-content">
        <div className="page-header">
          <div>
            <h1>🚨 Quản lý Yêu cầu Khẩn cấp</h1>
            <p>Quản lý và đăng yêu cầu máu khẩn cấp công khai</p>
          </div>
          <button 
            className="btn btn-danger"
            onClick={() => setShowCreateModal(true)}
          >
            + Tạo yêu cầu khẩn cấp
          </button>
        </div>

        {/* Emergency Alert Banner */}
        <div className="emergency-banner">
          <div className="banner-icon">🚨</div>
          <div className="banner-content">
            <h3>Cảnh báo thiếu máu khẩn cấp</h3>
            <p>Hiện tại có {publicRequests.filter(r => r.status === 'active').length} yêu cầu máu khẩn cấp đang chờ xử lý</p>
          </div>
        </div>

        {/* Internal Emergency Requests */}
        <div className="requests-section">
          <h2>📋 Yêu cầu khẩn cấp nội bộ</h2>
          <div className="requests-grid">
            {emergencyRequests.map(request => (
              <div key={request.requestID} className={`request-card ${getUrgencyColor(request.urgencyLevel)}`}>
                <div className="card-header">
                  <div className="blood-type">{request.bloodType}</div>
                  <div className={`urgency-badge ${getUrgencyColor(request.urgencyLevel)}`}>
                    {getUrgencyText(request.urgencyLevel)}
                  </div>
                </div>
                <div className="card-body">
                  <div className="quantity">{request.quantity} đơn vị</div>
                  <div className="reason">{request.reason}</div>
                  <div className="time">
                    Cần trước: {new Date(request.neededTime).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className="card-footer">
                  <span className="doctor">BS. {request.doctorInfo?.name}</span>
                  <span className="department">{request.doctorInfo?.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Emergency Requests */}
        <div className="requests-section">
          <h2>🌐 Yêu cầu khẩn cấp công khai</h2>
          <div className="public-requests">
            {publicRequests.map(request => (
              <div key={request.id} className={`public-request-card ${request.status}`}>
                <div className="card-main">
                  <div className="blood-info">
                    <div className="blood-type-large">{request.bloodType}</div>
                    {request.isRare && <div className="rare-badge">⭐ Máu hiếm</div>}
                    <div className="quantity-large">{request.quantity} đơn vị</div>
                  </div>
                  
                  <div className="request-details">
                    <div className={`urgency-level ${getUrgencyColor(request.urgencyLevel)}`}>
                      {getUrgencyText(request.urgencyLevel)}
                    </div>
                    <div className="reason">{request.reason}</div>
                    <div className="contact">{request.contactInfo}</div>
                    <div className="deadline">
                      <span className="label">Thời hạn:</span>
                      <span className={`time-remaining ${getTimeRemaining(request.deadline).includes('hết hạn') ? 'expired' : ''}`}>
                        {getTimeRemaining(request.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-actions">
                  {request.status === 'active' ? (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleDeactivateRequest(request.id)}
                    >
                      Đánh dấu hoàn thành
                    </button>
                  ) : (
                    <span className="status-completed">✅ Đã hoàn thành</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="emergency-stats">
          <div className="stat-card critical">
            <h3>Cực kỳ khẩn cấp</h3>
            <p className="stat-number">
              {emergencyRequests.filter(r => r.urgencyLevel === URGENCY_LEVELS.CRITICAL).length}
            </p>
          </div>
          <div className="stat-card urgent">
            <h3>Khẩn cấp</h3>
            <p className="stat-number">
              {emergencyRequests.filter(r => r.urgencyLevel === URGENCY_LEVELS.URGENT).length}
            </p>
          </div>
          <div className="stat-card public">
            <h3>Công khai</h3>
            <p className="stat-number">
              {publicRequests.filter(r => r.status === 'active').length}
            </p>
          </div>
          <div className="stat-card rare">
            <h3>Máu hiếm</h3>
            <p className="stat-number">
              {publicRequests.filter(r => r.isRare && r.status === 'active').length}
            </p>
          </div>
        </div>
      </div>

      {/* Create Public Request Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo yêu cầu máu khẩn cấp công khai</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nhóm máu:</label>
                  <select 
                    value={newRequest.bloodGroup}
                    onChange={(e) => setNewRequest(prev => ({...prev, bloodGroup: e.target.value}))}
                  >
                    <option value="">Chọn nhóm máu</option>
                    {Object.values(BLOOD_GROUPS).map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Rh:</label>
                  <select 
                    value={newRequest.rhType}
                    onChange={(e) => setNewRequest(prev => ({...prev, rhType: e.target.value}))}
                  >
                    <option value="">Chọn Rh</option>
                    {Object.values(RH_TYPES).map(rh => (
                      <option key={rh} value={rh}>{rh}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Số lượng (đơn vị):</label>
                  <input 
                    type="number"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest(prev => ({...prev, quantity: parseInt(e.target.value) || 1}))}
                    min="1"
                    max="10"
                  />
                </div>
                <div className="form-group">
                  <label>Mức độ khẩn cấp:</label>
                  <select 
                    value={newRequest.urgencyLevel}
                    onChange={(e) => setNewRequest(prev => ({...prev, urgencyLevel: parseInt(e.target.value)}))}
                  >
                    <option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</option>
                    <option value={URGENCY_LEVELS.CRITICAL}>Cực kỳ khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Lý do:</label>
                <textarea 
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({...prev, reason: e.target.value}))}
                  placeholder="Mô tả lý do cần máu khẩn cấp..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Thời hạn:</label>
                <input 
                  type="datetime-local"
                  value={newRequest.deadline}
                  onChange={(e) => setNewRequest(prev => ({...prev, deadline: e.target.value}))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="form-group">
                <label>Thông tin liên hệ:</label>
                <input 
                  type="text"
                  value={newRequest.contactInfo}
                  onChange={(e) => setNewRequest(prev => ({...prev, contactInfo: e.target.value}))}
                  placeholder="Khoa/Phòng - Số điện thoại"
                />
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleCreatePublicRequest}
                  disabled={!newRequest.bloodGroup || !newRequest.rhType || !newRequest.reason || !newRequest.deadline}
                >
                  Tạo yêu cầu khẩn cấp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyRequestsManagement;

import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import authService from '../../services/authService';
import { 
  BLOOD_GROUPS, 
  RH_TYPES, 
  COMPONENT_TYPES, 
  URGENCY_LEVELS,
  DOCTOR_TYPES 
} from '../../services/mockData';
import '../../styles/pages/DoctorBloodRequestsPage.scss';

const DoctorBloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bloodGroup: '',
    rhType: '',
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 1,
    urgencyLevel: URGENCY_LEVELS.NORMAL,
    reason: '',
    neededTime: '',
    patientCode: '',
    notes: ''
  });

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment = currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Load doctor's blood requests
    const mockRequests = [
      {
        requestID: 1,
        bloodType: 'O+',
        componentType: COMPONENT_TYPES.WHOLE,
        quantity: 2,
        urgencyLevel: URGENCY_LEVELS.URGENT,
        reason: 'Phẫu thuật khẩn cấp',
        neededTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        patientCode: 'BN001',
        status: isBloodDepartment ? 'approved' : 'pending',
        createdTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        doctorInfo: {
          name: currentUser?.name,
          department: currentUser?.department
        },
        notes: 'Bệnh nhân cần máu gấp cho ca mổ'
      },
      {
        requestID: 2,
        bloodType: 'A-',
        componentType: COMPONENT_TYPES.PLATELETS,
        quantity: 1,
        urgencyLevel: URGENCY_LEVELS.NORMAL,
        reason: 'Điều trị ung thư',
        neededTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        patientCode: 'BN002',
        status: 'approved',
        createdTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        doctorInfo: {
          name: currentUser?.name,
          department: currentUser?.department
        },
        notes: 'Bệnh nhân đang trong quá trình hóa trị'
      }
    ];

    setRequests(mockRequests);
  }, [currentUser, isBloodDepartment]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'processing': return 'primary';
      case 'completed': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.NORMAL: return 'Bình thường';
      case URGENCY_LEVELS.URGENT: return 'Khẩn cấp';
      case URGENCY_LEVELS.CRITICAL: return 'Cực kỳ khẩn cấp';
      default: return 'Không xác định';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.NORMAL: return 'success';
      case URGENCY_LEVELS.URGENT: return 'warning';
      case URGENCY_LEVELS.CRITICAL: return 'danger';
      default: return 'secondary';
    }
  };

  const handleCreateRequest = () => {
    const request = {
      requestID: requests.length + 1,
      bloodType: `${newRequest.bloodGroup}${newRequest.rhType}`,
      componentType: newRequest.componentType,
      quantity: newRequest.quantity,
      urgencyLevel: newRequest.urgencyLevel,
      reason: newRequest.reason,
      neededTime: newRequest.neededTime,
      patientCode: newRequest.patientCode,
      status: isBloodDepartment ? 'approved' : 'pending', // Auto-approve for blood department
      createdTime: new Date().toISOString(),
      doctorInfo: {
        name: currentUser?.name,
        department: currentUser?.department
      },
      notes: newRequest.notes
    };

    setRequests(prev => [...prev, request]);
    setShowCreateModal(false);
    setNewRequest({
      bloodGroup: '',
      rhType: '',
      componentType: COMPONENT_TYPES.WHOLE,
      quantity: 1,
      urgencyLevel: URGENCY_LEVELS.NORMAL,
      reason: '',
      neededTime: '',
      patientCode: '',
      notes: ''
    });
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="doctor-blood-requests">
      <DoctorSidebar />
      
      <div className="doctor-blood-requests-content">
        <div className="page-header">
          <div>
            <h1>📋 Yêu cầu Máu</h1>
            <p>Tạo và quản lý yêu cầu máu cho bệnh nhân</p>
            {isBloodDepartment && (
              <div className="auto-approve-notice">
                ✅ Yêu cầu từ khoa máu được tự động duyệt
              </div>
            )}
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Tạo yêu cầu máu
          </button>
        </div>

        {/* Doctor Info */}
        <div className="doctor-info-card">
          <div className="doctor-details">
            <h3>Thông tin bác sĩ</h3>
            <div className="info-row">
              <span className="label">Họ tên:</span>
              <span className="value">{currentUser?.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Khoa:</span>
              <span className="value">{currentUser?.department}</span>
            </div>
            <div className="info-row">
              <span className="label">Loại bác sĩ:</span>
              <span className={`value ${isBloodDepartment ? 'blood-dept' : 'other-dept'}`}>
                {isBloodDepartment ? 'Khoa Huyết học' : 'Khoa khác'}
              </span>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="requests-section">
          <h2>Danh sách yêu cầu máu</h2>
          <div className="requests-table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nhóm máu</th>
                  <th>Thành phần</th>
                  <th>Số lượng</th>
                  <th>Mức độ</th>
                  <th>Thời gian cần</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.requestID}>
                    <td>#{request.requestID}</td>
                    <td>
                      <span className="blood-type-badge">{request.bloodType}</span>
                    </td>
                    <td>{request.componentType}</td>
                    <td>{request.quantity} đơn vị</td>
                    <td>
                      <span className={`urgency-badge urgency-${getUrgencyColor(request.urgencyLevel)}`}>
                        {getUrgencyText(request.urgencyLevel)}
                      </span>
                    </td>
                    <td>{new Date(request.neededTime).toLocaleString('vi-VN')}</td>
                    <td>
                      <span className={`status-badge status-${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-info btn-sm">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics */}
        <div className="statistics-section">
          <div className="stat-card">
            <h3>Tổng yêu cầu</h3>
            <p className="stat-number">{requests.length}</p>
          </div>
          <div className="stat-card">
            <h3>Chờ duyệt</h3>
            <p className="stat-number warning">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Đã duyệt</h3>
            <p className="stat-number success">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Khẩn cấp</h3>
            <p className="stat-number danger">
              {requests.filter(r => r.urgencyLevel >= URGENCY_LEVELS.URGENT).length}
            </p>
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo yêu cầu máu mới</h2>
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
                  <label>Thành phần máu:</label>
                  <select 
                    value={newRequest.componentType}
                    onChange={(e) => setNewRequest(prev => ({...prev, componentType: e.target.value}))}
                  >
                    {Object.values(COMPONENT_TYPES).map(component => (
                      <option key={component} value={component}>{component}</option>
                    ))}
                  </select>
                </div>
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mức độ khẩn cấp:</label>
                  <select 
                    value={newRequest.urgencyLevel}
                    onChange={(e) => setNewRequest(prev => ({...prev, urgencyLevel: parseInt(e.target.value)}))}
                  >
                    <option value={URGENCY_LEVELS.NORMAL}>Bình thường</option>
                    <option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</option>
                    <option value={URGENCY_LEVELS.CRITICAL}>Cực kỳ khẩn cấp</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Thời gian cần:</label>
                  <input 
                    type="datetime-local"
                    value={newRequest.neededTime}
                    onChange={(e) => setNewRequest(prev => ({...prev, neededTime: e.target.value}))}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mã bệnh nhân (tùy chọn):</label>
                <input 
                  type="text"
                  value={newRequest.patientCode}
                  onChange={(e) => setNewRequest(prev => ({...prev, patientCode: e.target.value}))}
                  placeholder="Nhập mã hồ sơ bệnh nhân..."
                />
              </div>

              <div className="form-group">
                <label>Lý do yêu cầu:</label>
                <textarea 
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({...prev, reason: e.target.value}))}
                  placeholder="Mô tả lý do cần máu..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú thêm:</label>
                <textarea 
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Ghi chú thêm về yêu cầu..."
                  rows="2"
                />
              </div>

              {isBloodDepartment && (
                <div className="auto-approve-info">
                  ℹ️ Yêu cầu này sẽ được tự động duyệt vì bạn thuộc khoa Huyết học
                </div>
              )}

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateRequest}
                  disabled={!newRequest.bloodGroup || !newRequest.rhType || !newRequest.reason || !newRequest.neededTime}
                >
                  Tạo yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorBloodRequestsPage;

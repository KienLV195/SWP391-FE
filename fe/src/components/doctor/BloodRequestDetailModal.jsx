import React, { useState } from 'react';
import { DOCTOR_TYPES } from '../../services/mockData';
import authService from '../../services/authService';
import '../../styles/components/BloodRequestDetailModal.scss';

const BloodRequestDetailModal = ({ request, isOpen, onClose, onUpdate }) => {
  const [actionData, setActionData] = useState({
    status: '',
    notes: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment = currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  if (!isOpen || !request) return null;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - PUT /api/blood-requests/:id/action
      const updatedRequest = {
        ...request,
        status: action,
        doctorNotes: actionData.notes,
        processedBy: currentUser.name,
        processedAt: new Date().toISOString(),
        ...(action === 'rejected' && { rejectionReason: actionData.reason })
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdate(updatedRequest);
      onClose();
    } catch (error) {
      console.error('Error updating request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'processing': return '#17a2b8';
      case 'completed': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Đang chờ xử lý';
      case 'approved': return 'Đã chấp nhận';
      case 'rejected': return 'Đã từ chối';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return '#dc3545';
      case 'urgent': return '#fd7e14';
      case 'normal': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'Cấp cứu';
      case 'urgent': return 'Khẩn cấp';
      case 'normal': return 'Bình thường';
      default: return 'Không xác định';
    }
  };

  const canTakeAction = request.status === 'pending' && (
    (isBloodDepartment) || 
    (!isBloodDepartment && request.requestType === 'internal')
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="blood-request-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h2>Chi tiết yêu cầu máu #{request.id}</h2>
            <div className="request-meta">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(request.status) }}
              >
                {getStatusText(request.status)}
              </span>
              <span 
                className="urgency-badge"
                style={{ backgroundColor: getUrgencyColor(request.urgency) }}
              >
                {getUrgencyText(request.urgency)}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Request Information */}
          <div className="info-section">
            <h3>🩸 Thông tin yêu cầu</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nhóm máu:</label>
                <span className="blood-type-display">{request.bloodType}</span>
                {['AB-', 'B-', 'O-'].includes(request.bloodType) && (
                  <span className="rare-badge">⭐ Máu hiếm</span>
                )}
              </div>
              <div className="info-item">
                <label>Thành phần:</label>
                <span>{request.component}</span>
              </div>
              <div className="info-item">
                <label>Số lượng:</label>
                <span className="quantity-display">{request.quantity} {request.unit}</span>
              </div>
              <div className="info-item">
                <label>Thời gian cần:</label>
                <span>{new Date(request.neededBy).toLocaleString('vi-VN')}</span>
              </div>
              <div className="info-item">
                <label>Ngày tạo:</label>
                <span>{new Date(request.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="info-item">
                <label>Loại yêu cầu:</label>
                <span className="request-type">
                  {request.requestType === 'internal' ? '🏥 Nội bộ' : '🌐 Bên ngoài'}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          {request.patientInfo && (
            <div className="info-section">
              <h3>👤 Thông tin bệnh nhân</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Họ tên:</label>
                  <span>{request.patientInfo.name}</span>
                </div>
                <div className="info-item">
                  <label>Tuổi:</label>
                  <span>{request.patientInfo.age}</span>
                </div>
                <div className="info-item">
                  <label>Giới tính:</label>
                  <span>{request.patientInfo.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                </div>
                <div className="info-item">
                  <label>Mã hồ sơ:</label>
                  <span>{request.patientInfo.recordId || 'Không có'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Information */}
          <div className="info-section">
            <h3>👨‍⚕️ Thông tin bác sĩ yêu cầu</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Bác sĩ:</label>
                <span>{request.requestedBy}</span>
              </div>
              <div className="info-item">
                <label>Khoa:</label>
                <span>{request.department}</span>
              </div>
              <div className="info-item">
                <label>Liên hệ:</label>
                <span>{request.contactInfo?.phone || 'Không có'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{request.contactInfo?.email || 'Không có'}</span>
              </div>
            </div>
          </div>

          {/* Medical Reason */}
          <div className="info-section">
            <h3>📋 Lý do y tế</h3>
            <div className="reason-content">
              <p>{request.reason}</p>
              {request.diagnosis && (
                <div className="diagnosis">
                  <strong>Chẩn đoán:</strong> {request.diagnosis}
                </div>
              )}
            </div>
          </div>

          {/* Processing History */}
          {request.processedBy && (
            <div className="info-section">
              <h3>📝 Lịch sử xử lý</h3>
              <div className="processing-history">
                <div className="history-item">
                  <span className="processor">Xử lý bởi: {request.processedBy}</span>
                  <span className="process-time">
                    {new Date(request.processedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                {request.doctorNotes && (
                  <div className="notes">
                    <strong>Ghi chú:</strong> {request.doctorNotes}
                  </div>
                )}
                {request.rejectionReason && (
                  <div className="rejection-reason">
                    <strong>Lý do từ chối:</strong> {request.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Section */}
          {canTakeAction && (
            <div className="action-section">
              <h3>⚡ Hành động</h3>
              
              <div className="action-form">
                <div className="form-group">
                  <label>Ghi chú xử lý:</label>
                  <textarea
                    value={actionData.notes}
                    onChange={(e) => setActionData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Nhập ghi chú về quyết định của bạn..."
                    rows="3"
                  />
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAction('approved')}
                    disabled={loading}
                  >
                    {loading ? '⏳ Đang xử lý...' : '✅ Chấp nhận'}
                  </button>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      const reason = prompt('Nhập lý do từ chối:');
                      if (reason) {
                        setActionData(prev => ({...prev, reason}));
                        handleAction('rejected');
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? '⏳ Đang xử lý...' : '❌ Từ chối'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Access Level Notice */}
          {!isBloodDepartment && request.requestType === 'external' && (
            <div className="access-notice">
              <div className="notice-content">
                <span className="notice-icon">ℹ️</span>
                <div>
                  <strong>Thông báo:</strong> Bạn chỉ có thể xem thông tin yêu cầu này. 
                  Chỉ bác sĩ khoa Huyết học mới có thể xử lý yêu cầu từ bên ngoài.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {request.requestType === 'internal' && request.status === 'approved' && (
            <button className="btn btn-info">
              📋 Xem tiến trình xử lý
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodRequestDetailModal;

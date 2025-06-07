import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { 
  mockBloodRequests, 
  REQUEST_STATUS, 
  URGENCY_LEVELS,
  COMPONENT_TYPES 
} from '../../services/mockData';
import '../../styles/pages/BloodRequestsManagement.scss';

const BloodRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    urgency: 'all',
    bloodType: 'all'
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load blood requests
    setRequests(mockBloodRequests);
    setFilteredRequests(mockBloodRequests);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = requests;

    if (filters.status !== 'all') {
      filtered = filtered.filter(req => req.status === parseInt(filters.status));
    }

    if (filters.urgency !== 'all') {
      filtered = filtered.filter(req => req.urgencyLevel === parseInt(filters.urgency));
    }

    if (filters.bloodType !== 'all') {
      filtered = filtered.filter(req => req.bloodType === filters.bloodType);
    }

    setFilteredRequests(filtered);
  }, [filters, requests]);

  const getStatusText = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING: return 'Đang chờ xử lý';
      case REQUEST_STATUS.ACCEPTED: return 'Đã chấp nhận';
      case REQUEST_STATUS.COMPLETED: return 'Hoàn thành';
      case REQUEST_STATUS.REJECTED: return 'Từ chối';
      default: return 'Không xác định';
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

  const getStatusColor = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING: return 'warning';
      case REQUEST_STATUS.ACCEPTED: return 'info';
      case REQUEST_STATUS.COMPLETED: return 'success';
      case REQUEST_STATUS.REJECTED: return 'danger';
      default: return 'secondary';
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

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(prev => prev.map(req => 
      req.requestID === requestId 
        ? { ...req, status: newStatus }
        : req
    ));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="blood-requests-management">
      <ManagerSidebar />
      
      <div className="blood-requests-content">
        <div className="page-header">
          <h1>📋 Quản lý Yêu cầu Máu</h1>
          <p>Xử lý và theo dõi tất cả yêu cầu máu từ bác sĩ và bệnh nhân</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select 
              value={filters.status} 
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              <option value={REQUEST_STATUS.PENDING}>Đang chờ xử lý</option>
              <option value={REQUEST_STATUS.ACCEPTED}>Đã chấp nhận</option>
              <option value={REQUEST_STATUS.COMPLETED}>Hoàn thành</option>
              <option value={REQUEST_STATUS.REJECTED}>Từ chối</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Mức độ khẩn cấp:</label>
            <select 
              value={filters.urgency} 
              onChange={(e) => setFilters(prev => ({...prev, urgency: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              <option value={URGENCY_LEVELS.NORMAL}>Bình thường</option>
              <option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</option>
              <option value={URGENCY_LEVELS.CRITICAL}>Cực kỳ khẩn cấp</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Nhóm máu:</label>
            <select 
              value={filters.bloodType} 
              onChange={(e) => setFilters(prev => ({...prev, bloodType: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nhóm máu</th>
                <th>Số lượng</th>
                <th>Mức độ</th>
                <th>Thời gian cần</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.requestID}>
                  <td>#{request.requestID}</td>
                  <td>
                    <span className="blood-type-badge">{request.bloodType}</span>
                  </td>
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
                    <div className="action-buttons">
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        Chi tiết
                      </button>
                      {request.status === REQUEST_STATUS.PENDING && (
                        <>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(request.requestID, REQUEST_STATUS.ACCEPTED)}
                          >
                            Chấp nhận
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatusChange(request.requestID, REQUEST_STATUS.REJECTED)}
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      {request.status === REQUEST_STATUS.ACCEPTED && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusChange(request.requestID, REQUEST_STATUS.COMPLETED)}
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="statistics-section">
          <div className="stat-card">
            <h3>Tổng yêu cầu</h3>
            <p className="stat-number">{requests.length}</p>
          </div>
          <div className="stat-card">
            <h3>Đang chờ xử lý</h3>
            <p className="stat-number warning">
              {requests.filter(r => r.status === REQUEST_STATUS.PENDING).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Đã hoàn thành</h3>
            <p className="stat-number success">
              {requests.filter(r => r.status === REQUEST_STATUS.COMPLETED).length}
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

      {/* Modal for request details */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết Yêu cầu #{selectedRequest.requestID}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Nhóm máu:</strong> {selectedRequest.bloodType}
              </div>
              <div className="detail-row">
                <strong>Số lượng:</strong> {selectedRequest.quantity} đơn vị
              </div>
              <div className="detail-row">
                <strong>Thành phần:</strong> {selectedRequest.component}
              </div>
              <div className="detail-row">
                <strong>Mức độ khẩn cấp:</strong> {getUrgencyText(selectedRequest.urgencyLevel)}
              </div>
              <div className="detail-row">
                <strong>Thời gian cần:</strong> {new Date(selectedRequest.neededTime).toLocaleString('vi-VN')}
              </div>
              <div className="detail-row">
                <strong>Lý do:</strong> {selectedRequest.reason}
              </div>
              <div className="detail-row">
                <strong>Bác sĩ:</strong> {selectedRequest.doctorInfo?.name}
              </div>
              <div className="detail-row">
                <strong>Khoa:</strong> {selectedRequest.doctorInfo?.department}
              </div>
              <div className="detail-row">
                <strong>Trạng thái:</strong> 
                <span className={`status-badge status-${getStatusColor(selectedRequest.status)}`}>
                  {getStatusText(selectedRequest.status)}
                </span>
              </div>
              {selectedRequest.notes && selectedRequest.notes.length > 0 && (
                <div className="detail-row">
                  <strong>Ghi chú:</strong>
                  <div className="notes-list">
                    {selectedRequest.notes.map((note, index) => (
                      <div key={index} className="note-item">
                        <strong>{note.author}:</strong> {note.content}
                        <small>({new Date(note.timestamp).toLocaleString('vi-VN')})</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestsManagement;

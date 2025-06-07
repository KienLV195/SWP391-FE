import React, { useState, useEffect } from "react";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import {
  mockBloodRequests,
  REQUEST_STATUS,
  URGENCY_LEVELS,
  COMPONENT_TYPES,
  BLOOD_GROUPS,
  RH_TYPES,
} from "../../services/mockData";
import "../../styles/pages/BloodRequestsManagement.scss";

const BloodRequestsManagement = () => {
  const [activeTab, setActiveTab] = useState("regular"); // 'regular' or 'emergency'
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [publicRequests, setPublicRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    urgency: "all",
    bloodType: "all",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bloodGroup: "",
    rhType: "",
    quantity: 1,
    urgencyLevel: URGENCY_LEVELS.URGENT,
    reason: "",
    deadline: "",
    isPublic: true,
    contactInfo: "",
  });

  useEffect(() => {
    // Load blood requests
    setRequests(mockBloodRequests);
    setFilteredRequests(mockBloodRequests);

    // Load emergency requests (urgent and critical)
    const urgent = mockBloodRequests.filter(
      (req) => req.urgencyLevel >= URGENCY_LEVELS.URGENT
    );
    setEmergencyRequests(urgent);

    // Mock public emergency requests
    const publicEmergency = [
      {
        id: 1,
        bloodType: "O-",
        quantity: 3,
        urgencyLevel: URGENCY_LEVELS.CRITICAL,
        reason: "Tai nạn giao thông nghiêm trọng",
        deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
        isRare: true,
        contactInfo: "Khoa Cấp cứu - ĐT: 0123456789",
        createdAt: new Date().toISOString(),
        status: "active",
      },
      {
        id: 2,
        bloodType: "AB-",
        quantity: 2,
        urgencyLevel: URGENCY_LEVELS.URGENT,
        reason: "Phẫu thuật tim khẩn cấp",
        deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        isRare: true,
        contactInfo: "Khoa Tim mạch - ĐT: 0987654321",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: "active",
      },
    ];
    setPublicRequests(publicEmergency);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = requests;

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (req) => req.status === parseInt(filters.status)
      );
    }

    if (filters.urgency !== "all") {
      filtered = filtered.filter(
        (req) => req.urgencyLevel === parseInt(filters.urgency)
      );
    }

    if (filters.bloodType !== "all") {
      filtered = filtered.filter((req) => req.bloodType === filters.bloodType);
    }

    setFilteredRequests(filtered);
  }, [filters, requests]);

  const getStatusText = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return "Đang chờ xử lý";
      case REQUEST_STATUS.ACCEPTED:
        return "Đã chấp nhận";
      case REQUEST_STATUS.COMPLETED:
        return "Hoàn thành";
      case REQUEST_STATUS.REJECTED:
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.NORMAL:
        return "Bình thường";
      case URGENCY_LEVELS.URGENT:
        return "Khẩn cấp";
      case URGENCY_LEVELS.CRITICAL:
        return "Cực kỳ khẩn cấp";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return "warning";
      case REQUEST_STATUS.ACCEPTED:
        return "info";
      case REQUEST_STATUS.COMPLETED:
        return "success";
      case REQUEST_STATUS.REJECTED:
        return "danger";
      default:
        return "secondary";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.NORMAL:
        return "success";
      case URGENCY_LEVELS.URGENT:
        return "warning";
      case URGENCY_LEVELS.CRITICAL:
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleStatusChange = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.requestID === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return "Đã hết hạn";

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
      isRare: ["AB-", "B-", "O-"].includes(
        `${newRequest.bloodGroup}${newRequest.rhType}`
      ),
      contactInfo: newRequest.contactInfo,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    setPublicRequests((prev) => [...prev, request]);
    setShowCreateModal(false);
    setNewRequest({
      bloodGroup: "",
      rhType: "",
      quantity: 1,
      urgencyLevel: URGENCY_LEVELS.URGENT,
      reason: "",
      deadline: "",
      isPublic: true,
      contactInfo: "",
    });
  };

  const handleDeactivateRequest = (requestId) => {
    setPublicRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "completed" } : req
      )
    );
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="blood-requests-management">
      <ManagerSidebar />

      <div className="blood-requests-content">
        <div className="page-header">
          <div className="header-content">
            <h1>📋 Quản lý Yêu cầu Máu</h1>
            <p>Xử lý và theo dõi tất cả yêu cầu máu từ bác sĩ và bệnh nhân</p>
          </div>
          {activeTab === "emergency" && (
            <button
              className="btn btn-danger"
              onClick={() => setShowCreateModal(true)}
            >
              + Tạo yêu cầu khẩn cấp
            </button>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button
            className={`tab-btn ${activeTab === "regular" ? "active" : ""}`}
            onClick={() => setActiveTab("regular")}
          >
            📋 Yêu cầu thường
          </button>
          <button
            className={`tab-btn ${activeTab === "emergency" ? "active" : ""}`}
            onClick={() => setActiveTab("emergency")}
          >
            🚨 Yêu cầu khẩn cấp
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "regular" && (
          <>
            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label>Trạng thái:</label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, urgency: e.target.value }))
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value={URGENCY_LEVELS.NORMAL}>Bình thường</option>
                  <option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</option>
                  <option value={URGENCY_LEVELS.CRITICAL}>
                    Cực kỳ khẩn cấp
                  </option>
                </select>
              </div>

              <div className="filter-group">
                <label>Nhóm máu:</label>
                <select
                  value={filters.bloodType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bloodType: e.target.value,
                    }))
                  }
                >
                  <option value="all">Tất cả</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
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
                  {filteredRequests.map((request) => (
                    <tr key={request.requestID}>
                      <td>#{request.requestID}</td>
                      <td>
                        <span className="blood-type-badge">
                          {request.bloodType}
                        </span>
                      </td>
                      <td>{request.quantity} đơn vị</td>
                      <td>
                        <span
                          className={`urgency-badge urgency-${getUrgencyColor(
                            request.urgencyLevel
                          )}`}
                        >
                          {getUrgencyText(request.urgencyLevel)}
                        </span>
                      </td>
                      <td>
                        {new Date(request.neededTime).toLocaleString("vi-VN")}
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${getStatusColor(
                            request.status
                          )}`}
                        >
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
                                onClick={() =>
                                  handleStatusChange(
                                    request.requestID,
                                    REQUEST_STATUS.ACCEPTED
                                  )
                                }
                              >
                                Chấp nhận
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    request.requestID,
                                    REQUEST_STATUS.REJECTED
                                  )
                                }
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                          {request.status === REQUEST_STATUS.ACCEPTED && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                handleStatusChange(
                                  request.requestID,
                                  REQUEST_STATUS.COMPLETED
                                )
                              }
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
                  {
                    requests.filter((r) => r.status === REQUEST_STATUS.PENDING)
                      .length
                  }
                </p>
              </div>
              <div className="stat-card">
                <h3>Đã hoàn thành</h3>
                <p className="stat-number success">
                  {
                    requests.filter(
                      (r) => r.status === REQUEST_STATUS.COMPLETED
                    ).length
                  }
                </p>
              </div>
              <div className="stat-card">
                <h3>Khẩn cấp</h3>
                <p className="stat-number danger">
                  {
                    requests.filter(
                      (r) => r.urgencyLevel >= URGENCY_LEVELS.URGENT
                    ).length
                  }
                </p>
              </div>
            </div>
          </>
        )}

        {/* Emergency Requests Tab */}
        {activeTab === "emergency" && (
          <div className="emergency-requests-section">
            <div className="emergency-stats">
              <div className="stat-card urgent">
                <div className="stat-number">
                  {publicRequests.filter((r) => r.status === "active").length}
                </div>
                <div className="stat-label">Yêu cầu đang hoạt động</div>
              </div>
              <div className="stat-card critical">
                <div className="stat-number">
                  {
                    publicRequests.filter(
                      (r) => r.urgencyLevel === URGENCY_LEVELS.CRITICAL
                    ).length
                  }
                </div>
                <div className="stat-label">Cực kỳ khẩn cấp</div>
              </div>
              <div className="stat-card rare">
                <div className="stat-number">
                  {publicRequests.filter((r) => r.isRare).length}
                </div>
                <div className="stat-label">Nhóm máu hiếm</div>
              </div>
            </div>

            <div className="emergency-requests-grid">
              {publicRequests
                .filter((req) => req.status === "active")
                .map((request) => (
                  <div
                    key={request.id}
                    className={`emergency-card ${
                      request.urgencyLevel === URGENCY_LEVELS.CRITICAL
                        ? "critical"
                        : "urgent"
                    }`}
                  >
                    <div className="emergency-header">
                      <div className="blood-type-large">
                        {request.bloodType}
                      </div>
                      <div className="urgency-indicator">
                        {request.urgencyLevel === URGENCY_LEVELS.CRITICAL
                          ? "🔴 CỰC KHẨN CẤPẤP"
                          : "🟡 KHẨN CẤP"}
                      </div>
                    </div>

                    <div className="emergency-details">
                      <div className="detail-item">
                        <span className="label">Số lượng:</span>
                        <span className="value">{request.quantity} đơn vị</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Thời gian còn lại:</span>
                        <span className="value countdown">
                          {getTimeRemaining(request.deadline)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Lý do:</span>
                        <span className="value">{request.reason}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Liên hệ:</span>
                        <span className="value">{request.contactInfo}</span>
                      </div>
                    </div>

                    <div className="emergency-actions">
                      <button
                        className="btn btn-success"
                        onClick={() => handleDeactivateRequest(request.id)}
                      >
                        ✅ Đã xử lý
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {publicRequests.filter((req) => req.status === "active").length ===
              0 && (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>Không có yêu cầu khẩn cấp nào</h3>
                <p>
                  Tất cả yêu cầu khẩn cấp đã được xử lý hoặc chưa có yêu cầu
                  mới.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for request details */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết Yêu cầu #{selectedRequest.requestID}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
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
                <strong>Mức độ khẩn cấp:</strong>{" "}
                {getUrgencyText(selectedRequest.urgencyLevel)}
              </div>
              <div className="detail-row">
                <strong>Thời gian cần:</strong>{" "}
                {new Date(selectedRequest.neededTime).toLocaleString("vi-VN")}
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
                <span
                  className={`status-badge status-${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
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
                        <small>
                          ({new Date(note.timestamp).toLocaleString("vi-VN")})
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Emergency Request Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚨 Tạo yêu cầu khẩn cấp</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nhóm máu:</label>
                  <select
                    value={newRequest.bloodGroup}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        bloodGroup: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn nhóm máu</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Rh:</label>
                  <select
                    value={newRequest.rhType}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        rhType: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn Rh</option>
                    {RH_TYPES.map((rh) => (
                      <option key={rh} value={rh}>
                        {rh}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số lượng (đơn vị):</label>
                  <input
                    type="number"
                    min="1"
                    value={newRequest.quantity}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Mức độ khẩn cấp:</label>
                  <select
                    value={newRequest.urgencyLevel}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        urgencyLevel: parseInt(e.target.value),
                      }))
                    }
                  >
                    <option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</option>
                    <option value={URGENCY_LEVELS.CRITICAL}>
                      Cực kỳ khẩn cấp
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Thời hạn:</label>
                <input
                  type="datetime-local"
                  value={newRequest.deadline}
                  onChange={(e) =>
                    setNewRequest((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Lý do:</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) =>
                    setNewRequest((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Mô tả lý do cần máu khẩn cấp..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Thông tin liên hệ:</label>
                <input
                  type="text"
                  value={newRequest.contactInfo}
                  onChange={(e) =>
                    setNewRequest((prev) => ({
                      ...prev,
                      contactInfo: e.target.value,
                    }))
                  }
                  placeholder="Khoa/Phòng - Số điện thoại"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                onClick={handleCreatePublicRequest}
                disabled={
                  !newRequest.bloodGroup ||
                  !newRequest.rhType ||
                  !newRequest.reason
                }
              >
                🚨 Tạo yêu cầu khẩn cấp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestsManagement;

import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import authService from "../../services/authService";
import {
  BLOOD_GROUPS,
  RH_TYPES,
  COMPONENT_TYPES,
  URGENCY_LEVELS,
  DOCTOR_TYPES,
} from "../../services/mockData";
import "../../styles/pages/ExternalRequestsManagement.scss";

const ExternalRequestsManagement = () => {
  const [externalRequests, setExternalRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    urgency: "all",
    bloodType: "all",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment =
    currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Mock external blood requests from individuals/external hospitals
    const mockExternalRequests = [
      {
        requestID: 1,
        requesterName: "Nguyễn Văn A",
        requesterType: "individual",
        contactInfo: {
          phone: "0123456789",
          email: "nguyenvana@email.com",
          address: "123 Đường ABC, Quận 1, TP.HCM",
        },
        bloodType: "O-",
        componentType: COMPONENT_TYPES.WHOLE,
        quantity: 2,
        urgencyLevel: URGENCY_LEVELS.CRITICAL,
        reason: "Tai nạn giao thông nghiêm trọng",
        neededTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        doctorInfo: {
          name: "BS. Trần Thị B",
          department: "Khoa Cấp cứu",
          hospital: "Bệnh viện Đa khoa XYZ",
          phone: "0987654321",
          email: "tranb@hospital.com",
        },
        medicalDocuments: ["xet_nghiem_mau.pdf", "chup_ct.jpg"],
        status: "pending",
        createdTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isRare: true,
        notes: "Bệnh nhân đang trong tình trạng nguy kịch, cần máu gấp",
      },
      {
        requestID: 2,
        requesterName: "Bệnh viện Đa khoa DEF",
        requesterType: "hospital",
        contactInfo: {
          phone: "0234567890",
          email: "bloodbank@hospitaldef.com",
          address: "456 Đường XYZ, Quận 3, TP.HCM",
        },
        bloodType: "AB-",
        componentType: COMPONENT_TYPES.PLATELETS,
        quantity: 1,
        urgencyLevel: URGENCY_LEVELS.URGENT,
        reason: "Phẫu thuật tim mạch",
        neededTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        doctorInfo: {
          name: "BS. Lê Văn C",
          department: "Khoa Tim mạch",
          hospital: "Bệnh viện Đa khoa DEF",
          phone: "0345678901",
          email: "levanc@hospitaldef.com",
        },
        medicalDocuments: ["ho_so_benh_an.pdf"],
        status: "approved",
        createdTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        approvedTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        approvedBy: currentUser?.name,
        isRare: true,
        notes: "Bệnh nhân cần tiểu cầu cho ca phẫu thuật tim",
      },
      {
        requestID: 3,
        requesterName: "Phạm Thị D",
        requesterType: "individual",
        contactInfo: {
          phone: "0456789012",
          email: "phamthid@email.com",
          address: "789 Đường GHI, Quận 7, TP.HCM",
        },
        bloodType: "B+",
        componentType: COMPONENT_TYPES.PLASMA,
        quantity: 1,
        urgencyLevel: URGENCY_LEVELS.NORMAL,
        reason: "Điều trị bệnh gan",
        neededTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        doctorInfo: {
          name: "BS. Hoàng Văn E",
          department: "Khoa Tiêu hóa",
          hospital: "Phòng khám tư nhân",
          phone: "0567890123",
          email: "hoangvane@clinic.com",
        },
        medicalDocuments: ["ket_qua_sieu_am.jpg"],
        status: "rejected",
        createdTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        rejectedTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        rejectedBy: currentUser?.name,
        rejectionReason: "Không đủ tài liệu y tế chứng minh nhu cầu",
        isRare: false,
        notes: "Cần thêm kết quả xét nghiệm máu và chẩn đoán chi tiết",
      },
    ];

    setExternalRequests(mockExternalRequests);
    setFilteredRequests(mockExternalRequests);
  }, [currentUser]);

  useEffect(() => {
    // Apply filters
    let filtered = externalRequests;

    if (filters.status !== "all") {
      filtered = filtered.filter((req) => req.status === filters.status);
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
  }, [filters, externalRequests]);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "processing":
        return "Đang xử lý";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "processing":
        return "info";
      default:
        return "secondary";
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

  const getRequesterTypeText = (type) => {
    switch (type) {
      case "individual":
        return "Cá nhân";
      case "hospital":
        return "Bệnh viện";
      default:
        return "Khác";
    }
  };

  const handleApproveRequest = (requestId) => {
    setExternalRequests((prev) =>
      prev.map((req) =>
        req.requestID === requestId
          ? {
              ...req,
              status: "approved",
              approvedTime: new Date().toISOString(),
              approvedBy: currentUser?.name,
            }
          : req
      )
    );
  };

  const handleRejectRequest = (requestId, reason) => {
    setExternalRequests((prev) =>
      prev.map((req) =>
        req.requestID === requestId
          ? {
              ...req,
              status: "rejected",
              rejectedTime: new Date().toISOString(),
              rejectedBy: currentUser?.name,
              rejectionReason: reason,
            }
          : req
      )
    );
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Only show this page for blood department doctors
  if (!isBloodDepartment) {
    return (
      <DoctorLayout pageTitle="Yêu cầu máu bên ngoài">
        <div className="external-requests-content">
          <div className="access-denied">
            <h1>🚫 Không có quyền truy cập</h1>
            <p>Chỉ bác sĩ khoa Huyết học mới có thể truy cập trang này.</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout pageTitle="Quản lý yêu cầu bên ngoài">
      <div className="doctor-external-requests-content">
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
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
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
              <option value={URGENCY_LEVELS.CRITICAL}>Cực kỳ khẩn cấp</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Nhóm máu:</label>
            <select
              value={filters.bloodType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, bloodType: e.target.value }))
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

        {/* Requests List */}
        <div className="requests-section">
          <h2>Danh sách yêu cầu bên ngoài</h2>
          <div className="requests-grid">
            {filteredRequests.map((request) => (
              <div
                key={request.requestID}
                className={`request-card ${getStatusColor(request.status)}`}
              >
                <div className="card-header">
                  <div className="request-info">
                    <h3 className="requester-name">{request.requesterName}</h3>
                    <div className="requester-type">
                      {getRequesterTypeText(request.requesterType)}
                    </div>
                  </div>
                  <div className="request-badges">
                    <span
                      className={`urgency-badge urgency-${getUrgencyColor(
                        request.urgencyLevel
                      )}`}
                    >
                      {getUrgencyText(request.urgencyLevel)}
                    </span>
                    {request.isRare && (
                      <span className="rare-badge">⭐ Máu hiếm</span>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="blood-info">
                    <div className="blood-type">{request.bloodType}</div>
                    <div className="component">{request.componentType}</div>
                    <div className="quantity">{request.quantity} đơn vị</div>
                  </div>

                  <div className="request-details">
                    <div className="reason">{request.reason}</div>
                    <div className="needed-time">
                      Cần trước:{" "}
                      {new Date(request.neededTime).toLocaleString("vi-VN")}
                    </div>
                    <div className="doctor-info">
                      BS. {request.doctorInfo.name} -{" "}
                      {request.doctorInfo.department}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="request-status">
                    <span
                      className={`status-badge status-${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                    {request.status === "approved" && (
                      <small>Duyệt bởi: {request.approvedBy}</small>
                    )}
                    {request.status === "rejected" && (
                      <small>Từ chối bởi: {request.rejectedBy}</small>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewDetails(request)}
                    >
                      Chi tiết
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleApproveRequest(request.requestID)
                          }
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const reason = prompt("Lý do từ chối:");
                            if (reason) {
                              handleRejectRequest(request.requestID, reason);
                            }
                          }}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="statistics-section">
          <div className="stat-card">
            <h3>Tổng yêu cầu</h3>
            <p className="stat-number">{externalRequests.length}</p>
          </div>
          <div className="stat-card">
            <h3>Chờ duyệt</h3>
            <p className="stat-number warning">
              {externalRequests.filter((r) => r.status === "pending").length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Đã duyệt</h3>
            <p className="stat-number success">
              {externalRequests.filter((r) => r.status === "approved").length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Máu hiếm</h3>
            <p className="stat-number rare">
              {externalRequests.filter((r) => r.isRare).length}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết yêu cầu #{selectedRequest.requestID}</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Thông tin người yêu cầu</h3>
                <div className="detail-row">
                  <strong>Tên:</strong> {selectedRequest.requesterName}
                </div>
                <div className="detail-row">
                  <strong>Loại:</strong>{" "}
                  {getRequesterTypeText(selectedRequest.requesterType)}
                </div>
                <div className="detail-row">
                  <strong>Điện thoại:</strong>{" "}
                  {selectedRequest.contactInfo.phone}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {selectedRequest.contactInfo.email}
                </div>
                <div className="detail-row">
                  <strong>Địa chỉ:</strong>{" "}
                  {selectedRequest.contactInfo.address}
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin bác sĩ</h3>
                <div className="detail-row">
                  <strong>Tên:</strong> {selectedRequest.doctorInfo.name}
                </div>
                <div className="detail-row">
                  <strong>Khoa:</strong> {selectedRequest.doctorInfo.department}
                </div>
                <div className="detail-row">
                  <strong>Bệnh viện:</strong>{" "}
                  {selectedRequest.doctorInfo.hospital}
                </div>
                <div className="detail-row">
                  <strong>Điện thoại:</strong>{" "}
                  {selectedRequest.doctorInfo.phone}
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin yêu cầu máu</h3>
                <div className="detail-row">
                  <strong>Nhóm máu:</strong> {selectedRequest.bloodType}
                  {selectedRequest.isRare && (
                    <span className="rare-badge">⭐ Máu hiếm</span>
                  )}
                </div>
                <div className="detail-row">
                  <strong>Thành phần:</strong> {selectedRequest.componentType}
                </div>
                <div className="detail-row">
                  <strong>Số lượng:</strong> {selectedRequest.quantity} đơn vị
                </div>
                <div className="detail-row">
                  <strong>Mức độ:</strong>
                  <span
                    className={`urgency-badge urgency-${getUrgencyColor(
                      selectedRequest.urgencyLevel
                    )}`}
                  >
                    {getUrgencyText(selectedRequest.urgencyLevel)}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Lý do:</strong> {selectedRequest.reason}
                </div>
                <div className="detail-row">
                  <strong>Thời gian cần:</strong>{" "}
                  {new Date(selectedRequest.neededTime).toLocaleString("vi-VN")}
                </div>
                {selectedRequest.notes && (
                  <div className="detail-row">
                    <strong>Ghi chú:</strong> {selectedRequest.notes}
                  </div>
                )}
              </div>

              {selectedRequest.medicalDocuments &&
                selectedRequest.medicalDocuments.length > 0 && (
                  <div className="detail-section">
                    <h3>Tài liệu y tế</h3>
                    <div className="documents-list">
                      {selectedRequest.medicalDocuments.map((doc, index) => (
                        <div key={index} className="document-item">
                          📄 {doc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedRequest.status === "rejected" &&
                selectedRequest.rejectionReason && (
                  <div className="detail-section">
                    <h3>Lý do từ chối</h3>
                    <div className="rejection-reason">
                      {selectedRequest.rejectionReason}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default ExternalRequestsManagement;

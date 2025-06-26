import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import BloodRequestDetailModal from "../../components/doctor/BloodRequestDetailModal";
import authService from "../../services/authService";
import {
  BLOOD_GROUPS,
  RH_TYPES,
  COMPONENT_TYPES,
  DOCTOR_TYPES,
} from "../../services/mockData";
import {
  REQUEST_STATUS,
  URGENCY_LEVELS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  URGENCY_ICONS,
} from "../../constants/systemConstants";
import "../../styles/pages/DoctorBloodRequestsPage.scss";
import DoctorBloodRequestsTable from "../../components/doctor/blood-requests/DoctorBloodRequestsTable";
import DoctorBloodRequestsFilters from "../../components/doctor/blood-requests/DoctorBloodRequestsFilters";
import { Card, Descriptions, Row, Col, Statistic, Tabs } from "antd";

const DoctorBloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [externalRequests, setExternalRequests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("internal"); // 'internal' or 'external'
  const [newRequest, setNewRequest] = useState({
    bloodGroup: "",
    rhType: "",
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 1,
    urgencyLevel: URGENCY_LEVELS.NORMAL,
    reason: "",
    neededTime: "",
    patientCode: "",
    notes: "",
  });
  const [filters, setFilters] = useState({
    bloodType: "all",
    componentType: "all",
    status: "all",
  });

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment =
    currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Load doctor's blood requests
    const mockRequests = [
      {
        id: 1,
        requestID: 1,
        bloodType: "O+",
        component: COMPONENT_TYPES.WHOLE,
        componentType: COMPONENT_TYPES.WHOLE,
        quantity: 2,
        unit: "đơn vị",
        urgency: "urgent",
        urgencyLevel: URGENCY_LEVELS.URGENT,
        reason:
          "Phẫu thuật khẩn cấp - Bệnh nhân bị tai nạn giao thông nghiêm trọng, cần phẫu thuật cấp cứu để cứu sống.",
        diagnosis: "Chấn thương đa cơ quan, xuất huyết nội",
        neededBy: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        neededTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        patientCode: "BN001",
        status: isBloodDepartment ? "approved" : "pending",
        requestType: "internal",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        requestedBy: currentUser?.name,
        department: currentUser?.department,
        doctorInfo: {
          name: currentUser?.name,
          department: currentUser?.department,
        },
        patientInfo: {
          name: "Nguyễn Văn A",
          age: 35,
          gender: "male",
          recordId: "BN001",
        },
        contactInfo: {
          phone: "0123456789",
          email: "doctor@hospital.com",
        },
        notes: "Bệnh nhân cần máu gấp cho ca mổ cấp cứu",
      },
      {
        requestID: 2,
        bloodType: "A-",
        componentType: COMPONENT_TYPES.PLATELETS,
        quantity: 1,
        urgencyLevel: URGENCY_LEVELS.NORMAL,
        reason: "Điều trị ung thư",
        neededTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        patientCode: "BN002",
        status: "approved",
        createdTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        doctorInfo: {
          name: currentUser?.name,
          department: currentUser?.department,
        },
        notes: "Bệnh nhân đang trong quá trình hóa trị",
      },
    ];

    setRequests(mockRequests);
  }, [currentUser, isBloodDepartment]);

  // Load external requests for blood department doctors
  useEffect(() => {
    if (isBloodDepartment) {
      const mockExternalRequests = [
        {
          id: 101,
          requestID: 101,
          bloodType: "AB-",
          componentType: COMPONENT_TYPES.WHOLE,
          quantity: 1,
          urgencyLevel: URGENCY_LEVELS.CRITICAL,
          reason: "Yêu cầu máu khẩn cấp từ bên ngoài bệnh viện",
          neededTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          patientCode: "EXT001",
          status: "pending",
          requestType: "external",
          createdTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          requesterInfo: {
            name: "Nguyễn Văn B",
            phone: "0987654321",
            email: "requester@email.com",
            relationship: "Gia đình bệnh nhân",
          },
          patientInfo: {
            name: "Trần Thị C",
            age: 28,
            gender: "female",
            hospitalName: "Bệnh viện Đa khoa ABC",
          },
          notes: "Bệnh nhân đang trong tình trạng nguy kịch, cần máu gấp",
        },
        {
          id: 102,
          requestID: 102,
          bloodType: "O+",
          componentType: COMPONENT_TYPES.PLATELETS,
          quantity: 2,
          urgencyLevel: URGENCY_LEVELS.URGENT,
          reason: "Điều trị bệnh nhân ung thư máu",
          neededTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          patientCode: "EXT002",
          status: "pending",
          requestType: "external",
          createdTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          requesterInfo: {
            name: "Lê Thị D",
            phone: "0123456789",
            email: "family@email.com",
            relationship: "Con gái bệnh nhân",
          },
          patientInfo: {
            name: "Lê Văn E",
            age: 65,
            gender: "male",
            hospitalName: "Bệnh viện Ung bướu XYZ",
          },
          notes: "Bệnh nhân đang hóa trị, cần tiểu cầu",
        },
      ];
      setExternalRequests(mockExternalRequests);
    }
  }, [isBloodDepartment]);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "rejected":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "info";
      case "processing":
        return "primary";
      case "completed":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getUrgencyText = (urgency) => {
    return URGENCY_LABELS[urgency] || "Không xác định";
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
      status: isBloodDepartment ? "approved" : "pending", // Auto-approve for blood department
      createdTime: new Date().toISOString(),
      doctorInfo: {
        name: currentUser?.name,
        department: currentUser?.department,
      },
      notes: newRequest.notes,
    };

    setRequests((prev) => [...prev, request]);
    setShowCreateModal(false);
    setNewRequest({
      bloodGroup: "",
      rhType: "",
      componentType: COMPONENT_TYPES.WHOLE,
      quantity: 1,
      urgencyLevel: URGENCY_LEVELS.NORMAL,
      reason: "",
      neededTime: "",
      patientCode: "",
      notes: "",
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleUpdateRequest = (updatedRequest) => {
    if (updatedRequest.requestType === "external") {
      setExternalRequests((prev) =>
        prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
      );
    } else {
      setRequests((prev) =>
        prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
      );
    }
  };

  const handleApproveExternal = (requestId) => {
    setExternalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              processedBy: currentUser?.name,
              processedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  const handleRejectExternal = (requestId, reason) => {
    setExternalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "rejected",
              rejectionReason: reason,
              processedBy: currentUser?.name,
              processedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Lọc dữ liệu theo filter
  const filteredRequests = (
    isBloodDepartment && activeTab === "external" ? externalRequests : requests
  ).filter((req) => {
    const matchBloodType =
      filters.bloodType === "all" || req.bloodType === filters.bloodType;
    const matchComponent =
      filters.componentType === "all" ||
      req.componentType === filters.componentType;
    const matchStatus =
      filters.status === "all" || req.status === filters.status;
    return matchBloodType && matchComponent && matchStatus;
  });

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ duyệt" },
    { value: "approved", label: "Đã duyệt" },
    { value: "processing", label: "Đang xử lý" },
    { value: "completed", label: "Hoàn thành" },
    { value: "rejected", label: "Từ chối" },
  ];

  // Định nghĩa columns cho table
  const columns = [
    {
      title: "ID",
      dataIndex: "requestID",
      key: "requestID",
      render: (id) => `#${id}`,
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (bloodType) => {
        const isPositive = bloodType.includes("+");
        return (
          <span
            className={`blood-type-badge ${
              isPositive ? "positive" : "negative"
            }`}
          >
            {bloodType}
          </span>
        );
      },
    },
    {
      title: "Thành phần",
      dataIndex: "componentType",
      key: "componentType",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (q) => `${q} đơn vị`,
    },
    {
      title: "Mức độ",
      dataIndex: "urgencyLevel",
      key: "urgencyLevel",
      render: (urgency) => (
        <span className={`urgency-badge urgency-${getUrgencyColor(urgency)}`}>
          {getUrgencyText(urgency)}
        </span>
      ),
    },
    {
      title: "Thời gian cần",
      dataIndex: "neededTime",
      key: "neededTime",
      render: (t) => new Date(t).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-badge status-${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, request) => (
        <div className="action-buttons">
          <button
            className="btn btn-info btn-sm"
            onClick={() => handleViewDetails(request)}
          >
            Chi tiết
          </button>
          {isBloodDepartment &&
            activeTab === "external" &&
            request.status === "pending" && (
              <>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleApproveExternal(request.id)}
                >
                  ✅ Duyệt
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    handleRejectExternal(request.id, "Không đủ điều kiện")
                  }
                >
                  ❌ Từ chối
                </button>
              </>
            )}
        </div>
      ),
    },
  ];

  // Tabs items cho Ant Design
  const tabItems = isBloodDepartment
    ? [
        {
          key: "internal",
          label: `🏥 Yêu cầu nội bộ (${requests.length})`,
        },
        {
          key: "external",
          label: `🌐 Yêu cầu bên ngoài (${externalRequests.length})`,
        },
      ]
    : [];

  // Thống kê
  const currentRequests =
    isBloodDepartment && activeTab === "external" ? externalRequests : requests;
  const stats = [
    {
      title: "Tổng yêu cầu",
      value: currentRequests.length,
      color: "#1677ff",
    },
    {
      title: "Chờ duyệt",
      value: currentRequests.filter((r) => r.status === "pending").length,
      color: "#faad14",
    },
    {
      title: "Đã duyệt",
      value: currentRequests.filter((r) => r.status === "approved").length,
      color: "#52c41a",
    },
    {
      title: "Khẩn cấp",
      value: currentRequests.filter(
        (r) => r.urgencyLevel >= URGENCY_LEVELS.URGENT
      ).length,
      color: "#ff4d4f",
    },
  ];

  return (
    <DoctorLayout pageTitle="📋 Yêu cầu Máu">
      <div className="doctor-blood-requests-content">
        {/* Tabs cho khoa máu */}
        {isBloodDepartment && (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Thống kê hiện đại */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {stats.map((stat) => (
            <Col xs={24} sm={12} md={6} key={stat.title}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color, fontWeight: 600 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Requests List */}
        <div className="requests-section">
          <h2 style={{ marginBottom: 16 }}>
            {isBloodDepartment
              ? activeTab === "internal"
                ? "Yêu cầu máu nội bộ"
                : "Yêu cầu máu từ bên ngoài"
              : "Danh sách yêu cầu máu"}
          </h2>
          <DoctorBloodRequestsFilters
            filters={filters}
            setFilters={setFilters}
            bloodTypes={bloodTypes}
            componentTypes={Object.values(COMPONENT_TYPES)}
            statusOptions={statusOptions}
          />
          <div className="requests-table-container" style={{ marginTop: 16 }}>
            <DoctorBloodRequestsTable
              data={filteredRequests}
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo yêu cầu máu mới</h2>
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
                    {Object.values(BLOOD_GROUPS).map((group) => (
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
                    {Object.values(RH_TYPES).map((rh) => (
                      <option key={rh} value={rh}>
                        {rh}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thành phần máu:</label>
                  <select
                    value={newRequest.componentType}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        componentType: e.target.value,
                      }))
                    }
                  >
                    {Object.values(COMPONENT_TYPES).map((component) => (
                      <option key={component} value={component}>
                        {component}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Số lượng (đơn vị):</label>
                  <input
                    type="number"
                    value={newRequest.quantity}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 1,
                      }))
                    }
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
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        urgencyLevel: parseInt(e.target.value),
                      }))
                    }
                  >
                    <option value={URGENCY_LEVELS.NORMAL}>Bình thường</option>
                    <option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</option>
                    <option value={URGENCY_LEVELS.CRITICAL}>
                      Cực kỳ khẩn cấp
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Thời gian cần:</label>
                  <input
                    type="datetime-local"
                    value={newRequest.neededTime}
                    onChange={(e) =>
                      setNewRequest((prev) => ({
                        ...prev,
                        neededTime: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mã bệnh nhân (tùy chọn):</label>
                <input
                  type="text"
                  value={newRequest.patientCode}
                  onChange={(e) =>
                    setNewRequest((prev) => ({
                      ...prev,
                      patientCode: e.target.value,
                    }))
                  }
                  placeholder="Nhập mã hồ sơ bệnh nhân..."
                />
              </div>

              <div className="form-group">
                <label>Lý do yêu cầu:</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) =>
                    setNewRequest((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Mô tả lý do cần máu..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú thêm:</label>
                <textarea
                  value={newRequest.notes}
                  onChange={(e) =>
                    setNewRequest((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Ghi chú thêm về yêu cầu..."
                  rows="2"
                />
              </div>

              {isBloodDepartment && (
                <div className="auto-approve-info">
                  ℹ️ Yêu cầu này sẽ được tự động duyệt vì bạn thuộc khoa Huyết
                  học
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateRequest}
                  disabled={
                    !newRequest.bloodGroup ||
                    !newRequest.rhType ||
                    !newRequest.reason ||
                    !newRequest.neededTime
                  }
                >
                  Tạo yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blood Request Detail Modal */}
      <BloodRequestDetailModal
        request={selectedRequest}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onUpdate={handleUpdateRequest}
      />
    </DoctorLayout>
  );
};

export default DoctorBloodRequestsPage;

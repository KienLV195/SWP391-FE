import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Select,
  Input,
  Tag,
  Space,
  Tooltip,
  message,
  Row,
  Col,
  Modal,
} from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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

const { Option } = Select;
const { Search } = Input;

const BloodRequestsManagement = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    urgency: "all",
    bloodType: "all",
    searchText: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadBloodRequests();
  }, []);

  const loadBloodRequests = async () => {
    setLoading(true);
    try {
      // TODO_API_REPLACE: Replace with actual API call - GET /api/manager/blood-requests
      // Combine regular and emergency requests into one unified list
      const unifiedRequests = [
        ...mockBloodRequests.map((req) => ({
          ...req,
          priority:
            req.urgencyLevel >= URGENCY_LEVELS.URGENT ? "Khẩn cấp" : "Thường",
          priorityLevel: req.urgencyLevel,
          createdAt: req.createdAt || new Date().toISOString(),
        })),
        // Add some emergency requests
        {
          requestID: "EMG001",
          bloodType: "O-",
          quantity: 3,
          urgencyLevel: URGENCY_LEVELS.CRITICAL,
          priority: "Cực kỳ khẩn cấp",
          priorityLevel: URGENCY_LEVELS.CRITICAL,
          reason: "Tai nạn giao thông nghiêm trọng",
          neededTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          status: REQUEST_STATUS.PENDING,
          requesterName: "BS. Nguyễn Văn A",
          department: "Khoa Cấp cứu",
          contactInfo: "0123456789",
          createdAt: new Date().toISOString(),
        },
        {
          requestID: "EMG002",
          bloodType: "AB-",
          quantity: 2,
          urgencyLevel: URGENCY_LEVELS.URGENT,
          priority: "Khẩn cấp",
          priorityLevel: URGENCY_LEVELS.URGENT,
          reason: "Phẫu thuật tim khẩn cấp",
          neededTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          status: REQUEST_STATUS.ACCEPTED,
          requesterName: "BS. Trần Thị B",
          department: "Khoa Tim mạch",
          contactInfo: "0987654321",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setAllRequests(unifiedRequests);
      setFilteredRequests(unifiedRequests);
    } catch (error) {
      console.error("Error loading blood requests:", error);
      message.error("Có lỗi xảy ra khi tải danh sách yêu cầu máu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let filtered = allRequests;

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

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.requestID.toLowerCase().includes(searchLower) ||
          req.reason?.toLowerCase().includes(searchLower) ||
          req.requesterName?.toLowerCase().includes(searchLower) ||
          req.department?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRequests(filtered);
  }, [filters, allRequests]);

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

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // TODO_API_REPLACE: Replace with actual API call - PUT /api/manager/blood-requests/:id/status
      setAllRequests((prev) =>
        prev.map((req) =>
          req.requestID === requestId ? { ...req, status: newStatus } : req
        )
      );
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating request status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const getPriorityColor = (urgencyLevel) => {
    switch (urgencyLevel) {
      case URGENCY_LEVELS.CRITICAL:
        return "#D91022";
      case URGENCY_LEVELS.URGENT:
        return "#D93E4C";
      case URGENCY_LEVELS.NORMAL:
      default:
        return "#20374E";
    }
  };

  const getPriorityText = (urgencyLevel) => {
    switch (urgencyLevel) {
      case URGENCY_LEVELS.CRITICAL:
        return "Cực kỳ khẩn cấp";
      case URGENCY_LEVELS.URGENT:
        return "Khẩn cấp";
      case URGENCY_LEVELS.NORMAL:
      default:
        return "Thường";
    }
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
          <div className="header-info">
            <h1>📋 Quản lý Yêu cầu Máu</h1>
            <p>Xử lý và theo dõi tất cả yêu cầu máu từ bác sĩ và bệnh nhân</p>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadBloodRequests}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        </div>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="stats-section">
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card total">
              <div className="stat-content">
                <div className="stat-number">{allRequests.length}</div>
                <div className="stat-label">Tổng yêu cầu</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card pending">
              <div className="stat-content">
                <div className="stat-number">
                  {
                    allRequests.filter(
                      (r) => r.status === REQUEST_STATUS.PENDING
                    ).length
                  }
                </div>
                <div className="stat-label">Đang chờ xử lý</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card emergency">
              <div className="stat-content">
                <div className="stat-number">
                  {
                    allRequests.filter(
                      (r) => r.urgencyLevel >= URGENCY_LEVELS.URGENT
                    ).length
                  }
                </div>
                <div className="stat-label">Khẩn cấp</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card completed">
              <div className="stat-content">
                <div className="stat-number">
                  {
                    allRequests.filter(
                      (r) => r.status === REQUEST_STATUS.COMPLETED
                    ).length
                  }
                </div>
                <div className="stat-label">Đã hoàn thành</div>
              </div>
            </Card>
          </Col>
        </Row>
        {/* Filters */}
        <Card className="filters-card">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className="filter-group">
                <label>Tìm kiếm:</label>
                <Search
                  placeholder="Tìm theo ID, lý do, bác sĩ..."
                  value={filters.searchText}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchText: e.target.value,
                    }))
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="filter-group">
                <label>Trạng thái:</label>
                <Select
                  value={filters.status}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                  style={{ width: "100%" }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value={REQUEST_STATUS.PENDING}>Đang chờ xử lý</Option>
                  <Option value={REQUEST_STATUS.ACCEPTED}>Đã chấp nhận</Option>
                  <Option value={REQUEST_STATUS.COMPLETED}>Hoàn thành</Option>
                  <Option value={REQUEST_STATUS.REJECTED}>Từ chối</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="filter-group">
                <label>Mức độ:</label>
                <Select
                  value={filters.urgency}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, urgency: value }))
                  }
                  style={{ width: "100%" }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value={URGENCY_LEVELS.NORMAL}>Thường</Option>
                  <Option value={URGENCY_LEVELS.URGENT}>Khẩn cấp</Option>
                  <Option value={URGENCY_LEVELS.CRITICAL}>
                    Cực kỳ khẩn cấp
                  </Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="filter-group">
                <label>Nhóm máu:</label>
                <Select
                  value={filters.bloodType}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, bloodType: value }))
                  }
                  style={{ width: "100%" }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </div>
            </Col>
          </Row>
        </Card>
        {/* Unified Requests Table */}
        <Card className="requests-table-card">
          <Table
            dataSource={filteredRequests}
            columns={[
              {
                title: "ID Yêu cầu",
                dataIndex: "requestID",
                key: "requestID",
                width: 120,
                render: (text) => (
                  <span style={{ fontWeight: 600, color: "#20374E" }}>
                    {text}
                  </span>
                ),
              },
              {
                title: "Mức độ",
                dataIndex: "priority",
                key: "priority",
                width: 130,
                render: (_, record) => {
                  const color = getPriorityColor(record.urgencyLevel);
                  const text = getPriorityText(record.urgencyLevel);
                  return (
                    <Tag color={color} style={{ fontWeight: "bold" }}>
                      {text}
                    </Tag>
                  );
                },
              },
              {
                title: "Nhóm máu",
                dataIndex: "bloodType",
                key: "bloodType",
                width: 100,
                align: "center",
                render: (bloodType) => (
                  <Tag
                    color="#D93E4C"
                    style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                  >
                    {bloodType}
                  </Tag>
                ),
              },
              {
                title: "Số lượng",
                dataIndex: "quantity",
                key: "quantity",
                width: 100,
                align: "center",
                render: (quantity) => `${quantity} đơn vị`,
              },
              {
                title: "Ngày yêu cầu",
                dataIndex: "createdAt",
                key: "createdAt",
                width: 130,
                render: (date) => new Date(date).toLocaleDateString("vi-VN"),
              },
              {
                title: "Bác sĩ/Khoa",
                key: "doctor",
                width: 150,
                render: (_, record) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {record.requesterName || record.doctorInfo?.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      {record.department || record.doctorInfo?.department}
                    </div>
                  </div>
                ),
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 120,
                render: (status) => {
                  const getStatusConfig = (status) => {
                    switch (status) {
                      case REQUEST_STATUS.PENDING:
                        return { color: "#fa8c16", text: "Chờ xử lý" };
                      case REQUEST_STATUS.ACCEPTED:
                        return { color: "#52c41a", text: "Đã chấp nhận" };
                      case REQUEST_STATUS.COMPLETED:
                        return { color: "#13c2c2", text: "Hoàn thành" };
                      case REQUEST_STATUS.REJECTED:
                        return { color: "#ff4d4f", text: "Từ chối" };
                      default:
                        return { color: "#d9d9d9", text: "Không xác định" };
                    }
                  };
                  const config = getStatusConfig(status);
                  return <Tag color={config.color}>{config.text}</Tag>;
                },
              },
              {
                title: "Hành động",
                key: "actions",
                width: 200,
                render: (_, record) => (
                  <Space>
                    <Tooltip title="Xem chi tiết">
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetails(record)}
                      />
                    </Tooltip>
                    {record.status === REQUEST_STATUS.PENDING && (
                      <>
                        <Tooltip title="Chấp nhận">
                          <Button
                            type="default"
                            icon={<CheckOutlined />}
                            size="small"
                            style={{
                              backgroundColor: "#52c41a",
                              borderColor: "#52c41a",
                              color: "white",
                            }}
                            onClick={() =>
                              handleStatusChange(
                                record.requestID,
                                REQUEST_STATUS.ACCEPTED
                              )
                            }
                          />
                        </Tooltip>
                        <Tooltip title="Từ chối">
                          <Button
                            type="default"
                            icon={<CloseOutlined />}
                            size="small"
                            danger
                            onClick={() =>
                              handleStatusChange(
                                record.requestID,
                                REQUEST_STATUS.REJECTED
                              )
                            }
                          />
                        </Tooltip>
                      </>
                    )}
                    {record.status === REQUEST_STATUS.ACCEPTED && (
                      <Tooltip title="Hoàn thành">
                        <Button
                          type="default"
                          icon={<CheckOutlined />}
                          size="small"
                          style={{
                            backgroundColor: "#13c2c2",
                            borderColor: "#13c2c2",
                            color: "white",
                          }}
                          onClick={() =>
                            handleStatusChange(
                              record.requestID,
                              REQUEST_STATUS.COMPLETED
                            )
                          }
                        >
                          Hoàn thành
                        </Button>
                      </Tooltip>
                    )}
                  </Space>
                ),
              },
            ]}
            rowKey="requestID"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} yêu cầu`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={`Chi tiết yêu cầu máu: ${selectedRequest?.requestID}`}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          {selectedRequest && (
            <div className="request-details">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>ID Yêu cầu:</strong> {selectedRequest.requestID}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Mức độ:</strong>
                    <Tag
                      color={getPriorityColor(selectedRequest.urgencyLevel)}
                      style={{ marginLeft: 8 }}
                    >
                      {getPriorityText(selectedRequest.urgencyLevel)}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Nhóm máu:</strong>
                    <Tag color="#D93E4C" style={{ marginLeft: 8 }}>
                      {selectedRequest.bloodType}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Số lượng:</strong> {selectedRequest.quantity} đơn vị
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Bác sĩ yêu cầu:</strong>{" "}
                    {selectedRequest.requesterName ||
                      selectedRequest.doctorInfo?.name}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Khoa:</strong>{" "}
                    {selectedRequest.department ||
                      selectedRequest.doctorInfo?.department}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Ngày yêu cầu:</strong>{" "}
                    {new Date(selectedRequest.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Thời gian cần:</strong>{" "}
                    {selectedRequest.neededTime
                      ? new Date(selectedRequest.neededTime).toLocaleString(
                          "vi-VN"
                        )
                      : "Không xác định"}
                  </div>
                </Col>
                <Col span={24}>
                  <div className="detail-item">
                    <strong>Lý do:</strong>{" "}
                    {selectedRequest.reason || "Không có thông tin"}
                  </div>
                </Col>
                <Col span={24}>
                  <div className="detail-item">
                    <strong>Liên hệ:</strong>{" "}
                    {selectedRequest.contactInfo || "Không có thông tin"}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BloodRequestsManagement;

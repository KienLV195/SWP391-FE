import React, { useState, useEffect, useCallback } from "react";
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
  Steps,
  Divider,
  Badge,
  Popconfirm,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ExportOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HeartOutlined,
  TableOutlined,
  AppstoreOutlined,
  LoadingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import PageHeader from "../../components/manager/PageHeader";
import ManagerBloodRequestsTable from "../../components/manager/blood-requests/ManagerBloodRequestsTable";
import ManagerBloodRequestsFilters from "../../components/manager/blood-requests/ManagerBloodRequestsFilters";
import {
  mockBloodRequests,
  REQUEST_STATUS,
  URGENCY_LEVELS,
  COMPONENT_TYPES,
  BLOOD_GROUPS,
  RH_TYPES,
} from "../../services/mockData";
import "../../styles/pages/BloodRequestsManagement.scss";
import "../../styles/components/PageHeader.scss";

const { Option } = Select;
const { Search } = Input;
const { Step } = Steps;
const { Text, Title } = Typography;

// Blood request workflow steps
const WORKFLOW_STEPS = [
  {
    title: "Tiếp nhận yêu cầu",
    description: "Yêu cầu được tạo và chờ xử lý",
    icon: <ClockCircleOutlined />,
  },
  {
    title: "Kiểm tra kho",
    description: "Kiểm tra tồn kho máu phù hợp",
    icon: <SearchOutlined />,
  },
  {
    title: "Xuất kho",
    description: "Xuất máu từ kho theo yêu cầu",
    icon: <ExportOutlined />,
  },
  {
    title: "Hoàn thành",
    description: "Giao máu thành công",
    icon: <CheckOutlined />,
  },
];

// Status mapping for workflow
const STATUS_TO_STEP = {
  [REQUEST_STATUS.PENDING]: 0,
  [REQUEST_STATUS.ACCEPTED]: 1,
  [REQUEST_STATUS.PROCESSING]: 2,
  [REQUEST_STATUS.COMPLETED]: 3,
  [REQUEST_STATUS.EXPORTED]: 3, // Xuất kho = Hoàn thành
};

// Blood types for filter
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodRequestsPage = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    bloodType: "all",
    patientName: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [workflowModalVisible, setWorkflowModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  useEffect(() => {
    loadBloodRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allRequests, filters]);

  const loadBloodRequests = async () => {
    setLoading(true);
    try {
      // TODO_API_REPLACE: Replace with actual API call - GET /api/manager/blood-requests
      // Enhanced mock data with additional fields
      const enhancedRequests = mockBloodRequests.map((req, index) => ({
        ...req,
        requestCode: `YC${String(req.requestID).padStart(4, "0")}`,
        patientName: req.patientName || `Bệnh nhân ${index + 1}`,
        bloodTypeDisplay: `${req.bloodGroup}${req.rhType}`,
        quantityUnit: `${req.quantity} đơn vị`,
        priority:
          req.urgencyLevel >= URGENCY_LEVELS.URGENT ? "Khẩn cấp" : "Thường",
        priorityLevel: req.urgencyLevel,
        createdAt: req.createdAt || new Date().toISOString(),
        canExport:
          req.status === REQUEST_STATUS.ACCEPTED ||
          req.status === REQUEST_STATUS.PROCESSING,
      }));

      // Sort by priority and creation date
      const sortedRequests = enhancedRequests.sort((a, b) => {
        // First sort by priority (urgent first)
        if (a.priorityLevel !== b.priorityLevel) {
          return b.priorityLevel - a.priorityLevel;
        }
        // Then by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAllRequests(sortedRequests);
    } catch (error) {
      console.error("Error loading blood requests:", error);
      message.error("Có lỗi xảy ra khi tải danh sách yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...allRequests];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((req) => req.status === filters.status);
    }

    // Filter by blood type
    if (filters.bloodType !== "all") {
      filtered = filtered.filter(
        (req) => req.bloodTypeDisplay === filters.bloodType
      );
    }

    // Filter by patient name
    if (filters.patientName.trim()) {
      const searchTerm = filters.patientName.toLowerCase().trim();
      filtered = filtered.filter(
        (req) =>
          req.patientName.toLowerCase().includes(searchTerm) ||
          req.requestCode.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredRequests(filtered);
  }, [allRequests, filters]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // TODO_API_REPLACE: Replace with actual API call - PUT /api/manager/blood-requests/:id/status
      setAllRequests((prev) =>
        prev.map((req) =>
          req.requestID === requestId
            ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
            : req
        )
      );

      // If status is "Xuất kho", update inventory
      if (newStatus === REQUEST_STATUS.EXPORTED) {
        const request = allRequests.find((req) => req.requestID === requestId);
        if (request) {
          // TODO_API_REPLACE: Update blood inventory - POST /api/manager/blood-inventory/export
          message.success(
            `Đã xuất kho ${request.quantity} đơn vị máu ${request.bloodTypeDisplay}`
          );
        }
      }

      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating request status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const handleViewWorkflow = (request) => {
    setSelectedRequest(request);
    setWorkflowModalVisible(true);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const handleManageRequest = (request) => {
    setSelectedRequest(request);
    setManageModalVisible(true);
  };

  const handleRejectRequest = async () => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setRejectLoading(true);
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // PUT /api/manager/blood-requests/:id/reject
      // Body: { rejectReason: string }
      // Response: { success: boolean, message: string }

      // Mock API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllRequests((prev) =>
        prev.map((req) =>
          req.requestID === selectedRequest.requestID
            ? {
                ...req,
                status: REQUEST_STATUS.REJECTED,
                rejectReason: rejectReason,
                rejectedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : req
        )
      );

      message.success("Đã từ chối yêu cầu máu thành công");
      setManageModalVisible(false);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting request:", error);
      message.error("Có lỗi xảy ra khi từ chối yêu cầu!");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleExportBlood = async () => {
    setExportLoading(true);
    try {
      // TODO_API_REPLACE: Replace with actual API calls

      // 1. Update blood request status
      // PUT /api/manager/blood-requests/:id/export
      // Body: { exportedBy: managerId, exportedAt: timestamp }
      // Response: { success: boolean, message: string }

      // 2. Update blood inventory (reduce quantity)
      // PUT /api/manager/blood-inventory/reduce
      // Body: {
      //   bloodType: string,
      //   quantity: number,
      //   reason: "EXPORTED_FOR_REQUEST",
      //   requestId: string
      // }
      // Response: { success: boolean, remainingQuantity: number }

      // Mock API calls simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update request status
      setAllRequests((prev) =>
        prev.map((req) =>
          req.requestID === selectedRequest.requestID
            ? {
                ...req,
                status: REQUEST_STATUS.EXPORTED,
                exportedAt: new Date().toISOString(),
                exportedBy: "current_manager_id", // TODO: Get from auth context
                updatedAt: new Date().toISOString(),
              }
            : req
        )
      );

      // TODO_API_REPLACE: Update blood inventory quantity
      // This should reduce the blood inventory by the requested amount
      console.log(
        `Reducing blood inventory: ${selectedRequest.bloodTypeDisplay} by ${selectedRequest.quantity} units`
      );

      message.success(
        `Đã xuất kho ${selectedRequest.quantity} đơn vị máu ${selectedRequest.bloodTypeDisplay} thành công`
      );
      setManageModalVisible(false);
    } catch (error) {
      console.error("Error exporting blood:", error);
      message.error("Có lỗi xảy ra khi xuất kho!");
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return "Đang chờ xử lý";
      case REQUEST_STATUS.ACCEPTED:
        return "Đã chấp nhận";
      case REQUEST_STATUS.PROCESSING:
        return "Đang xử lý";
      case REQUEST_STATUS.COMPLETED:
        return "Hoàn thành";
      case REQUEST_STATUS.EXPORTED:
        return "Xuất kho";
      case REQUEST_STATUS.REJECTED:
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return "#fa8c16";
      case REQUEST_STATUS.ACCEPTED:
        return "#52c41a";
      case REQUEST_STATUS.PROCESSING:
        return "#1890ff";
      case REQUEST_STATUS.COMPLETED:
        return "#13c2c2";
      case REQUEST_STATUS.EXPORTED:
        return "#D93E4C";
      case REQUEST_STATUS.REJECTED:
        return "#ff4d4f";
      default:
        return "#d9d9d9";
    }
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

  // Table columns configuration
  const tableColumns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestCode",
      key: "requestCode",
      width: 120,
      sorter: (a, b) => a.requestCode.localeCompare(b.requestCode),
      render: (text) => (
        <Text strong style={{ color: "#20374E" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      width: 150,
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: "#20374E" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodTypeDisplay",
      key: "bloodTypeDisplay",
      width: 100,
      align: "center",
      sorter: (a, b) => a.bloodTypeDisplay.localeCompare(b.bloodTypeDisplay),
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
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity) => (
        <Text
          strong
          style={{
            color: "#20374E",
            fontSize: "14px",
            textAlign: "center",
            display: "block",
          }}
        >
          {quantity || 0} đơn vị
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      filters: [
        { text: "Đang chờ xử lý", value: REQUEST_STATUS.PENDING },
        { text: "Đã chấp nhận", value: REQUEST_STATUS.ACCEPTED },
        { text: "Đang xử lý", value: REQUEST_STATUS.PROCESSING },
        { text: "Hoàn thành", value: REQUEST_STATUS.COMPLETED },
        { text: "Xuất kho", value: REQUEST_STATUS.EXPORTED },
        { text: "Từ chối", value: REQUEST_STATUS.REJECTED },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <span
          className="status-badge"
          style={{
            backgroundColor: getStatusColor(status),
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
              style={{ backgroundColor: "#20374E", borderColor: "#20374E" }}
            >
              Xem chi tiết
            </Button>
          </Tooltip>
          <Tooltip title="Quản lý">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => handleManageRequest(record)}
              style={{ backgroundColor: "#D93E4C", borderColor: "#D93E4C" }}
            >
              Quản lý
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="blood-requests-management">
      <ManagerSidebar />

      <div className="blood-requests-content">
        {/* Page Header */}
        <PageHeader
          title="Quản lý Yêu cầu Máu"
          description="Xử lý và theo dõi tất cả yêu cầu máu từ bác sĩ và bệnh nhân"
          icon={FileTextOutlined}
          actions={[
            {
              label: viewMode === "table" ? "Dạng thẻ" : "Dạng bảng",
              icon:
                viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />,
              onClick: () =>
                setViewMode(viewMode === "table" ? "card" : "table"),
            },
            {
              label: "Thêm yêu cầu",
              type: "primary",
              icon: <PlusOutlined />,
              style: { backgroundColor: "#D93E4C", borderColor: "#D93E4C" },
            },
            {
              label: "Làm mới",
              icon: <ReloadOutlined />,
              onClick: loadBloodRequests,
              loading: loading,
            },
          ]}
        />

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="stats-section">
          <Col xs={24} sm={12} md={6}>
            <Card
              className="stat-card"
              style={{ borderLeft: "4px solid #20374E" }}
            >
              <div className="stat-content">
                <div className="stat-number" style={{ color: "#20374E" }}>
                  {allRequests.length}
                </div>
                <div className="stat-label">Tổng yêu cầu</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              className="stat-card"
              style={{ borderLeft: "4px solid #fa8c16" }}
            >
              <div className="stat-content">
                <div className="stat-number" style={{ color: "#fa8c16" }}>
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
            <Card
              className="stat-card"
              style={{ borderLeft: "4px solid #D91022" }}
            >
              <div className="stat-content">
                <div className="stat-number" style={{ color: "#D91022" }}>
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
            <Card
              className="stat-card"
              style={{ borderLeft: "4px solid #D93E4C" }}
            >
              <div className="stat-content">
                <div className="stat-number" style={{ color: "#D93E4C" }}>
                  {
                    allRequests.filter(
                      (r) => r.status === REQUEST_STATUS.EXPORTED
                    ).length
                  }
                </div>
                <div className="stat-label">Đã xuất kho</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="filters-card" style={{ marginBottom: 16 }}>
          <ManagerBloodRequestsFilters
            filters={filters}
            setFilters={setFilters}
            bloodTypes={BLOOD_TYPES}
            statusOptions={[
              { value: REQUEST_STATUS.PENDING, label: "Đang chờ xử lý" },
              { value: REQUEST_STATUS.ACCEPTED, label: "Đã chấp nhận" },
              { value: REQUEST_STATUS.PROCESSING, label: "Đang xử lý" },
              { value: REQUEST_STATUS.COMPLETED, label: "Hoàn thành" },
              { value: REQUEST_STATUS.EXPORTED, label: "Xuất kho" },
              { value: REQUEST_STATUS.REJECTED, label: "Từ chối" },
            ]}
          />
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <div style={{ textAlign: "right" }}>
                <Text type="secondary">
                  Hiển thị {filteredRequests.length} / {allRequests.length} yêu
                  cầu
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Data Display */}
        {viewMode === "table" ? (
          <Card className="requests-table-card">
            <ManagerBloodRequestsTable
              data={filteredRequests}
              columns={tableColumns}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
              rowClassName={(record) => {
                if (record.urgencyLevel === URGENCY_LEVELS.CRITICAL)
                  return "urgent-row";
                if (record.urgencyLevel === URGENCY_LEVELS.URGENT)
                  return "priority-row";
                return "";
              }}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredRequests.map((request) => (
              <Col xs={24} sm={12} md={8} lg={6} key={request.requestID}>
                <Card
                  className="request-card"
                  hoverable
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(
                      request.urgencyLevel
                    )}`,
                    transition: "all 0.3s ease",
                  }}
                  actions={[
                    <Tooltip title="Xem quy trình">
                      <EyeOutlined
                        onClick={() => handleViewWorkflow(request)}
                        style={{ color: "#20374E" }}
                      />
                    </Tooltip>,
                    request.canExport ? (
                      <Tooltip title="Xuất kho">
                        <ExportOutlined
                          onClick={() =>
                            handleStatusUpdate(
                              request.requestID,
                              REQUEST_STATUS.EXPORTED
                            )
                          }
                          style={{ color: "#D93E4C" }}
                        />
                      </Tooltip>
                    ) : (
                      <ClockCircleOutlined style={{ color: "#d9d9d9" }} />
                    ),
                  ]}
                >
                  <div className="card-header">
                    <Text strong style={{ color: "#20374E" }}>
                      {request.requestCode}
                    </Text>
                    <Tag color={getStatusColor(request.status)} size="small">
                      {getStatusText(request.status)}
                    </Tag>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div className="card-content">
                    <div className="info-row">
                      <UserOutlined style={{ color: "#20374E" }} />
                      <Text>{request.patientName}</Text>
                    </div>
                    <div className="info-row">
                      <HeartOutlined style={{ color: "#D93E4C" }} />
                      <Text strong>{request.bloodTypeDisplay}</Text>
                    </div>
                    <div className="info-row">
                      <Text type="secondary">Số lượng: </Text>
                      <Text strong>{request.quantityUnit}</Text>
                    </div>
                    <div className="info-row">
                      <Text type="secondary">Mức độ: </Text>
                      <Tag
                        color={getPriorityColor(request.urgencyLevel)}
                        size="small"
                        style={{ fontWeight: "bold" }}
                      >
                        {getPriorityText(request.urgencyLevel)}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Workflow Modal */}
        <Modal
          title={
            <div style={{ color: "#20374E" }}>
              <HeartOutlined style={{ marginRight: 8, color: "#D93E4C" }} />
              Quy trình hiến máu - {selectedRequest?.requestCode}
            </div>
          }
          open={workflowModalVisible}
          onCancel={() => setWorkflowModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setWorkflowModalVisible(false)}>
              Đóng
            </Button>,
            selectedRequest?.canExport && (
              <Button
                key="export"
                type="primary"
                icon={<ExportOutlined />}
                style={{ backgroundColor: "#D93E4C", borderColor: "#D93E4C" }}
                onClick={() => {
                  handleStatusUpdate(
                    selectedRequest.requestID,
                    REQUEST_STATUS.EXPORTED
                  );
                  setWorkflowModalVisible(false);
                }}
              >
                Xuất kho ngay
              </Button>
            ),
          ]}
          width={800}
          style={{ top: 20 }}
        >
          {selectedRequest && (
            <div className="workflow-content">
              {/* Request Details */}
              <Card
                size="small"
                style={{ marginBottom: 16, backgroundColor: "#DECCAA" }}
              >
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>Bệnh nhân: </Text>
                    <Text>{selectedRequest.patientName}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Nhóm máu: </Text>
                    <Tag color="#D93E4C" style={{ fontWeight: "bold" }}>
                      {selectedRequest.bloodTypeDisplay}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Số lượng: </Text>
                    <Text>{selectedRequest.quantityUnit}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Mức độ: </Text>
                    <Tag color={getPriorityColor(selectedRequest.urgencyLevel)}>
                      {getPriorityText(selectedRequest.urgencyLevel)}
                    </Tag>
                  </Col>
                </Row>
              </Card>

              {/* Workflow Steps */}
              <Steps
                current={STATUS_TO_STEP[selectedRequest.status] || 0}
                direction="vertical"
                size="small"
                style={{
                  "& .ant-steps-item-finish .ant-steps-item-icon": {
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                  },
                  "& .ant-steps-item-process .ant-steps-item-icon": {
                    backgroundColor: "#D93E4C",
                    borderColor: "#D93E4C",
                  },
                }}
              >
                {WORKFLOW_STEPS.map((step, index) => (
                  <Step
                    key={index}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    status={
                      index < STATUS_TO_STEP[selectedRequest.status]
                        ? "finish"
                        : index === STATUS_TO_STEP[selectedRequest.status]
                        ? "process"
                        : "wait"
                    }
                  />
                ))}
              </Steps>

              {/* Status Update Actions */}
              {selectedRequest.status === REQUEST_STATUS.PENDING && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => {
                        handleStatusUpdate(
                          selectedRequest.requestID,
                          REQUEST_STATUS.ACCEPTED
                        );
                        setWorkflowModalVisible(false);
                      }}
                      style={{
                        backgroundColor: "#52c41a",
                        borderColor: "#52c41a",
                      }}
                    >
                      Chấp nhận yêu cầu
                    </Button>
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => {
                        handleStatusUpdate(
                          selectedRequest.requestID,
                          REQUEST_STATUS.REJECTED
                        );
                        setWorkflowModalVisible(false);
                      }}
                    >
                      Từ chối yêu cầu
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Detail Modal */}
        <Modal
          title={
            <div style={{ color: "#20374E" }}>
              <UserOutlined style={{ marginRight: 8, color: "#D93E4C" }} />
              Chi tiết yêu cầu máu - {selectedRequest?.requestCode}
            </div>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={700}
          style={{ top: 20 }}
        >
          {selectedRequest && (
            <div className="detail-content">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title="Thông tin bệnh nhân"
                    size="small"
                    style={{ backgroundColor: "#DECCAA" }}
                  >
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Text strong>Tên bệnh nhân: </Text>
                        <Text>{selectedRequest.patientName}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Mã yêu cầu: </Text>
                        <Text>{selectedRequest.requestCode}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Nhóm máu: </Text>
                        <Tag color="#D93E4C" style={{ fontWeight: "bold" }}>
                          {selectedRequest.bloodTypeDisplay}
                        </Tag>
                      </Col>
                      <Col span={12}>
                        <Text strong>Số lượng: </Text>
                        <Text>{selectedRequest.quantity} đơn vị</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Mức độ ưu tiên: </Text>
                        <Tag
                          color={getPriorityColor(selectedRequest.urgencyLevel)}
                        >
                          {getPriorityText(selectedRequest.urgencyLevel)}
                        </Tag>
                      </Col>
                      <Col span={12}>
                        <Text strong>Trạng thái: </Text>
                        <Tag color={getStatusColor(selectedRequest.status)}>
                          {getStatusText(selectedRequest.status)}
                        </Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card title="Thông tin liên hệ" size="small">
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Text strong>Bác sĩ yêu cầu: </Text>
                        <Text>
                          {selectedRequest.requesterName || "Chưa cập nhật"}
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Khoa: </Text>
                        <Text>
                          {selectedRequest.department || "Chưa cập nhật"}
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Số điện thoại: </Text>
                        <Text>
                          {selectedRequest.contactInfo || "Chưa cập nhật"}
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Ngày tạo: </Text>
                        <Text>
                          {new Date(selectedRequest.createdAt).toLocaleString(
                            "vi-VN"
                          )}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card title="Lý do cần máu" size="small">
                    <Text>
                      {selectedRequest.reason || "Chưa có thông tin chi tiết"}
                    </Text>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal>

        {/* Manage Modal - Push-up Style */}
        <Modal
          title={
            <div style={{ color: "#20374E", textAlign: "center" }}>
              <CheckOutlined style={{ marginRight: 8, color: "#D93E4C" }} />
              Quản lý yêu cầu - {selectedRequest?.requestCode}
            </div>
          }
          open={manageModalVisible}
          onCancel={() => {
            setManageModalVisible(false);
            setRejectReason("");
          }}
          footer={null}
          width={500}
          centered
          style={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
          bodyStyle={{
            padding: "24px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          {selectedRequest && (
            <div className="manage-content">
              {/* Request Summary */}
              <Card
                size="small"
                style={{ marginBottom: 16, backgroundColor: "#DECCAA" }}
              >
                <Row gutter={[16, 8]}>
                  <Col span={8}>
                    <Text strong>Bệnh nhân: </Text>
                    <Text>{selectedRequest.patientName}</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>Nhóm máu: </Text>
                    <Tag color="#D93E4C" style={{ fontWeight: "bold" }}>
                      {selectedRequest.bloodTypeDisplay}
                    </Tag>
                  </Col>
                  <Col span={8}>
                    <Text strong>Số lượng: </Text>
                    <Text>{selectedRequest.quantity} đơn vị</Text>
                  </Col>
                </Row>
              </Card>

              {/* Action Buttons - Two Clear Options */}
              <div style={{ marginTop: 24 }}>
                {selectedRequest.status === REQUEST_STATUS.PENDING && (
                  <div>
                    <Title
                      level={4}
                      style={{
                        textAlign: "center",
                        color: "#20374E",
                        marginBottom: 24,
                      }}
                    >
                      Chọn hành động:
                    </Title>

                    {/* Option 1: Export Blood */}
                    <Card
                      hoverable={!exportLoading}
                      style={{
                        marginBottom: 16,
                        border: "2px solid #D93E4C",
                        borderRadius: "8px",
                        cursor: exportLoading ? "not-allowed" : "pointer",
                        opacity: exportLoading ? 0.7 : 1,
                      }}
                      onClick={exportLoading ? undefined : handleExportBlood}
                      bodyStyle={{ padding: "16px", textAlign: "center" }}
                    >
                      {exportLoading ? (
                        <LoadingOutlined
                          style={{
                            fontSize: "32px",
                            color: "#D93E4C",
                            marginBottom: 8,
                          }}
                        />
                      ) : (
                        <ExportOutlined
                          style={{
                            fontSize: "32px",
                            color: "#D93E4C",
                            marginBottom: 8,
                          }}
                        />
                      )}
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#20374E",
                          marginBottom: 4,
                        }}
                      >
                        {exportLoading ? "Đang xuất kho..." : "Xuất kho"}
                      </div>
                      <div style={{ color: "#666", fontSize: "14px" }}>
                        Xác nhận xuất {selectedRequest.quantity} đơn vị máu{" "}
                        {selectedRequest.bloodTypeDisplay}
                      </div>
                    </Card>

                    {/* Option 2: Reject Request */}
                    <Card
                      hoverable
                      style={{
                        border: "2px solid #ff4d4f",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <CloseOutlined
                          style={{
                            fontSize: "32px",
                            color: "#ff4d4f",
                            marginBottom: 8,
                          }}
                        />
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#20374E",
                            marginBottom: 4,
                          }}
                        >
                          Từ chối yêu cầu
                        </div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: "14px",
                            marginBottom: 16,
                          }}
                        >
                          Nhập lý do từ chối bắt buộc
                        </div>
                      </div>

                      <Input.TextArea
                        placeholder="Nhập lý do từ chối (ví dụ: Không đủ số lượng máu trong kho)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                        style={{ marginBottom: 12 }}
                      />
                      <Button
                        danger
                        size="large"
                        icon={
                          rejectLoading ? (
                            <LoadingOutlined />
                          ) : (
                            <CloseOutlined />
                          )
                        }
                        onClick={handleRejectRequest}
                        disabled={!rejectReason.trim() || rejectLoading}
                        loading={rejectLoading}
                        style={{
                          width: "100%",
                          height: "45px",
                          fontSize: "16px",
                        }}
                      >
                        {rejectLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
                      </Button>
                    </Card>
                  </div>
                )}

                {/* For other statuses - show export option if applicable */}
                {(selectedRequest.status === REQUEST_STATUS.ACCEPTED ||
                  selectedRequest.status === REQUEST_STATUS.PROCESSING) && (
                  <div style={{ textAlign: "center" }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ExportOutlined />}
                      onClick={handleExportBlood}
                      style={{
                        backgroundColor: "#D93E4C",
                        borderColor: "#D93E4C",
                        width: "100%",
                        height: "50px",
                        fontSize: "16px",
                      }}
                    >
                      Xuất kho máu
                    </Button>
                  </div>
                )}

                {/* Status Info */}
                {selectedRequest.status === REQUEST_STATUS.EXPORTED && (
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                      borderRadius: "6px",
                      textAlign: "center",
                    }}
                  >
                    <CheckOutlined
                      style={{
                        color: "#52c41a",
                        fontSize: "24px",
                        marginBottom: "8px",
                      }}
                    />
                    <div style={{ color: "#52c41a", fontWeight: "bold" }}>
                      Đã xuất kho thành công
                    </div>
                  </div>
                )}

                {selectedRequest.status === REQUEST_STATUS.REJECTED && (
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#fff2f0",
                      border: "1px solid #ffccc7",
                      borderRadius: "6px",
                      textAlign: "center",
                    }}
                  >
                    <CloseOutlined
                      style={{
                        color: "#ff4d4f",
                        fontSize: "24px",
                        marginBottom: "8px",
                      }}
                    />
                    <div style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                      Yêu cầu đã bị từ chối
                    </div>
                    {selectedRequest.rejectReason && (
                      <div style={{ marginTop: "8px", color: "#666" }}>
                        Lý do: {selectedRequest.rejectReason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BloodRequestsPage;

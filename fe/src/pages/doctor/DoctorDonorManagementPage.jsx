import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import SimpleStatusTracker from "../../components/common/SimpleStatusTracker";
import NotificationService from "../../services/notificationService";
import authService from "../../services/authService";
import bloodDonationService from "../../services/bloodDonationService";
import { DOCTOR_TYPES } from "../../services/mockData";
import {
  DONATION_STATUS,
  STATUS_TRANSITIONS,
  USER_ROLES,
  WORKFLOW_PERMISSIONS
} from "../../constants/systemConstants";
import "../../styles/pages/DoctorDonorManagementPage.scss";
import {
  Card, Row, Col, Statistic, Select, Table, Tag, Button, message,
  Modal, Input, InputNumber, Divider, Space, Avatar,
  Descriptions, Badge, Steps
} from "antd";

const { TextArea } = Input;
import {
  EditOutlined, UserOutlined, PhoneOutlined, MailOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

// StatusWorkflowService helper
const StatusWorkflowService = {
  // New status constants based on database TINYINT values
  DONATION_STATUSES: {
    PENDING: 0,        // Đang chờ duyệt
    REJECTED: 1,       // Không chấp nhận
    APPROVED: 2,       // Chấp nhận
    CANCELLED: 3,      // Hủy
    // Keep old constants for backward compatibility
    ...DONATION_STATUS
  },
  USER_ROLES: USER_ROLES,
  DOCTOR_TYPES: DOCTOR_TYPES,

  getStatusInfo: (status, type = 'donation') => {
    // Handle both numeric and string status values
    const numericStatus = typeof status === 'string' ? parseInt(status) : status;

    const statusMap = {
      // New numeric statuses
      0: {
        text: "Đang chờ duyệt",
        color: "#faad14"
      },
      1: {
        text: "Không chấp nhận",
        color: "#ff4d4f"
      },
      2: {
        text: "Chấp nhận",
        color: "#52c41a"
      },
      3: {
        text: "Hủy",
        color: "#d9d9d9"
      },
      // Legacy string statuses for backward compatibility
      [DONATION_STATUS.REGISTERED]: {
        text: "Đã đăng ký",
        color: "#1890ff"
      },
      [DONATION_STATUS.HEALTH_CHECKED]: {
        text: "Đã khám sức khỏe",
        color: "#52c41a"
      },
      [DONATION_STATUS.NOT_ELIGIBLE_HEALTH]: {
        text: "Không đủ điều kiện (sau khám)",
        color: "#ff4d4f"
      },
      [DONATION_STATUS.DONATED]: {
        text: "Đã hiến máu",
        color: "#722ed1"
      },
      [DONATION_STATUS.BLOOD_TESTED]: {
        text: "Đã xét nghiệm",
        color: "#13c2c2"
      },
      [DONATION_STATUS.NOT_ELIGIBLE_TEST]: {
        text: "Không đủ điều kiện (sau xét nghiệm)",
        color: "#ff4d4f"
      },
      [DONATION_STATUS.COMPLETED]: {
        text: "Hoàn thành",
        color: "#52c41a"
      },
      [DONATION_STATUS.STORED]: {
        text: "Đã nhập kho",
        color: "#389e0d"
      }
    };

    return statusMap[numericStatus] || statusMap[status] || { text: status?.toString() || "N/A", color: "#666" };
  },

  getDonationStatusTransitions: (currentStatus, userRole, doctorType) => {
    // Handle numeric status transitions
    const numericStatus = typeof currentStatus === 'string' ? parseInt(currentStatus) : currentStatus;

    // Define allowed transitions for numeric statuses
    const numericTransitions = {
      0: [1, 2, 3], // Pending -> Rejected, Approved, Cancelled
      1: [0],       // Rejected -> Pending (re-review)
      2: [3],       // Approved -> Cancelled
      3: [0]        // Cancelled -> Pending (re-activate)
    };

    // Check if it's a numeric status
    if (typeof numericStatus === 'number' && numericTransitions[numericStatus]) {
      return numericTransitions[numericStatus];
    }

    // Fallback to legacy string-based transitions
    const transitions = STATUS_TRANSITIONS.DONATION[currentStatus] || [];
    const permissions = WORKFLOW_PERMISSIONS.DONATION[userRole];

    if (!permissions) return [];

    return transitions.filter(status =>
      permissions.allowedStatuses.includes(status)
    );
  }
};

const DoctorDonorManagementPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, today, pending, completed
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    bloodType: "",
    healthStatus: "",
    chronicDiseases: [],
    bloodRelatedDiseases: [],
    notes: "",
    testResults: {
      hemoglobin: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
    },
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: "",
    notes: "",
    healthCheck: {
      bloodPressure: "",
      heartRate: "",
      weight: "",
      hemoglobin: "",
      temperature: "",
    },
  });

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment =
    currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    if (isBloodDepartment) {
      loadDonors();
    }
  }, [isBloodDepartment]);

  const loadDonors = async () => {
    setLoading(true);
    try {
      // Get all blood donation appointments
      const response = await bloodDonationService.getAllAppointments();
      console.log("Blood donation appointments response:", response);

      let appointmentsData = [];

      // Handle different response formats
      if (Array.isArray(response)) {
        appointmentsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (response.appointments && Array.isArray(response.appointments)) {
        appointmentsData = response.appointments;
      }

      // Transform API data to match component structure
      const transformedDonors = await Promise.all(
        appointmentsData.map(async (appointment) => {
          try {
            // Get user info for each appointment
            let userInfo = {};
            if (appointment.UserId || appointment.userId) {
              try {
                const userResponse = await bloodDonationService.getUserInfo(
                  appointment.UserId || appointment.userId
                );
                userInfo = userResponse.data || userResponse;
              } catch (userError) {
                console.warn("Could not fetch user info:", userError);
              }
            }

            return {
              id: appointment.AppointmentId || appointment.appointmentId || appointment.id,
              name: userInfo.Name || userInfo.name || appointment.Name || "N/A",
              phone: userInfo.Phone || userInfo.phone || appointment.Phone || "N/A",
              email: userInfo.Email || userInfo.email || appointment.Email || "N/A",
              bloodType: userInfo.BloodGroup || userInfo.bloodGroup || appointment.BloodGroup || "N/A",
              age: userInfo.Age || userInfo.age || appointment.Age || 0,
              gender: userInfo.Gender || userInfo.gender || appointment.Gender || "unknown",
              weight: userInfo.Weight || userInfo.weight || appointment.Weight || 0,
              height: userInfo.Height || userInfo.height || appointment.Height || 0,
              appointmentDate: appointment.AppointmentDate || appointment.appointmentDate || appointment.RequestedDonationDate,
              timeSlot: appointment.TimeSlot || appointment.timeSlot || "morning",
              status: appointment.Status !== undefined ? appointment.Status :
                     appointment.status !== undefined ? appointment.status : 0, // Default to "Đang chờ duyệt"
              lastDonationDate: appointment.LastDonationDate || appointment.lastDonationDate || userInfo.LastDonationDate,
              notes: appointment.Notes || appointment.notes || "",
              createdAt: appointment.CreatedAt || appointment.createdAt || new Date().toISOString(),
              // Default values for fields not in API
              healthSurvey: {
                chronicDiseases: [],
                recentIllness: false,
                medications: "",
                allergies: "",
              },
              testResults: {
                hemoglobin: "",
                bloodPressure: "",
                heartRate: "",
                temperature: "",
                weight: (userInfo.Weight || userInfo.weight || appointment.Weight || "").toString(),
              },
              healthStatus: "unknown",
              bloodRelatedDiseases: [],
              totalDonations: 0,
            };
          } catch (transformError) {
            console.error("Error transforming appointment data:", transformError);
            return null;
          }
        })
      );

      // Filter out null values and set donors
      const validDonors = transformedDonors.filter(donor => donor !== null);
      setDonors(validDonors);

      if (validDonors.length === 0) {
        message.info("Không có dữ liệu người hiến máu");
      }

    } catch (error) {
      console.error("Error loading donors:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu người hiến máu");

      // Fallback to empty array instead of mock data
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDonors = () => {
    const today = new Date().toISOString().split("T")[0];

    switch (filter) {
      case "today":
        return donors.filter((d) => d.appointmentDate === today);
      case "pending":
        return donors.filter((d) => {
          const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
          return status === 0 || status === StatusWorkflowService.DONATION_STATUSES.PENDING;
        });
      case "approved":
        return donors.filter((d) => {
          const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
          return status === 2 || status === StatusWorkflowService.DONATION_STATUSES.APPROVED;
        });
      case "rejected":
        return donors.filter((d) => {
          const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
          return status === 1 || status === StatusWorkflowService.DONATION_STATUSES.REJECTED;
        });
      case "cancelled":
        return donors.filter((d) => {
          const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
          return status === 3 || status === StatusWorkflowService.DONATION_STATUSES.CANCELLED;
        });
      default:
        return donors;
    }
  };

  const handleUpdateDonor = (donor) => {
    setSelectedDonor(donor);
    setUpdateData({
      bloodType: donor.bloodType || "",
      healthStatus: donor.healthStatus || "",
      chronicDiseases: donor.healthSurvey?.chronicDiseases || [],
      bloodRelatedDiseases: donor.bloodRelatedDiseases || [],
      notes: donor.notes || "",
      testResults: donor.testResults || {
        hemoglobin: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
      },
    });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = async () => {
    if (!selectedDonor) return;

    try {
      // Note: API doesn't have specific endpoint for updating donor info
      // This updates local state only - in real implementation,
      // you might need to call a different API endpoint
      const updatedDonor = {
        ...selectedDonor,
        bloodType: updateData.bloodType,
        healthStatus: updateData.healthStatus,
        bloodRelatedDiseases: updateData.bloodRelatedDiseases,
        notes: updateData.notes,
        testResults: updateData.testResults,
        healthSurvey: {
          ...selectedDonor.healthSurvey,
          chronicDiseases: updateData.chronicDiseases,
        },
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name,
      };

      setDonors((prev) =>
        prev.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
      );

      setShowUpdateModal(false);
      setSelectedDonor(null);

      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating donor:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleUpdateStatus = (donor) => {
    setSelectedDonor(donor);
    setStatusUpdateData({
      status: donor.status,
      notes: donor.notes || "",
      healthCheck: donor.testResults || {
        bloodPressure: "",
        heartRate: "",
        weight: "",
        hemoglobin: "",
        temperature: "",
      },
    });
    setShowStatusModal(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      // Call delete API
      await bloodDonationService.deleteAppointment(appointmentId);

      // Remove from local state
      setDonors(prev => prev.filter(donor => donor.id !== appointmentId));

      message.success("Xóa lịch hẹn thành công!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      message.error("Có lỗi xảy ra khi xóa lịch hẹn!");
    }
  };

  const handleSaveStatusUpdate = async () => {
    if (!selectedDonor) return;

    try {
      // Convert status to appropriate format for API
      const statusToSend = typeof statusUpdateData.status === 'string' ?
        parseInt(statusUpdateData.status) : statusUpdateData.status;

      // Update appointment status via API
      await bloodDonationService.updateAppointmentStatus(
        selectedDonor.id,
        statusToSend
      );

      // Update local state
      const updatedDonor = {
        ...selectedDonor,
        status: statusToSend,
        notes: statusUpdateData.notes,
        testResults: statusUpdateData.healthCheck,
        updatedBy: currentUser?.name,
        updatedAt: new Date().toISOString(),
        // Add timestamps based on status
        ...(statusToSend === 2 && {
          approvedAt: new Date().toISOString(),
        }),
        ...(statusToSend === 1 && {
          rejectedAt: new Date().toISOString(),
        }),
        ...(statusToSend === 3 && {
          cancelledAt: new Date().toISOString(),
        }),
      };

      setDonors((prev) =>
        prev.map((donor) =>
          donor.id === selectedDonor.id ? updatedDonor : donor
        )
      );

      setShowStatusModal(false);
      setSelectedDonor(null);

      message.success("Cập nhật trạng thái thành công!");

      // Send notifications based on status
      if (statusToSend === 1) { // Rejected
        try {
          await NotificationService.createNotification({
            userId: selectedDonor.id,
            type: "donation_update",
            title: "💝 Cảm ơn bạn",
            message:
              "Cảm ơn bạn đã đăng ký hiến máu. Mặc dù lần này chưa phù hợp nhưng chúng tôi rất trân trọng tinh thần của bạn.",
            data: {
              donationDate: new Date().toISOString().split("T")[0],
              reason: "Không chấp nhận",
            },
          });
        } catch (notificationError) {
          console.warn("Could not send notification:", notificationError);
        }
      } else if (statusToSend === 2) { // Approved
        try {
          await NotificationService.createNotification({
            userId: selectedDonor.id,
            type: "donation_update",
            title: "🎉 Chúc mừng!",
            message:
              "Đăng ký hiến máu của bạn đã được chấp nhận. Vui lòng đến đúng giờ hẹn.",
            data: {
              donationDate: new Date().toISOString().split("T")[0],
              status: "Chấp nhận",
            },
          });
        } catch (notificationError) {
          console.warn("Could not send notification:", notificationError);
        }
      }
    } catch (error) {
      console.error("Error updating donor status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const getNextPossibleStatuses = (currentStatus) => {
    return StatusWorkflowService.getDonationStatusTransitions(
      currentStatus,
      StatusWorkflowService.USER_ROLES.DOCTOR,
      StatusWorkflowService.DOCTOR_TYPES.BLOOD_DEPARTMENT
    );
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "#28a745";
      case "good":
        return "#17a2b8";
      case "fair":
        return "#ffc107";
      case "poor":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getHealthStatusText = (status) => {
    switch (status) {
      case "excellent":
        return "Xuất sắc";
      case "good":
        return "Tốt";
      case "fair":
        return "Khá";
      case "poor":
        return "Kém";
      default:
        return "Chưa đánh giá";
    }
  };

  const getTimeSlotText = (slot) => {
    if (slot === "morning" || slot === "Sáng (7:00-12:00)") {
      return "7:00 - 12:00";
    } else if (slot === "afternoon" || slot === "Chiều (13:00-17:00)") {
      return "13:00 - 17:00";
    }
    return slot || "N/A";
  };

  if (!isBloodDepartment) {
    return (
      <DoctorLayout pageTitle="Quản lý người hiến máu">
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>🚫 Không có quyền truy cập</h2>
            <p>Chỉ bác sĩ khoa Huyết học mới có thể truy cập trang này.</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  const filteredDonors = getFilteredDonors();
  const todayCount = donors.filter(
    (d) => d.appointmentDate === new Date().toISOString().split("T")[0]
  ).length;

  const pendingCount = donors.filter((d) => {
    const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
    return status === 0;
  }).length;

  const approvedCount = donors.filter((d) => {
    const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
    return status === 2;
  }).length;

  const rejectedCount = donors.filter((d) => {
    const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
    return status === 1;
  }).length;

  const cancelledCount = donors.filter((d) => {
    const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
    return status === 3;
  }).length;

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (b) => <Tag color="red">{b}</Tag>,
    },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (g) => (g === "male" ? "Nam" : g === "female" ? "Nữ" : "N/A"),
    },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "N/A"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const statusInfo = StatusWorkflowService.getStatusInfo(s);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Sức khỏe",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (s) => (
        <Tag color={getHealthStatusColor(s)}>{getHealthStatusText(s)}</Tag>
      ),
    },
    {
      title: "Tổng lần hiến",
      dataIndex: "totalDonations",
      key: "totalDonations",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, donor) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <Button type="link" size="small" onClick={() => handleUpdateDonor(donor)}>
            Thông tin
          </Button>
          <Button type="link" size="small" onClick={() => handleUpdateStatus(donor)}>
            Trạng thái
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
                handleDeleteAppointment(donor.id);
              }
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DoctorLayout pageTitle="Quản lý người hiến máu">
      <div className="doctor-donor-management-content">
        {/* Thống kê hiện đại */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Hôm nay" value={todayCount} prefix="📅" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Chờ duyệt" value={pendingCount} prefix="⏳" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Chấp nhận"
                value={approvedCount}
                prefix="✅"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Tổng cộng" value={donors.length} prefix="👥" />
            </Card>
          </Col>
        </Row>

        {/* Thống kê bổ sung */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Không chấp nhận" value={rejectedCount} prefix="❌" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Đã hủy" value={cancelledCount} prefix="🚫" />
            </Card>
          </Col>
        </Row>

        {/* Filter hiện đại */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>Lọc theo:</span>
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 250 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "today", label: `Hôm nay (${todayCount})` },
              { value: "pending", label: `Chờ duyệt (${pendingCount})` },
              { value: "approved", label: `Chấp nhận (${approvedCount})` },
              { value: "rejected", label: `Không chấp nhận (${rejectedCount})` },
              { value: "cancelled", label: `Đã hủy (${cancelledCount})` },
            ]}
          />
          <Button
            style={{ marginLeft: 16 }}
            onClick={loadDonors}
            loading={loading}
            type="primary"
          >
            Làm mới
          </Button>
        </div>

        {/* Table người hiến máu */}
        <Table
          dataSource={filteredDonors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />

        {/* Update Modal - Modern Ant Design */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: '#1890ff' }} />
              <span>Cập nhật thông tin người hiến máu</span>
            </div>
          }
          open={showUpdateModal}
          onCancel={() => setShowUpdateModal(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setShowUpdateModal(false)}>
              Hủy
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveUpdate}>
              <EditOutlined /> Lưu thay đổi
            </Button>
          ]}
        >
          {selectedDonor && (
            <div>
              {/* Donor Summary Card */}
              <Card
                size="small"
                style={{ marginBottom: 16, backgroundColor: '#f8f9fa' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  <div>
                    <h3 style={{ margin: 0, color: '#1890ff' }}>{selectedDonor.name}</h3>
                    <Space direction="vertical" size={4}>
                      <div><PhoneOutlined /> {selectedDonor.phone}</div>
                      <div><MailOutlined /> {selectedDonor.email}</div>
                      <div>
                        📅 {new Date(selectedDonor.appointmentDate).toLocaleDateString("vi-VN")}
                        - {getTimeSlotText(selectedDonor.timeSlot)}
                      </div>
                    </Space>
                  </div>
                </div>
              </Card>

              <Divider orientation="left">🩸 Thông tin máu</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Nhóm máu:
                    </label>
                    <Select
                      style={{ width: '100%' }}
                      value={updateData.bloodType}
                      onChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          bloodType: value,
                        }))
                      }
                      placeholder="Chọn nhóm máu"
                    >
                      <Select.Option value="O+">O+</Select.Option>
                      <Select.Option value="O-">O-</Select.Option>
                      <Select.Option value="A+">A+</Select.Option>
                      <Select.Option value="A-">A-</Select.Option>
                      <Select.Option value="B+">B+</Select.Option>
                      <Select.Option value="B-">B-</Select.Option>
                      <Select.Option value="AB+">AB+</Select.Option>
                      <Select.Option value="AB-">AB-</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Tình trạng sức khỏe:
                    </label>
                    <Select
                      style={{ width: '100%' }}
                      value={updateData.healthStatus}
                      onChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          healthStatus: value,
                        }))
                      }
                      placeholder="Chọn tình trạng"
                    >
                      <Select.Option value="excellent">Xuất sắc</Select.Option>
                      <Select.Option value="good">Tốt</Select.Option>
                      <Select.Option value="fair">Khá</Select.Option>
                      <Select.Option value="poor">Kém</Select.Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Divider orientation="left">🔬 Kết quả xét nghiệm</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Hemoglobin (g/dL):
                    </label>
                    <InputNumber
                      style={{ width: '100%' }}
                      step={0.1}
                      value={updateData.testResults.hemoglobin}
                      onChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          testResults: {
                            ...prev.testResults,
                            hemoglobin: value,
                          },
                        }))
                      }
                      placeholder="VD: 14.5"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Huyết áp (mmHg):
                    </label>
                    <Input
                      value={updateData.testResults.bloodPressure}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          testResults: {
                            ...prev.testResults,
                            bloodPressure: e.target.value,
                          },
                        }))
                      }
                      placeholder="VD: 120/80"
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Nhịp tim (bpm):
                    </label>
                    <InputNumber
                      style={{ width: '100%' }}
                      value={updateData.testResults.heartRate}
                      onChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          testResults: {
                            ...prev.testResults,
                            heartRate: value,
                          },
                        }))
                      }
                      placeholder="VD: 72"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Nhiệt độ (°C):
                    </label>
                    <InputNumber
                      style={{ width: '100%' }}
                      step={0.1}
                      value={updateData.testResults.temperature}
                      onChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          testResults: {
                            ...prev.testResults,
                            temperature: value,
                          },
                        }))
                      }
                      placeholder="VD: 36.5"
                    />
                  </div>
                </Col>
              </Row>

              <Divider orientation="left">📝 Ghi chú</Divider>
              <Input.TextArea
                rows={4}
                value={updateData.notes}
                onChange={(e) =>
                  setUpdateData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Nhập ghi chú về tình trạng sức khỏe, kết quả khám..."
              />
            </div>
          )}
        </Modal>

        {/* Status Update Modal - Modern Ant Design */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: '#1890ff' }} />
              <span>Cập nhật trạng thái hiến máu</span>
            </div>
          }
          open={showStatusModal}
          onCancel={() => setShowStatusModal(false)}
          width={700}
          footer={[
            <Button key="cancel" onClick={() => setShowStatusModal(false)}>
              Hủy
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveStatusUpdate}>
              <CheckCircleOutlined /> Lưu cập nhật
            </Button>
          ]}
        >
          {selectedDonor && (
            <div>
              {/* Donor Summary */}
              <Card
                size="small"
                style={{ marginBottom: 16, backgroundColor: '#f8f9fa' }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                      <div style={{ marginTop: 8, fontWeight: 'bold', color: '#1890ff' }}>
                        {selectedDonor.name}
                      </div>
                    </div>
                  </Col>
                  <Col span={16}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Nhóm máu">
                        <Tag color="red" style={{ fontSize: '14px' }}>
                          {selectedDonor.bloodType}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái hiện tại">
                        <Badge
                          color={StatusWorkflowService.getStatusInfo(selectedDonor.status).color}
                          text={StatusWorkflowService.getStatusInfo(selectedDonor.status).text}
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày hẹn">
                        {new Date(selectedDonor.appointmentDate).toLocaleDateString("vi-VN")} - {getTimeSlotText(selectedDonor.timeSlot)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>

              {/* Status Update Section */}
              <Divider orientation="left">🔄 Cập nhật trạng thái</Divider>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Chọn trạng thái mới:
                </label>
                <Select
                  style={{ width: '100%' }}
                  value={statusUpdateData.status}
                  onChange={(value) =>
                    setStatusUpdateData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                  placeholder="Chọn trạng thái"
                >
                  <Select.Option value={selectedDonor.status}>
                    Giữ nguyên - {StatusWorkflowService.getStatusInfo(selectedDonor.status).text}
                  </Select.Option>
                  <Select.OptGroup label="Trạng thái cơ bản">
                    <Select.Option value="0">
                      <Badge color="#faad14" text="Đang chờ duyệt" />
                    </Select.Option>
                    <Select.Option value="1">
                      <Badge color="#ff4d4f" text="Không chấp nhận" />
                    </Select.Option>
                    <Select.Option value="2">
                      <Badge color="#52c41a" text="Chấp nhận" />
                    </Select.Option>
                    <Select.Option value="3">
                      <Badge color="#d9d9d9" text="Hủy" />
                    </Select.Option>
                  </Select.OptGroup>
                </Select>
              </div>

              {/* Health Check Form - Show when status is approved */}
              {(statusUpdateData.status === "2" || statusUpdateData.status === 2) && (
                <div>
                  <Divider orientation="left">🩺 Thông số sức khỏe</Divider>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                          Huyết áp (mmHg):
                        </label>
                        <Input
                          value={statusUpdateData.healthCheck.bloodPressure}
                          onChange={(e) =>
                            setStatusUpdateData((prev) => ({
                              ...prev,
                              healthCheck: {
                                ...prev.healthCheck,
                                bloodPressure: e.target.value,
                              },
                            }))
                          }
                          placeholder="120/80"
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                          Nhịp tim (bpm):
                        </label>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={statusUpdateData.healthCheck.heartRate}
                          onChange={(value) =>
                            setStatusUpdateData((prev) => ({
                              ...prev,
                              healthCheck: {
                                ...prev.healthCheck,
                                heartRate: value,
                              },
                            }))
                          }
                          placeholder="72"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                          Cân nặng (kg):
                        </label>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={statusUpdateData.healthCheck.weight}
                          onChange={(value) =>
                            setStatusUpdateData((prev) => ({
                              ...prev,
                              healthCheck: {
                                ...prev.healthCheck,
                                weight: value,
                              },
                            }))
                          }
                          placeholder="65"
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                          Hemoglobin (g/dL):
                        </label>
                        <InputNumber
                          style={{ width: '100%' }}
                          step={0.1}
                          value={statusUpdateData.healthCheck.hemoglobin}
                          onChange={(value) =>
                            setStatusUpdateData((prev) => ({
                              ...prev,
                              healthCheck: {
                                ...prev.healthCheck,
                                hemoglobin: value,
                              },
                            }))
                          }
                          placeholder="13.5"
                        />
                      </div>
                    </Col>
                  </Row>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                      Nhiệt độ (°C):
                    </label>
                    <InputNumber
                      style={{ width: '100%' }}
                      step={0.1}
                      value={statusUpdateData.healthCheck.temperature}
                      onChange={(value) =>
                        setStatusUpdateData((prev) => ({
                          ...prev,
                          healthCheck: {
                            ...prev.healthCheck,
                            temperature: value,
                          },
                        }))
                      }
                      placeholder="36.5"
                    />
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <Divider orientation="left">📝 Ghi chú</Divider>
              <TextArea
                value={statusUpdateData.notes}
                onChange={(e) =>
                  setStatusUpdateData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Nhập ghi chú về tình trạng sức khỏe hoặc quá trình hiến máu..."
                rows={4}
                style={{ marginBottom: 16 }}
              />
            </div>
          )}
        </Modal>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDonorManagementPage;

import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import SimpleStatusTracker from "../../components/common/SimpleStatusTracker";
import NotificationService from "../../services/notificationService";
import authService from "../../services/authService";
import { DOCTOR_TYPES } from "../../services/mockData";
import { DONATION_STATUS } from "../../constants/systemConstants";
import "../../styles/pages/DoctorDonorManagementPage.scss";
import { Card, Row, Col, Statistic, Select, Table, Tag, Button } from "antd";

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
      // TODO: Replace with actual API call - GET /api/doctor/donors
      const mockDonors = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          phone: "0123456789",
          email: "nguyenvana@email.com",
          bloodType: "O+",
          age: 28,
          gender: "male",
          weight: 65,
          height: 170,
          appointmentDate: "2024-12-15",
          timeSlot: "morning",
          status: StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED,
          healthSurvey: {
            chronicDiseases: [],
            recentIllness: false,
            medications: "",
            allergies: "",
          },
          testResults: {
            hemoglobin: "14.5",
            bloodPressure: "120/80",
            heartRate: "72",
            temperature: "36.5",
            weight: "65",
          },
          healthStatus: "excellent",
          bloodRelatedDiseases: [],
          lastDonationDate: "2024-10-15",
          totalDonations: 8,
          notes: "",
          createdAt: "2024-12-10T08:00:00Z",
        },
        {
          id: 2,
          name: "Trần Thị B",
          phone: "0987654321",
          email: "tranthib@email.com",
          bloodType: "A+",
          age: 32,
          gender: "female",
          weight: 55,
          height: 160,
          appointmentDate: "2024-12-15",
          timeSlot: "afternoon",
          status: StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED,
          healthSurvey: {
            chronicDiseases: [],
            recentIllness: false,
            medications: "",
            allergies: "",
          },
          testResults: {
            hemoglobin: "12.8",
            bloodPressure: "110/70",
            heartRate: "68",
            temperature: "36.3",
            weight: "55",
          },
          healthStatus: "good",
          bloodRelatedDiseases: [],
          lastDonationDate: "2024-09-20",
          totalDonations: 12,
          notes: "Đã hiến máu thành công, chờ xét nghiệm",
          createdAt: "2024-12-09T14:30:00Z",
        },
        {
          id: 3,
          name: "Lê Văn C",
          phone: "0345678901",
          email: "levanc@email.com",
          bloodType: "O-",
          age: 35,
          gender: "male",
          weight: 70,
          height: 175,
          appointmentDate: "2024-12-16",
          timeSlot: "morning",
          status: StatusWorkflowService.DONATION_STATUSES.REGISTERED,
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
            weight: "",
          },
          healthStatus: "unknown",
          bloodRelatedDiseases: [],
          lastDonationDate: "2024-08-30",
          totalDonations: 15,
          notes: "",
          createdAt: "2024-12-08T10:15:00Z",
        },
        {
          id: 4,
          name: "Phạm Thị D",
          bloodType: "AB+",
          phone: "0912345678",
          email: "donor4@test.com",
          age: 32,
          gender: "female",
          address: "456 Đường DEF, Quận 3, TP.HCM",
          registrationDate: "2024-12-18",
          lastDonation: null,
          donationCount: 0,
          status: StatusWorkflowService.DONATION_STATUSES.DONATED,
          healthStatus: "good",
          chronicDiseases: [],
          bloodRelatedDiseases: [],
          notes: "Đã hiến máu thành công, chờ xét nghiệm",
          testResults: {
            hemoglobin: "12.8",
            bloodPressure: "110/70",
            heartRate: "75",
            temperature: "36.4",
            weight: "55",
          },
          eligibilityDate: "2024-12-18",
          distance: 2.1,
        },
      ];

      setDonors(mockDonors);
    } catch (error) {
      console.error("Error loading donors:", error);
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
        return donors.filter((d) =>
          [
            StatusWorkflowService.DONATION_STATUSES.REGISTERED,
            StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED,
          ].includes(d.status)
        );
      case "completed":
        return donors.filter((d) =>
          [
            StatusWorkflowService.DONATION_STATUSES.COMPLETED,
            StatusWorkflowService.DONATION_STATUSES.NOT_ELIGIBLE,
          ].includes(d.status)
        );
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
      // TODO: Replace with actual API call - PUT /api/doctor/donors/:id
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
        updatedBy: currentUser.name,
      };

      setDonors((prev) =>
        prev.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
      );

      setShowUpdateModal(false);
      setSelectedDonor(null);

      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating donor:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
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

  const handleSaveStatusUpdate = async () => {
    try {
      // TODO: Replace with actual API call - PUT /api/doctor/donors/:id/status
      const updatedDonor = {
        ...selectedDonor,
        status: statusUpdateData.status,
        notes: statusUpdateData.notes,
        testResults: statusUpdateData.healthCheck,
        updatedBy: currentUser?.name,
        updatedAt: new Date().toISOString(),
        ...(statusUpdateData.status ===
          StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED && {
          healthCheckedAt: new Date().toISOString(),
        }),
        ...(statusUpdateData.status ===
          StatusWorkflowService.DONATION_STATUSES.DONATED && {
          donatedAt: new Date().toISOString(),
        }),
      };

      setDonors((prev) =>
        prev.map((donor) =>
          donor.id === selectedDonor.id ? updatedDonor : donor
        )
      );

      setShowStatusModal(false);
      setSelectedDonor(null);

      // Send notifications based on status
      if (
        statusUpdateData.status ===
        StatusWorkflowService.DONATION_STATUSES.NOT_ELIGIBLE_AFTER_HEALTH_CHECK
      ) {
        await NotificationService.createNotification({
          userId: selectedDonor.id,
          type: "donation_update",
          title: "💝 Cảm ơn bạn",
          message:
            "Cảm ơn bạn đã đến hiến máu. Mặc dù lần này chưa phù hợp nhưng chúng tôi rất trân trọng tinh thần của bạn.",
          data: {
            donationDate: new Date().toISOString().split("T")[0],
            reason: "Không đủ điều kiện sau khám",
          },
        });
      }
    } catch (error) {
      console.error("Error updating donor status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
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
    return slot === "morning" ? "7:00 - 11:00" : "13:00 - 17:00";
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
  const pendingCount = donors.filter((d) =>
    [
      StatusWorkflowService.DONATION_STATUSES.REGISTERED,
      StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED,
    ].includes(d.status)
  ).length;
  const completedCount = donors.filter((d) =>
    [
      StatusWorkflowService.DONATION_STATUSES.COMPLETED,
      StatusWorkflowService.DONATION_STATUSES.NOT_ELIGIBLE,
    ].includes(d.status)
  ).length;

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
      render: (g) => (g === "male" ? "Nam" : "Nữ"),
    },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag>{s}</Tag>,
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
        <Button type="link" onClick={() => handleUpdateDonor(donor)}>
          Cập nhật
        </Button>
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
              <Statistic title="Đang xử lý" value={pendingCount} prefix="⏳" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={completedCount}
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

        {/* Filter hiện đại */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>Lọc theo:</span>
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 200 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "today", label: `Hôm nay (${todayCount})` },
              { value: "pending", label: `Đang xử lý (${pendingCount})` },
              { value: "completed", label: `Hoàn thành (${completedCount})` },
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

        {/* Update Modal */}
        {showUpdateModal && selectedDonor && (
          <div
            className="modal-overlay"
            onClick={() => setShowUpdateModal(false)}
          >
            <div className="update-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>✏️ Cập nhật thông tin người hiến</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowUpdateModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="donor-summary">
                  <h4>👤 {selectedDonor.name}</h4>
                  <p>
                    📅{" "}
                    {new Date(selectedDonor.appointmentDate).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                    - {getTimeSlotText(selectedDonor.timeSlot)}
                  </p>
                </div>

                <form className="update-form">
                  <div className="form-section">
                    <h4>🩸 Thông tin máu</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nhóm máu:</label>
                        <select
                          value={updateData.bloodType}
                          onChange={(e) =>
                            setUpdateData((prev) => ({
                              ...prev,
                              bloodType: e.target.value,
                            }))
                          }
                        >
                          <option value="">Chọn nhóm máu</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Tình trạng sức khỏe:</label>
                        <select
                          value={updateData.healthStatus}
                          onChange={(e) =>
                            setUpdateData((prev) => ({
                              ...prev,
                              healthStatus: e.target.value,
                            }))
                          }
                        >
                          <option value="">Chọn tình trạng</option>
                          <option value="excellent">Xuất sắc</option>
                          <option value="good">Tốt</option>
                          <option value="fair">Khá</option>
                          <option value="poor">Kém</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>🔬 Kết quả xét nghiệm</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Hemoglobin (g/dL):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={updateData.testResults.hemoglobin}
                          onChange={(e) =>
                            setUpdateData((prev) => ({
                              ...prev,
                              testResults: {
                                ...prev.testResults,
                                hemoglobin: e.target.value,
                              },
                            }))
                          }
                          placeholder="VD: 14.5"
                        />
                      </div>

                      <div className="form-group">
                        <label>Huyết áp (mmHg):</label>
                        <input
                          type="text"
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
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Nhịp tim (bpm):</label>
                        <input
                          type="number"
                          value={updateData.testResults.heartRate}
                          onChange={(e) =>
                            setUpdateData((prev) => ({
                              ...prev,
                              testResults: {
                                ...prev.testResults,
                                heartRate: e.target.value,
                              },
                            }))
                          }
                          placeholder="VD: 72"
                        />
                      </div>

                      <div className="form-group">
                        <label>Nhiệt độ (°C):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={updateData.testResults.temperature}
                          onChange={(e) =>
                            setUpdateData((prev) => ({
                              ...prev,
                              testResults: {
                                ...prev.testResults,
                                temperature: e.target.value,
                              },
                            }))
                          }
                          placeholder="VD: 36.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>📝 Ghi chú</h4>
                    <textarea
                      value={updateData.notes}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Nhập ghi chú về tình trạng sức khỏe, kết quả khám..."
                      rows="4"
                    />
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSaveUpdate}>
                  💾 Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedDonor && (
          <div
            className="modal-overlay"
            onClick={() => setShowStatusModal(false)}
          >
            <div className="status-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🩺 Cập nhật trạng thái hiến máu</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowStatusModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="donor-summary">
                  <div className="summary-item">
                    <label>Người hiến:</label>
                    <span>{selectedDonor.name}</span>
                  </div>
                  <div className="summary-item">
                    <label>Nhóm máu:</label>
                    <span
                      className={`blood-type-badge ${
                        selectedDonor.bloodType.includes("+")
                          ? "positive"
                          : "negative"
                      }`}
                    >
                      {selectedDonor.bloodType}
                    </span>
                  </div>
                  <div className="summary-item">
                    <label>Trạng thái hiện tại:</label>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: StatusWorkflowService.getStatusInfo(
                          selectedDonor.status,
                          "donation"
                        ).color,
                      }}
                    >
                      {
                        StatusWorkflowService.getStatusInfo(
                          selectedDonor.status,
                          "donation"
                        ).text
                      }
                    </span>
                  </div>
                </div>

                <div className="form-section">
                  <label>Cập nhật trạng thái:</label>
                  <select
                    value={statusUpdateData.status}
                    onChange={(e) =>
                      setStatusUpdateData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value={selectedDonor.status}>
                      Giữ nguyên -{" "}
                      {
                        StatusWorkflowService.getStatusInfo(
                          selectedDonor.status,
                          "donation"
                        ).text
                      }
                    </option>
                    {getNextPossibleStatuses(selectedDonor.status).map(
                      (status) => (
                        <option key={status} value={status}>
                          {
                            StatusWorkflowService.getStatusInfo(
                              status,
                              "donation"
                            ).text
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Health Check Form */}
                {(statusUpdateData.status ===
                  StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED ||
                  statusUpdateData.status ===
                    StatusWorkflowService.DONATION_STATUSES.DONATED) && (
                  <div className="health-check-section">
                    <h4>Thông số sức khỏe</h4>
                    <div className="health-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Huyết áp:</label>
                          <input
                            type="text"
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
                        <div className="form-group">
                          <label>Nhịp tim:</label>
                          <input
                            type="text"
                            value={statusUpdateData.healthCheck.heartRate}
                            onChange={(e) =>
                              setStatusUpdateData((prev) => ({
                                ...prev,
                                healthCheck: {
                                  ...prev.healthCheck,
                                  heartRate: e.target.value,
                                },
                              }))
                            }
                            placeholder="72"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Cân nặng (kg):</label>
                          <input
                            type="text"
                            value={statusUpdateData.healthCheck.weight}
                            onChange={(e) =>
                              setStatusUpdateData((prev) => ({
                                ...prev,
                                healthCheck: {
                                  ...prev.healthCheck,
                                  weight: e.target.value,
                                },
                              }))
                            }
                            placeholder="65"
                          />
                        </div>
                        <div className="form-group">
                          <label>Hemoglobin (g/dL):</label>
                          <input
                            type="text"
                            value={statusUpdateData.healthCheck.hemoglobin}
                            onChange={(e) =>
                              setStatusUpdateData((prev) => ({
                                ...prev,
                                healthCheck: {
                                  ...prev.healthCheck,
                                  hemoglobin: e.target.value,
                                },
                              }))
                            }
                            placeholder="13.5"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nhiệt độ (°C):</label>
                        <input
                          type="text"
                          value={statusUpdateData.healthCheck.temperature}
                          onChange={(e) =>
                            setStatusUpdateData((prev) => ({
                              ...prev,
                              healthCheck: {
                                ...prev.healthCheck,
                                temperature: e.target.value,
                              },
                            }))
                          }
                          placeholder="36.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-section">
                  <label>Ghi chú:</label>
                  <textarea
                    value={statusUpdateData.notes}
                    onChange={(e) =>
                      setStatusUpdateData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Nhập ghi chú về tình trạng sức khỏe hoặc quá trình hiến máu..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowStatusModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveStatusUpdate}
                >
                  💾 Lưu cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorDonorManagementPage;

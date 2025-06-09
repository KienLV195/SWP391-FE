import React, { useState, useEffect } from "react";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import SimpleStatusTracker from "../../components/common/SimpleStatusTracker";
import GeolibService from "../../services/geolibService";
import { DONATION_STATUS } from "../../constants/systemConstants";
import "../../styles/pages/DonationSchedulePage.scss";

const DonationSchedulePage = () => {
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' or 'process'
  const [donations, setDonations] = useState([]);
  const [processDonations, setProcessDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, today, upcoming, completed
  const [processFilter, setProcessFilter] = useState("all"); // all, testing, completed, stored
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  useEffect(() => {
    loadDonationSchedule();
    loadProcessDonations();
  }, []);

  const loadDonationSchedule = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - GET /api/manager/donation-schedule
      const mockDonations = [
        {
          id: 1,
          donorId: 101,
          donorName: "Nguyễn Văn A",
          donorPhone: "0123456789",
          donorEmail: "nguyenvana@email.com",
          bloodType: "O+",
          appointmentDate: "2024-12-15",
          timeSlot: "morning", // morning (7-11) or afternoon (13-17)
          status: StatusWorkflowService.DONATION_STATUSES.REGISTERED,
          healthSurvey: {
            weight: 65,
            height: 170,
            bloodPressure: "120/80",
            chronicDiseases: [],
            eligibilityChecked: true,
          },
          location: {
            lat: 10.7751,
            lng: 106.6862,
            address: "120 Đường ABC, Quận 1, TP.HCM",
            distance: 0.5,
          },
          emergencyContact: {
            name: "Nguyễn Thị B",
            phone: "0987654321",
            relationship: "spouse",
          },
          createdAt: "2024-12-10T08:00:00Z",
          notes: "",
        },
        {
          id: 2,
          donorId: 102,
          donorName: "Trần Thị C",
          donorPhone: "0345678901",
          donorEmail: "tranthic@email.com",
          bloodType: "A+",
          appointmentDate: "2024-12-15",
          timeSlot: "afternoon",
          status: StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED,
          healthSurvey: {
            weight: 55,
            height: 160,
            bloodPressure: "110/70",
            chronicDiseases: [],
            eligibilityChecked: true,
          },
          location: {
            lat: 10.78,
            lng: 106.69,
            address: "456 Đường XYZ, Quận 3, TP.HCM",
            distance: 5.2,
          },
          emergencyContact: {
            name: "Trần Văn D",
            phone: "0567890123",
            relationship: "parent",
          },
          createdAt: "2024-12-09T14:30:00Z",
          notes: "Đã hoàn thành khám sức khỏe",
        },
        {
          id: 3,
          donorId: 103,
          donorName: "Lê Văn E",
          donorPhone: "0789012345",
          donorEmail: "levane@email.com",
          bloodType: "B+",
          appointmentDate: "2024-12-16",
          timeSlot: "morning",
          status: StatusWorkflowService.DONATION_STATUSES.DONATED,
          healthSurvey: {
            weight: 70,
            height: 175,
            bloodPressure: "125/85",
            chronicDiseases: [],
            eligibilityChecked: true,
          },
          location: {
            lat: 10.8,
            lng: 106.7,
            address: "789 Đường GHI, Quận 7, TP.HCM",
            distance: 15.3,
          },
          emergencyContact: {
            name: "Lê Thị F",
            phone: "0901234567",
            relationship: "sibling",
          },
          createdAt: "2024-12-08T10:15:00Z",
          notes: "Đã hiến máu thành công, chờ xét nghiệm",
        },
      ];

      setDonations(mockDonations);
    } catch (error) {
      console.error("Error loading donation schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProcessDonations = async () => {
    try {
      // TODO: Replace with actual API call - GET /api/manager/donation-process
      const mockProcessDonations = [
        {
          id: 1,
          donorId: "VDU001",
          donorName: "Nguyễn Văn A",
          bloodType: "O+",
          donationDate: "2024-12-18",
          quantity: "450ml",
          status: StatusWorkflowService.DONATION_STATUSES.BLOOD_TESTED,
          testResults: {
            hemoglobin: "14.2 g/dL",
            bloodPressure: "120/80 mmHg",
            heartRate: "72 bpm",
            temperature: "36.5°C",
            weight: "65 kg",
            bloodTests: {
              hiv: "Âm tính",
              hepatitisB: "Âm tính",
              hepatitisC: "Âm tính",
              syphilis: "Âm tính",
            },
          },
          processedBy: "BS. Trần Văn B",
          processedAt: "2024-12-18T10:30:00Z",
          notes: "Kết quả xét nghiệm tốt, đủ điều kiện sử dụng",
        },
        {
          id: 2,
          donorId: "VDU002",
          donorName: "Trần Thị C",
          bloodType: "A+",
          donationDate: "2024-12-17",
          quantity: "450ml",
          status: StatusWorkflowService.DONATION_STATUSES.COMPLETED,
          testResults: {
            hemoglobin: "13.8 g/dL",
            bloodPressure: "115/75 mmHg",
            heartRate: "68 bpm",
            temperature: "36.3°C",
            weight: "58 kg",
            bloodTests: {
              hiv: "Âm tính",
              hepatitisB: "Âm tính",
              hepatitisC: "Âm tính",
              syphilis: "Âm tính",
            },
          },
          processedBy: "BS. Lê Thị D",
          processedAt: "2024-12-17T15:45:00Z",
          completedAt: "2024-12-18T08:00:00Z",
          notes: "Hoàn thành quy trình, sẵn sàng nhập kho",
        },
        {
          id: 3,
          donorId: "VDU003",
          donorName: "Lê Văn E",
          bloodType: "B+",
          donationDate: "2024-12-16",
          quantity: "450ml",
          status: StatusWorkflowService.DONATION_STATUSES.STORED,
          testResults: {
            hemoglobin: "15.1 g/dL",
            bloodPressure: "125/80 mmHg",
            heartRate: "70 bpm",
            temperature: "36.4°C",
            weight: "72 kg",
            bloodTests: {
              hiv: "Âm tính",
              hepatitisB: "Âm tính",
              hepatitisC: "Âm tính",
              syphilis: "Âm tính",
            },
          },
          processedBy: "BS. Phạm Văn F",
          processedAt: "2024-12-16T14:20:00Z",
          completedAt: "2024-12-17T09:30:00Z",
          storedAt: "2024-12-17T11:00:00Z",
          storageLocation: "Kho A - Tủ 1 - Ngăn 3",
          expiryDate: "2024-12-31",
          notes: "Đã nhập kho thành công",
        },
      ];

      setProcessDonations(mockProcessDonations);
    } catch (error) {
      console.error("Error loading process donations:", error);
    }
  };

  const getFilteredDonations = () => {
    const today = new Date().toISOString().split("T")[0];

    switch (filter) {
      case "today":
        return donations.filter((d) => d.appointmentDate === today);
      case "upcoming":
        return donations.filter(
          (d) => new Date(d.appointmentDate) > new Date()
        );
      case "completed":
        return donations.filter((d) =>
          [
            StatusWorkflowService.DONATION_STATUSES.COMPLETED,
            StatusWorkflowService.DONATION_STATUSES
              .NOT_ELIGIBLE_AFTER_HEALTH_CHECK,
          ].includes(d.status)
        );
      default:
        return donations;
    }
  };

  const getFilteredProcessDonations = () => {
    switch (processFilter) {
      case "testing":
        return processDonations.filter(
          (d) =>
            d.status === StatusWorkflowService.DONATION_STATUSES.BLOOD_TESTED
        );
      case "completed":
        return processDonations.filter(
          (d) => d.status === StatusWorkflowService.DONATION_STATUSES.COMPLETED
        );
      case "stored":
        return processDonations.filter(
          (d) => d.status === StatusWorkflowService.DONATION_STATUSES.STORED
        );
      default:
        return processDonations;
    }
  };

  const getTimeSlotText = (slot) => {
    return slot === "morning" ? "7:00 - 11:00" : "13:00 - 17:00";
  };

  const getStatusColor = (status) => {
    const statusInfo = StatusWorkflowService.getStatusInfo(status, "donation");
    return statusInfo.color;
  };

  const handleStatusUpdate = (updatedDonation) => {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === updatedDonation.id
          ? { ...d, status: updatedDonation.status }
          : d
      )
    );
    setShowWorkflowModal(false);
    setSelectedDonation(null);
  };

  const handleViewWorkflow = (donation) => {
    setSelectedDonation(donation);
    setShowWorkflowModal(true);
  };

  const handleUpdateStatus = async (donationId, newStatus) => {
    try {
      // TODO: Replace with actual API call - PUT /api/manager/donations/:id/status
      const updatedDonation = {
        ...processDonations.find((d) => d.id === donationId),
        status: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: "Manager",
        ...(newStatus === DONATION_STATUS.STORED && {
          storedAt: new Date().toISOString(),
          storageLocation: "Kho A - Tủ 2 - Ngăn 1",
          expiryDate: new Date(
            Date.now() + 35 * 24 * 60 * 60 * 1000
          ).toISOString(), // 35 days from now
        }),
      };

      setProcessDonations((prev) =>
        prev.map((donation) =>
          donation.id === donationId ? updatedDonation : donation
        )
      );

      console.log(`Cập nhật trạng thái thành công: ${newStatus}`);
    } catch (error) {
      console.error("Error updating donation status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const getPriorityClass = (distance) => {
    if (distance <= 5) return "very-close";
    if (distance <= 10) return "close";
    if (distance <= 20) return "moderate";
    return "far";
  };

  const filteredDonations = getFilteredDonations();
  const todayCount = donations.filter(
    (d) => d.appointmentDate === new Date().toISOString().split("T")[0]
  ).length;
  const upcomingCount = donations.filter(
    (d) => new Date(d.appointmentDate) > new Date()
  ).length;
  const completedCount = donations.filter((d) =>
    [
      StatusWorkflowService.DONATION_STATUSES.COMPLETED,
      StatusWorkflowService.DONATION_STATUSES.NOT_ELIGIBLE,
    ].includes(d.status)
  ).length;

  return (
    <div className="donation-schedule-page">
      <ManagerSidebar />

      <div className="schedule-content">
        <div className="page-header">
          <div className="header-content">
            <h1>📅 Lịch & Quy trình hiến máu</h1>
            <p>Quản lý lịch hẹn và theo dõi quy trình hiến máu</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              loadDonationSchedule();
              loadProcessDonations();
            }}
            disabled={loading}
          >
            {loading ? "⏳ Đang tải..." : "🔄 Làm mới"}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button
            className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            📅 Lịch hiến máu
          </button>
          <button
            className={`tab-btn ${activeTab === "process" ? "active" : ""}`}
            onClick={() => setActiveTab("process")}
          >
            🔬 Quy trình xử lý
          </button>
        </div>

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <>
            {/* Statistics Cards */}
            <div className="stats-section">
              <div className="stat-card today">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">{todayCount}</div>
                  <div className="stat-label">Hôm nay</div>
                </div>
              </div>

              <div className="stat-card upcoming">
                <div className="stat-icon">⏰</div>
                <div className="stat-content">
                  <div className="stat-number">{upcomingCount}</div>
                  <div className="stat-label">Sắp tới</div>
                </div>
              </div>

              <div className="stat-card completed">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{completedCount}</div>
                  <div className="stat-label">Hoàn thành</div>
                </div>
              </div>

              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-number">{donations.length}</div>
                  <div className="stat-label">Tổng cộng</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label>Lọc theo:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay ({todayCount})</option>
                  <option value="upcoming">Sắp tới ({upcomingCount})</option>
                  <option value="completed">
                    Hoàn thành ({completedCount})
                  </option>
                </select>
              </div>
            </div>

            {/* Donations List */}
            <div className="donations-section">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Đang tải lịch hiến máu...</p>
                </div>
              ) : filteredDonations.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📅</span>
                  <h3>Không có lịch hẹn nào</h3>
                  <p>
                    {filter === "today"
                      ? "Không có lịch hẹn nào hôm nay."
                      : filter === "upcoming"
                      ? "Không có lịch hẹn nào sắp tới."
                      : filter === "completed"
                      ? "Chưa có lịch hẹn nào hoàn thành."
                      : "Chưa có lịch hẹn hiến máu nào."}
                  </p>
                </div>
              ) : (
                <div className="donations-list">
                  {filteredDonations.map((donation) => (
                    <div key={donation.id} className="donation-card">
                      <div className="donation-header">
                        <div className="donor-info">
                          <div className="donor-name">{donation.donorName}</div>
                          <div className="donor-contact">
                            📞 {donation.donorPhone} | 📧 {donation.donorEmail}
                          </div>
                          <div className="blood-type-badge">
                            {donation.bloodType}
                          </div>
                        </div>

                        <div className="appointment-info">
                          <div className="appointment-date">
                            📅{" "}
                            {new Date(
                              donation.appointmentDate
                            ).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="appointment-time">
                            🕐 {getTimeSlotText(donation.timeSlot)}
                          </div>
                        </div>

                        <div className="status-info">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(donation.status),
                            }}
                          >
                            {
                              StatusWorkflowService.getStatusInfo(
                                donation.status,
                                "donation"
                              ).text
                            }
                          </span>
                        </div>
                      </div>

                      <div className="donation-details">
                        <div className="detail-section">
                          <h4>🏥 Thông tin sức khỏe</h4>
                          <div className="health-info">
                            <span>
                              Cân nặng: {donation.healthSurvey.weight}kg
                            </span>
                            <span>
                              Chiều cao: {donation.healthSurvey.height}cm
                            </span>
                            <span>
                              Huyết áp: {donation.healthSurvey.bloodPressure}
                            </span>
                          </div>
                        </div>

                        <div className="detail-section">
                          <h4>📍 Vị trí & Khoảng cách</h4>
                          <div className="location-info">
                            <div className="address">
                              {donation.location.address}
                            </div>
                            <div
                              className={`distance ${getPriorityClass(
                                donation.location.distance
                              )}`}
                            >
                              📏{" "}
                              {DistanceService.formatDistance(
                                donation.location.distance
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="detail-section">
                          <h4>🚨 Liên hệ khẩn cấp</h4>
                          <div className="emergency-contact">
                            <span>{donation.emergencyContact.name}</span>
                            <span>📞 {donation.emergencyContact.phone}</span>
                            <span>
                              ({donation.emergencyContact.relationship})
                            </span>
                          </div>
                        </div>

                        {donation.notes && (
                          <div className="detail-section">
                            <h4>📝 Ghi chú</h4>
                            <div className="notes">{donation.notes}</div>
                          </div>
                        )}
                      </div>

                      <div className="donation-actions">
                        <button
                          className="btn btn-info"
                          onClick={() => handleViewWorkflow(donation)}
                        >
                          📊 Quản lý trạng thái
                        </button>

                        <a
                          href={DistanceService.getDirectionsUrl(
                            donation.location
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                        >
                          🗺️ Chỉ đường
                        </a>

                        <a
                          href={`tel:${donation.donorPhone}`}
                          className="btn btn-success"
                        >
                          📞 Gọi điện
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Process Tab */}
        {activeTab === "process" && (
          <div className="process-section">
            {/* Process Statistics */}
            <div className="process-stats">
              <div className="stat-card testing">
                <div className="stat-number">
                  {
                    processDonations.filter(
                      (d) =>
                        d.status ===
                        StatusWorkflowService.DONATION_STATUSES.BLOOD_TESTED
                    ).length
                  }
                </div>
                <div className="stat-label">Đang xét nghiệm</div>
              </div>
              <div className="stat-card completed">
                <div className="stat-number">
                  {
                    processDonations.filter(
                      (d) =>
                        d.status ===
                        StatusWorkflowService.DONATION_STATUSES.COMPLETED
                    ).length
                  }
                </div>
                <div className="stat-label">Hoàn thành</div>
              </div>
              <div className="stat-card stored">
                <div className="stat-number">
                  {
                    processDonations.filter(
                      (d) =>
                        d.status ===
                        StatusWorkflowService.DONATION_STATUSES.STORED
                    ).length
                  }
                </div>
                <div className="stat-label">Đã nhập kho</div>
              </div>
              <div className="stat-card total">
                <div className="stat-number">{processDonations.length}</div>
                <div className="stat-label">Tổng cộng</div>
              </div>
            </div>

            {/* Process Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label>Lọc theo trạng thái:</label>
                <select
                  value={processFilter}
                  onChange={(e) => setProcessFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="testing">Đang xét nghiệm</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="stored">Đã nhập kho</option>
                </select>
              </div>
            </div>

            {/* Process Donations List */}
            <div className="process-donations-list">
              {getFilteredProcessDonations().map((donation) => (
                <div key={donation.id} className="process-card">
                  <div className="process-header">
                    <div className="donor-info">
                      <div className="donor-name">{donation.donorName}</div>
                      <div className="donor-id">ID: {donation.donorId}</div>
                      <div className="blood-type-badge">
                        {donation.bloodType}
                      </div>
                    </div>

                    <div className="donation-info">
                      <div className="donation-date">
                        📅{" "}
                        {new Date(donation.donationDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      <div className="quantity">🩸 {donation.quantity}</div>
                    </div>

                    <div className="status-info">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(donation.status),
                        }}
                      >
                        {
                          StatusWorkflowService.getStatusInfo(
                            donation.status,
                            "donation"
                          ).text
                        }
                      </span>
                    </div>
                  </div>

                  <div className="process-details">
                    <div className="test-results">
                      <h4>🔬 Kết quả xét nghiệm</h4>
                      <div className="results-grid">
                        <div className="result-item">
                          <span className="label">Hemoglobin:</span>
                          <span className="value">
                            {donation.testResults.hemoglobin}
                          </span>
                        </div>
                        <div className="result-item">
                          <span className="label">Huyết áp:</span>
                          <span className="value">
                            {donation.testResults.bloodPressure}
                          </span>
                        </div>
                        <div className="result-item">
                          <span className="label">Nhịp tim:</span>
                          <span className="value">
                            {donation.testResults.heartRate}
                          </span>
                        </div>
                        <div className="result-item">
                          <span className="label">Nhiệt độ:</span>
                          <span className="value">
                            {donation.testResults.temperature}
                          </span>
                        </div>
                      </div>

                      <div className="blood-tests">
                        <h5>Xét nghiệm máu:</h5>
                        <div className="tests-grid">
                          <div className="test-item">
                            <span className="test-name">HIV:</span>
                            <span className="test-result negative">
                              {donation.testResults.bloodTests.hiv}
                            </span>
                          </div>
                          <div className="test-item">
                            <span className="test-name">Hepatitis B:</span>
                            <span className="test-result negative">
                              {donation.testResults.bloodTests.hepatitisB}
                            </span>
                          </div>
                          <div className="test-item">
                            <span className="test-name">Hepatitis C:</span>
                            <span className="test-result negative">
                              {donation.testResults.bloodTests.hepatitisC}
                            </span>
                          </div>
                          <div className="test-item">
                            <span className="test-name">Syphilis:</span>
                            <span className="test-result negative">
                              {donation.testResults.bloodTests.syphilis}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="process-info">
                      <div className="info-item">
                        <span className="label">Xử lý bởi:</span>
                        <span className="value">{donation.processedBy}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Thời gian xử lý:</span>
                        <span className="value">
                          {new Date(donation.processedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      {donation.completedAt && (
                        <div className="info-item">
                          <span className="label">Hoàn thành:</span>
                          <span className="value">
                            {new Date(donation.completedAt).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                      {donation.storedAt && (
                        <div className="info-item">
                          <span className="label">Nhập kho:</span>
                          <span className="value">
                            {new Date(donation.storedAt).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                      {donation.storageLocation && (
                        <div className="info-item">
                          <span className="label">Vị trí kho:</span>
                          <span className="value">
                            {donation.storageLocation}
                          </span>
                        </div>
                      )}
                      {donation.expiryDate && (
                        <div className="info-item">
                          <span className="label">Hạn sử dụng:</span>
                          <span className="value">
                            {new Date(donation.expiryDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {donation.notes && (
                      <div className="notes-section">
                        <h4>📝 Ghi chú</h4>
                        <p>{donation.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="process-actions">
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewWorkflow(donation)}
                    >
                      📊 Quản lý trạng thái
                    </button>
                    {donation.status ===
                      StatusWorkflowService.DONATION_STATUSES.COMPLETED && (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleUpdateStatus(
                            donation.id,
                            StatusWorkflowService.DONATION_STATUSES.STORED
                          )
                        }
                      >
                        🏪 Nhập kho
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {getFilteredProcessDonations().length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔬</div>
                <h3>Không có dữ liệu quy trình</h3>
                <p>
                  Chưa có dữ liệu quy trình hiến máu nào phù hợp với bộ lọc.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Workflow Modal */}
      {showWorkflowModal && selectedDonation && (
        <div
          className="modal-overlay"
          onClick={() => setShowWorkflowModal(false)}
        >
          <div className="workflow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Quản lý trạng thái hiến máu</h3>
              <button
                className="close-btn"
                onClick={() => setShowWorkflowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="donor-summary">
                <h4>👤 {selectedDonation.donorName}</h4>
                <p>
                  📅{" "}
                  {new Date(
                    selectedDonation.appointmentDate
                  ).toLocaleDateString("vi-VN")}{" "}
                  - {getTimeSlotText(selectedDonation.timeSlot)}
                </p>
              </div>

              <SimpleStatusTracker
                currentStatus={selectedDonation.status}
                workflowType="donation"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationSchedulePage;

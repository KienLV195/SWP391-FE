import React, { useState, useEffect } from "react";
import MemberNavbar from "../../components/member/MemberNavbar";
import SimpleStatusTracker from "../../components/common/SimpleStatusTracker";
import authService from "../../services/authService";
import bloodDonationService from "../../services/bloodDonationService";
import { DONATION_STATUS, REQUEST_STATUS } from "../../constants/systemConstants";
import "../../styles/pages/ActivityHistoryPage.scss";

const ActivityHistoryPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, donations, requests
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  const currentUser = authService.getCurrentUser();

  // Helper function to safely format date
  const formatDate = (dateValue) => {
    if (!dateValue) return "Chưa xác định";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Chưa xác định";

    return date.toLocaleDateString("vi-VN");
  };

  // Helper function to map API status to display status
  const mapApiStatusToDisplayStatus = (apiStatus) => {
    // Map API status values to our constants
    const statusMap = {
      'registered': DONATION_STATUS.REGISTERED,
      'health_checked': DONATION_STATUS.HEALTH_CHECKED,
      'not_eligible_health': DONATION_STATUS.NOT_ELIGIBLE_HEALTH,
      'donated': DONATION_STATUS.DONATED,
      'blood_tested': DONATION_STATUS.BLOOD_TESTED,
      'not_eligible_test': DONATION_STATUS.NOT_ELIGIBLE_TEST,
      'completed': DONATION_STATUS.COMPLETED,
      'stored': DONATION_STATUS.STORED,
      'pending': REQUEST_STATUS.PENDING,
      'approved': REQUEST_STATUS.APPROVED,
      'rejected': REQUEST_STATUS.REJECTED,
      'fulfilled': REQUEST_STATUS.FULFILLED,
    };

    return statusMap[apiStatus] || DONATION_STATUS.REGISTERED;
  };

  // Helper function to get status info for display
  const getStatusInfo = (status, type) => {
    const donationStatusMap = {
      [DONATION_STATUS.REGISTERED]: { text: "Đã đăng ký", color: "#1890ff" },
      [DONATION_STATUS.HEALTH_CHECKED]: { text: "Đã khám sức khỏe", color: "#52c41a" },
      [DONATION_STATUS.NOT_ELIGIBLE_HEALTH]: { text: "Không đủ điều kiện", color: "#ff4d4f" },
      [DONATION_STATUS.DONATED]: { text: "Đã hiến máu", color: "#722ed1" },
      [DONATION_STATUS.BLOOD_TESTED]: { text: "Đã xét nghiệm", color: "#fa8c16" },
      [DONATION_STATUS.NOT_ELIGIBLE_TEST]: { text: "Không đủ điều kiện", color: "#ff4d4f" },
      [DONATION_STATUS.COMPLETED]: { text: "Hoàn thành", color: "#52c41a" },
      [DONATION_STATUS.STORED]: { text: "Đã nhập kho", color: "#13c2c2" },
    };

    const requestStatusMap = {
      [REQUEST_STATUS.PENDING]: { text: "Đang chờ xử lý", color: "#fa8c16" },
      [REQUEST_STATUS.APPROVED]: { text: "Đã duyệt", color: "#52c41a" },
      [REQUEST_STATUS.REJECTED]: { text: "Từ chối", color: "#ff4d4f" },
      [REQUEST_STATUS.FULFILLED]: { text: "Đã xuất kho", color: "#13c2c2" },
      [REQUEST_STATUS.COMPLETED]: { text: "Hoàn thành", color: "#52c41a" },
    };

    if (type === "donation") {
      return donationStatusMap[status] || { text: "Không xác định", color: "#d9d9d9" };
    } else {
      return requestStatusMap[status] || { text: "Không xác định", color: "#d9d9d9" };
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
      return;
    }

    try {
      setLoading(true);
      await bloodDonationService.deleteAppointment(appointmentId);

      // Remove from local state
      setActivities(prev => prev.filter(activity => activity.id !== appointmentId));

      alert("Đã hủy lịch hẹn thành công!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // View appointment details
  const handleViewDetails = async (appointmentId) => {
    try {
      const details = await bloodDonationService.getAppointmentDetails(appointmentId);
      console.log("Appointment details:", details);
      // You can show details in a modal or navigate to details page
      alert(`Chi tiết lịch hẹn: ${JSON.stringify(details, null, 2)}`);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      alert("Không thể tải chi tiết lịch hẹn.");
    }
  };

  useEffect(() => {
    loadActivityHistory();
  }, []);

  const loadActivityHistory = async () => {
    setLoading(true);
    try {
      // Lấy thông tin đặt lịch hiến máu từ API
      const appointmentsData = await bloodDonationService.getAppointmentsByUser(currentUser.id);

      // Kiểm tra nếu không có dữ liệu
      if (!appointmentsData || appointmentsData.length === 0) {
        setActivities([]);
        return;
      }

      // Chuyển đổi dữ liệu từ API thành format hiển thị
      const donationActivities = appointmentsData.map((appointment, index) => {
        // Debug: Log appointment data để kiểm tra fields
        console.log(`Appointment ${index + 1} data:`, appointment);
        console.log(`Available date fields:`, {
          requestedDonationDate: appointment.requestedDonationDate,
          AppointmentDate: appointment.AppointmentDate,
          appointmentDate: appointment.appointmentDate,
          createdAt: appointment.createdAt
        });

        // Xác định ngày hẹn hiến máu từ database
        const donationDate = appointment.AppointmentDate || appointment.requestedDonationDate || appointment.appointmentDate;
        console.log(`Selected donation date:`, donationDate);

        return {
          id: appointment.appointmentId || appointment.id || `temp-${index}`,
          type: "donation",
          title: "Đặt lịch hiến máu",
          status: mapApiStatusToDisplayStatus(appointment.status),
          bloodType: appointment.bloodType || "Chưa xác định",
          quantity: appointment.quantity || "450ml",
          appointmentDate: donationDate,
          timeSlot: appointment.TimeSlot || appointment.timeSlot || "Chưa xác định",
          location: appointment.location || "Bệnh viện Đa khoa Ánh Dương - Khoa Huyết học, Tầng 2",
          notes: appointment.Notes || appointment.notes || "",
          weight: appointment.Weight || appointment.weight || 0,
          height: appointment.Height || appointment.height || 0,
          hasDonated: appointment.hasDonated,
          lastDonationDate: appointment.LastDonationDate || appointment.lastDonationDate,
          createdAt: appointment.CreatedAt || appointment.createdAt || appointment.requestedDonationDate,
          completedAt: appointment.completedAt || null,
        };
      });

      setActivities(donationActivities);
    } catch (error) {
      console.error("Error loading activity history:", error);

      // Fallback to mock data if API fails
      const mockActivities = [
        {
          id: 1,
          type: "donation",
          title: "Hiến máu tình nguyện (Demo)",
          status: DONATION_STATUS.COMPLETED,
          bloodType: "O+",
          quantity: "450ml",
          appointmentDate: "2024-12-10",
          timeSlot: "Sáng (7:00-12:00)",
          location: "Bệnh viện XYZ - Tầng 2",
          notes: "Hiến máu thành công, sức khỏe tốt",
          weight: 65,
          height: 170,
          hasDonated: true,
          lastDonationDate: "2024-08-15",
          createdAt: "2024-12-05T08:00:00Z",
          completedAt: "2024-12-10T10:30:00Z",
        },
        {
          id: 2,
          type: "request",
          title: "Yêu cầu máu cho gia đình (Demo)",
          status: REQUEST_STATUS.FULFILLED,
          bloodType: "A+",
          quantity: "2 đơn vị",
          urgency: "urgent",
          patientName: "Nguyễn Thị B",
          hospitalName: "Bệnh viện ABC",
          notes: "Đã xuất kho thành công",
          createdAt: "2024-11-20T14:00:00Z",
          completedAt: "2024-11-21T09:15:00Z",
        },
        {
          id: 3,
          type: "donation",
          title: "Hiến máu khẩn cấp (Demo)",
          status: DONATION_STATUS.DONATED,
          bloodType: "O+",
          quantity: "450ml",
          appointmentDate: "2024-11-15",
          timeSlot: "Chiều (13:00-17:00)",
          location: "Bệnh viện XYZ - Tầng 2",
          notes: "Đang chờ xét nghiệm",
          weight: 70,
          height: 175,
          hasDonated: false,
          lastDonationDate: null,
          createdAt: "2024-11-14T16:00:00Z",
          completedAt: null,
        },
      ];

      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredActivities = () => {
    switch (filter) {
      case "donations":
        return activities.filter((a) => a.type === "donation");
      case "requests":
        return activities.filter((a) => a.type === "request");
      default:
        return activities;
    }
  };

  const handleViewWorkflow = (activity) => {
    setSelectedActivity(activity);
    setShowWorkflowModal(true);
  };

  const getActivityIcon = (type) => {
    return type === "donation" ? "🩸" : "📋";
  };

  const getStatusColor = (status, type) => {
    const statusInfo = getStatusInfo(status, type);
    return statusInfo.color;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "emergency":
        return "#dc3545";
      case "urgent":
        return "#fd7e14";
      default:
        return "#28a745";
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case "emergency":
        return "🚨 Cấp cứu";
      case "urgent":
        return "⚡ Khẩn cấp";
      default:
        return "📋 Bình thường";
    }
  };

  const filteredActivities = getFilteredActivities();
  const donationCount = activities.filter((a) => a.type === "donation").length;
  const requestCount = activities.filter((a) => a.type === "request").length;
  const completedCount = activities.filter((a) =>
    [
      DONATION_STATUS.COMPLETED,
      REQUEST_STATUS.COMPLETED,
    ].includes(a.status)
  ).length;

  return (
    <div className="activity-history-page">
      <MemberNavbar />

      <div className="activity-content">
        <div className="page-header">
          <div className="header-content">
            <h1>Lịch sử hoạt động</h1>
            <p>Theo dõi lịch sử hiến máu và yêu cầu máu của bạn</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={loadActivityHistory}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card total">
            <div className="stat-number">{activities.length}</div>
            <div className="stat-label">Tổng hoạt động</div>
          </div>

          <div className="stat-card donations">
            <div className="stat-number">{donationCount}</div>
            <div className="stat-label">Lần hiến máu</div>
          </div>

          <div className="stat-card requests">
            <div className="stat-number">{requestCount}</div>
            <div className="stat-label">Yêu cầu máu</div>
          </div>

          <div className="stat-card completed">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Hoàn thành</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Lọc theo:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả ({activities.length})</option>
              <option value="donations">Hiến máu ({donationCount})</option>
              <option value="requests">Yêu cầu máu ({requestCount})</option>
            </select>
          </div>
        </div>

        {/* Activities List */}
        <div className="activities-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải lịch sử hoạt động...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📜</span>
              <h3>Chưa có hoạt động nào</h3>
              <p>
                {filter === "donations"
                  ? "Bạn chưa có lần hiến máu nào."
                  : filter === "requests"
                  ? "Bạn chưa có yêu cầu máu nào."
                  : "Bạn chưa có hoạt động nào."}
              </p>
            </div>
          ) : (
            <div className="activities-list">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-header">
                    <div className="activity-info">
                      <div className="activity-title">
                        {getActivityIcon(activity.type)} {activity.title}
                      </div>
                      
                    </div>

                    <div className="activity-status">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(
                            activity.status,
                            activity.type
                          ),
                        }}
                      >
                        {
                          getStatusInfo(
                            activity.status,
                            activity.type
                          ).text
                        }
                      </span>
                    </div>
                  </div>

                  <div className="activity-details">

                    {activity.type === "donation" && (
                      <div className="detail-section">
                        <h4>Thông tin lịch hẹn</h4>
                        <div className="appointment-info">
                          <span>
                            Ngày tạo lịch hẹn:{" "}
                            {formatDate(activity.createdAt)}
                          </span>
                          <span>
                             Ngày hẹn hiến máu:{" "}
                            {formatDate(activity.appointmentDate)}
                          </span>
                          <span>
                            Khung giờ:{" "}
                            {activity.timeSlot || "Chưa xác định"}
                          </span>
                          <span>Địa điểm: {activity.location}</span>
                          {activity.weight && (
                            <span className="health-info-badge">
                              Cân nặng: {activity.weight} kg
                            </span>
                          )}
                          {activity.height && (
                            <span className="health-info-badge">
                              Chiều cao: {activity.height} cm
                            </span>
                          )}
                          {activity.lastDonationDate && (
                            <span className="donation-history-badge">
                              Lần hiến máu cuối:{" "}
                              {formatDate(activity.lastDonationDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {activity.type === "request" && (
                      <div className="detail-section">
                        <h4>Thông tin bệnh nhân</h4>
                        <div className="patient-info">
                          <span>Bệnh nhân: {activity.patientName}</span>
                          <span>Bệnh viện: {activity.hospitalName}</span>
                        </div>
                      </div>
                    )}

                    {activity.notes && (
                      <div className="detail-section">
                        <h4>Ghi chú</h4>
                        <div className="notes">{activity.notes}</div>
                      </div>
                    )}
                  </div>

                  <div className="activity-actions">
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewWorkflow(activity)}
                    >
                      Xem tiến trình
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => handleViewDetails(activity.id)}
                    >
                      Chi tiết
                    </button>

                    {activity.type === "donation" && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteAppointment(activity.id)}
                        disabled={activity.status === DONATION_STATUS.COMPLETED}
                      >
                        Hủy lịch
                      </button>
                    )}

                    {activity.type === "donation" &&
                      activity.status === DONATION_STATUS.COMPLETED && (
                        <button className="btn btn-success">
                          Giấy chứng nhận
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workflow Modal */}
      {showWorkflowModal && selectedActivity && (
        <div
          className="modal-overlay"
          onClick={() => setShowWorkflowModal(false)}
        >
          <div className="workflow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Tiến trình{" "}
                {selectedActivity.type === "donation"
                  ? "hiến máu"
                  : "yêu cầu máu"}
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowWorkflowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="activity-summary">
                <h4>
                  {getActivityIcon(selectedActivity.type)}{" "}
                  {selectedActivity.title}
                </h4>
                <p>
                  {new Date(selectedActivity.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>

              <SimpleStatusTracker
                currentStatus={selectedActivity.status}
                workflowType={selectedActivity.type}
                urgency={selectedActivity.urgency}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;

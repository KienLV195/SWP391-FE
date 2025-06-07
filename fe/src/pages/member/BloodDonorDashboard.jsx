import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberNavbar from "../../components/member/MemberNavbar";
import authService from "../../services/authService";
// Removed DONOR_STATUS import - no longer needed
import "../../styles/pages/BloodDonorDashboard.scss";

const BloodDonorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Mock donation history - in real app, fetch from API
      setDonationHistory([
        {
          id: 1,
          date: "2024-01-10",
          bloodType: currentUser.profile.bloodType,
          quantity: 450,
          location: "Bệnh viện XYZ",
          status: "completed",
        },
      ]);
    }
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "registration_success":
        return {
          text: "Đăng ký thành công",
          color: "success",
          nextStep: "Chờ lịch khám sàng lọc",
        };
      case "medical_checked":
        return {
          text: "Đã khám sàng lọc",
          color: "info",
          nextStep: "Chờ lịch hiến máu",
        };
      case "not_eligible":
        return {
          text: "Không đủ điều kiện",
          color: "danger",
          nextStep: "Vui lòng thử lại sau 6 tháng",
        };
      case "blood_donated":
        return {
          text: "Đã hiến máu",
          color: "warning",
          nextStep: "Chờ kết quả xét nghiệm",
        };
      case "completed":
        return {
          text: "Hoàn thành",
          color: "success",
          nextStep: "Có thể đăng ký hiến máu lần tiếp theo",
        };
      default:
        return {
          text: "Chưa xác định",
          color: "secondary",
          nextStep: "",
        };
    }
  };

  const handleNewDonation = () => {
    navigate("/member/blood-donation-form");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const statusInfo = getStatusDisplay(user.status);

  return (
    <>
      <MemberNavbar />
      <div className="blood-donor-dashboard">
        <div className="dashboard-header">
          <h1>Bảng điều khiển người hiến máu</h1>
          <p>Chào mừng, {user.profile.fullName}</p>
        </div>

        <div className="dashboard-content">
          {/* Current Status Card */}
          <div className="status-card">
            <h2>Trạng thái hiện tại</h2>
            <div className={`status-badge status-${statusInfo.color}`}>
              {statusInfo.text}
            </div>
            <p className="next-step">{statusInfo.nextStep}</p>

            {user.status === "completed" && (
              <button className="btn btn-primary" onClick={handleNewDonation}>
                Đăng ký hiến máu mới
              </button>
            )}
          </div>

          {/* Profile Summary */}
          <div className="profile-summary">
            <h2>Thông tin cá nhân</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Nhóm máu:</label>
                <span className="blood-type">{user.profile.bloodType}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{user.profile.phone}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.profile.email}</span>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <span>{user.profile.address}</span>
              </div>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/member/profile")}
            >
              Cập nhật thông tin
            </button>
          </div>

          {/* Donation History */}
          <div className="donation-history">
            <h2>Lịch sử hiến máu</h2>
            {donationHistory.length > 0 ? (
              <div className="history-list">
                {donationHistory.map((donation) => (
                  <div key={donation.id} className="history-item">
                    <div className="donation-date">
                      {new Date(donation.date).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="donation-details">
                      <span className="blood-type">{donation.bloodType}</span>
                      <span className="quantity">{donation.quantity}ml</span>
                      <span className="location">{donation.location}</span>
                    </div>
                    <div className={`status status-${donation.status}`}>
                      {donation.status === "completed"
                        ? "Hoàn thành"
                        : "Đang xử lý"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-history">Chưa có lịch sử hiến máu</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() => navigate("/member/blood-info")}
              >
                <i className="icon-info"></i>
                Tài liệu về máu
              </button>
              <button
                className="action-btn"
                onClick={() => navigate("/member/donation-guide")}
              >
                <i className="icon-guide"></i>
                Hướng dẫn hiến máu
              </button>
              <button
                className="action-btn"
                onClick={() => navigate("/member/notifications")}
              >
                <i className="icon-notification"></i>
                Thông báo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodDonorDashboard;

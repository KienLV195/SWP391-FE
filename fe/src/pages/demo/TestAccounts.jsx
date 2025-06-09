import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers, ROLES, DOCTOR_TYPES } from "../../services/mockData";
import authService from "../../services/authService";
import "../../styles/pages/TestAccounts.scss";

const TestAccounts = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleQuickLogin = async (email, password) => {
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        const redirectPath = authService.getRedirectPath();
        navigate(redirectPath);
      } else {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError("Có lỗi xảy ra khi đăng nhập");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const getRoleDisplay = (user) => {
    switch (user.role) {
      case ROLES.MEMBER:
        return "Thành viên";
      case ROLES.STAFF_DOCTOR:
        return user.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT
          ? "Bác sĩ Khoa Huyết học"
          : "Bác sĩ Khoa khác";
      case ROLES.STAFF_BLOOD_MANAGER:
        return "Quản lý Ngân hàng Máu";
      case ROLES.ADMIN:
        return "Quản trị viên";
      default:
        return "Khách";
    }
  };

  const getActivitySummary = (user) => {
    if (!user.activityHistory || user.activityHistory.length === 0) {
      return "Chưa có hoạt động";
    }

    const donations = user.activityHistory.filter(
      (a) => a.type === "donation"
    ).length;
    const requests = user.activityHistory.filter(
      (a) => a.type === "request"
    ).length;

    const parts = [];
    if (donations > 0) parts.push(`${donations} lần hiến máu`);
    if (requests > 0) parts.push(`${requests} yêu cầu máu`);

    return parts.join(", ") || "Chưa có hoạt động";
  };

  const groupedUsers = {
    [ROLES.MEMBER]: mockUsers.filter((user) => user.role === ROLES.MEMBER),
    [ROLES.STAFF_DOCTOR]: mockUsers.filter(
      (user) => user.role === ROLES.STAFF_DOCTOR
    ),
    [ROLES.STAFF_BLOOD_MANAGER]: mockUsers.filter(
      (user) => user.role === ROLES.STAFF_BLOOD_MANAGER
    ),
    [ROLES.ADMIN]: mockUsers.filter((user) => user.role === ROLES.ADMIN),
  };

  return (
    <div className="test-accounts">
      <div className="accounts-container">
        <div className="accounts-header">
          <h1>Tài khoản test - Hệ thống quản lý hiến máu</h1>
          <p>
            Chọn một tài khoản để đăng nhập nhanh và trải nghiệm các tính năng
          </p>
          {loginError && <div className="error-message">{loginError}</div>}
        </div>

        <div className="accounts-sections">
          {/* Members */}
          <div className="account-section">
            <h2>👥 Thành viên (Members)</h2>
            <p className="section-description">
              Thành viên có thể vừa hiến máu vừa yêu cầu máu. Mỗi thành viên có
              lịch sử hoạt động riêng.
            </p>
            <div className="accounts-grid">
              {groupedUsers[ROLES.MEMBER].map((user) => (
                <div key={user.id} className="account-card">
                  <div className="account-header">
                    <h3>{user.profile.fullName}</h3>
                    <span className="role-badge member">
                      {getRoleDisplay(user)}
                    </span>
                  </div>
                  <div className="account-details">
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mật khẩu:</span>
                      <span>{user.password}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Nhóm máu:</span>
                      <span className="blood-type">
                        {user.profile.bloodType}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Hoạt động:</span>
                      <span className="activity-summary">
                        {getActivitySummary(user)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="login-btn"
                    onClick={() => handleQuickLogin(user.email, user.password)}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors */}
          <div className="account-section">
            <h2>👨‍⚕️ Bác sĩ (Doctors)</h2>
            <p className="section-description">
              Bác sĩ có thể xem và xử lý các yêu cầu máu từ bệnh nhân.
            </p>
            <div className="accounts-grid">
              {groupedUsers[ROLES.STAFF_DOCTOR].map((user) => (
                <div key={user.id} className="account-card">
                  <div className="account-header">
                    <h3>{user.profile.fullName}</h3>
                    <span className="role-badge doctor">
                      {getRoleDisplay(user)}
                    </span>
                  </div>
                  <div className="account-details">
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mật khẩu:</span>
                      <span>{user.password}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Khoa:</span>
                      <span>{user.profile.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Chuyên khoa:</span>
                      <span>{user.profile.specialization}</span>
                    </div>
                  </div>
                  <button
                    className="login-btn"
                    onClick={() => handleQuickLogin(user.email, user.password)}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Managers */}
          <div className="account-section">
            <h2>👔 Quản lý (Managers)</h2>
            <p className="section-description">
              Quản lý có thể xem tổng quan hệ thống và quản lý tất cả các hoạt
              động.
            </p>
            <div className="accounts-grid">
              {groupedUsers[ROLES.STAFF_BLOOD_MANAGER].map((user) => (
                <div key={user.id} className="account-card">
                  <div className="account-header">
                    <h3>{user.profile.fullName}</h3>
                    <span className="role-badge manager">
                      {getRoleDisplay(user)}
                    </span>
                  </div>
                  <div className="account-details">
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mật khẩu:</span>
                      <span>{user.password}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phòng ban:</span>
                      <span>{user.profile.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Chức vụ:</span>
                      <span>{user.profile.position}</span>
                    </div>
                  </div>
                  <button
                    className="login-btn"
                    onClick={() => handleQuickLogin(user.email, user.password)}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Admins */}
          <div className="account-section">
            <h2>🔧 Quản trị viên (Admins)</h2>
            <p className="section-description">
              Quản trị viên có quyền cao nhất, quản lý toàn bộ hệ thống, người
              dùng, blog và báo cáo.
            </p>
            <div className="accounts-grid">
              {groupedUsers[ROLES.ADMIN].map((user) => (
                <div key={user.id} className="account-card">
                  <div className="account-header">
                    <h3>{user.profile.fullName}</h3>
                    <span className="role-badge admin">
                      {getRoleDisplay(user)}
                    </span>
                  </div>
                  <div className="account-details">
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mật khẩu:</span>
                      <span>{user.password}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phòng ban:</span>
                      <span>{user.profile.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Chức vụ:</span>
                      <span>{user.profile.position}</span>
                    </div>
                  </div>
                  <button
                    className="login-btn"
                    onClick={() => handleQuickLogin(user.email, user.password)}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="accounts-footer">
          <div className="navigation-buttons">
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Về trang chủ
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Đăng nhập thủ công
            </button>
          </div>

          <div className="info-note">
            <p>
              <strong>Lưu ý:</strong> Đây là dữ liệu giả định để test giao diện.
              Trong môi trường thực tế, dữ liệu sẽ được lấy từ API backend.
            </p>
            <p>
              <strong>Thay đổi:</strong> Bây giờ thành viên có thể vừa hiến máu
              vừa yêu cầu máu. Lịch sử hoạt động được lưu trữ trong avatar
              dropdown menu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAccounts;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import authService from "../../services/authService";
import {
  mockBloodRequests,
  mockDonationHistory,
  mockUsers,
  mockBloodInventory,
  REQUEST_STATUS,
  getBloodInventoryWithStatus,
} from "../../services/mockData";
import "../../styles/pages/ManagerDashboard.scss";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    pendingDonations: 0,
    pendingRequests: 0,
    bloodInventory: {},
    recentActivities: [],
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = () => {
    // Calculate statistics from mock data
    const members = mockUsers.filter((user) => user.role === "member");
    const donorsWithHistory = members.filter(
      (user) =>
        user.activityHistory &&
        user.activityHistory.some((activity) => activity.type === "donation")
    );
    const recipientsWithHistory = members.filter(
      (user) =>
        user.activityHistory &&
        user.activityHistory.some((activity) => activity.type === "request")
    );
    const pendingRequests = mockBloodRequests.filter(
      (req) => req.status === REQUEST_STATUS.PENDING
    );

    // Get blood inventory with status
    const bloodInventory = getBloodInventoryWithStatus();

    // Recent activities
    const recentActivities = [
      {
        id: 1,
        type: "donation",
        message: "Hoàng Văn E đã hoàn thành hiến máu O-",
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        type: "request",
        message: "Yêu cầu máu A- khẩn cấp từ Nguyễn Thị F",
        timestamp: "2024-01-15T09:15:00Z",
      },
      {
        id: 3,
        type: "approval",
        message: "BS. Trần Thị I đã duyệt yêu cầu máu AB-",
        timestamp: "2024-01-14T16:00:00Z",
      },
    ];

    setDashboardData({
      totalDonors: donorsWithHistory.length,
      totalRecipients: recipientsWithHistory.length,
      pendingDonations: 0, // No pending donations in new structure
      pendingRequests: pendingRequests.length,
      bloodInventory,
      recentActivities,
    });
  };

  // Removed getInventoryStatus - now handled in mockData

  const handleViewDonations = () => {
    navigate("/manager/manage-blood");
  };

  const handleViewRequests = () => {
    navigate("/manager/request");
  };

  const handleViewInventory = () => {
    navigate("/manager/blood-bank");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manager-dashboard">
      <ManagerSidebar />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Bảng điều khiển quản lý</h1>
          <p>Chào mừng, {user.profile.fullName}</p>
        </div>

        <div className="dashboard-content">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card donors">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Người hiến máu</h3>
                <div className="stat-number">{dashboardData.totalDonors}</div>
                <div className="stat-subtitle">Tổng số đăng ký</div>
              </div>
            </div>

            <div className="stat-card recipients">
              <div className="stat-icon">🩸</div>
              <div className="stat-info">
                <h3>Người cần máu</h3>
                <div className="stat-number">
                  {dashboardData.totalRecipients}
                </div>
                <div className="stat-subtitle">Tổng số đăng ký</div>
              </div>
            </div>

            <div className="stat-card pending-donations">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>Hiến máu chờ xử lý</h3>
                <div className="stat-number">
                  {dashboardData.pendingDonations}
                </div>
                <div className="stat-subtitle">Cần xử lý</div>
              </div>
              <button className="stat-action" onClick={handleViewDonations}>
                Xem chi tiết
              </button>
            </div>

            <div className="stat-card pending-requests">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>Yêu cầu máu chờ xử lý</h3>
                <div className="stat-number">
                  {dashboardData.pendingRequests}
                </div>
                <div className="stat-subtitle">Cần xử lý</div>
              </div>
              <button className="stat-action" onClick={handleViewRequests}>
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Blood Inventory Overview */}
          <div className="blood-inventory-overview">
            <div className="section-header">
              <h2>Tồn kho máu</h2>
              <button className="btn btn-outline" onClick={handleViewInventory}>
                Xem chi tiết
              </button>
            </div>

            <div className="inventory-grid">
              {dashboardData.bloodInventory.map((item) => (
                <div
                  key={item.inventoryID}
                  className={`inventory-item ${item.status}`}
                >
                  <div className="blood-type">{item.bloodType}</div>
                  <div className="quantity">{item.quantity}</div>
                  <div className="unit">đơn vị</div>
                  <div className="status-indicator">{item.statusIcon}</div>
                  {item.isRare && <div className="rare-indicator">⭐ Hiếm</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            <h2>Hoạt động gần đây</h2>
            <div className="activities-list">
              {dashboardData.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`activity-item ${activity.type}`}
                >
                  <div className="activity-icon">
                    {activity.type === "donation" && "🩸"}
                    {activity.type === "request" && "📋"}
                    {activity.type === "approval" && "✅"}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">
                      {new Date(activity.timestamp).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => navigate("/manager/request")}
              >
                <i className="icon-request"></i>
                Quản lý yêu cầu máu
              </button>
              <button
                className="action-btn secondary"
                onClick={() => navigate("/manager/manage-blood")}
              >
                <i className="icon-donation"></i>
                Quản lý hiến máu
              </button>
              <button
                className="action-btn info"
                onClick={() => navigate("/manager/blood-bank")}
              >
                <i className="icon-inventory"></i>
                Kho máu
              </button>
              <button
                className="action-btn warning"
                onClick={() => navigate("/manager/report")}
              >
                <i className="icon-report"></i>
                Báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/pages/AdminDashboard.scss";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    pendingBlogs: 0,
    totalRequests: 0,
    systemHealth: "good",
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API Calls for Admin Dashboard:
    // GET /api/admin/dashboard/stats - Overall system statistics
    // GET /api/admin/dashboard/activities - Recent system activities
    // GET /api/admin/dashboard/alerts - System alerts and warnings
    // Headers: Authorization: Bearer {admin_token}
    // Response: { success: boolean, data: Object, message: string }

    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock stats data
        setStats({
          totalUsers: 1247,
          totalBlogs: 89,
          pendingBlogs: 12,
          totalRequests: 456,
          systemHealth: "good",
        });

        // Mock recent activities
        setRecentActivities([
          {
            id: 1,
            type: "user_registration",
            message: "Người dùng mới đăng ký: Nguyễn Văn A",
            timestamp: "2024-01-15 14:30:00",
            icon: "fas fa-user-plus",
            color: "success",
          },
          {
            id: 2,
            type: "blog_submission",
            message: 'Bài viết mới cần duyệt: "Kinh nghiệm hiến máu"',
            timestamp: "2024-01-15 13:45:00",
            icon: "fas fa-blog",
            color: "warning",
          },
          {
            id: 3,
            type: "blood_request",
            message: "Yêu cầu máu khẩn cấp: Nhóm máu O-",
            timestamp: "2024-01-15 12:20:00",
            icon: "fas fa-tint",
            color: "danger",
          },
          {
            id: 4,
            type: "system_backup",
            message: "Sao lưu hệ thống hoàn tất",
            timestamp: "2024-01-15 02:00:00",
            icon: "fas fa-database",
            color: "info",
          },
        ]);

        // Mock system alerts
        setSystemAlerts([
          {
            id: 1,
            type: "warning",
            title: "Dung lượng lưu trữ",
            message: "Dung lượng đĩa đạt 85%. Cần dọn dẹp hoặc mở rộng.",
            timestamp: "2024-01-15 10:00:00",
          },
          {
            id: 2,
            type: "info",
            title: "Cập nhật hệ thống",
            message: "Phiên bản mới v2.1.0 đã sẵn sàng để cập nhật.",
            timestamp: "2024-01-14 16:30:00",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (activity) => {
    return (
      <div className={`activity-icon ${activity.color}`}>
        <i className={activity.icon}></i>
      </div>
    );
  };

  const getAlertIcon = (type) => {
    const icons = {
      warning: "fas fa-exclamation-triangle",
      error: "fas fa-times-circle",
      info: "fas fa-info-circle",
      success: "fas fa-check-circle",
    };
    return icons[type] || icons.info;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-dashboard">
          <div className="dashboard-header">
            <div className="header-content">
              <h1>Tổng quan hệ thống</h1>
              <p>Quản lý và giám sát hệ thống hiến máu</p>
            </div>
            <div className="header-actions">
              <button className="btn-outline">
                <i className="fas fa-download"></i>
                Xuất báo cáo
              </button>
              <button className="btn-primary">
                <i className="fas fa-cog"></i>
                Cài đặt
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card users">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>Tổng người dùng</h3>
                <div className="stat-number">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  +12% so với tháng trước
                </div>
              </div>
            </div>

            <div className="stat-card blogs">
              <div className="stat-icon">
                <i className="fas fa-blog"></i>
              </div>
              <div className="stat-info">
                <h3>Tổng bài viết</h3>
                <div className="stat-number">{stats.totalBlogs}</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  +8% so với tháng trước
                </div>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>Bài viết chờ duyệt</h3>
                <div className="stat-number">{stats.pendingBlogs}</div>
                <div className="stat-change neutral">
                  <i className="fas fa-minus"></i>
                  Không đổi
                </div>
              </div>
            </div>

            <div className="stat-card requests">
              <div className="stat-icon">
                <i className="fas fa-tint"></i>
              </div>
              <div className="stat-info">
                <h3>Yêu cầu máu</h3>
                <div className="stat-number">{stats.totalRequests}</div>
                <div className="stat-change negative">
                  <i className="fas fa-arrow-down"></i>
                  -5% so với tháng trước
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card recent-activities">
              <div className="card-header">
                <h2>Hoạt động gần đây</h2>
                <button className="view-all-link">Xem tất cả</button>
              </div>
              <div className="card-body">
                {recentActivities.length === 0 ? (
                  <div className="empty-state">
                    <p>Không có hoạt động nào gần đây</p>
                  </div>
                ) : (
                  <div className="activities-list">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        {getActivityIcon(activity)}
                        <div className="activity-content">
                          <p className="activity-message">{activity.message}</p>
                          <span className="activity-time">
                            {new Date(activity.timestamp).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-card system-alerts">
              <div className="card-header">
                <h2>Cảnh báo hệ thống</h2>
                <span className={`system-status ${stats.systemHealth}`}>
                  <i className="fas fa-circle"></i>
                  {stats.systemHealth === "good"
                    ? "Hoạt động tốt"
                    : "Có vấn đề"}
                </span>
              </div>
              <div className="card-body">
                {systemAlerts.length === 0 ? (
                  <div className="empty-state">
                    <p>Không có cảnh báo nào</p>
                  </div>
                ) : (
                  <div className="alerts-list">
                    {systemAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`alert-item ${alert.type}`}
                      >
                        <div className="alert-icon">
                          <i className={getAlertIcon(alert.type)}></i>
                        </div>
                        <div className="alert-content">
                          <h4 className="alert-title">{alert.title}</h4>
                          <p className="alert-message">{alert.message}</p>
                          <span className="alert-time">
                            {new Date(alert.timestamp).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="actions-grid">
              <button className="action-card">
                <i className="fas fa-user-plus"></i>
                <span>Thêm người dùng</span>
              </button>
              <button className="action-card">
                <i className="fas fa-blog"></i>
                <span>Duyệt bài viết</span>
              </button>
              <button className="action-card">
                <i className="fas fa-chart-bar"></i>
                <span>Xem báo cáo</span>
              </button>
              <button className="action-card">
                <i className="fas fa-database"></i>
                <span>Sao lưu dữ liệu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { BarChartOutlined } from "@ant-design/icons";
import "../../styles/pages/Reports.scss";

const Reports = () => {
  const [reportData, setReportData] = useState({
    overview: {},
    userStats: {},
    bloodStats: {},
    blogStats: {},
    systemStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState("overview");

  useEffect(() => {
    // Mock API call - replace with actual API
    const fetchReportData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockData = {
          overview: {
            totalUsers: 1247,
            totalBlogs: 89,
            totalRequests: 456,
            totalDonations: 234,
            activeUsers: 892,
            pendingApprovals: 12,
          },
          userStats: {
            newRegistrations: [
              { month: "Jan", count: 45 },
              { month: "Feb", count: 52 },
              { month: "Mar", count: 38 },
              { month: "Apr", count: 67 },
              { month: "May", count: 71 },
              { month: "Jun", count: 59 },
            ],
            usersByRole: [
              { role: "Member", count: 1089, percentage: 87.3 },
              { role: "Doctor", count: 89, percentage: 7.1 },
              { role: "Manager", count: 45, percentage: 3.6 },
              { role: "Admin", count: 24, percentage: 1.9 },
            ],
            activeUsers: 892,
            inactiveUsers: 355,
          },
          bloodStats: {
            requestsByType: [
              { type: "O+", count: 89, percentage: 32.1 },
              { type: "A+", count: 67, percentage: 24.2 },
              { type: "B+", count: 45, percentage: 16.2 },
              { type: "AB+", count: 23, percentage: 8.3 },
              { type: "O-", count: 34, percentage: 12.3 },
              { type: "A-", count: 12, percentage: 4.3 },
              { type: "B-", count: 5, percentage: 1.8 },
              { type: "AB-", count: 2, percentage: 0.7 },
            ],
            monthlyRequests: [
              { month: "Jan", requests: 78, donations: 45 },
              { month: "Feb", requests: 82, donations: 52 },
              { month: "Mar", requests: 65, donations: 38 },
              { month: "Apr", requests: 91, donations: 67 },
              { month: "May", requests: 88, donations: 71 },
              { month: "Jun", requests: 76, donations: 59 },
            ],
          },
          blogStats: {
            totalBlogs: 89,
            publishedBlogs: 67,
            pendingBlogs: 12,
            rejectedBlogs: 10,
            blogsByCategory: [
              { category: "Kinh nghiệm", count: 34 },
              { category: "Tin tức", count: 23 },
              { category: "Câu chuyện", count: 18 },
              { category: "Hướng dẫn", count: 14 },
            ],
            monthlyBlogs: [
              { month: "Jan", count: 12 },
              { month: "Feb", count: 15 },
              { month: "Mar", count: 8 },
              { month: "Apr", count: 18 },
              { month: "May", count: 21 },
              { month: "Jun", count: 15 },
            ],
          },
          systemStats: {
            serverUptime: "99.8%",
            averageResponseTime: "245ms",
            totalPageViews: 45678,
            uniqueVisitors: 12345,
            storageUsed: "2.3GB",
            storageTotal: "10GB",
          },
        };

        setReportData(mockData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const renderOverviewReport = () => (
    <div className="report-section">
      <h2>Tổng quan hệ thống</h2>
      <div className="overview-grid">
        <div className="overview-card users">
          <div className="card-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="card-content">
            <h3>Tổng người dùng</h3>
            <div className="number">
              {reportData.overview.totalUsers?.toLocaleString()}
            </div>
            <div className="subtitle">
              Hoạt động: {reportData.overview.activeUsers}
            </div>
          </div>
        </div>

        <div className="overview-card blogs">
          <div className="card-icon">
            <i className="fas fa-blog"></i>
          </div>
          <div className="card-content">
            <h3>Tổng bài viết</h3>
            <div className="number">{reportData.overview.totalBlogs}</div>
            <div className="subtitle">
              Chờ duyệt: {reportData.overview.pendingApprovals}
            </div>
          </div>
        </div>

        <div className="overview-card requests">
          <div className="card-icon">
            <i className="fas fa-tint"></i>
          </div>
          <div className="card-content">
            <h3>Yêu cầu máu</h3>
            <div className="number">{reportData.overview.totalRequests}</div>
            <div className="subtitle">
              Hiến máu: {reportData.overview.totalDonations}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserStatsReport = () => (
    <div className="report-section">
      <h2>Thống kê người dùng</h2>
      <div className="stats-grid">
        <div className="chart-container">
          <h3>Đăng ký mới theo tháng</h3>
          <div className="chart-placeholder">
            <i className="fas fa-chart-line"></i>
            <p>Biểu đồ đăng ký người dùng mới</p>
            <small>Tích hợp Chart.js để hiển thị biểu đồ thực tế</small>
          </div>
        </div>

        <div className="chart-container">
          <h3>Phân bố theo vai trò</h3>
          <div className="role-stats">
            {reportData.userStats.usersByRole?.map((role, index) => (
              <div key={index} className="role-item">
                <div className="role-info">
                  <span className="role-name">{role.role}</span>
                  <span className="role-count">{role.count}</span>
                </div>
                <div className="role-bar">
                  <div
                    className="role-progress"
                    style={{ width: `${role.percentage}%` }}
                  ></div>
                </div>
                <span className="role-percentage">{role.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBloodStatsReport = () => (
    <div className="report-section">
      <h2>Thống kê hiến máu</h2>
      <div className="stats-grid">
        <div className="chart-container">
          <h3>Yêu cầu theo nhóm máu</h3>
          <div className="blood-type-stats">
            {reportData.bloodStats.requestsByType?.map((type, index) => (
              <div key={index} className="blood-type-item">
                <div className="blood-type-info">
                  <span className="blood-type">{type.type}</span>
                  <span className="blood-count">{type.count}</span>
                </div>
                <div className="blood-bar">
                  <div
                    className="blood-progress"
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
                <span className="blood-percentage">{type.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Xu hướng theo tháng</h3>
          <div className="chart-placeholder">
            <i className="fas fa-chart-bar"></i>
            <p>Biểu đồ yêu cầu và hiến máu theo tháng</p>
            <small>Tích hợp Chart.js để hiển thị biểu đồ thực tế</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlogStatsReport = () => (
    <div className="report-section">
      <h2>Thống kê blog</h2>
      <div className="stats-grid">
        <div className="blog-overview">
          <div className="blog-stat-card">
            <h4>Tổng bài viết</h4>
            <div className="stat-number">{reportData.blogStats.totalBlogs}</div>
          </div>
          <div className="blog-stat-card">
            <h4>Đã đăng</h4>
            <div className="stat-number">
              {reportData.blogStats.publishedBlogs}
            </div>
          </div>
          <div className="blog-stat-card">
            <h4>Chờ duyệt</h4>
            <div className="stat-number">
              {reportData.blogStats.pendingBlogs}
            </div>
          </div>
          <div className="blog-stat-card">
            <h4>Từ chối</h4>
            <div className="stat-number">
              {reportData.blogStats.rejectedBlogs}
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Phân bố theo danh mục</h3>
          <div className="category-stats">
            {reportData.blogStats.blogsByCategory?.map((category, index) => (
              <div key={index} className="category-item">
                <span className="category-name">{category.category}</span>
                <span className="category-count">{category.count} bài</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemStatsReport = () => (
    <div className="report-section">
      <h2>Thống kê hệ thống</h2>
      <div className="system-grid">
        <div className="system-card">
          <h4>Uptime Server</h4>
          <div className="system-value">
            {reportData.systemStats.serverUptime}
          </div>
        </div>
        <div className="system-card">
          <h4>Thời gian phản hồi</h4>
          <div className="system-value">
            {reportData.systemStats.averageResponseTime}
          </div>
        </div>
        <div className="system-card">
          <h4>Lượt xem trang</h4>
          <div className="system-value">
            {reportData.systemStats.totalPageViews?.toLocaleString()}
          </div>
        </div>
        <div className="system-card">
          <h4>Khách truy cập</h4>
          <div className="system-value">
            {reportData.systemStats.uniqueVisitors?.toLocaleString()}
          </div>
        </div>
        <div className="system-card">
          <h4>Dung lượng sử dụng</h4>
          <div className="system-value">
            {reportData.systemStats.storageUsed} /{" "}
            {reportData.systemStats.storageTotal}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverviewReport();
      case "users":
        return renderUserStatsReport();
      case "blood":
        return renderBloodStatsReport();
      case "blogs":
        return renderBlogStatsReport();
      case "system":
        return renderSystemStatsReport();
      default:
        return renderOverviewReport();
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu báo cáo...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Báo cáo & Thống kê"
        icon={<BarChartOutlined />}
        subtitle="Xem các báo cáo tổng hợp và thống kê hoạt động hệ thống"
      />
      <div
        className="reports"
        style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}
      >
        <div className="reports-nav">
          <button
            className={`nav-btn ${
              selectedReport === "overview" ? "active" : ""
            }`}
            onClick={() => setSelectedReport("overview")}
          >
            <i className="fas fa-chart-pie"></i>
            Tổng quan
          </button>
          <button
            className={`nav-btn ${selectedReport === "users" ? "active" : ""}`}
            onClick={() => setSelectedReport("users")}
          >
            <i className="fas fa-users"></i>
            Người dùng
          </button>
          <button
            className={`nav-btn ${selectedReport === "blood" ? "active" : ""}`}
            onClick={() => setSelectedReport("blood")}
          >
            <i className="fas fa-tint"></i>
            Hiến máu
          </button>
          <button
            className={`nav-btn ${selectedReport === "blogs" ? "active" : ""}`}
            onClick={() => setSelectedReport("blogs")}
          >
            <i className="fas fa-blog"></i>
            Blog
          </button>
          <button
            className={`nav-btn ${selectedReport === "system" ? "active" : ""}`}
            onClick={() => setSelectedReport("system")}
          >
            <i className="fas fa-server"></i>
            Hệ thống
          </button>
        </div>

        <div className="reports-content">{renderReportContent()}</div>
      </div>
    </AdminLayout>
  );
};

export default Reports;

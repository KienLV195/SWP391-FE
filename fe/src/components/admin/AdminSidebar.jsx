import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/components/AdminSidebarNew.scss";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "📊 Tổng quan hệ thống" },
    { path: "/admin/users", label: "👥 Quản lý người dùng" },
    { path: "/admin/blogs", label: "📝 Quản lý blog" },
    { path: "/admin/reports", label: "📈 Báo cáo & Thống kê" },
    { path: "/admin/system", label: "⚙️ Cài đặt hệ thống" },
  ];

  const userInfo = {
    name: user?.name || "Admin",
    role: "Quản trị viên",
    avatar: user?.name ? user.name.charAt(0).toUpperCase() : "A",
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`admin-sidebar ${isExpanded ? "expanded" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <Link to="/admin/dashboard" className="logo-link">
            <div className="logo-icon">
              <i className="fas fa-hospital"></i>
            </div>
            {isExpanded && (
              <div className="logo-text">
                <span className="hospital-name">Ánh Dương</span>
                <span className="system-name">Admin Panel</span>
              </div>
            )}
          </Link>
        </div>

        <button className="toggle-btn" onClick={toggleSidebar}>
          <i
            className={`fas ${
              isExpanded ? "fa-chevron-left" : "fa-chevron-right"
            }`}
          ></i>
        </button>
      </div>

      <div className="user-section">
        <div className="user-avatar">{userInfo.avatar}</div>
        {isExpanded && (
          <div className="user-info">
            <div className="user-name">{userInfo.name}</div>
            <div className="user-role">{userInfo.role}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            title={!isExpanded ? item.label : ""}
          >
            <span className="nav-text">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
          title={!isExpanded ? "Đăng xuất" : ""}
        >
          <i className="fas fa-sign-out-alt"></i>
          {isExpanded && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

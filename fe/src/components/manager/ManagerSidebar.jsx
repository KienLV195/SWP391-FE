import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import {
  FiMenu,
  FiX,
  FiHome,
  FiCalendar,
  FiUsers,
  FiClipboard,
  FiDatabase,
  FiEdit3,
  FiBarChart,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import "../../styles/components/ManagerSidebar.scss";

const ManagerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/manager", label: "Dashboard", icon: FiHome, exact: true },
    {
      path: "/manager/donation-schedule",
      label: "Lịch & Quy trình hiến máu",
      icon: FiCalendar,
    },
    {
      path: "/manager/eligible-donors",
      label: "Người hiến đủ điều kiện",
      icon: FiUsers,
    },
    {
      path: "/manager/blood-requests",
      label: "Quản lý yêu cầu máu",
      icon: FiClipboard,
    },
    {
      path: "/manager/blood-inventory",
      label: "Quản lý kho máu",
      icon: FiDatabase,
    },
    { path: "/manager/blog", label: "Quản lý Blog", icon: FiEdit3 },
    {
      path: "/manager/reports",
      label: "Báo cáo & Thống kê",
      icon: FiBarChart,
    },
    { path: "/manager/notifications", label: "Thông báo", icon: FiBell },
  ];

  const userInfo = {
    name: "Nguyễn Văn F",
    avatar: null, // Có thể thay bằng URL ảnh avatar nếu có
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if logout API fails
      navigate("/");
    }
  };

  return (
    <>
      <aside className={`manager-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? <FiMenu /> : <FiX />}
          </div>
          <div className="logo">Quản lý Máu</div>
          <div className="subtitle">Hệ thống quản lý</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            const IconComponent = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <IconComponent className="nav-icon" />
                <span className="nav-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default ManagerSidebar;

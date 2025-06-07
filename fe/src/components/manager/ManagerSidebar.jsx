import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import LogoutButton from "../common/LogoutButton";
import "../../styles/components/ManagerSidebar.scss";

const ManagerSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/manager", label: "🏠 Dashboard", exact: true },
    { path: "/manager/blood-requests", label: "📋 Quản lý yêu cầu máu" },
    { path: "/manager/donation-process", label: "🩸 Quy trình hiến máu" },
    { path: "/manager/blood-inventory", label: "🏦 Quản lý kho máu" },
    { path: "/manager/reports", label: "📊 Báo cáo & Thống kê" },
    { path: "/manager/emergency-requests", label: "🚨 Yêu cầu khẩn cấp" },
    { path: "/manager/notifications", label: "🔔 Thông báo" },
  ];

  const userInfo = {
    name: "Nguyễn Văn F",
    avatar: null, // Có thể thay bằng URL ảnh avatar nếu có
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <aside className={`manager-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </div>
          {!isCollapsed && (
            <>
              <div className="sidebar-logo">
                <Link to="/manager">
                  <img
                    src="/assets/images/blood1.jpg"
                    alt="Manager Portal Logo"
                    className="logo-img"
                  />
                </Link>
              </div>
              <div className="user-info">
                <div className="user-avatar">
                  {userInfo.avatar || userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{userInfo.name}</span>
              </div>
            </>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                title={
                  isCollapsed ? item.label.replace(/[^\w\s]/gi, "").trim() : ""
                }
              >
                <span className="nav-icon">{item.label.split(" ")[0]}</span>
                {!isCollapsed && (
                  <span className="nav-text">
                    {item.label.substring(item.label.indexOf(" ") + 1)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="sidebar-footer">
            <LogoutButton variant="sidebar" />
          </div>
        )}
        {isCollapsed && (
          <div className="sidebar-footer collapsed">
            <LogoutButton variant="icon-only" />
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default ManagerSidebar;

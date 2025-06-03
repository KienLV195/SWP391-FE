import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../../styles/components/ManagerSidebar.scss";

const ManagerSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/manager", label: "Trang chủ" },
    { path: "/manager/request", label: "Yêu cầu" },
    { path: "/manager/manage-blood", label: "Quản lý hiến máu" },
    { path: "/manager/blood-bank", label: "Kho máu" },
    { path: "/manager/report", label: "Báo cáo" },
    { path: "/manager/notification", label: "Thông báo" },
  ];

  const userInfo = {
    name: "Nguyễn Văn F",
    avatar: null, // Có thể thay bằng URL ảnh avatar nếu có
  };

  return (
    <aside className="manager-sidebar">
      <div className="sidebar-header">
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
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/logout" className="logout-btn">
          <FaSignOutAlt /> Đăng xuất
        </Link>
      </div>
    </aside>
  );
};

export default ManagerSidebar;

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/components/MemberNavbar.scss";

const navItems = [
  { path: "/member", label: "Trang chủ" },
  { path: "/member/blood-info", label: "Tài liệu" },
  { path: "/member/blog", label: "Tin tức" },
  { path: "/member/donation-guide", label: "Hướng dẫn hiến máu" },
];

const MemberNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const user = authService.getCurrentUser();

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
    <header className="navbar member-navbar">
      <div className="navbar-logo">
        <Link to="/member">Blood Donation</Link>
      </div>
      <nav className="navbar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="navbar-actions">
        <div className="user-info">
          <span className="user-name">
            {user?.profile?.fullName || "Member"}
          </span>
          <div
            className="member-avatar-wrapper"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            {user?.profile?.fullName?.charAt(0).toUpperCase() || "M"}
          </div>
        </div>
        {showMenu && (
          <div className="member-dropdown-menu">
            <Link to="/member/activity-history" className="dropdown-item">
              Lịch sử hoạt động
            </Link>
            <Link to="/member/notifications" className="dropdown-item">
              Thông báo cá nhân
            </Link>
            <Link to="/member/profile" className="dropdown-item">
              Hồ sơ cá nhân
            </Link>

            <div className="dropdown-divider"></div>

            <button onClick={handleLogout} className="dropdown-item logout-btn">
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MemberNavbar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/components/MemberNavbar.scss";

const navItems = [
  { path: "/member", label: "Trang chủ" },
  { path: "/member/blood-info", label: "Tài liệu" },
  { path: "/member/blog", label: "Tin tức" },
  { path: "/member/donation-guide", label: "Hướng dẫn hiến máu" },
];

const MemberNavbar = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const userInfo = {
    name: "Nguyễn Văn A",
    avatar: "", // Có thể thay bằng link ảnh nếu có
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
          <span className="user-name">{userInfo.name}</span>
          <div
            className="member-avatar-wrapper"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            {userInfo.avatar || userInfo.name.charAt(0).toUpperCase()}
          </div>
        </div>
        {showMenu && (
          <div className="member-dropdown-menu">
            <Link to="/member/notifications">Thông báo cá nhân</Link>
            <Link to="/member/profile">Hồ sơ cá nhân</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default MemberNavbar;

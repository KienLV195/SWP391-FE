import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";
import "../../styles/components/MemberSidebar.scss";

const MemberSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/member",
      label: "🏠 Trang chủ",
      exact: true,
    },
    {
      path: "/member/profile",
      label: "👤 Hồ sơ cá nhân",
    },
    {
      path: "/member/blood-donation-form",
      label: "🩸 Đăng ký hiến máu",
    },
    {
      path: "/member/blood-request-form",
      label: "📋 Yêu cầu máu",
    },

    {
      path: "/member/notifications",
      label: "🔔 Thông báo",
    },
    {
      path: "/member/blood-info",
      label: "🔍 Thông tin nhóm máu",
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="member-sidebar">
      <div className="member-sidebar__header">
        <h2>Member Panel</h2>
      </div>

      <nav className="member-sidebar__nav">
        <ul className="member-sidebar__menu">
          {menuItems.map((item) => (
            <li key={item.path} className="member-sidebar__menu-item">
              <Link
                to={item.path}
                className={`member-sidebar__link ${
                  isActive(item.path, item.exact) ? "active" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="member-sidebar__footer">
        <LogoutButton variant="sidebar" />
      </div>
    </div>
  );
};

export default MemberSidebar;

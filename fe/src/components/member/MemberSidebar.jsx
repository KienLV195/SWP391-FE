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
      exact: true
    },
    {
      path: "/member/profile",
      label: "👤 Hồ sơ cá nhân"
    },
    {
      path: "/member/donation-history",
      label: "🩸 Lịch sử hiến máu"
    },
    {
      path: "/member/blood-requests",
      label: "📋 Yêu cầu máu"
    },
    {
      path: "/member/blood-compatibility",
      label: "🔍 Tra cứu nhóm máu"
    },
    {
      path: "/member/emergency-support",
      label: "🚨 Hỗ trợ khẩn cấp"
    }
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

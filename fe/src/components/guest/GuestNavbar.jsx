import React from "react";
import NavbarBase from "../common/NavbarBase";
import "../../styles/components/GuestNavbar.scss";

const GuestNavbar = () => {
  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/blood-info", label: "Tài liệu" },
    { path: "/blog", label: "Tin tức" },
    { path: "/donation-guide", label: "Hướng dẫn hiến máu" },
  ];

  const actionItems = [
    { path: "/login", label: "Đăng nhập", className: "btn-login" },
    { path: "/register", label: "Đăng ký", className: "btn-register" },
  ];

  return (
    <NavbarBase
      logoSrc="/assets/images/blood1.jpg"
      logoAlt="Blood Donation Logo"
      navItems={navItems}
      actionItems={actionItems}
      userInfo={null}
    />
  );
};

export default GuestNavbar;

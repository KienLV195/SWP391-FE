import { Link, useLocation } from "react-router-dom";
import "../../styles/components/GuestNavbar.scss";

const GuestNavbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/blood-info", label: "Tài liệu" },
    { path: "/blog", label: "Tin tức" },
    { path: "/donation-guide", label: "Hướng dẫn hiến máu" },
  ];

  return (
    <header className="guest-navbar">
      <div className="guest-navbar-logo">
        <Link to="/">
          <img
            src="/assets/images/blood1.jpg"
            alt="Blood Donation Logo"
            className="logo-img"
          />
        </Link>
      </div>

      <nav className="guest-navbar-nav">
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

      <div className="guest-navbar-actions">
        <Link to="/login" className="btn-login">
          Đăng nhập
        </Link>
        <Link to="/register" className="btn-register">
          Đăng ký
        </Link>
      </div>
    </header>
  );
};

export default GuestNavbar;

import { Link } from "react-router-dom";
import "./GuestNavbar.scss";

const GuestNavbar = () => {
  return (
    <nav className="guest-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Logo
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/blood-info">Tài liệu</Link>
          </li>
          <li>
            <Link to="/blog">Tin tức</Link>
          </li>
          <li>
            <Link to="/urgent-blood-requests">Hướng dẫn hiến máu</Link>
          </li>
        </ul>
        <div className="navbar-actions">
          <Link to="/login" className="btn-login">
            Đăng nhập
          </Link>
          <Link to="/register" className="btn-register">
            Đăng ký
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;

import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const location = useLocation();
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">
          <img src="/static/images/logo.png" alt="Logo" />
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Trang chủ
        </Link>
        <Link
          to="/blood-info"
          className={location.pathname === "/blood-info" ? "active" : ""}
        >
          Tài liệu
        </Link>
        <Link
          to="/blog"
          className={location.pathname === "/blog" ? "active" : ""}
        >
          Tin tức
        </Link>
        <Link
          to="/urgent-blood-requests"
          className={
            location.pathname === "/urgent-blood-requests" ? "active" : ""
          }
        >
          Hướng dẫn hiến máu
        </Link>
      </nav>
      <div className="header-actions">
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

export default Header;

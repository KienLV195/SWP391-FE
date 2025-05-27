import "./Navbar.scss";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="navbar-actions">
        <button className="btn-login">Đăng nhập</button>
        <button className="btn-register">Đăng ký</button>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/components/LoginForm.scss";
import authService from "../../services/authService";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Removed Google login functionality

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(formData.email, formData.password);

      if (result.success) {
        const redirectPath = authService.getRedirectPath();
        navigate(redirectPath);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Có lỗi xảy ra khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form__container">
      <div className="login-form__box">
        <div className="login-form__logo">LOGO</div>
        <div className="login-form__welcome">CHÀO MỪNG BẠN ĐÃ TRỞ LẠI</div>
        {/* Removed Google login - using email/password only */}
        <form className="login-form__form" onSubmit={handleSubmit}>
          <label className="login-form__label">EMAIL</label>
          <input
            className="login-form__input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="NHẬP EMAIL VÀO ĐÂY"
            required
          />

          <label className="login-form__label">MẬT KHẨU</label>
          <input
            className="login-form__input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="NHẬP MẬT KHẨU VÀO ĐÂY"
            required
            minLength={6}
          />

          {error && <div className="login-form__error">{error}</div>}
          <button
            className="login-form__submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>
        </form>
        <div className="login-form__register">
          <Link to="/register">
            BẠN CHƯA CÓ TÀI KHOẢN? <span>ĐĂNG KÝ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

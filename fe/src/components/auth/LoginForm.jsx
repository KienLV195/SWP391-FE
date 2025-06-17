import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/validation";
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    if (!validateEmail(formData.email) || formData.password.length < 6) {
      setError("Mật khẩu hoặc email nhập chưa đúng");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(formData.email, formData.password);

      if (result.success) {
        const redirectPath = authService.getRedirectPath();
        navigate(redirectPath);
      } else {
        // Check for banned user error
        if (result.error === "Account is banned") {
          setError(
            "Tài khoản của bạn đã bị cấm. Vui lòng liên hệ quản trị viên."
          );
        } else {
          setError(
            result.error ||
              "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu."
          );
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle HTTP status codes or specific error messages
      if (
        error.response?.status === 403 &&
        error.response?.data?.message === "Account is banned"
      ) {
        setError(
          "Tài khoản của bạn đã bị cấm. Vui lòng liên hệ quản trị viên."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form__container">
      <div className="login-form__box">
        <div className="login-form__logo">LOGO</div>
        <div className="login-form__welcome">CHÀO MỪNG BẠN ĐÃ TRỞ LẠI</div>
        <form className="login-form__form" onSubmit={handleSubmit}>
          <label className="login-form__label">EMAIL</label>
          <input
            className="login-form__input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ email"
            required
          />

          <label className="login-form__label">MẬT KHẨU</label>
          <input
            className="login-form__input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Nhập mật khẩu"
            required
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

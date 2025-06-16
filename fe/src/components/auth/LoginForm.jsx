import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/validation";
import "../../styles/components/LoginForm.scss";
import authService from "../../services/authService";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setPasswordError("");

    if (!formData.email || !formData.password) {
      setFormError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError("Email không hợp lệ");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự trong đó có ký tự viết hoa, ký tự viết thường, ký tự số và ký tự đặc biệt.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(formData.email, formData.password);

      if (result.success) {
        const redirectPath = authService.getRedirectPath();
        navigate(redirectPath);
      } else {
        if (result.error === "Email hoặc mật khẩu không đúng.") {
          setPasswordError(result.error);
        } else {
          setFormError(result.error);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setFormError("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau");
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
          {formError && !passwordError && (
            <div className="login-form__error">{formError}</div>
          )}

          <label className="login-form__label">MẬT KHẨU</label>
          <div className="login-form__password-input-wrapper">
            <input
              className="login-form__input"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          {passwordError && (
            <div className="login-form__password-error">{passwordError}</div>
          )}

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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/components/RegisterForm.scss";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to register user
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to email verification page
      navigate("/register/verify-email", {
        state: {
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          isRegister: true,
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form__container">
      <div className="register-form__box">
        <div className="register-form__logo">LOGO</div>
        <div className="register-form__welcome">
          CHÀO MỪNG BẠN ĐẾN VỚI CHÚNG TÔI
        </div>

        <form className="register-form__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="register-form__label">HỌ VÀ TÊN</label>
            <input
              className={`register-form__input ${errors.fullName ? "error" : ""}`}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="NHẬP HỌ VÀ TÊN"
              required
            />
            {errors.fullName && (
              <div className="register-form__error">{errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <label className="register-form__label">EMAIL</label>
            <input
              className={`register-form__input ${errors.email ? "error" : ""}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="NHẬP EMAIL"
              required
            />
            {errors.email && (
              <div className="register-form__error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="register-form__label">MẬT KHẨU</label>
            <input
              className={`register-form__input ${errors.password ? "error" : ""}`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="NHẬP MẬT KHẨU (ÍT NHẤT 6 KÝ TỰ)"
              required
            />
            {errors.password && (
              <div className="register-form__error">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label className="register-form__label">XÁC NHẬN MẬT KHẨU</label>
            <input
              className={`register-form__input ${
                errors.confirmPassword ? "error" : ""
              }`}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="NHẬP LẠI MẬT KHẨU"
              required
            />
            {errors.confirmPassword && (
              <div className="register-form__error">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="register-form__error">{errors.submit}</div>
          )}

          <button
            className="register-form__submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
          </button>
        </form>

        <div className="register-form__login">
          BẠN ĐÃ CÓ TÀI KHOẢN?{" "}
          <Link to="/login">
            <span>ĐĂNG NHẬP</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

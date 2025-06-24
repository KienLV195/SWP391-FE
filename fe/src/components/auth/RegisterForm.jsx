import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  getPasswordValidationError,
  validatePasswordConfirmation,
  validateFullName,
} from "../../utils/validation";
import "../../styles/components/RegisterForm.scss";
import authService from "../../services/authService";

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

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) {
      newErrors.fullName = fullNameError;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Validate password
    const passwordError = getPasswordValidationError(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate password confirmation
    const confirmPasswordError = validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
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
    setErrors({});

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      };

      const result = await authService.register(registerData);

      if (result.success) {
        // Navigate to email verification page
        navigate("/register/verify-email", {
          state: {
            email: formData.email,
            fullName: formData.fullName,
            isRegister: true,
          },
        });
        // navigate("/member");
      } else {
        setErrors({
          submit: result.error || "Đăng ký không thành công. Vui lòng thử lại sau."
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({
        submit: "Đăng ký không thành công. Vui lòng thử lại sau."
      });
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
              className={`register-form__input ${errors.fullName ? "error" : ""
                }`}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ"
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
              placeholder="Nhập địa chỉ email"
              required
            />
            {errors.email && (
              <div className="register-form__error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="register-form__label">MẬT KHẨU</label>
            <input
              className={`register-form__input ${errors.password ? "error" : ""
                }`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
              required
            />
            {errors.password && (
              <div className="register-form__error">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label className="register-form__label">XÁC NHẬN MẬT KHẨU</label>
            <input
              className={`register-form__input ${errors.confirmPassword ? "error" : ""
                }`}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu để xác nhận"
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

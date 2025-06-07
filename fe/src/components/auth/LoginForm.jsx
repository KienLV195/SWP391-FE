import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/components/LoginForm.scss";
import { auth, googleProvider } from "../../services/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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

  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
        // TODO: Handle Google login with backend
      })
      .catch((error) => {
        console.log(error);
        setError("Đăng nhập Google thất bại");
      });
  };

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
        <button
          className="login-form__google-btn"
          onClick={handleLoginGoogle}
          type="button"
        >
          <span className="login-form__google-icon">
            {/* Google icon SVG */}
            <svg width="22" height="22" viewBox="0 0 48 48">
              <g>
                <path
                  fill="#4285F4"
                  d="M44.5 20H24v8.5h11.7C34.9 33.1 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z"
                />
                <path
                  fill="#34A853"
                  d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-18 10.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 45c5.2 0 10-1.7 13.7-4.7l-6.3-5.2C29.7 36.9 27 38 24 38c-6.1 0-11.3-4.1-13.1-9.6l-7 5.4C6.1 41.6 14.4 45 24 45z"
                />
                <path
                  fill="#EA4335"
                  d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.8-2l-7 5.4C18.7 43.9 21.2 45 24 45c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z"
                />
              </g>
            </svg>
          </span>
          ĐĂNG NHẬP BẰNG GOOGLE
        </button>
        <div className="login-form__divider">
          <span />
          <span className="login-form__divider-text">
            HOẶC ĐĂNG NHẬP BẰNG EMAIL
          </span>
          <span />
        </div>
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

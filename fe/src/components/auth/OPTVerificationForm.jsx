import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/components/OTPVerificationForm.scss";

export default function OTPVerificationForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const { phoneNumber, isRegister } = location.state || {};

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/register");
    }
  }, [phoneNumber, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isRegister) {
        // Create new user account
        const newUser = {
          id: `member_${Date.now()}`,
          phone: phoneNumber,
          email: `${phoneNumber}@temp.com`, // Temporary email
          role: "member",
          isFirstLogin: true,
          profile: {
            phone: phoneNumber,
            fullName: "",
            bloodType: "",
            address: "",
            dateOfBirth: "",
            gender: "",
          },
        };

        // Auto login the new user
        authService.setCurrentUser(newUser);

        // Redirect to member info page for first-time setup
        navigate("/member/profile", {
          state: {
            isFirstTime: true,
            message: "Vui lòng hoàn thiện thông tin cá nhân",
          },
        });
      } else {
        // Login flow - redirect to home
        navigate("/member");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError("Mã OTP không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Simulate resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Đã gửi lại mã OTP");
    } catch (error) {
      console.error("Resend OTP failed:", error);
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại.");
    }
  };

  return (
    <form className="otp-form" onSubmit={handleSubmit}>
      <h1 className="otp-title">XÁC THỰC MÃ OTP</h1>
      <p className="otp-description">
        Chúng tôi đã gửi mã OTP vào số điện thoại {phoneNumber}, hãy nhập mã đó
        vào các ô bên dưới để xác thực
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
          />
        ))}
      </div>

      <button
        type="submit"
        className="verify-button"
        disabled={isLoading || otp.join("").length !== 6}
      >
        {isLoading ? "ĐANG XÁC THỰC..." : "XÁC THỰC"}
      </button>

      <p className="resend-text">
        CHƯA NHẬN ĐƯỢC MÃ CODE?
        <button
          type="button"
          className="resend-button"
          onClick={handleResendOtp}
          disabled={isLoading}
        >
          GỬI LẠI MÃ
        </button>
      </p>
    </form>
  );
}

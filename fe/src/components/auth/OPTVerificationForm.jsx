import React from 'react';
import '../../styles/components/OTPVerificationForm.scss';

export default function OTPVerificationForm() {
    return (
        <form className="otp-form">
            <h1 className="otp-title">XÁC THỰC MÃ OTP</h1>
            <p className="otp-description">
                Chúng tôi đã gửi mã OTP vào số điện thoại của bạn, hãy nhập mã đó vào các ô bên dưới để xác thực
            </p>
            <div className="otp-inputs">
                {[...Array(5)].map((_, i) => (
                    <input key={i} type="text" maxLength="1" className="otp-input" />
                ))}
            </div>
            <button type="submit" className="verify-button">XÁC THỰC</button>
            <p className="resend-text">
                CHƯA NHẬN ĐƯỢC MÃ CODE? <button type="button" className="resend-button">GỬI LẠI MÃ</button>
            </p>
        </form>
    );
}

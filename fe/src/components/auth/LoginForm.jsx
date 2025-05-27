import React, { useState } from 'react';
import './LoginForm.scss';

export default function LoginForm() {
    const [phone, setPhone] = useState('');

    return (
        <div className="login-form__container">
            <div className="login-form__box">
                <div className="login-form__logo">LOGO</div>
                <div className="login-form__welcome">CHÀO MỪNG BẠN ĐÃ TRỞ LẠI</div>
                <button className="login-form__google-btn">
                    <span className="login-form__google-icon">
                        {/* Google icon SVG */}
                        <svg width="22" height="22" viewBox="0 0 48 48">
                            <g>
                                <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.9 33.1 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z" />
                                <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-18 10.7z" />
                                <path fill="#FBBC05" d="M24 45c5.2 0 10-1.7 13.7-4.7l-6.3-5.2C29.7 36.9 27 38 24 38c-6.1 0-11.3-4.1-13.1-9.6l-7 5.4C6.1 41.6 14.4 45 24 45z" />
                                <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.8-2l-7 5.4C18.7 43.9 21.2 45 24 45c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z" />
                            </g>
                        </svg>
                    </span>
                    LOGIN WITH GOOGLE
                </button>
                <div className="login-form__divider">
                    <span />
                    <span className="login-form__divider-text">OR LOGIN WITH YOUR PHONE NUMBER</span>
                    <span />
                </div>
                <form className="login-form__form">
                    <label className="login-form__label">SỐ ĐIỆN THOẠI</label>
                    <input
                        className="login-form__input"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="HÃY NHẬP SỐ ĐIỆN THOẠI BẠN VÀO ĐÂY"
                        required
                    />
                    <button className="login-form__submit" type="submit">ĐĂNG NHẬP</button>
                </form>
                <div className="login-form__register">
                    BẠN CHƯA CÓ TÀI KHOẢN? <a href="/register">ĐĂNG KÝ</a>
                </div>
            </div>
        </div>
    );
}

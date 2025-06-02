import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP, sendOTP } from '../../services/firebase';
import '../../styles/components/OTPVerification.scss';

export default function OTPVerification() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isVerifying, setIsVerifying] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state?.phoneNumber) {
            navigate('/login');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [location.state, navigate]);

    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('Vui lòng nhập đủ 6 số OTP');
            return;
        }

        setIsVerifying(true);
        try {
            const result = await verifyOTP(otp);
            if (result.user) {
                // Nếu là đăng ký, chuyển đến trang hoàn tất đăng ký
                if (location.state?.isRegister) {
                    navigate('/register/complete', {
                        state: {
                            phoneNumber: location.state.phoneNumber,
                            uid: result.user.uid
                        }
                    });
                } else {
                    // Nếu là đăng nhập, chuyển đến trang chủ
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError(error.message);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        if (timeLeft > 0) return;

        try {
            await sendOTP(location.state.phoneNumber);
            setTimeLeft(60);
            setError('');
        } catch (error) {
            console.error('Error resending OTP:', error);
            setError(error.message);
        }
    };

    return (
        <div className="otp-verification__container">
            <div className="otp-verification__box">
                <h2 className="otp-verification__title">XÁC THỰC OTP</h2>
                <p className="otp-verification__subtitle">
                    Vui lòng nhập mã OTP đã được gửi đến số điện thoại {location.state?.phoneNumber}
                </p>
                <form className="otp-verification__form" onSubmit={handleSubmit}>
                    <input
                        className="otp-verification__input"
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Nhập mã OTP"
                        maxLength={6}
                        required
                        disabled={isVerifying}
                    />
                    {error && <div className="otp-verification__error">{error}</div>}
                    <button
                        className="otp-verification__submit"
                        type="submit"
                        disabled={isVerifying}
                    >
                        {isVerifying ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN'}
                    </button>
                </form>
                <div className="otp-verification__resend">
                    {timeLeft > 0 ? (
                        <p>Gửi lại mã sau {timeLeft} giây</p>
                    ) : (
                        <button
                            className="otp-verification__resend-button"
                            onClick={handleResendOTP}
                            disabled={isVerifying}
                        >
                            Gửi lại mã OTP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 
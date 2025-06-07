import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/components/EmailVerificationForm.scss';

export default function EmailVerificationForm() {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    const { email, fullName, password, isRegister } = location.state || {};

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return;
        
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = verificationCode.join('');
        
        if (code.length !== 6) {
            setError('Vui lòng nhập đầy đủ mã xác thực');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate email verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (isRegister) {
                // Create new user account
                const newUser = {
                    id: `user_${Date.now()}`,
                    email: email,
                    name: fullName,
                    role: 'member',
                    status: 1, // active
                    isFirstLogin: true,
                    profile: {
                        email: email,
                        fullName: fullName,
                        name: fullName,
                        age: null,
                        gender: '',
                        address: '',
                        bloodGroup: '',
                        rhType: '',
                        phone: '',
                        createdAt: new Date().toISOString()
                    }
                };

                // Auto login the new user
                authService.setCurrentUser(newUser);
                
                // Redirect to member info page for first-time setup
                navigate('/member/profile', { 
                    state: { 
                        isFirstTime: true, 
                        message: 'Chào mừng bạn! Vui lòng hoàn thiện thông tin cá nhân để sử dụng đầy đủ tính năng.' 
                    }
                });
            } else {
                // Login flow - redirect to home
                navigate('/member');
            }
        } catch (error) {
            console.error('Email verification failed:', error);
            setError('Mã xác thực không đúng. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;
        
        try {
            setIsLoading(true);
            // Simulate resend email
            await new Promise(resolve => setTimeout(resolve, 1000));
            setResendCooldown(60); // 60 seconds cooldown
            alert('Đã gửi lại mã xác thực đến email của bạn');
        } catch (error) {
            console.error('Resend email failed:', error);
            setError('Không thể gửi lại mã xác thực. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="email-verification-container">
            <div className="verification-box">
                <div className="verification-header">
                    <h1 className="verification-title">XÁC THỰC EMAIL</h1>
                    <p className="verification-description">
                        Chúng tôi đã gửi mã xác thực 6 số đến email <strong>{email}</strong>. 
                        Vui lòng nhập mã đó vào các ô bên dưới.
                    </p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="verification-inputs">
                        {verificationCode.map((digit, index) => (
                            <input 
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text" 
                                maxLength="1" 
                                className="verification-input"
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="verify-button"
                        disabled={isLoading || verificationCode.join('').length !== 6}
                    >
                        {isLoading ? 'ĐANG XÁC THỰC...' : 'XÁC THỰC'}
                    </button>
                </form>
                
                <div className="resend-section">
                    <p className="resend-text">
                        Chưa nhận được mã?{' '}
                        <button 
                            type="button" 
                            className="resend-button"
                            onClick={handleResendCode}
                            disabled={isLoading || resendCooldown > 0}
                        >
                            {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại mã'}
                        </button>
                    </p>
                </div>

                <div className="back-to-register">
                    <button 
                        type="button"
                        className="back-button"
                        onClick={() => navigate('/register')}
                    >
                        ← Quay lại đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
}

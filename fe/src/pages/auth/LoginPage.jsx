import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import './LoginPage.scss';

export default function LoginPage() {
    return (
        <div className="auth-page__container">
            <div className="auth-page__content">
                <div className="auth-page__left">
                    <div className="auth-page__image-placeholder">
                        <svg width="120" height="120" viewBox="0 0 60 60">
                            <rect x="5" y="5" width="50" height="50" rx="12" fill="#eee" stroke="#888" />
                            <circle cx="45" cy="20" r="4" fill="#222" />
                            <path d="M10 45 Q30 25 50 45" stroke="#888" strokeWidth="2" fill="#bbb" />
                        </svg>
                    </div>
                </div>
                <div className="auth-page__right">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
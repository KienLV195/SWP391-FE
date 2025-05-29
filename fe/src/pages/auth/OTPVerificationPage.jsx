import React from 'react'
import OPTVerificationForm from '../../components/auth/OPTVerificationForm'
import '../../styles/pages/OTPVerificationPage.scss'
import loginImg from '../../assets/images/loginImg.jpg'

export default function OTPVerificationPage() {
    return (
        <div className="otp-page__container">
            <div className="auth-page__content">
                <div className="auth-page__left">
                    <div className="auth-page__image-placeholder">
                        <img src={loginImg} alt="login" />
                    </div>
                </div>
                <div className="auth-page__right">
                    <OPTVerificationForm />
                </div>
            </div>
        </div>
    )
}
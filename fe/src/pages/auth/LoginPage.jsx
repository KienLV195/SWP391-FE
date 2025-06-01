import React from 'react';
import LoginForm from "../../components/auth/LoginForm";
import "../../styles/pages/LoginPage.scss";
import loginImg from "../../assets/images/loginImg.jpg";
import GuestNavbar from '../../components/guest/GuestNavbar';

export default function LoginPage() {
    return (
        <>
            <GuestNavbar />
            <div className="auth-page__container">
                <div className="auth-page__content">
                    <div className="auth-page__left">
                        <LoginForm />
                    </div>
                    <div className="auth-page__right">
                        <img className="auth-page__image-real" src={loginImg} alt="Blood drop on hand" />
                    </div>
                </div>
            </div>
        </>
    );
}
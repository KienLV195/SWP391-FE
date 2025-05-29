import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import registerImg from "../../assets/images/registerImg.jpg";

export default function RegisterPage() {
    return (
        <div className="auth-page__container">
            <div className="auth-page__content">
                <div className="auth-page__left">
                    <img className="auth-page__image-real" src={registerImg} alt="Blood drop on hand" />

                </div>
                <div className="auth-page__right">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}       
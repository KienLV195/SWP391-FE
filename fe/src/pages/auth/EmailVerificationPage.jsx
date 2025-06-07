import React from 'react';
import EmailVerificationForm from '../../components/auth/EmailVerificationForm';
import '../../styles/pages/EmailVerificationPage.scss';

const EmailVerificationPage = () => {
  return (
    <div className="email-verification-page">
      <EmailVerificationForm />
    </div>
  );
};

export default EmailVerificationPage;

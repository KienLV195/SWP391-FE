// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAO34vMj1TdEPB8NiJ2lNyHgP-D0MjX1gY",
    authDomain: "blooddonation-management.firebaseapp.com",
    projectId: "blooddonation-management",
    storageBucket: "blooddonation-management.firebasestorage.app",
    messagingSenderId: "1086631940080",
    appId: "1:1086631940080:web:b742a0a3082ba2692d1735",
    measurementId: "G-MPHM1QEHNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Enable test mode for development
auth.settings.appVerificationDisabledForTesting = true;

// Function to setup reCAPTCHA
const setupRecaptcha = (buttonId) => {
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
        'size': 'invisible',
        'callback': () => {
            console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
            console.log('reCAPTCHA expired');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        }
    });

    return window.recaptchaVerifier;
};

// Function to send OTP
const sendOTP = async (phoneNumber, buttonId) => {
    try {
        // Format phone number to E.164 format
        const formattedPhone = phoneNumber.startsWith('0')
            ? `+84${phoneNumber.substring(1)}`
            : phoneNumber;

        // Setup reCAPTCHA
        const appVerifier = setupRecaptcha(buttonId);

        // Send OTP
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        window.confirmationResult = confirmationResult;
        return confirmationResult;
    } catch (error) {
        console.error('Error sending OTP:', error);

        // Handle specific error cases
        switch (error.code) {
            case 'auth/invalid-phone-number':
                throw new Error('Số điện thoại không hợp lệ');
            case 'auth/too-many-requests':
                throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút');
            case 'auth/quota-exceeded':
                throw new Error('Đã vượt quá giới hạn gửi OTP. Vui lòng thử lại sau 1 giờ');
            case 'auth/captcha-check-failed':
                throw new Error('Xác thực reCAPTCHA thất bại. Vui lòng thử lại');
            default:
                throw new Error('Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại');
        }
    }
};

// Function to verify OTP
const verifyOTP = async (otp) => {
    try {
        const confirmationResult = window.confirmationResult;
        if (!confirmationResult) {
            throw new Error('Phiên xác thực đã hết hạn. Vui lòng thử lại');
        }
        const result = await confirmationResult.confirm(otp);
        return result;
    } catch (error) {
        console.error('Error verifying OTP:', error);

        // Handle specific error cases
        switch (error.code) {
            case 'auth/invalid-verification-code':
                throw new Error('Mã OTP không hợp lệ');
            case 'auth/code-expired':
                throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới');
            case 'auth/too-many-requests':
                throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút');
            default:
                throw new Error('Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại');
        }
    }
};

export { googleProvider, auth, sendOTP, verifyOTP };  
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
export { googleProvider, auth };  
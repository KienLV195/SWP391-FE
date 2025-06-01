import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/error/NotFoundPage";
import ForbiddenPage from "../pages/error/ForbiddenPage";
import HomePage from "../pages/guest/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OTPVerificationPage from "../pages/auth/OTPVerificationPage";
import BloodInfoPage from "../pages/guest/BloodInfoPage";
import BlogPage from "../pages/guest/BlogPage";
import BloodDonationGuide from "../pages/guest/DonationGuide";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/:authType/otpverification",
    element: <OTPVerificationPage />,
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "/blood-info",
    element: <BloodInfoPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/donation-guide",
    element: <BloodDonationGuide />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;

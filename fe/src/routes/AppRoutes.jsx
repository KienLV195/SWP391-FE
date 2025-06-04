import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/error/NotFoundPage";
import ForbiddenPage from "../pages/error/ForbiddenPage";
import GuestHomePage from "../pages/guest/GuestHomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OTPVerificationPage from "../pages/auth/OTPVerificationPage";
import BloodInfoPage from "../pages/guest/BloodInfoPage";
import BlogPage from "../pages/guest/BlogPage";
import BloodDonationGuide from "../pages/guest/DonationGuide";
import ManagerHomePage from "../pages/manager/ManagerHomePage";
import MemberHomePage from "../pages/member/MemberHomePage";
import MemberBlogPage from "../pages/member/MemberBlogPage";
import MemberBloodInfoPage from "../pages/member/MemberBloodInfoPage";
import MemberDonationGuide from "../pages/member/MemberDonationGuide";
import MemberInfo from "../pages/member/MemberInfo";
import MemberNavbar from "../components/member/MemberNavbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestHomePage />,
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
    path: "/manager",
    element: <ManagerHomePage />,
  },
  {
    path: "/member",
    element: <MemberHomePage />,
  },
  {
    path: "/member/blood-info",
    element: <MemberBloodInfoPage />,
  },
  {
    path: "/member/blog",
    element: <MemberBlogPage />,
  },
  {
    path: "/member/donation-guide",
    element: <MemberDonationGuide />,
  },
  {
    path: "/member/profile",
    element: <MemberInfo />,
  },
  {
    path: "/member/notifications",
    element: (
      <>
        <MemberNavbar />
        <div style={{ padding: 32 }}>
          <h2>Thông báo cá nhân</h2>
          <p>Trang này đang phát triển.</p>
        </div>
      </>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;

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
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MemberHomePage from "../pages/member/MemberHomePage";
import MemberBlogPage from "../pages/member/MemberBlogPage";
import MemberBloodInfoPage from "../pages/member/MemberBloodInfoPage";
import MemberDonationGuide from "../pages/member/MemberDonationGuide";
import MemberInfoPage from "../pages/member/MemberInfoPage";
import MemberNavbar from "../components/member/MemberNavbar";
import BloodDonationFormPage from "../pages/member/BloodDonationFormPage";
import BloodRequestForm from "../pages/member/BloodRequestForm";
import ActivityHistory from "../pages/member/ActivityHistory";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import TestAccounts from "../pages/demo/TestAccounts";
import ProtectedRoute, {
  MemberRoute,
  DoctorRoute,
  ManagerRoute,
} from "../components/common/ProtectedRoute";

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
    path: "/test-accounts",
    element: <TestAccounts />,
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
    element: (
      <ManagerRoute>
        <ManagerDashboard />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/home",
    element: (
      <ManagerRoute>
        <ManagerHomePage />
      </ManagerRoute>
    ),
  },
  {
    path: "/doctor",
    element: (
      <DoctorRoute>
        <DoctorDashboard />
      </DoctorRoute>
    ),
  },
  {
    path: "/member",
    element: (
      <MemberRoute>
        <MemberHomePage />
      </MemberRoute>
    ),
  },
  {
    path: "/member/activity-history",
    element: (
      <MemberRoute>
        <ActivityHistory />
      </MemberRoute>
    ),
  },
  {
    path: "/member/blood-request-form",
    element: (
      <MemberRoute>
        <BloodRequestForm />
      </MemberRoute>
    ),
  },
  {
    path: "/member/blood-info",
    element: (
      <MemberRoute>
        <MemberBloodInfoPage />
      </MemberRoute>
    ),
  },
  {
    path: "/member/blog",
    element: (
      <MemberRoute>
        <MemberBlogPage />
      </MemberRoute>
    ),
  },
  {
    path: "/member/donation-guide",
    element: (
      <MemberRoute>
        <MemberDonationGuide />
      </MemberRoute>
    ),
  },
  {
    path: "/member/profile",
    element: (
      <MemberRoute>
        <MemberInfoPage />
      </MemberRoute>
    ),
  },
  {
    path: "/member/blood-donation-form",
    element: (
      <MemberRoute>
        <BloodDonationFormPage />
      </MemberRoute>
    ),
  },
  {
    path: "/member/notifications",
    element: (
      <MemberRoute>
        <>
          <MemberNavbar />
          <div style={{ padding: 32 }}>
            <h2>Thông báo cá nhân</h2>
            <p>Trang này đang phát triển.</p>
          </div>
        </>
      </MemberRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;

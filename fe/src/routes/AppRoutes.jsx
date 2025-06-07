import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/error/NotFoundPage";
import ForbiddenPage from "../pages/error/ForbiddenPage";
import GuestHomePage from "../pages/guest/GuestHomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import BloodInfoPage from "../pages/guest/BloodInfoPage";
import BlogPage from "../pages/guest/BlogPage";
import BloodDonationGuide from "../pages/guest/DonationGuide";
import ManagerHomePage from "../pages/manager/ManagerHomePage";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import BloodRequestsManagement from "../pages/manager/BloodRequestsManagement";
import DonationProcessManagement from "../pages/manager/DonationProcessManagement";
import BloodInventoryManagement from "../pages/manager/BloodInventoryManagement";
import ReportsManagement from "../pages/manager/ReportsManagement";
import EmergencyRequestsManagement from "../pages/manager/EmergencyRequestsManagement";
import NotificationsManagement from "../pages/manager/NotificationsManagement";
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
import DoctorBloodRequestsPage from "../pages/doctor/DoctorBloodRequestsPage";
import ExternalRequestsManagement from "../pages/doctor/ExternalRequestsManagement";
import TestAccounts from "../pages/demo/TestAccounts";
import ProtectedRoute, {
  MemberRoute,
  DoctorRoute,
  ManagerRoute,
  AdminRoute,
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
    path: "/register/verify-email",
    element: <EmailVerificationPage />,
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
    path: "/manager/blood-requests",
    element: (
      <ManagerRoute>
        <BloodRequestsManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/donation-process",
    element: (
      <ManagerRoute>
        <DonationProcessManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/blood-inventory",
    element: (
      <ManagerRoute>
        <BloodInventoryManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/reports",
    element: (
      <ManagerRoute>
        <ReportsManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/emergency-requests",
    element: (
      <ManagerRoute>
        <EmergencyRequestsManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/notifications",
    element: (
      <ManagerRoute>
        <NotificationsManagement />
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
    path: "/doctor/blood-requests",
    element: (
      <DoctorRoute>
        <DoctorBloodRequestsPage />
      </DoctorRoute>
    ),
  },
  {
    path: "/doctor/external-requests",
    element: (
      <DoctorRoute>
        <ExternalRequestsManagement />
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

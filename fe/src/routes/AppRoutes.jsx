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
import BloodRequestsPage from "../pages/manager/BloodRequestsPage";

import BloodInventoryManagement from "../pages/manager/BloodInventoryManagement";
import ReportsManagement from "../pages/manager/ReportsManagement";

import NotificationsManagement from "../pages/manager/NotificationsManagement";
import MemberHomePage from "../pages/member/MemberHomePage";
import MemberBlogPage from "../pages/member/MemberBlogPage";
import MemberBloodInfoPage from "../pages/member/MemberBloodInfoPage";
import MemberDonationGuide from "../pages/member/MemberDonationGuide";
import MemberInfoPage from "../pages/member/MemberInfoPage";
import MemberNavbar from "../components/member/MemberNavbar";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorBloodRequestsPage from "../pages/doctor/DoctorBloodRequestsPage";
import ExternalRequestsManagement from "../pages/doctor/ExternalRequestsManagement";
import DoctorDonorManagementPage from "../pages/doctor/DoctorDonorManagementPage";

import BloodInventoryViewPage from "../pages/doctor/BloodInventoryViewPage";
import DonationSchedulePageNew from "../pages/manager/DonationSchedulePageNew";
import EligibleDonorsPage from "../pages/manager/EligibleDonorsPage";

import BloodDonationFormPage from "../pages/member/BloodDonationFormPage";
import BloodRequestFormPage from "../pages/member/BloodRequestFormPage";
import ActivityHistoryPage from "../pages/member/ActivityHistoryPage";
import NotificationsPage from "../pages/member/NotificationsPage";
import TestAccounts from "../pages/demo/TestAccounts";

// Admin imports
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import BlogApproval from "../pages/admin/BlogApproval";
import Reports from "../pages/admin/Reports";
import SystemSettings from "../pages/admin/SystemSettings";

// Doctor Blog Management
import DoctorBlogManagement from "../pages/doctor/BlogManagement";
import DoctorBlogEditor from "../pages/doctor/BlogEditor";

// Manager Blog Management
import ManagerBlogManagement from "../pages/manager/BlogManagement";
import ManagerBlogEditor from "../pages/manager/BlogEditor";

import ProtectedRoute, {
  MemberRoute,
  DoctorRoute,
  ManagerRoute,
  AdminRoute,
} from "../components/common/ProtectedRoute";
import ArticleDetailPage from "../pages/guest/ArticleDetailPage";

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
        <BloodRequestsPage />
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
    path: "/manager/notifications",
    element: (
      <ManagerRoute>
        <NotificationsManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/donation-schedule",
    element: (
      <ManagerRoute>
        <DonationSchedulePageNew />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/eligible-donors",
    element: (
      <ManagerRoute>
        <EligibleDonorsPage />
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
    path: "/doctor/donor-management",
    element: (
      <DoctorRoute>
        <DoctorDonorManagementPage />
      </DoctorRoute>
    ),
  },

  {
    path: "/doctor/blood-inventory",
    element: (
      <DoctorRoute>
        <BloodInventoryViewPage />
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
    path: "/member/blood-request-form",
    element: (
      <MemberRoute>
        <BloodRequestFormPage />
      </MemberRoute>
    ),
  },
  {
    path: "/member/activity-history",
    element: (
      <MemberRoute>
        <ActivityHistoryPage />
      </MemberRoute>
    ),
  },

  {
    path: "/member/notifications",
    element: (
      <MemberRoute>
        <NotificationsPage />
      </MemberRoute>
    ),
  },
  {
    path: "/articles/:id",
    element: <ArticleDetailPage />,
  },
  {
    path: "/blood-info/:id",
    element: <ArticleDetailPage />,
  },

  // === ADMIN ROUTES ===
  {
    path: "/admin/dashboard",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <UserManagement />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/blogs",
    element: (
      <AdminRoute>
        <BlogApproval />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <AdminRoute>
        <Reports />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/system",
    element: (
      <AdminRoute>
        <SystemSettings />
      </AdminRoute>
    ),
  },

  // === DOCTOR BLOG ROUTES ===
  {
    path: "/doctor/blog",
    element: (
      <DoctorRoute>
        <DoctorBlogManagement />
      </DoctorRoute>
    ),
  },
  {
    path: "/doctor/blog/create",
    element: (
      <DoctorRoute>
        <DoctorBlogEditor />
      </DoctorRoute>
    ),
  },
  {
    path: "/doctor/blog/edit/:id",
    element: (
      <DoctorRoute>
        <DoctorBlogEditor />
      </DoctorRoute>
    ),
  },

  // === MANAGER BLOG ROUTES ===
  {
    path: "/manager/blog",
    element: (
      <ManagerRoute>
        <ManagerBlogManagement />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/blog/create",
    element: (
      <ManagerRoute>
        <ManagerBlogEditor />
      </ManagerRoute>
    ),
  },
  {
    path: "/manager/blog/edit/:id",
    element: (
      <ManagerRoute>
        <ManagerBlogEditor />
      </ManagerRoute>
    ),
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;

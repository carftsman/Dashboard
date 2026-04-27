import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import DashboardSelection from "../pages/DashboardSelection";
import MainDashboard from "../pages/MainDashboard";
import UploadData from "../pages/UploadData";
import ColumnMapping from "../pages/ColumnMapping";
import DataValidation from "../pages/DataValidation";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import AdminDashboard from "../pages/admin/adminDashboard";
import ManageUsers from "../pages/admin/Manageusers";
import DataSchema from "../pages/admin/dataSchema";
import UserLog from "../pages/UserLog";
import EditProfile from "../pages/EditProfile";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginOtp from "../pages/LoginOtp";
import AdminReportManagement from "../pages/AdminReportManagement";
import ChangePassword from "../pages/ChangePassword";
<Route path="/unauthorized" element={<h2>Access Denied</h2>} />

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/loginOtp" element={<LoginOtp />} />

      {/* Protected Routes */}

      <Route
        path="/dashboard-selection"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ANALYST","MANAGER","SUBUSER"]}>
            <DashboardSelection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ANALYST","SUBUSER"]}>
            <MainDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-data"
        element={
          <ProtectedRoute allowedRoles={["ANALYST","SUBUSER"]}>
            <UploadData />
          </ProtectedRoute>
        }
      />

      <Route
        path="/column-mapping"
        element={
          <ProtectedRoute allowedRoles={["ANALYST","SUBUSER"]}>
            <ColumnMapping />
          </ProtectedRoute>
        }
      />

      <Route
        path="/data-validation"
        element={
          <ProtectedRoute allowedRoles={["ANALYST","SUBUSER"]}>
            <DataValidation />
          </ProtectedRoute>
        }
      />

      

      <Route
        path="/reports/:dashboardId/:dashboardName"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ANALYST","SUBUSER","MANAGER"]}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/all"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <AdminReportManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/reports/:id" element={<Reports />} allowedRoles={["ADMIN", "SUPER_ADMIN", "ANALYST","SUBUSER","MANAGER"]}/>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-logs"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ANALYST"]}>
            <UserLog />
          </ProtectedRoute>
        }
      />
      <Route path="/edit-profile" element={<EditProfile />} allowedRoles={["ADMIN", "SUPER_ADMIN", "ANALYST","MANAGER","SUBUSER"]}/>
      <Route path="/change-password" element={<ChangePassword />} allowedRoles={["ADMIN", "SUPER_ADMIN", "ANALYST","MANAGER","SUBUSER"]}/>

      {/* Admin Routes */}

      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataschema/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <DataSchema />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
    </Routes>
  );
};

export default AppRoutes;

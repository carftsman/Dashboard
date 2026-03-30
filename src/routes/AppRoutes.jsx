import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import DashboardSelection from "../pages/DashboardSelection";
import MainDashboard from "../pages/MainDashboard";
import UploadData from "../pages/UploadData";
import ColumnMapping from "../pages/ColumnMapping";
import DataValidation from "../pages/DataValidation";
import VisualEditing from "../pages/VisualEditing";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import AdminDashboard from "../pages/admin/adminDashboard";
import ManageUsers from "../pages/admin/Manageusers";
import DataSchema from "../pages/admin/dataSchema";
import UserLogs from "../pages/userlogs";

import ProtectedRoute from "../components/ProtectedRoute";
import LoginOtp from "../pages/LoginOtp";
import AdminReportManagement from "../pages/AdminReportManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/loginOtp" element={<LoginOtp />} />

      {/* Protected Routes */}

      <Route
        path="/dashboard-selection"
        element={
          <ProtectedRoute>
            <DashboardSelection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute>
            <MainDashboard />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/upload-data"
        element={
          <ProtectedRoute>
            <UploadData />
          </ProtectedRoute>
        }
      />

      <Route
        path="/column-mapping"
        element={
          <ProtectedRoute>
            <ColumnMapping />
          </ProtectedRoute>
        }
      />

      <Route
        path="/data-validation"
        element={
          <ProtectedRoute>
            <DataValidation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visual-editing"
        element={
          <ProtectedRoute>
            <VisualEditing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/:dashboardId/:dashboardName"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/all"
        element={
          <ProtectedRoute>
            <AdminReportManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/reports/:id" element={<Reports />} />

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
          <ProtectedRoute>
            <UserLogs />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route path="/admin-dashboard/*" 
       element={
         <ProtectedRoute>
            <AdminDashboard />
       </ProtectedRoute>
       } />

      <Route
        path="/manage-users"
        element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataschema/:id"
        element={
          <ProtectedRoute>
            <DataSchema />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

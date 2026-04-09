import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  KeyIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import api from '../api/apiConfig';

function ChangePassword() {

  const navigate = useNavigate();

 
  const role = localStorage.getItem("role")?.toLowerCase();

 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //  State for show/hide password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  //  Function to handle password change
  const handleChangePassword = async () => {
    try {
      //  Get token & email from localStorage
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      //  API call to change password
      await api.post(
        "/api/auth/change-password", 
        {
          email: email,
          "current Password": currentPassword,
          "new Password": newPassword,
          "confirm Password": confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );

      //  Success message
      toast.success("Password updated successfully ");

      //  Redirect to profile page
      navigate("/profile");

    } catch (error) {
      console.error(error);

      //  Error message
      toast.error(
        error?.response?.data?.message || "Failed to update password "
      );
    }
  };

  return (
    //  Main layout container
    <div className="flex bg-gray-100 min-h-screen overflow-x-hidden">

      {/*  Sidebar based on role */}
      {role === "admin" ? <AdminSidebar /> : <Sidebar />}

      {/* Right side content */}
      <div className="flex-1 ml-[220px] flex flex-col">

        {/*  Header  */}
        <div className="fixed top-0 left-[220px] right-0 z-50 bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/profile")} // 🔹 Back navigation
            className="flex items-center gap-2 text-gray-600 font-medium bg-transparent p-0 
                       hover:text-gray-600 hover:bg-transparent 
                       focus:outline-none focus:ring-0 
                       active:bg-transparent active:text-gray-600"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        {/*  Main content area */}
        <div className="mt-[60px] flex justify-center py-6 h-[calc(100vh-60px)] overflow-hidden">

          {/*  Card container */}
          <div className="bg-white rounded-xl shadow-md w-[500px] p-6 max-h-full overflow-y-auto">

            {/*  Title */}
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              Change Password
            </h2>

            {/*  Description */}
            <p className="text-gray-500 text-sm mb-6">
              To protect your account, ensure your new password is at least 12 characters long and includes a mix of letters, numbers, and symbols.
            </p>

            {/*  Current Password  */}
            <div className="mb-4">
              <label className="text-sm text-gray-500">Current Password</label>
              <div className="relative mt-1">
                <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showCurrent ? "text" : "password"} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 outline-none"
                  placeholder="Enter Current Password"
                />
                <div
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                >
                  {showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </div>
              </div>
            </div>

            {/*  New Password Field */}
            <div className="mb-4">
              <label className="text-sm text-gray-500">New Password</label>
              <div className="relative mt-1">
                <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 outline-none"
                  placeholder="Enter New Password"
                />
                <div
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                >
                  {showNew ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="text-sm text-gray-500">Confirm New Password</label>
              <div className="relative mt-1">
                <ShieldCheckIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 outline-none"
                  placeholder="Confirm Password"
                />
                <div
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                >
                  {showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </div>
              </div>
            </div>

            {/*  Security checklist */}
            <div className="mb-6 bg-gray-50 border rounded-md p-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">
                SECURITY CHECKLIST
              </h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Minimum 12 characters</li>
                <li>• One uppercase & one lowercase letter</li>
                <li>• One number & one special character</li>
              </ul>
            </div>

            {/*  Buttons */}
            <div className="flex justify-between">

              {/*  Cancel button */}
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
              >
                Cancel
              </button>

              {/*  Submit button */}
              <button
                onClick={handleChangePassword}
                className="px-6 py-2 bg-[#1f2a44] text-white rounded-md"
              >
                Update Password
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
export default ChangePassword;
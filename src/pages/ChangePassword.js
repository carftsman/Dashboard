import React, { useState } from "react";
import AdminSidebar from "../components/adminSidebar";
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

function ChangePassword() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      await axios.post(
        "https://dashboard-backend-cyrd.onrender.com/api/auth/change-password",
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

      alert("Password updated successfully ");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to update password ❌"
      );
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      {role === "admin" ? <AdminSidebar /> : <Sidebar />}

      <div className="flex-1 ml-[220px]">

        {/* ✅ HEADER (EXACT MATCH LIKE PROFILE PAGE) */}
        <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-600 font-medium bg-transparent p-0 hover:underline focus:outline-none"
          >
            &lt; Back
          </button>

          <div className="flex-1"></div>
          <div></div>
        </div>

        {/* CONTENT */}
        <div className="flex justify-center items-start py-12">

          <div className="bg-white rounded-xl shadow-md w-[500px] p-6">

            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              🔄 Change Password
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              To protect your account, ensure your new password is at least 12 characters long and includes a mix of letters, numbers, and symbols.
            </p>

            {/* Current Password */}
            <div className="mb-4">
              <label className="text-sm text-gray-500">Current Password</label>
              <div className="relative mt-1">
                <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 outline-none"
                  placeholder="••••••••"
                />
                <div
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                >
                  {showCurrent ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="text-sm text-gray-500">New Password</label>
              <div className="relative mt-1">
                <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 outline-none"
                  placeholder="••••••••"
                />
                <div
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                >
                  {showNew ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="text-sm text-gray-500">Confirm New Password</label>
              <div className="relative mt-1">
                <ShieldCheckIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 outline-none"
                  placeholder="••••••••"
                />
                <div
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Security Checklist */}
            <div className="bg-blue-50 border rounded-md p-4 text-sm text-gray-600 mb-6">
              <p className="font-semibold text-gray-700 mb-2">
                SECURITY CHECKLIST
              </p>
              <ul className="space-y-1">
                <li>✔ Minimum 12 characters</li>
                <li>✔ One uppercase & one lowercase letter</li>
                <li>✔ One number & one special character</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>

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
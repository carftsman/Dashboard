import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";

// Icons
import {
  FaHome,
  FaUsers,
  FaBullhorn,
  FaThLarge,
  FaChevronDown,
  FaSignOutAlt,
  FaUserClock // ✅ ADDED
} from "react-icons/fa";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  FiAlertCircle
} from "react-icons/fi";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/admin-dashboard";
  const isUsersPage = location.pathname.startsWith("/manage-users");
  const isDashboardPage = location.pathname.startsWith("/dashboard-selection");
  const isReportsPage = location.pathname.startsWith("/reports");
  const isUserLogsPage = location.pathname.startsWith("/user-logs"); // ✅ ADDED

  const isHomeActive =
    isHomePage || isUsersPage || isDashboardPage || isReportsPage;

  const [openHome, setOpenHome] = useState(
    isHomeActive && location.pathname !== "/admin-dashboard"
  );

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [hoveredOption, setHoveredOption] = useState("no");

  useEffect(() => {
    setOpenHome(
      isHomeActive && location.pathname !== "/admin-dashboard"
    );
  }, [location]);

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-[220px] h-screen bg-[#192A51] flex flex-col justify-between text-white fixed top-0 left-0">

        <div>
          {/* Logo */}
          <div className="flex items-center px-2 py-1">
            <img
              src={logo}
              alt="ZestBot"
              className="w-[85px] h-[85px] object-contain"
            />

            <h2 className="text-[30px] font-semibold ml-[-10px] tracking-[0.5px]">
              <span className="text-white">Zest</span>
              <span className="text-[#f4c542]">Bot</span>
            </h2>
          </div>

          <div className="h-[1px] bg-white/10 mx-[15px] my-[5px]" />

          <div className="mt-[15px] px-3">

            {/* HOME MENU */}
            <div
              onClick={() => {
                setOpenHome(!openHome);
                if (location.pathname !== "/admin-dashboard") {
                  navigate("/admin-dashboard");
                }
              }}
              className={`relative flex items-center justify-between gap-3 px-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px]
              ${isHomeActive
                ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
            >
              <div className="flex items-center gap-3">
                <FaHome />
                <span>Home</span>
              </div>

              <FaChevronDown
                className={`transition-transform duration-300 ${openHome ? "rotate-180" : ""}`}
              />

              {isHomeActive && (
                <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542]" />
              )}
            </div>

            {/* SUBMENU */}
            {openHome && (
              <div className="pl-[35px] mt-[5px]">

                <NavLink
                  to="/manage-users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 text-[13px]
                    ${(isUsersPage || isActive)
                      ? "text-white font-semibold"
                      : "text-slate-300 hover:text-white"}`
                  }
                >
                  <FaUsers />
                  <span>Manage Users</span>
                </NavLink>

                <NavLink
                  to="/dashboard-selection"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 text-[13px]
                    ${(isDashboardPage || isActive)
                      ? "text-white font-semibold"
                      : "text-slate-300 hover:text-white"}`
                  }
                >
                  <FaThLarge />
                  <span>Dashboards</span>
                </NavLink>

                <NavLink
                  to="/reports/all"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 text-[13px]
                    ${(isReportsPage || isActive)
                      ? "text-white font-semibold"
                      : "text-slate-300 hover:text-white"}`
                  }
                >
                  <FaBullhorn />
                  <span>Reports</span>
                </NavLink>

              </div>
            )}

            
            <NavLink
              to="/user-logs"
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] text-[14px] transition-all
                ${isActive
                  ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                  : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"
                }`
              }
            >
              <FaUserClock className="text-[15px]" />
              <span>Users Log</span>
            </NavLink>

          </div>
        </div>

        {/* Logout */}
        <div className="p-[15px]">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="w-full bg-[#2a4270] hover:bg-[#3b5a91] flex items-center justify-center gap-2 py-3 rounded-[10px]"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* LOGOUT POPUP */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div className="relative bg-white w-[360px] rounded-2xl shadow-2xl p-6 text-center">

            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
              <FiAlertCircle className="text-red-500 text-[26px]" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to logout from your account?
            </p>

            <div className="flex justify-center gap-3 mt-6">

              <button
                onClick={() => setShowLogoutPopup(false)}
                onMouseEnter={() => setHoveredOption("no")}
                className={`px-4 py-2 rounded-lg border transition
                  ${hoveredOption === "no"
                    ? "bg-gray-200 text-black"
                    : "bg-white text-gray-600 border-gray-300"}`}
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                onMouseEnter={() => setHoveredOption("yes")}
                className={`px-4 py-2 rounded-lg transition shadow-md
                  ${hoveredOption === "yes"
                    ? "bg-red-600 text-white"
                    : "bg-red-500 text-white"}`}
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
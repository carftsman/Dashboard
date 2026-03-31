import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";
 
// Icons
import {
  FaHome,
  FaUsers,
  FaBullhorn,
  FaThLarge,
  FaChevronDown,
  FaSignOutAlt
} from "react-icons/fa";
 
import { NavLink, useLocation, useNavigate } from "react-router-dom";
 
const AdminSidebar = () => {
  const location = useLocation();   // current URL
  const navigate = useNavigate();   // navigation function
 
  // Check which page is active
  const isHomePage = location.pathname === "/admin-dashboard";
  const isUsersPage = location.pathname.startsWith("/manage-users");
  const isDashboardPage = location.pathname.startsWith("/dashboard-selection");
  const isReportsPage = location.pathname.startsWith("/reports");
 
  // Home is active if any related page is active
  const isHomeActive =
    isHomePage || isUsersPage || isDashboardPage || isReportsPage;
 
  // State: submenu open/close
  const [openHome, setOpenHome] = useState(
    isHomeActive && location.pathname !== "/admin-dashboard"
  );
 
  // State: logout popup visibility
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
 
  // State: controls hover highlight (default = "no")
  const [hoveredOption, setHoveredOption] = useState("no");
 
  // Open submenu automatically when navigating
  useEffect(() => {
    setOpenHome(
      isHomeActive && location.pathname !== "/admin-dashboard"
    );
  }, [location]);
 
  // Logout function
  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/profile");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      navigate("/profile");
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
 
            {/* Home menu */}
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
 
              {/* Arrow rotates when submenu is open */}
              <FaChevronDown
                className={`transition-transform duration-300 ${openHome ? "rotate-180" : ""}`}
              />
 
              {/* Left highlight bar when active */}
              {isHomeActive && (
                <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542]" />
              )}
            </div>
 
            {/* Submenu */}
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
          </div>
        </div>
 
        {/* Logout button */}
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
 
      {/* Logout popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-[12px] w-[300px] text-center shadow-lg">
 
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to exit?
            </h3>
 
            <div className="flex justify-center gap-4">
 
              {/* Yes button */}
              <button
                onMouseEnter={() => setHoveredOption("yes")}
                onMouseLeave={() => setHoveredOption("no")}
                onClick={handleLogout}
                className={`px-4 py-2 rounded transition
                  ${hoveredOption === "yes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"}
                `}
              >
                Yes
              </button>
 
              {/* No button */}
              <button
                autoFocus
                onMouseEnter={() => setHoveredOption("no")}
                onClick={() => setShowLogoutPopup(false)}
                className={`px-4 py-2 rounded transition
                  ${hoveredOption === "no"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"}
                `}
              >
                No
              </button>
 
            </div>
          </div>
        </div>
      )}
    </>
  );
};
 
export default AdminSidebar;
 
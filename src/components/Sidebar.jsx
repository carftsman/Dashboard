import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";
import {
  FaThLarge,
  FaUserClock,
  FaSignOutAlt,
  FaChevronDown,
  FaTimes
} from "react-icons/fa";

import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();

  // ✅ UPDATED LOGOUT
  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        "https://dashboard-backend-cyrd.onrender.com/api/dashboards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboards(res.data);
    } catch (error) {
      setDashboards([]);
    }
  };

  return (
    <>
      {/* 🔥 SIDEBAR */}
      <div className="w-[220px] h-screen bg-[#192A51] flex flex-col justify-between text-white fixed top-0 left-0">

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div>
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
          </div>

          {/* MENU */}
          <div className="mt-[15px] px-3 max-h-[65vh] overflow-y-auto sidebar-scroll">

            {/* DASHBOARD */}
            <div
              onClick={() => setOpenDashboard(!openDashboard)}
              className={`relative flex items-center gap-3 pl-2 pr-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px] transition-all duration-200
              ${openDashboard
                  ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                  : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"
                }`}
            >
              <FaThLarge className="text-[15px]" />
              <span>Dashboard</span>

              <FaChevronDown
                className={`ml-auto text-[12px] transition-transform duration-300 ${openDashboard ? "rotate-180" : ""
                  }`}
              />
            </div>

            {/* SUBMENU */}
            {openDashboard && (
              <div className="pl-[35px] mt-[8px]">
                <div
                  className="
                  max-h-[160px] overflow-y-auto pr-1 space-y-1 sidebar-scroll
                  transition-all duration-300 ease-in-out
                  scrollbar-thin
                  scrollbar-thumb-[#3b82f6]
                  scrollbar-track-transparent
                  animate-fadeIn
                "
                >
                  {dashboards.length > 0 ? (
                    dashboards.map((item) => (
                      <NavLink
                        key={item.id}
                        to={`/dashboard/${item.id}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-200 ${isActive
                            ? "bg-[#f4c542] text-black font-semibold shadow"
                            : "text-slate-300 hover:bg-white/5 hover:translate-x-1"
                          }`
                        }
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[36px] h-[36px] rounded-lg object-cover shadow-sm flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <FaThLarge />
                        )}

                        <span
                          className="flex-1 text-[12px] whitespace-nowrap overflow-hidden truncate"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </NavLink>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No dashboards found
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* USERS LOG */}
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

        {/* LOGOUT */}
        <div className="p-[15px]">
          <button
            onClick={handleLogout}
            className="w-full bg-[#2a4270] hover:bg-[#3b5a91] transition-all duration-200 transform hover:-translate-y-[2px] text-gray-200 flex items-center justify-center gap-2 py-3 rounded-[10px]"
          >
            <FaSignOutAlt className="text-[13px]" />
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 MODAL (OUTSIDE SIDEBAR - FIXED) */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white w-[320px] p-6 rounded-2xl shadow-2xl text-center 
                    transform transition-all duration-300 scale-100 animate-fadeIn">

            {/* TITLE */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h2>

            {/* SUBTEXT */}
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout from your account?
            </p>

            {/* BUTTONS */}
            <div className="flex justify-center gap-3">

      <button
  onClick={cancelLogout}
  className="
    flex items-center gap-2
    px-4 py-2 rounded-lg
    text-gray-500 bg-transparent

    hover:bg-gray-100 hover:text-gray-700
    hover:-translate-y-[1px]

    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-gray-200

    transition-all duration-200
  "
>
  <FaTimes className="text-[12px]" />
  Cancel
</button>

              {/* CONFIRM */}
              <button
                onClick={confirmLogout}
                className="
    flex items-center justify-center gap-2
    px-5 py-2 rounded-lg 
    bg-gradient-to-r from-red-500 to-red-600 text-white
    hover:from-red-600 hover:to-red-700
    shadow-md hover:shadow-lg
    hover:-translate-y-[1px]
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-red-400
    transition-all duration-200
  "
              >
                <FaSignOutAlt className="text-[12px]" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";
import {
  FaThLarge,
  FaUserClock,
  FaSignOutAlt,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardActive = location.pathname.startsWith("/dashboard");

  //  LOGOUT
  const handleLogout = () => setShowLogoutPopup(true);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "/";
  };

  const cancelLogout = () => setShowLogoutPopup(false);

  useEffect(() => {
    fetchDashboards();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setOpenDashboard(true);
    }
  }, [location.pathname]);

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
        },
      );

      setDashboards(res.data);
    } catch (error) {
      setDashboards([]);
    }
  };

  return (
    <>
      <div className="w-[220px] h-screen bg-[#192A51] flex flex-col justify-between text-white fixed top-0 left-0">
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div>
            <div className="flex items-center px-2 py-1 ">
              <img
                src={logo}
                alt="ZestBot"
                className="w-[85px] h-[85px] object-contain mt-[-10px] "
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
              onClick={() => {
                setOpenDashboard(true);
                navigate("/dashboard-selection");
              }}
              className={`relative flex items-center gap-3 pl-2 pr-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px] transition-all duration-200
              ${
                isDashboardActive
                  ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                  : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"
              }`}
            >
              <FaThLarge className="text-[15px]" />
              <span>Dashboard</span>

              <FaChevronDown
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent click
                  setOpenDashboard(!openDashboard);
                }}
                className={`ml-auto text-[12px] transition-transform duration-300 ${openDashboard ? "rotate-180" : ""}`}
              />
            </div>

            {/* SUBMENU */}
            {openDashboard && (
              <div className="pl-[35px] mt-[8px]">
                <div className="max-h-[160px] overflow-y-auto pr-1 space-y-1 sidebar-scroll">
                  {dashboards.length > 0 ? (
                    dashboards.map((item) => (
                      <NavLink
                        key={item.id}
                        to={`/reports/${item.id}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-[#f4c542] text-black font-semibold shadow"
                              : "text-slate-300 hover:bg-white/5 hover:translate-x-1"
                          }`
                        }
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[36px] h-[36px] rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <FaThLarge />
                        )}

                        <span className="flex-1 text-[12px] truncate">
                          {item.name}
                        </span>
                      </NavLink>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No dashboards found</p>
                  )}
                </div>
              </div>
            )}

            {/* USERS LOG */}
            <NavLink
              to="/user-logs"
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] text-[14px] transition-all
                ${
                  isActive
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
            className="w-full bg-[#2a4270] hover:bg-[#3b5a91] text-gray-200 flex items-center justify-center gap-2 py-3 rounded-[10px]"
          >
            <FaSignOutAlt className="text-[13px]" />
            Logout
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white w-[320px] p-6 rounded-2xl text-center">
            <h2 className="text-xl font-semibold mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-3">
              <button onClick={cancelLogout} className="px-4 py-2">
                <FaTimes /> Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-5 py-2 bg-red-500 text-white rounded"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

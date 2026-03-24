import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";
import {
  FaThLarge,
  FaUserClock,
  FaSignOutAlt,
  FaChevronDown,

} from "react-icons/fa";

import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const location = useLocation();

  // ================= FETCH DASHBOARDS =================
  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log(" TOKEN:", token);

      if (!token) {
        console.error("No token found. Please login.");
        return;
      }

      const res = await axios.get(
        "https://dashboard-backend-cyrd.onrender.com/api/dashboards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(" DASHBOARDS API RESPONSE:", res.data);

      //  API returns array
      setDashboards(res.data);
    } catch (error) {
      console.error(
        " API ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      setDashboards([]);
    }
  };

  // ================= AUTO OPEN =================
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setOpenDashboard(true);
    }
  }, [location]);

  return (
    <div className="w-[220px] h-screen bg-[#192A51] flex flex-col justify-between text-white fixed top-0 left-0">
      
      {/* ================= TOP ================= */}
      <div>

        {/* LOGO */}
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

        {/* ================= MENU ================= */}
        <div className="mt-[15px] px-3">

          {/* DASHBOARD */}
          <div
            onClick={() => setOpenDashboard(!openDashboard)}
            className={`relative flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px] transition-all duration-200
            ${
              openDashboard
                ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"
            }`}
          >
            <FaThLarge className="text-[15px]" />
            <span>Dashboard</span>

            <FaChevronDown
              className={`ml-auto text-[12px] transition-transform duration-300 ${
                openDashboard ? "rotate-180" : ""
              }`}
            />

            {openDashboard && (
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542] rounded" />
            )}
          </div>

          {/* ================= SUBMENU ================= */}
          {openDashboard && (
            <div className="pl-[35px] mt-[5px]">

              {dashboards.length > 0 ? (
                dashboards.map((item) => (
                  <NavLink
                    key={item.id}
                    to={`/dashboard/${item.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-2 text-[13px] transition-all ${
                        isActive
                          ? "text-white font-medium"
                          : "text-slate-300 hover:text-white"
                      }`
                    }
                  >
                    {/*  IMAGE OR ICON */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[36px] h-[36px] rounded-lg object-cover shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <FaThLarge />
                    )}

                    <span>{item.name}</span>
                  </NavLink>
                ))
              ) : (
                <p className="text-xs text-gray-400">
                  No dashboards found
                </p>
              )}

            </div>
          )}

          {/* USERS LOG */}
          <NavLink
            to="/users-log"
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

      {/* ================= LOGOUT ================= */}
      <div className="p-[15px]">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full bg-[#2a4270] hover:bg-[#3b5a91] transition-all duration-200 transform hover:-translate-y-[2px] text-gray-200 flex items-center justify-center gap-2 py-3 rounded-[10px]"
        >
          <FaSignOutAlt className="text-[13px]" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
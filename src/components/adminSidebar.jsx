import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";
import {
  FaThLarge,
  FaSignOutAlt,
  FaBullhorn,
  FaUsers,
  FaHome,
  FaDatabase,
  FaChartLine,   // ✅ added
  FaBox,         // ✅ added
  FaBug          // ✅ added
} from "react-icons/fa";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openHome, setOpenHome] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dashboards = [
    { id: "sales", name: "Sales Performance" },
    { id: "customer", name: "Customer Insights" },
    { id: "supply", name: "Supply Chain" },
    { id: "marketing", name: "Marketing ROI" },
    { id: "executive", name: "Executive Summary" },
    { id: "qa", name: "QA and Stability" }
  ];

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setOpenDashboard(true);
    }
  }, [location]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/manage-users") ||
      location.pathname.startsWith("/dashboard-selection") ||
      location.pathname.startsWith("/data-schema") ||
      location.pathname.startsWith("/reports") ||
      location.pathname.startsWith("/userlogs")
    ) {
      setOpenHome(true);
    }
  }, [location]);

  // ✅ ICON FUNCTION (only addition)
  const getDashboardIcon = (id) => {
    switch (id) {
      case "sales":
        return <FaChartLine />;
      case "marketing":
        return <FaBullhorn />;
      case "customer":
        return <FaUsers />;
      case "supply":
        return <FaBox />;
      case "qa":
        return <FaBug />;
      default:
        return <FaThLarge />;
    }
  };

  return (
    <div className="w-[220px] h-screen bg-[#192A51] flex flex-col justify-between text-white fixed top-0 left-0">

      {/* TOP SECTION */}
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

        {/* DIVIDER */}
        <div className="h-[1px] bg-white/10 mx-[15px] my-[5px]" />

        {/* MENU */}
        <div className="mt-[15px] px-3">

          {/* HOME */}
          <div
            onClick={() => setOpenHome(!openHome)}
            className={`relative flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px]
            ${openHome
              ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
              : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
          >
            <FaHome />
            <span>Home</span>

            {openHome && (
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542]" />
            )}
          </div>

          {/* HOME SUBMENU */}
          {openHome && (
            <div className="pl-[35px] mt-[5px]">

              <NavLink to="/manage-users" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
              }>
                <FaUsers />
                <span>Manage Users</span>
              </NavLink>

              <NavLink to="/dashboard-selection" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
              }>
                <FaThLarge />
                <span>Dashboards</span>
              </NavLink>

              <NavLink to="/data-schema" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
              }>
                <FaDatabase />
                <span>Edit Data Schema</span>
              </NavLink>

              <NavLink to="/reports" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
              }>
                <FaBullhorn />
                <span>Reports</span>
              </NavLink>

            </div>
          )}

          {/* DASHBOARD */}
          <div
            onClick={() => setOpenDashboard(!openDashboard)}
            className={`relative flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px]
            ${openDashboard
              ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
              : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
          >
            <FaThLarge />
            <span>Dashboard</span>

            {openDashboard && (
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542]" />
            )}
          </div>

          {/* DASHBOARD SUBMENU */}
          {openDashboard && (
            <div className="pl-[35px] mt-[5px]">
              {dashboards.map((item) => (
                <NavLink
                  key={item.id}
                  to="/dashboard-selection"
                  state={{ selectedDashboard: item.id }}
                  className="flex items-center gap-2 py-2 text-[13px] text-slate-300 hover:text-white"
                >
                  {getDashboardIcon(item.id)}   {/* ✅ ONLY CHANGE */}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* USERS */}
          <NavLink
            to="/userlogs"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] text-[14px]
              ${isActive
                ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`
            }
          >
            <FaUsers />
            <span>Users</span>
          </NavLink>

          {/* DATA SCHEMA */}
          <NavLink
            to="/data-schema"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] text-[14px]
              ${isActive
                ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`
            }
          >
            <FaDatabase />
            <span>Data Schema</span>
          </NavLink>

        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-[15px]">
        <button
          onClick={() => navigate("/profile")}
          className="w-full bg-[#2a4270] hover:bg-[#3b5a91] flex items-center justify-center gap-2 py-3 rounded-[10px]"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
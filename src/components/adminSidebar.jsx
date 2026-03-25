import React, { useState, useEffect } from "react";
import logo from "../assets/images/zest.png";
import {
  FaThLarge,
  FaSignOutAlt,
  FaBullhorn,
  FaUsers,
  FaHome,
  FaDatabase,
  FaChartLine,
  FaBox,
  FaBug,
  FaChevronDown
} from "react-icons/fa";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import api from "../api/apiConfig";

const AdminSidebar = () => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openHome, setOpenHome] = useState(false);
  const [apiDashboards, setApiDashboards] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/admin-dashboard";
  const isReportsPage = location.pathname.startsWith("/reports");
  const isUsersPage = location.pathname.startsWith("/manage-users");
  const isDataSchemaPage = location.pathname.startsWith("/data-schema");

  const selectedDashboard = location.state?.selectedDashboard;

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

      <div>

        {/* LOGO */}
        <div className="flex items-center px-2 py-1">
          <img src={logo} alt="ZestBot" className="w-[85px] h-[85px] object-contain" />
          <h2 className="text-[30px] font-semibold ml-[-10px] tracking-[0.5px]">
            <span className="text-white">Zest</span>
            <span className="text-[#f4c542]">Bot</span>
          </h2>
        </div>

        <div className="h-[1px] bg-white/10 mx-[15px] my-[5px]" />

        <div className="mt-[15px] px-3">

          {/* HOME */}
          <div
            onClick={() => setOpenHome(!openHome)}
            className={`relative flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px]
            ${isHomePage
              ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
              : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
          >
            <FaHome />
            <span>Home</span>

            {isHomePage && (
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542]" />
            )}
          </div>

          {openHome && (
            <div className="pl-[35px] mt-[5px]">

              <NavLink to="/manage-users" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] transition-all duration-200 transform
                hover:scale-105 hover:translate-x-[5px]
                ${(isUsersPage || isActive)
                  ? "text-white font-semibold"
                  : "text-slate-300 hover:text-white"}`
              }>
                <FaUsers />
                <span>Manage Users</span>
              </NavLink>

              <NavLink to="/dashboard-selection" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] transition-all duration-200 transform
                hover:scale-105 hover:translate-x-[5px]
                ${isActive
                  ? "text-white font-semibold"
                  : "text-slate-300 hover:text-white"}`
              }>
                <FaThLarge />
                <span>Dashboards</span>
              </NavLink>

              <NavLink to="/data-schema" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] transition-all duration-200 transform
                hover:scale-105 hover:translate-x-[5px]
                ${(isDataSchemaPage || isActive)
                  ? "text-white font-semibold"
                  : "text-slate-300 hover:text-white"}`
              }>
                <FaDatabase />
                <span>Edit Data Schema</span>
              </NavLink>

              <NavLink to="/reports" className={({ isActive }) =>
                `flex items-center gap-2 py-2 text-[13px] transition-all duration-200 transform
                hover:scale-105 hover:translate-x-[5px]
                ${(isReportsPage || isActive)
                  ? "text-white font-semibold"
                  : "text-slate-300 hover:text-white"}`
              }>
                <FaBullhorn />
                <span>Reports</span>
              </NavLink>

            </div>
          )}

          {/* DASHBOARD */}
          <div
            onClick={() => navigate("/dashboard-selection")}
            className={`relative flex items-center justify-between px-4 py-3 mb-[10px] rounded-[30px] cursor-pointer text-[14px]
            ${isReportsPage
              ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
              : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
          >
            <div className="flex items-center gap-3">
              <FaThLarge />
              <span>Dashboard</span>
            </div>

            {/* ✅ FIXED DOWN ARROW */}
            <FaChevronDown
              onClick={async (e) => {
                e.stopPropagation();

                if (!openDashboard) {
                  try {
                    const response = await api.get("/api/dashboards");
                    setApiDashboards(response.data || []);
                  } catch (error) {
                    console.error("Error fetching dashboards", error);
                  }
                }

                setOpenDashboard(!openDashboard);
              }}
              className={`transition-transform duration-300 ${openDashboard ? "rotate-180" : ""}`}
            />

            {isReportsPage && (
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#f4c542]" />
            )}
          </div>

          {/* DASHBOARD SUBMENU */}
          {openDashboard && (
            <div className="pl-[35px] mt-[5px]">
              {apiDashboards.map((item) => (
                <NavLink
                  key={item.id}
                  to="/reports"
                  state={{ selectedDashboard: item.id }}
                  className={`flex items-start gap-2 py-2 text-[13px] leading-tight transition-all duration-200 transform
                    hover:scale-105 hover:translate-x-[5px]
                    ${selectedDashboard === item.id
                      ? "text-white font-semibold"
                      : "text-slate-300 hover:text-white"}`}
                >
                  <div className="mt-[2px]">
                    {getDashboardIcon(item.id)}
                  </div>

                  <span className="break-words whitespace-normal">
                    {item.name}
                  </span>
                </NavLink>
              ))}
            </div>
          )}

          {/* USERS */}
          <NavLink
            to="/manage-users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] text-[14px]
              ${(isUsersPage || isActive)
                ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
          >
            <FaUsers />
            <span>Users</span>
          </NavLink>

          {/* DATA SCHEMA */}
          <NavLink
            to="/data-schema"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-[10px] rounded-[30px] text-[14px]
              ${(isDataSchemaPage || isActive)
                ? "bg-gradient-to-r from-[#e2e8f0] to-[#cfd6e2] text-[#1e293b] font-semibold shadow-md translate-x-[5px]"
                : "text-slate-300 hover:bg-white/10 hover:translate-x-[3px]"}`}
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
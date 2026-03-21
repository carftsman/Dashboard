import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUsers, FaDatabase } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FiUser, FiCheckCircle } from "react-icons/fi";

/* ---------------- Icons ---------------- */

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L6 6V11C6 14.5 8.5 17.5 12 19C15.5 17.5 18 14.5 18 11V6L12 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="11" r="2" stroke="white" strokeWidth="2"/>
    <path d="M9 15C10 16 11 16.5 12 16.5C13 16.5 14 16 15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5V3H9" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

/* ---------------- Sidebar ---------------- */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-[230px] h-screen bg-[#1e1b4b] text-white flex flex-col justify-between p-5 flex-shrink-0 max-md:w-[70px] max-md:p-[10px]">
      <div>
        <div className="flex gap-2.5 items-center">
          <div className="bg-white/10 p-2.5 rounded-xl">
            <ShieldIcon />
          </div>

          <div className="flex flex-col gap-[2px] max-md:hidden">
            <h2 className="text-[14px] leading-[1.2]">Admin Panel</h2>
            <p className="text-[11px] text-gray-400 leading-[1.2]">
              System Management
            </p>
          </div>
        </div>

        <ul className="mt-5">
          <li
            className={`flex items-center gap-2.5 p-2.5 text-[13px] rounded-lg cursor-pointer ${
              location.pathname === "/"
                ? "bg-[#2f2b73] text-white"
                : "text-indigo-200 hover:bg-[#2a2768] hover:text-white"
            } max-md:justify-center`}
            onClick={() => navigate("/")}
          >
            <MdDashboard /> Overview
          </li>

          <li
            className={`flex items-center gap-2.5 p-2.5 text-[13px] rounded-lg cursor-pointer ${
              location.pathname === "/manage-users"
                ? "bg-[#2f2b73] text-white"
                : "text-indigo-200 hover:bg-[#2a2768] hover:text-white"
            } max-md:justify-center`}
            onClick={() => navigate("/manage-users")}
          >
            <FaUsers /> Manage Users
          </li>

          <li
            className={`flex items-center gap-2.5 p-2.5 text-[13px] rounded-lg cursor-pointer ${
              location.pathname === "/dashboard-selection"
                ? "bg-[#2f2b73] text-white"
                : "text-indigo-200 hover:bg-[#2a2768] hover:text-white"
            } max-md:justify-center`}
            onClick={() => navigate("/dashboard-selection")}
          >
            <MdDashboard /> Dashboards
          </li>

          <li
            className={`flex items-center gap-2.5 p-2.5 text-[13px] rounded-lg cursor-pointer ${
              location.pathname === "/data-schema"
                ? "bg-[#2f2b73] text-white"
                : "text-indigo-200 hover:bg-[#2a2768] hover:text-white"
            } max-md:justify-center`}
            onClick={() => navigate("/data-schema")}
          >
            <FaDatabase /> Edit Data Schema
          </li>

          <li
            className={`flex items-center gap-2.5 p-2.5 text-[13px] rounded-lg cursor-pointer ${
              location.pathname === "/reports"
                ? "bg-[#2f2b73] text-white"
                : "text-indigo-200 hover:bg-[#2a2768] hover:text-white"
            } max-md:justify-center`}
            onClick={() => navigate("/reports")}
          >
            <HiDocumentReport /> Reports
          </li>
        </ul>
      </div>

      <div className="border-t border-white/10 pt-2.5">
        <button className="flex items-center gap-2.5 text-indigo-200 cursor-pointer">
          <LogoutIcon /> Logout
        </button>
      </div>
    </div>
  );
}

/* ---------------- Topbar ---------------- */
function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="h-[60px] bg-white flex justify-between items-center px-5 border-b border-[#eee]">
      <h1 className="text-[20px] max-md:text-[16px]">
        Dashboard Overview
      </h1>

      <div
        onClick={() => navigate("/profile")}
        className="w-[35px] h-[35px] bg-[#eee] rounded-full flex items-center justify-center cursor-pointer"
      >
        <FiUser />
      </div>
    </div>
  );
}

/* ---------------- Card ---------------- */
function Card({ title, description, icon, stats, onClick, extra, tags }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#eee] rounded-xl p-4 min-h-[190px] max-h-[220px] flex flex-col justify-between cursor-pointer transition overflow-hidden hover:shadow-md"
    >
      <div className="flex justify-between items-center">
        <div className="bg-indigo-100 p-2 rounded-[10px] text-[#1e1b4b]">
          {icon}
        </div>
        <span>→</span>
      </div>

      <div className="mt-1.5 flex flex-col flex-1">
        <h3>{title}</h3>

        <p className="text-[11px] text-gray-500 leading-[1.4] h-[48px] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
          {description}
        </p>
      </div>

      {extra && <div className="mt-1.5">{extra}</div>}

      {tags && <div className="flex gap-1.5 mt-1">{tags}</div>}

      {stats && (
  <div className="mt-2 flex items-center gap-3 text-[11px]">
    <span className="text-gray-400 flex items-center gap-1">
      {stats.total}
    </span>
    <span className="text-emerald-500 flex items-center gap-1">
      {stats.new}
    </span>
  </div>
)}
    </div>
  );
}

/* ---------------- Main ---------------- */
function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden max-w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col px-6 py-5 overflow-hidden max-md:px-4 max-md:py-4">
          <p className="text-gray-500 mb-2.5 text-[13px]">
            Welcome back, Administrator. Select a module below to begin managing your system.
          </p>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-5 mt-2.5">

            {/* Manage Users */}
            <Card
              icon={<FaUsers />}
              title="Manage Users"
              description="Complete control over user authentication, access levels, and organizational hierarchy. Review active sessions and audit user activities across the platform.Monitor active sessions, manage permissions, and audit user activity across the entire platform to ensure security and compliance."
              stats={{
                total: (
                  <>
                    <FiCheckCircle className="mr-1" /> 2,401 Total
                  </>
                ),
                new: (
                  <>
                    <span>↗</span> 12 New today
                  </>
                ),
              }}
              onClick={() => navigate("/manage-users")}
            />

            {/* Dashboards */}
            <Card
              icon={<MdDashboard />}
              title="Dashboards"
              description="Visualize real-time system performance, user engagement metrics, and operational KPIs.Customize your view with modular widgets, interactive charts, and automated data refresh cycles for better decision-making."
              extra={
                <div className="mt-1.5">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-[#1e1b4b]" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    SYSTEM HEALTH: OPTIMAL
                  </p>
                </div>
              }
              onClick={() => navigate("/dashboard-selection")}
            />

            {/* Data Schema */}
            <Card
              icon={<FaDatabase />}
              title="Edit Data Schema"
              description="Modify core database structures, define new entity relations, and manage global metadata configurations.Ensure data consistency and integrity through structured validation rules and flexible schema controls."
              tags={
                <>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-[3px] rounded-md">SQL</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-[3px] rounded-md">NoSQL</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-[3px] rounded-md">GraphQL</span>
                </>
              }
              onClick={() => navigate("/data-schema")}
            />

            {/* Reports */}
            <Card
              icon={<HiDocumentReport />}
              title="Reports"
              description="Generate comprehensive PDF and CSV exports for stakeholder review.Schedule automated report generation, track historical data, and configure alerts for critical insights and anomalies."
              extra={
                <div className="mt-2">
                  <span className="text-[12px] text-slate-400 leading-4">
                    Last generated 2 hours ago
                  </span>
                </div>
              }
              onClick={() => navigate("/reports")}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
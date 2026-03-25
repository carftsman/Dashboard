import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaDatabase } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import AdminSidebar from "../../components/adminSidebar";

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
function Card({ title, description, icon, onClick }) {
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
    </div>
  );
}

/* ---------------- Main ---------------- */
function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden max-w-full">

      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden ml-[220px]">
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
              onClick={() => navigate("/manage-users")}
            />

            {/* Dashboards */}
            <Card
              icon={<MdDashboard />}
              title="Dashboards"
              description="Visualize real-time system performance, user engagement metrics, and operational KPIs.Customize your view with modular widgets, interactive charts, and automated data refresh cycles for better decision-making."
              onClick={() => navigate("/dashboard-selection")}
            />

            {/* Data Schema */}
            <Card
              icon={<FaDatabase />}
              title="Edit Data Schema"
              description="Modify core database structures, define new entity relations, and manage global metadata configurations.Ensure data consistency and integrity through structured validation rules and flexible schema controls."
              onClick={() => navigate("/data-schema")}
            />

            {/* Reports */}
            <Card
              icon={<HiDocumentReport />}
              title="Reports"
              description="Generate comprehensive PDF and CSV exports for stakeholder review.Schedule automated report generation, track historical data, and configure alerts for critical insights and anomalies."
              onClick={() => navigate("/reports")}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import AdminSidebar from "../../components/AdminSidebar";
import { useLocation } from "react-router-dom";

/* Top navigation bar (header) */
function Topbar() {
  const navigate = useNavigate(); // used for navigation

  return (
    <div className="h-[60px] bg-white flex justify-between items-center px-5 border-b border-[#eee]">
      
      {/* Page title */}
      <h1 className="text-[20px] max-md:text-[16px]">
        Dashboard Overview
      </h1>

      {/* Profile icon → navigates to profile page */}
      <div
        onClick={() => navigate("/profile")}
        className="w-[35px] h-[35px] bg-[#eee] rounded-full flex items-center justify-center cursor-pointer"
      >
        <FiUser />
      </div>
    </div>
  );
}


/* Reusable card component */
function Card({ title, description, icon, onClick, active }) {
  return (
    <div
      onClick={onClick} // runs when card is clicked
      className={`bg-white border border-[#eee] rounded-xl p-4 min-h-[190px] max-h-[220px] flex flex-col justify-between cursor-pointer transition overflow-hidden
      hover:shadow-md
      ${active ? "scale-105 shadow-xl" : ""}`} // highlight when active
    >
      {/* Top section (icon + arrow) */}
      <div className="flex justify-between items-center">
        <div className="bg-indigo-100 p-2 rounded-[10px] text-[#1e1b4b]">
          {icon}
        </div>
        <span>→</span>
      </div>

      {/* Content section */}
      <div className="mt-1.5 flex flex-col flex-1">
        <h3>{title}</h3>

        {/* Description (limited to 3 lines) */}
        <p className="text-[11px] text-gray-500 leading-[1.4] h-[48px] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
          {description}
        </p>
      </div>
    </div>
  );
}


/* Main dashboard page */
function AdminDashboard() {
  const navigate = useNavigate(); // navigation function
  const location = useLocation(); // get route data

  // get hovered item from previous page (if any)
  const hoveredItem = location.state?.hoveredItem;

  return (
    <div className="flex h-screen w-full overflow-hidden max-w-full">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen ml-[220px]">

        <Topbar />

        {/* Scrollable content */}
        <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto max-md:px-4 max-md:py-4">

          {/* Welcome text */}
          <p className="text-gray-500 mb-2.5 text-[13px]">
            Welcome back, Administrator. Select a module below to begin managing your system.
          </p>

          {/* Cards grid */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-5 mt-2.5">

            {/* Manage Users */}
            <Card
              icon={<FaUsers />}
              title="Manage Users"
              active={hoveredItem === "users"} // highlight if selected
              description="Complete control over user authentication, access levels, and organizational hierarchy. Review active sessions and audit user activities across the platform.Monitor active sessions, manage permissions, and audit user activity across the entire platform to ensure security and compliance."
              onClick={() => navigate("/manage-users")}
            />

            {/* Dashboards */}
            <Card
              icon={<MdDashboard />}
              title="Dashboards"
              active={hoveredItem === "dashboard"}
              description="Visualize real-time system performance, user engagement metrics, and operational KPIs.Customize your view with modular widgets, interactive charts, and automated data refresh cycles for better decision-making."
              onClick={() => navigate("/dashboard-selection")}
            />

            {/* Reports */}
            <Card
              icon={<HiDocumentReport />}
              title="Reports"
              active={hoveredItem === "reports"}
              description="Generate comprehensive PDF and CSV exports for stakeholder review.Schedule automated report generation, track historical data, and configure alerts for critical insights and anomalies."
              onClick={() => navigate("/reports/all")}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
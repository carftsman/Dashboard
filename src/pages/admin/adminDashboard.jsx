import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import AdminSidebar from "../../components/AdminSidebar";
import { useLocation } from "react-router-dom";
import { FiUsers, FiGrid, FiFileText,FiCornerDownRight } from "react-icons/fi";

/* Top navigation bar (header) */
function Topbar() {
  const navigate = useNavigate(); 

  return (
    <div className="h-[60px] bg-white flex justify-between items-center px-5 border-b border-[#eee]">
      
      {/* Page title */}
      <h1 className="text-[18px] md:text-[20px] font-semibold text-gray-800 tracking-tight mt-5">
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
      onClick={onClick}
      className={`
        group relative
        bg-white
        border border-gray-200
        rounded-xl
        p-5
        flex flex-col justify-between
        cursor-pointer
        transition-all duration-300

        hover:shadow-xl hover:-translate-y-[3px]
        hover:border-transparent

        ${active ? "ring-2 ring-indigo-500 shadow-md" : ""}
      `}
    >
      {/* 🔥 Gradient Hover Layer */}
      <div className="
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-indigo-500/5 to-purple-500/5
        opacity-0 group-hover:opacity-100
        transition duration-300
      "></div>

      {/* TOP */}
      <div className="relative flex justify-between items-start z-10">

        {/* ICON */}
        <div className="
          w-[42px] h-[42px]
          flex items-center justify-center
          rounded-lg
          bg-indigo-100 text-indigo-600
          text-[18px]
          group-hover:scale-110
          transition
        ">
          {icon}
        </div>

        {/* ARROW */}
        <div className="
          w-[32px] h-[32px]
          flex items-center justify-center
          rounded-full
          bg-gray-100
          group-hover:bg-indigo-100
          transition
        ">
          <FiCornerDownRight className="
            text-gray-500 text-[16px]
            group-hover:text-indigo-600
            group-hover:translate-x-[3px]
            transition-all duration-200
          " />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative mt-4 z-10">

        <h3 className="text-[15px] font-semibold text-gray-800">
          {title}
        </h3>

        <p className="text-[12px] text-gray-500 mt-1 leading-relaxed line-clamp-3">
          {description}
        </p>

        
       
      </div>
    </div>
  );
}
  

/* Main dashboard page */
function AdminDashboard() {
  const navigate = useNavigate(); 
  const location = useLocation(); 

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
  icon={<FiUsers />}
  title="Manage Users"
  active={hoveredItem === "users"}
  description="Complete control over user authentication, access levels, and organizational hierarchy. Review active sessions and audit user activities across the platform.Monitor active sessions, manage permissions, and audit user activity across the entire platform to ensure security and compliance."
  onClick={() => navigate("/manage-users")}
/>

{/* Dashboards */}
<Card
  icon={<FiGrid />}
  title="Dashboards"
  active={hoveredItem === "dashboard"}
  description="Visualize real-time system performance, user engagement metrics, and operational KPIs.Customize your view with modular widgets, interactive charts, and automated data refresh cycles for better decision-making."
  onClick={() => navigate("/dashboard-selection")}
/>

{/* Reports */}
<Card
  icon={<FiFileText />}
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
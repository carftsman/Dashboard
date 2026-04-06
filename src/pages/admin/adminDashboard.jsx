import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import AdminSidebar from "../../components/AdminSidebar";
import { useLocation } from "react-router-dom";
import { FiUsers, FiGrid, FiFileText, FiCornerDownRight } from "react-icons/fi";
import api from "../../api/apiConfig";
 
/* Top navigation bar (header) */
function Topbar() {
  const navigate = useNavigate();
 
  const [user, setUser] = useState(null);
 
  // ✅ ADDED (only this line)
  const profileImage = localStorage.getItem("profileImage");
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };
 
    fetchUser();
  }, []);
 
  return (
    <div className="h-[60px] bg-white flex justify-between items-center px-5 border-b border-[#eee] shadow-sm">
      <h1 className="text-[18px] md:text-[20px] font-semibold text-gray-800 tracking-tight mt-5">
        Dashboard Overview
      </h1>
 
      <div
        onClick={() => navigate("/profile")}
        className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-sm active:scale-[0.98] ml:10"
      >
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-gray-800 group-hover:text-indigo-600 transition">
            {user?.name || "User"}
          </p>
 
          <span
            className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${
              user?.role === "ADMIN"
                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {user?.role || "..."}
          </span>
        </div>
 
        {/* ✅ UPDATED PROFILE IMAGE DISPLAY */}
        <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition">
          {profileImage ? (
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="text-indigo-600" />
          )}
        </div>
      </div>
    </div>
  );
}
 
/* Reusable card component */
function Card({ title, description, icon, onClick, active }) {
 
  const themes = {
    "Manage Users": "from-blue-100 to-indigo-200 text-blue-700",
    "Dashboards": "from-purple-100 to-pink-200 text-purple-700",
    "Reports": "from-green-100 to-emerald-200 text-green-700",
  };
 
  const theme = themes[title] || "from-gray-50 to-gray-100 text-gray-600";
 
  return (
    <div
      onClick={onClick}
      className={`
        group relative
        border border-gray-200
        rounded-xl
        p-5
        flex flex-col justify-between
        cursor-pointer
        transition-all duration-300
 
        bg-gradient-to-br ${theme.split(" ")[0]} ${theme.split(" ")[1]}
 
        hover:shadow-xl hover:-translate-y-[3px]
        hover:border-transparent
 
        ${active ? "ring-2 ring-indigo-500 shadow-md" : ""}
      `}
    >
      <div className="absolute inset-0 rounded-xl bg-white/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>
 
      <div className="relative flex justify-between items-start z-10">
 
        <div className={`
          w-[42px] h-[42px]
          flex items-center justify-center
          rounded-lg
          bg-white shadow-sm
          ${theme.split(" ")[2]}
          text-[18px]
          group-hover:scale-110
          transition
        `}>
          {icon}
        </div>
 
        <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white shadow-sm">
          <FiCornerDownRight className="text-gray-500 text-[16px] group-hover:translate-x-[3px] transition-all duration-200" />
        </div>
      </div>
 
      <div className="relative mt-4 z-10">
 
        <h3 className="text-[15px] font-semibold text-gray-800">
          {title}
        </h3>
 
        <p
          className="
            text-[12px] text-gray-600 mt-1 leading-relaxed
            line-clamp-2
            group-hover:line-clamp-none
            transition-all duration-300
          "
        >
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
 
  const hoveredItem = location.state?.hoveredItem;
 
  const [user, setUser] = useState(null);
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
 
    fetchUser();
  }, []);
 
  return (
    <div className="flex h-screen w-full overflow-hidden max-w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
 
      <div className="flex-1 flex flex-col h-screen ml-[220px]">
        <Topbar />
 
        <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto max-md:px-4 max-md:py-4">
          <div className="mb-4">
            <h2 className="text-[16px] font-semibold text-gray-800 mb-1">
              Welcome back,{" "}
              <span className="text-indigo-600 font-semibold">
                {user?.name || "User"}
              </span>
            </h2>
 
            <p className="text-gray-500 text-[13px]">
              Select a module below to begin managing your system.
            </p>
          </div>
 
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-5 mt-2.5">
 
            <Card
              icon={<FiUsers />}
              title="Manage Users"
              active={hoveredItem === "users"}
              description="Complete control over user authentication, access levels, and organizational hierarchy. Review active sessions and audit user activities across the platform. Monitor active sessions, manage permissions, and audit user activity across the entire platform to ensure security and compliance."
              onClick={() => navigate("/manage-users")}
            />
 
            <Card
              icon={<FiGrid />}
              title="Dashboards"
              active={hoveredItem === "dashboard"}
              description="Visualize real-time system performance, user engagement metrics, and operational KPIs. Customize your view with modular widgets, interactive charts, and automated data refresh cycles for better decision-making."
              onClick={() => navigate("/dashboard-selection")}
            />
 
            <Card
              icon={<FiFileText />}
              title="Reports"
              active={hoveredItem === "reports"}
              description="Generate comprehensive PDF and CSV exports for stakeholder review. Schedule automated report generation, track historical data, and configure alerts for critical insights and anomalies."
              onClick={() => navigate("/reports/all")}
            />
 
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default AdminDashboard;
 
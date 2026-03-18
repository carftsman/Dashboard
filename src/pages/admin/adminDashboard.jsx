import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/adminDashboard.css";
import { FaUsers, FaDatabase } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FiUser, FiCheckCircle } from "react-icons/fi"; // ✅ added here

/* ---------------- Icons ---------------- */

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3L6 6V11C6 14.5 8.5 17.5 12 19C15.5 17.5 18 14.5 18 11V6L12 3Z"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="2" stroke="white" strokeWidth="2" />
    <path
      d="M9 15C10 16 11 16.5 12 16.5C13 16.5 14 16 15 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5V3H9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M21 12H9" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/* ---------------- Sidebar ---------------- */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <div className="icon-box"><ShieldIcon /></div>
          <div>
            <h2>Admin Panel</h2>
            <p>System Management</p>
          </div>
        </div>

        <ul className="menu">
          <li className={location.pathname === "/" ? "active" : ""} onClick={() => navigate("/")}>
            <MdDashboard /> Overview
          </li>
          <li className={location.pathname === "/manage-users" ? "active" : ""} onClick={() => navigate("/manage-users")}>
            <FaUsers /> Manage Users
          </li>
          <li className={location.pathname === "/dashboard-selection" ? "active" : ""} onClick={() => navigate("/dashboard-selection")}>
            <MdDashboard /> Dashboards
          </li>
          <li className={location.pathname === "/data-schema" ? "active" : ""} onClick={() => navigate("/data-schema")}>
            <FaDatabase /> Edit Data Schema
          </li>
          <li className={location.pathname === "/reports" ? "active" : ""} onClick={() => navigate("/reports")}>
            <HiDocumentReport /> Reports
          </li>
        </ul>
      </div>

      <div className="logout">
        <button><LogoutIcon /> Logout</button>
      </div>
    </div>
  );
}

/* ---------------- Topbar ---------------- */
function Topbar() {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <h1>Dashboard Overview</h1>
      <div className="profile" onClick={() => navigate("/profile")}>
        <FiUser />
      </div>
    </div>
  );
}

/* ---------------- Card ---------------- */
function Card({ title, description, icon, stats, onClick, extra, tags }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-top">
        <div className="card-icon">{icon}</div>
        <span className="card-arrow">→</span>
      </div>

      <div className="card-body">
        <h3>{title}</h3>
        <p className="card-desc">{description}</p>
      </div>

      {(extra || tags) && <div className="card-divider" />}

      {extra && <div className="card-extra">{extra}</div>}
      {tags && <div className="card-tags">{tags}</div>}

      {stats && (
        <div className="card-footer">
          <span className="total">{stats.total}</span>
          <span className="new">{stats.new}</span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Main ---------------- */
function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <Topbar />

        <div className="content">
          <p className="welcome">
            Welcome back, Administrator. Select a module below to begin managing your system.
          </p>

          <div className="grid">

            {/* Manage Users */}
            <Card
              icon={<FaUsers />}
              title="Manage Users"
              description="Complete control over user authentication, access levels, and organizational hierarchy. Review active sessions and audit user activities across the platform."
              stats={{
                total: (
                  <>
                    <FiCheckCircle className="total-icon" /> 2,401 Total
                  </>
                ),
                new: (<><span className="trend">↗</span> 12 New today</>)
              }}
              onClick={() => navigate("/manage-users")}
            />

            {/* Dashboards */}
            <Card
              icon={<MdDashboard />}
              title="Dashboards"
              description="Visualize real-time system performance, user engagement metrics, and operational KPIs. Customize your view with modular widgets and automated data refresh cycles."
              extra={
                <div className="health">
                  <div className="bar">
                    <div className="fill"></div>
                  </div>
                  <p className="health-text">SYSTEM HEALTH: OPTIMAL</p>
                </div>
              }
              onClick={() => navigate("/dashboard-selection")}
            />

            {/* Data Schema */}
            <Card
              icon={<FaDatabase />}
              title="Edit Data Schema"
              description="Modify core database structures, define new entity relations, and manage global metadata configurations. Ensure data integrity through robust validation rules."
              tags={
                <>
                  <span>SQL</span>
                  <span>NoSQL</span>
                  <span>GraphQL</span>
                </>
              }
              onClick={() => navigate("/data-schema")}
            />

            {/* Reports */}
            <Card
              icon={<HiDocumentReport />}
              title="Reports"
              description="Generate comprehensive PDF and CSV exports for stakeholder review. Schedule automated weekly summaries and configure custom alert triggers for abnormal data patterns."
              extra={
                <div className="report-row">
                  <span>Last generated 2 hours ago</span>
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
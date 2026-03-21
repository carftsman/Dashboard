import React, { useState, useEffect } from "react";
import "../components/css/Sidebar.css";
import logo from "../assets/images/zest.png";
import {
  FaThLarge,
  FaUserClock,
  FaSignOutAlt,
  FaChevronDown,
  FaChartLine,
  FaUserTie,
  FaStore,
  FaUsers,
  FaMotorcycle
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
// import { Sidebar } from "lucide-react";

  const Sidebar = () => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const location = useLocation();

  // 🔥 API Call
  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const res = await axios.get(
        "https://dashboard-backend-cyrd.onrender.com/api/admin/get_dashboards"
      );

      setDashboards(res.data.data || []);
    } catch (error) {
      console.error("API ERROR:", error);
      setDashboards([]);
    }
  };

  // 🔥 Auto open submenu
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setOpenDashboard(true);
    }
  }, [location]);

  // 🔥 ICON MAPPING FUNCTION
  const getDashboardIcon = (category) => {
    switch (category) {
      case "SALES":
        return <FaChartLine />;
      case "FIELD_SALES":
        return <FaUserTie />;
      case "VENDOR":
        return <FaStore />;
      case "CUSTOMER":
        return <FaUsers />;
      case "RIDER":
        return <FaMotorcycle />;
      default:
        return <FaThLarge />;
    }
  };

  return (
    <div className="sidebar">
      <div>
        {/* Logo */}
        <div className="logo-section">
          <img src={logo} alt="ZestBot" className="logo" />
          <h2 className="brand">
            <span className="zest">Zest</span>
            <span className="bot">Bot</span>
          </h2>
        </div>

        <div className="divider"></div>

        <div className="menu">

          {/* Dashboard Parent */}
          <div
            className={`menu-item ${openDashboard ? "active" : ""}`}
            onClick={() => setOpenDashboard(!openDashboard)}
          >
            <FaThLarge className="icon" />
            <span>Dashboard</span>
            <FaChevronDown
              className={`arrow ${openDashboard ? "rotate" : ""}`}
            />
          </div>

          {/* 🔥 Dynamic Submenu with Icons */}
          {openDashboard && (
            <div className="submenu">
              {dashboards.length > 0 ? (
                dashboards.map((item) => (
                  <NavLink
                    key={item.dashboardId}
                    to={`/dashboard/${item.dashboardId}`}
                    className={({ isActive }) =>
                      `submenu-item ${isActive ? "sub-active" : ""}`
                    }
                  >
                    <span className="submenu-content">
                      {getDashboardIcon(item.category)}
                      {item.dashboardName}
                    </span>
                  </NavLink>
                ))
              ) : (
                <p style={{ color: "#ccc", fontSize: "12px" }}>
                  No dashboards found
                </p>
              )}
            </div>
          )}

          {/* Users Log */}
          <NavLink
            to="/users-log"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <FaUserClock className="icon" />
            <span>Users Log</span>
          </NavLink>

        </div>
      </div>

      {/* Logout */}
      <div className="logout-section">
        <button className="logout-btn">
          <FaSignOutAlt className="logout-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
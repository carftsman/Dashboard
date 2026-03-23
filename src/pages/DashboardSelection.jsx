import React, { useState } from "react";   
import "../assets/styles/DashboardSelection.css";
import {
  FaChartLine,
  FaUsers,
  FaBox,
  FaBullhorn,
  FaBug,
  FaThLarge,
  FaCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");   

  const cards = [
    { title: "Marketing ROI", icon: <FaBullhorn />, color: "#f5e6cc" },
    { title: "Customer Insights", icon: <FaUsers />, color: "#e6ecf5" },
    { title: "Supply Chain", icon: <FaBox />, color: "#dff5ee" },
    { title: "Sales Performance", icon: <FaChartLine />, color: "#f7e3db" },
    { title: "Executive Summary", image: true },
    { title: "QA & Stability", icon: <FaBug />, color: "#eee6f7" }
  ];

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">
          <span className="logo-icon">ZB</span> Zest<span>Bot</span>
        </h2>

        <ul>
          <li className="active">
            <FaThLarge className="menu-icon" /> Dashboards
          </li>
          <li>
            <FaCog className="menu-icon" /> Settings
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">

        {/* Header */}
        <div className="header-row">
          <div className="header-text">
            <h2>Select Dashboard</h2>
            <p>
              Choose a customized view to monitor your business metrics,
              track performance targets, or analyze deep insights.
            </p>
          </div>

         
          <div className="header-search">
            <input
              type="text"
              placeholder="Search"
              value={search}                        
              onChange={(e) => setSearch(e.target.value)}  
            />
          </div>
        </div>

        {/* Cards */}
        <div className="cards">
          {filteredCards.map((card, index) => (  
            <div className="card" key={index}>
              
              {card.image ? (
                <div className="card-image"></div>
              ) : (
                <div
                  className="icon-box"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
              )}

              <h4>{card.title}</h4>

              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/reports");
                }}
              >
                View Dashboard →
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
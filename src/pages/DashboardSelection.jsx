import React, { useState, useEffect } from "react";
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
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);

  const getIcon = (category) => {
    switch (category) {
      case "SALES":
        return <FaChartLine />;
      case "MARKETING":
        return <FaBullhorn />;
      case "CUSTOMER":
        return <FaUsers />;
      case "SUPPLY":
        return <FaBox />;
      case "QA":
        return <FaBug />;
      default:
        return <FaChartLine />;
    }
  };

  const getColor = (category) => {
    switch (category) {
      case "SALES":
        return "#f7e3db";
      case "MARKETING":
        return "#f5e6cc";
      case "CUSTOMER":
        return "#e6ecf5";
      case "SUPPLY":
        return "#dff5ee";
      case "QA":
        return "#eee6f7";
      default:
        return "#e6ecf5";
    }
  };

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const res = await axios.get(
          "https://dashboard-backend-cyrd.onrender.com/api/admin/get_dashboards"
        );

        if (res.data.success) {
          setCards(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      }
    };

    fetchDashboards();
  }, []);

  const filteredCards = cards.filter((card) =>
    card.dashboardName.toLowerCase().includes(search.toLowerCase())
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
          {filteredCards.map((card) => (
            <div className="card" key={card.dashboardId}>

              <div
                className="icon-box"
                style={{ backgroundColor: getColor(card.category) }}
              >
                {getIcon(card.category)}
              </div>

              <h4>{card.dashboardName}</h4>

              <p>
                {card.description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/reports", { state: card });
                }}
              >
                View Dashboard
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
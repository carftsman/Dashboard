import React, { useState, useEffect } from "react";
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
import { FiSearch } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

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

  // ✅ ENSURE ALL COLORS UNIQUE
  const getColor = (category) => {
  switch (category) {
    case "MARKETING":
      return "#f5e6e8"; // light pink
    case "SALES":
      return "#fde8d5"; // peach
    case "CUSTOMER":
      return "#d9f3ef"; // mint green
    case "SUPPLY":
      return "#e8eef7"; // light blue-gray
    case "QA":
      return "#efe6ff"; // lavender
    default:
      return "#f1f5f9";
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
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* Sidebar */}
      <Sidebar/>
      {/* <div className="w-56 bg-slate-900 text-white p-5">
        <h2 className="text-lg font-semibold mb-8 flex items-center">
          <span className="bg-indigo-600 px-2 py-1 rounded mr-2">ZB</span>
          Zest<span className="text-indigo-400">Bot</span>
        </h2>

        <ul className="space-y-2">
          <li className="flex items-center p-2 rounded bg-slate-800 cursor-pointer">
            <FaThLarge className="mr-2" /> Dashboards
          </li>
          <li className="flex items-center p-2 rounded hover:bg-slate-800 cursor-pointer">
            <FaCog className="mr-2" /> Settings
          </li>
        </ul>
      </div> */}

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          {/* LEFT */}
          <div>
            <h2 className="text-xl font-semibold">Select Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2 ml-1">
              Choose a customized view to monitor your business metrics,
              track performance targets, or analyze deep insights.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* ✅ SEARCH ICON PERFECT CENTER */}
            <div className="relative w-64">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-full bg-gray-100 shadow-sm outline-none text-sm"
              />
            </div>

            {/* ✅ PROFILE STRICTLY FIXED */}
            <div className="w-10 h-10 min-w-[40px] min-h-[40px]">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-full h-full rounded-full object-cover border"
              />
            </div>

          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">

          {filteredCards.map((card) => (
            <div
              key={card.dashboardId}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden 
                         transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              {/* TOP */}
              <div
                className="w-full h-32 flex items-center justify-center relative"
                style={{ backgroundColor: getColor(card.category) }}
              >
                <div className="text-3xl z-10">
                  {getIcon(card.category)}
                </div>

                {/* DESCRIPTION */}
                <div className="absolute bottom-4 left-1/2 w-[80%] 
                                -translate-x-1/2
                                bg-blue-100 text-gray-600 text-xs p-2 rounded-lg text-center
                                opacity-0 group-hover:opacity-100 transition duration-300">
                  {card.description}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h4 className="text-sm font-semibold mb-1">
                  {card.dashboardName}
                </h4>

                {/* ❌ NOT TO CHANGE — KEPT CENTER */}
                <div className="border-t border-gray-200 pt-3 flex items-center justify-center gap-2">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/reports", { state: card });
                    }}
                    className="text-blue-700 text-sm font-medium cursor-pointer"
                  >
                    View Dashboard
                  </p>

                  <span className="text-blue-700 text-lg">→</span>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;

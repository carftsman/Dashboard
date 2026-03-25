import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../components/Sidebar"; 

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://dashboard-backend-cyrd.onrender.com/api/dashboards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedData = res.data.map((item) => ({
          dashboardId: item.id,
          dashboardName: item.name,
          description: item.description,
          image: item.image,
          originalData: item,
        }));

        setCards(formattedData);

      } catch (error) {
        console.error("  API Error:", error.response || error.message);
      }
    };

    fetchDashboards();
  }, []);

  const filteredCards = cards.filter((card) =>
    card.dashboardName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      <Sidebar />

      <div className="flex-1 ml-[220px] p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-xl font-semibold">Select Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2 ml-1">
              Choose a customized view to monitor your business metrics,
              track performance targets, or analyze deep insights.
            </p>
          </div>

          <div className="flex items-center gap-4">

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

            {/* Profile ICON */}
            <div
              className="w-10 h-10 min-w-[40px] min-h-[40px] cursor-pointer flex items-center justify-center rounded-full bg-gray-200"
              onClick={() => navigate("/profile")}
            >
              <span className="text-gray-600 text-lg font-semibold">👤</span>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">

          {filteredCards.map((card) => (
            <div
              key={card.dashboardId}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden 
                         transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              <div className="w-full h-32 flex items-center justify-center bg-gray-50">
                {card.image && (
                  <img
                    src={card.image}
                    alt="dashboard"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              <div className="absolute top-0 left-0 w-full h-32 flex items-end justify-center pointer-events-none">
                <div className="mb-2 w-[80%] bg-blue-100 text-gray-600 text-xs p-2 rounded-lg text-center
                                opacity-0 group-hover:opacity-100 transition duration-300">
                  {card.description}
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-semibold mb-1">
                  {card.dashboardName}
                </h4>

                <div className="border-t border-gray-200 pt-3 flex items-center justify-center gap-2">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/reports", { state: card.originalData });
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
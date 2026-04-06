import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiUser, FiArrowRight, FiTrash2, FiEdit } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import api from '../api/apiConfig';

// IMPORT MODALS
import CreateDashboard from "../components/CreateDashboard";
import VisualizationModal from "../components/VisualizationModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);

  // MODAL STATES
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openVizModal, setOpenVizModal] = useState(false);
  const [createdDashboardId, setCreatedDashboardId] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();
  const [profile, setProfile] = useState(null);

  // BACK BUTTON PREVENTION
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  // FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("PROFILE API ERROR:", error.response || error.message);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // FETCH DASHBOARDS (SEARCH + LIST)
  const fetchData = async () => {
    try {
      if (search.trim() !== "") {
        const res = await api.get(`/api/search?q=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dashboards = res.data?.results?.dashboards || [];

        setCards(
          dashboards.map((item) => ({
            dashboardId: item.id,
            dashboardName: item.name,
            description: item.description || "",
            image: item.image || "",
            originalData: item,
          }))
        );
      } else {
        const res = await api.get("/api/dashboards");

        setCards(
          res.data
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              dashboardId: item.id,
              dashboardName: item.name,
              description: item.description,
              image: item.image,
              originalData: item,
            }))
        );
      }
    } catch (error) {
      console.error("API Error:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, token]);

  // DELETE HANDLER
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/dashboards/${id}`);
      toast.success("Dashboard deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">

        {/* Sidebar */}
        {role === "admin" && <AdminSidebar />}
        {role !== "admin" && <Sidebar />}

        <div className="flex-1 ml-[220px] px-6 py-5 overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Select Dashboard</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xl">
                Choose a customized view to monitor your business metrics,
                track performance targets, or analyze deep insights.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Profile Section */}
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{profile?.role}</span>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-64">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboards..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">

            {cards.map((card) => (
              <div
                key={card.dashboardId}
                className="group relative bg-white rounded-xl shadow border border-gray-100 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Admin Actions */}
                {role === "admin" && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(card.dashboardId);
                      }}
                      className="bg-white p-2 rounded shadow hover:bg-gray-50"
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                )}

                {/* Dashboard Image */}
                <div className="h-32 flex items-center justify-center bg-gray-50 relative">
                  {card.image && (
                    <img
                      src={card.image}
                      alt="dashboard"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                  {/* Hover Description Overlay */}
                  <div className="absolute inset-0 bg-blue-50/90 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-gray-600 text-center">{card.description}</p>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">{card.dashboardName}</h4>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/reports/${card.dashboardId}/${encodeURIComponent(card.dashboardName.trim())}`,
                        { state: { dashboardId: card.dashboardId } }
                      );
                    }}
                    className="text-indigo-600 text-sm font-medium cursor-pointer mt-2 flex items-center gap-1 hover:text-indigo-800"
                  >
                    View Dashboard
                    <FiArrowRight />
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Block - TRIGGER MODAL */}
            {role === "admin" && (
              <div
                onClick={() => setOpenCreateModal(true)}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300
                           rounded-xl bg-gray-50 cursor-pointer hover:shadow-md hover:-translate-y-1
                           transition duration-300 h-[220px]"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mb-2">
                  <FiPlus className="text-[20px]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-700">Create New</h4>
                <p className="text-xs text-gray-400 text-center mt-1 px-3">
                  Start from a template or a blank canvas
                </p>
              </div>
            )}

          </div>
        </div>

        {/* MODALS */}
        <CreateDashboard
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          token={token}
          onSuccess={(dashboardId) => {
            setCreatedDashboardId(dashboardId);
            setOpenCreateModal(false);
            setOpenVizModal(true);
          }}
        />

        <VisualizationModal
          isOpen={openVizModal}
          onClose={() => {
            setOpenVizModal(false);
            window.location.reload();
          }}
          dashboardId={createdDashboardId}
          token={token}
        />
      </div>
    </>
  );
}

export default Dashboard;
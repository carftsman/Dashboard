import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiUser, FiArrowRight, FiTrash2 } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import api from '../api/apiConfig';

import CreateDashboard from "../components/CreateDashboard";
import VisualizationModal from "../components/VisualizationModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardSelection() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const token = localStorage.getItem("token");

  const profileImage = localStorage.getItem("profileImage");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openVizModal, setOpenVizModal] = useState(false);
  const [createdDashboardId, setCreatedDashboardId] = useState(null);

  const role = localStorage.getItem("role")?.toLowerCase();

  const [profile, setProfile] = useState(null);

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

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }
}, [navigate]);

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

  useEffect(() => {
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
              description: "",
              image: "",
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

    fetchData();
  }, [search, token]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/dashboards/${id}`);
      toast.success("Dashboard deleted successfully");
      setCards((prev) => prev.filter((c) => c.dashboardId !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">

        {(role === "admin" || role === "super_admin") ? (
          <AdminSidebar />
        ) : (
          <Sidebar />
        )}

        <div className="flex-1 ml-[220px] px-6 py-5 overflow-y-auto">

          <div className="flex justify-between items-start mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Select Dashboard
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xl">
                Choose dashboards to monitor metrics and insights.
              </p>
            </div>

            <div className="flex items-center gap-4">


              <div className="relative w-64">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboards..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>

              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.name || "User"}
                  </span>

                  <span
                    className={`text-[10px] px-2 py-[2px] rounded-full w-fit
                      ${profile?.role === "ADMIN"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {profile?.role || "..."}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">

            {cards.map((card) => (
              <div
                key={card.dashboardId}
                className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200"
              >
                {/* Only show delete button if the user is an admin */}
                {role === "admin" && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(card.dashboardId);
                      }}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition"
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                )}

                {/* ... rest of your card code ... */}
                <div className="w-full h-32 flex items-center justify-center bg-gray-50">
                  {card.image && (
                    <img
                      src={card.image}
                      alt="dashboard"
                      className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="absolute top-0 left-0 w-full h-32 flex items-end justify-center pointer-events-none">
                  <div className="mb-2 w-[80%] bg-blue-100 text-gray-600 text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                    {card.description}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                    {card.dashboardName}
                  </h4>

                  <div className="border-t border-gray-200 pt-3 flex items-center justify-center gap-2">
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reports/${card.dashboardId}/${encodeURIComponent(card.dashboardName.trim())}`);
                      }}
                      className="text-indigo-600 text-sm font-medium cursor-pointer"
                    >
                      View Dashboard
                    </p>

                    <FiArrowRight className="text-indigo-600 text-lg" />
                  </div>
                </div>
              </div>
            ))}

            {role === "admin" && (
              <div
                onClick={() => setOpenCreateModal(true)}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 transition duration-300 h-[220px]"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mb-2">
                  <FiPlus className="text-[20px]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-700">
                  Create New
                </h4>
                <p className="text-xs text-gray-400 text-center mt-1 px-3">
                  Start from a template or blank canvas
                </p>
              </div>
            )}
          </div>
        </div>

        <CreateDashboard
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          token={token}
          onSuccess={(id) => {
            setCreatedDashboardId(id);
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

export default DashboardSelection;

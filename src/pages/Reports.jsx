import { useNavigate, useParams } from "react-router-dom";

import ReportTable from "../components/ReportTable";

import Sidebar from "../components/Sidebar";

import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

import api from '../api/apiConfig';
import { FiUser, FiCalendar, FiAlertCircle } from "react-icons/fi";

// IMPORT DATEPICKER
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Reports() {

  const navigate = useNavigate();

  const { dashboardName, dashboardId } = useParams();
  const [files, setFiles] = useState([]);

  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role");

  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const profileImage = localStorage.getItem("profileImage");
  const canUpload = role !== "ADMIN" && role !== "MANAGER" && role !== "SUPER_ADMIN";

  // STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");

  // DATE RANGE STATES
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await api.get(`/api/reports?dashboardId=${dashboardId}`);
        const formattedData = response.data.map((item) => ({

          id: item.id,

          name: item.name || item.fileName,

          createdAt: item.createdAt,

          fileUrl: item.fileUrl,
          dashboardName: item.dashboardName,
        }));
        setFiles(formattedData);
      } catch (error) {

        console.error("API error:", error.response || error.message);

      }

    };

    fetchData();

  }, [dashboardId]);
  useEffect(() => {
  setCurrentPage(1);
}, [search, startDate, endDate, selectedDashboard]);

  const filteredFiles = files.filter((item) => {

    const name = item.name?.toLowerCase() || "";

    const dashboard = item.dashboardName?.toLowerCase() || "";

    const searchValue = search.toLowerCase().trim();
    const matchesSearch = name.includes(searchValue) || dashboard.includes(searchValue);
    const matchesDashboard = !selectedDashboard || item.dashboardName === selectedDashboard;
    return matchesSearch && matchesDashboard;

  });

  const processedFiles = filteredFiles
    .filter((item) => {
      if (!startDate && !endDate) return true;
      const itemDate = new Date(item.createdAt);
      itemDate.setHours(0, 0, 0, 0);

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedFiles.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {role === "ADMIN" || role === "SUPER_ADMIN" ? <AdminSidebar /> : <Sidebar />}

      <div className="flex-1 flex flex-col ml-[220px]">

        {/* HEADER - UPDATED FOR WRAPPING */}
        <div className="bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm border-b sticky top-0 z-10">

          {/* TITLE SECTION */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-800 whitespace-normal break-words max-w-[450px] leading-tight">
              Reports Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">Browse, manage and export data summaries</p>
          </div>

          {/* SEARCH SECTION */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <input
              type="text"

              placeholder="Search reports..."

              value={search}

              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
</div>

          {/* ACTION/PROFILE SECTION */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {canUpload && (
              <button
                className="px-5 py-2.5 rounded-xl shadow-md bg-[#18154F] text-white cursor-pointer hover:bg-[#23206b] transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/upload-data", { state: { dashboardId } });
                }}
              >
                Upload Data
              </button>
            )}
            <div className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-gray-200 overflow-hidden" onClick={() => navigate("/profile")}>
              {profileImage ? <img src={profileImage} alt="profile" className="w-full h-full object-cover" /> : <FiUser className="text-gray-600 text-lg" />}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            {/* SUB-TITLE WRAPPING LOGIC */}
            <div className="flex flex-wrap items-start justify-between mb-5 gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 whitespace-normal break-words max-w-[500px] leading-snug">
                  {dashboardName ? decodeURIComponent(dashboardName) : "Dashboard"} Reports
                </h2>
              </div>

              <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:border-indigo-300 transition">
                  <FiCalendar className="text-gray-400 text-sm" />
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      const [start, end] = update;
                      setStartDate(start);
                      setEndDate(end);
                      setCurrentPage(1);
                    }}
                    isClearable={true}
                    placeholderText="Select Date Range"
                    className="bg-transparent outline-none text-sm w-48 cursor-pointer"
                    maxDate={new Date()}
                  />
                </div>

                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm hover:border-[#18154F] transition-all duration-200">
                  <FiAlertCircle size={16} className="text-gray-400" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                  <button onClick={() => navigate(`/dataschema/${dashboardId}`)} className="bg-[#18154F] text-white px-5 py-2 rounded-xl shadow hover:bg-[#23206b] transition font-medium">
                    Edit Schema
                  </button>
                )}
              </div>
            </div>

            <ReportTable formattedData={currentItems} role={role} selectedDashboard={selectedDashboard} setSelectedDashboard={setSelectedDashboard} />

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition">Prev</button>
              <span className="text-sm text-gray-600 font-medium">Page {currentPage} of {totalPages || 1}</span>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
 
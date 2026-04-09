import { useNavigate, useParams } from "react-router-dom";

import ReportTable from "../components/ReportTable";

import Sidebar from "../components/Sidebar";

import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

import api from '../api/apiConfig';

import { FiUser, FiCalendar, FiAlertCircle } from "react-icons/fi";

export default function Reports() {

  const navigate = useNavigate();

  const { dashboardName, dashboardId } = useParams();

  console.log("dashboardId", dashboardId);

  const [files, setFiles] = useState([]);

  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const profileImage = localStorage.getItem("profileImage");
 
  //  UPDATED RBAC (ONLY ADMIN & MANAGER RESTRICTED)

  const canUpload = role !== "ADMIN" && role !== "MANAGER";

  // STATES

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage] = useState(5);

  const [sortOrder, setSortOrder] = useState("desc");

  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await api.get(`/api/reports?dashboardId=${dashboardId}`);

        const formattedData = response.data.map((item) => ({

          id: item.id,

          name: item.name || item.fileName,

          createdAt: item.createdAt,

          fileUrl: item.fileUrl,

        }));

        setFiles(formattedData);

      } catch (error) {

        console.error("API error:", error.response || error.message);

      }

    };

    fetchData();

  }, [dashboardId]);

  const filteredFiles = files.filter((item) => {

    const name = item.name?.toLowerCase() || "";

    const dashboard = item.dashboardName?.toLowerCase() || "";

    const searchValue = search.toLowerCase().trim();

    const matchesSearch =

      name.includes(searchValue) || dashboard.includes(searchValue);

    const matchesDashboard =

      !selectedDashboard || item.dashboardName === selectedDashboard;

    return matchesSearch && matchesDashboard;

  });

  // FILTER + SORT

  const processedFiles = filteredFiles

    .filter((item) => {

      const matchesDate = filterDate

        ? new Date(item.createdAt).toLocaleDateString() ===

          new Date(filterDate).toLocaleDateString()

        : true;

      return matchesDate;

    })

    .sort((a, b) => {

      const dateA = new Date(a.createdAt);

      const dateB = new Date(b.createdAt);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;

    });

  // PAGINATION

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = processedFiles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(processedFiles.length / itemsPerPage);

  return (
<div className="flex min-h-screen bg-gray-100">

      {role === "ADMIN" ? <AdminSidebar /> : <Sidebar />}
<div className="flex-1 flex flex-col ml-[220px]">

        {/* HEADER */}
<div className="bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm border-b sticky top-0 z-10">
<div>
<h1 className="text-xl font-semibold">Reports Management</h1>
<p className="text-gray-500 text-sm">

              Browse, manage and export data summaries
</p>
</div>

          {/* SEARCH */}
<div className="w-full lg:w-1/3">
<input

              type="text"

              placeholder="Search reports..."

              value={search}

              onChange={(e) => setSearch(e.target.value)}

              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"

            />
</div>

          {/* RIGHT */}
<div className="flex items-center gap-4">

            {/*  Upload button visible only for allowed roles */}

            {canUpload && (
<button

                className="px-5 py-2.5 rounded-xl shadow-md bg-[#18154F] text-white cursor-pointer"

                onClick={(e) => {

                  e.stopPropagation();

                  navigate("/upload-data", { state: { dashboardId } });

                }}
>

                Upload Data
</button>

            )}
<div

              className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-gray-200"

              onClick={() => navigate("/profile")}
>

              {profileImage ? (
<img

                  src={profileImage}

                  alt="profile"

                  className="w-full h-full object-cover rounded-full"

                />

              ) : (
<FiUser className="text-gray-600 text-lg" />

              )}
</div>
</div>
</div>

        {/* CONTENT */}
<div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            {/* TOP ROW */}
<div className="flex flex-wrap items-center justify-between mb-5 gap-4">
<h2 className="text-xl font-semibold text-gray-800">

                {dashboardName ? decodeURIComponent(dashboardName) : "Dashboard"} Reports
</h2>
<div className="flex items-center gap-3 flex-wrap">

                {/* DATE */}
<div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:border-indigo-300 transition">
<FiCalendar className="text-gray-400 text-sm" />
<input

                    type="date"

                    value={filterDate}

                    onChange={(e) => {

                      setFilterDate(e.target.value);

                      setCurrentPage(1);

                    }}

                    className="bg-transparent outline-none text-sm"

                  />
</div>
<div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm hover:border-[#18154F] focus-within:border-[#18154F] transition-all duration-200">
<FiAlertCircle

                    size={16}

                    className="text-gray-400 group-hover:text-[#18154F]"

                  />
<select

                    value={sortOrder}

                    onChange={(e) => setSortOrder(e.target.value)}

                    className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
>
<option value="desc">Newest First</option>
<option value="asc">Oldest First</option>
</select>
</div>

                {/* EDIT */}

                {role === "ADMIN" && (
<button

                    onClick={() => navigate(`/dataschema/${dashboardId}`)}

                    className="bg-[#18154F] text-white px-4 py-2 rounded-xl shadow hover:bg-[#23206b] hover:scale-105 transition"
>

                    Edit Schema
</button>

                )}
</div>
</div>

            {/* TABLE */}
<ReportTable

              formattedData={currentItems}

              role={role}

              selectedDashboard={selectedDashboard}

              setSelectedDashboard={setSelectedDashboard}

            />

            {/* PAGINATION */}
<div className="flex justify-between items-center mt-6">
<button

                disabled={currentPage === 1}

                onClick={() => setCurrentPage((prev) => prev - 1)}

                className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
>

                Prev
</button>
<span className="text-sm text-gray-600">

                Page {currentPage} of {totalPages}
</span>
<button

                disabled={currentPage === totalPages}

                onClick={() => setCurrentPage((prev) => prev + 1)}

                className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
>

                Next
</button>
</div>
</div>
</div>
</div>
</div>

  );

}
 
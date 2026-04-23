import { useNavigate, useParams } from "react-router-dom";
import ReportTable from "../components/ReportTable";
import { useEffect, useState } from "react";
import api from '../api/apiConfig';
import AdminSidebar from "../components/AdminSidebar";
import { FiUser, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Reports() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteId, setDeleteId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 🔥 PAGINATION STATES (ADDED)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/reports/all`);
      const formattedData = response.data.map((item) => ({
        id: item.reportId,
        name: item.reportName || item.fileName,
        generatedAt: item.generatedAt,
        fileUrl: item.fileUrl,
        dashboardName: item.dashboardName
      }));
      setFiles(formattedData);
    } catch (error) {
      console.error("API error:", error.response || error.message);
    }
  };

  // 🔥 FILTER (UNCHANGED LOGIC)
  const processedFiles = files.filter((item) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      item.name?.toLowerCase().includes(searchValue) ||
      item.dashboardName?.toLowerCase().includes(searchValue) ||
      item.fileUrl?.toLowerCase().includes(searchValue);

    if (!startDate && !endDate) return matchesSearch;

    const itemDate = new Date(item.generatedAt);
    itemDate.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return matchesSearch && itemDate >= start && itemDate <= end;
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      return matchesSearch && itemDate >= start;
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      return matchesSearch && itemDate <= end;
    }

    return matchesSearch;
  })

  .sort((a, b) => {
    const dateA = new Date(a.generatedAt);
    const dateB = new Date(b.generatedAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // 🔥 PAGINATION LOGIC (ADDED)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedFiles.length / itemsPerPage);

  // 🔥 RESET PAGE ON FILTER CHANGE (ADDED)
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate]);

  return (
    <>
      <AdminSidebar />
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col ml-[220px]">

          {/* HEADER */}
          <div className="bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm border-b">

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800 whitespace-normal break-words max-w-[400px] leading-tight">
                Reports
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Browse and export data summaries
              </p>
            </div>

            {/* SEARCH */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-10 h-10 min-w-[40px] min-h-[40px] cursor-pointer flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => navigate("/profile")}
              >
                <span className="text-gray-600 text-lg">
                  <FiUser />
                </span>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Reports
                </h2>

                {/* DATE FILTER */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 hover:border-blue-300 transition shadow-sm">
                  <FiCalendar className="text-gray-400 text-sm" />
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      const [start, end] = update;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    isClearable={true}
                    placeholderText="Filter by date range"
                    className="bg-transparent outline-none text-sm w-44 cursor-pointer"
                    maxDate={new Date()}
                  />
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              <ReportTable
                formattedData={currentItems.map(file => ({
                  ...file,
                  createdAt: file.generatedAt
                }))}
                role={role}
              />

            
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition"
                >
                  Next
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
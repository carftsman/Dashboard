import { useNavigate } from "react-router-dom";
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

  // DATE RANGE STATES
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const processedFiles = files.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const dashboard = item.dashboardName?.toLowerCase() || "";
    const searchValue = search.toLowerCase().trim();
    const matchesSearch = name.includes(searchValue) || dashboard.includes(searchValue);

    let matchesDate = true;
    if (startDate || endDate) {
      const itemDate = new Date(item.generatedAt);
      itemDate.setHours(0, 0, 0, 0);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      if (start && end) {
        matchesDate = itemDate >= start && itemDate <= end;
      } else if (start) {
        matchesDate = itemDate >= start;
      } else if (end) {
        matchesDate = itemDate <= end;
      }
    }
    return matchesSearch && matchesDate;
  });

  return (
    <>
      <AdminSidebar />
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col ml-[220px]">
          
          {/* HEADER SECTION - UPDATED FOR TEXT WRAPPING */}
          <div className="bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm border-b">
            
            {/* LEFT: TITLE CONTAINER */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800 whitespace-normal break-words max-w-[400px] leading-tight">
                {/* Long names will now wrap to 2 lines instead of pushing components */}
                Field Sales Executive Performance Dashboard Reports
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Browse, manage and export data summaries
              </p>
            </div>

            {/* MIDDLE: SEARCH BAR */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* RIGHT: PROFILE ICON */}
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

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Reports
                </h2>

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
                  />
                </div>
              </div>

              <ReportTable 
                formattedData={processedFiles.map(file => ({
                  ...file,
                  createdAt: file.generatedAt
                }))} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
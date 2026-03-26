import { useNavigate, useParams } from "react-router-dom";
import ReportTable from "../components/ReportTable";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import AdminSidebar from "../components/adminSidebar";
import api from '../api/apiConfig';

export default function Reports() {
  const navigate = useNavigate();
  const { dashboardName, dashboardId } = useParams();

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
const role = localStorage.getItem("role"); // get role
const [selectedDashboard, setSelectedDashboard] = useState(null);
  useEffect(() => {
     const fetchData = async () => {
    try {
      const response = await api.get(`/api/reports?dashboardId=${dashboardId}`);

      console.log(response);
      
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

  return (
    <div className="flex min-h-screen bg-gray-100">


     {role === "ADMIN" ? <AdminSidebar /> : <Sidebar />}

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col ml-[220px]">

        {/* HEADER */}
        <div className="bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm border-b">

          {/* LEFT */}
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-between lg:justify-end gap-4">

            <button className="bg-[#2B3F8F] hover:bg-[#1f2f6b] text-white px-5 py-2 rounded-lg transition">
              Upload Data
            </button>

            <div className="flex items-center gap-3">
                <div
              className="w-10 h-10 min-w-[40px] min-h-[40px] cursor-pointer flex items-center justify-center rounded-full bg-gray-200"
              onClick={() => navigate("/profile")}
            >
              <span className="text-gray-600 text-lg font-semibold">👤</span>
            </div>
            </div>

          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-lg font-semibold mb-1">
               {dashboardName ? decodeURIComponent(dashboardName) : "Dashboard"} Reports
            </h2>

            

            {role === "ADMIN" && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => navigate(`/dataschema/${dashboardId}`)}>
              Edit Schema
            </button>
          )}

            {/* TABLE */}
            <ReportTable
  formattedData={filteredFiles}
  role={role}
  selectedDashboard={selectedDashboard}
  setSelectedDashboard={setSelectedDashboard}
/>
            

          </div>

        </div>
      </div>
    </div>
  );
}
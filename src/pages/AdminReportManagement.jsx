import { useNavigate} from "react-router-dom";
import ReportTable from "../components/ReportTable";
import { useEffect, useState } from "react";

import api from '../api/apiConfig';
import AdminSidebar from "../components/AdminSidebar";

export default function Reports() {
    const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
const role = localStorage.getItem("role"); // get role
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/reports/all`);
      console.log(response);
      
      const formattedData = response.data.map((item) => ({
        id: item.reportId,
        name: item.reportName || item.fileName,
        createdAt: new Date(item.generatedAt).toLocaleDateString(),
        fileUrl: item.fileUrl,
        dashboardName:item.dashboardName
      }));

      setFiles(formattedData);

    } catch (error) {
      console.error("API error:", error.response || error.message);
    }
  };

  /* SEARCH FILTER */
  const filteredFiles = files.filter((item) => {
  const name = item.name?.toLowerCase() || "";
  const dashboard = item.dashboardName?.toLowerCase() || "";
  const searchValue = search.toLowerCase().trim();

  return name.includes(searchValue) || dashboard.includes(searchValue);
});

  return (
   <>
        <AdminSidebar/>
         <div className="flex min-h-screen bg-gray-100">

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
            <div className="flex items-center gap-3">
                <div
              className="w-10 h-10 min-w-[40px] min-h-[40px] cursor-pointer flex items-center justify-center rounded-full bg-gray-200"
              onClick={() => navigate("/profile")}
            >
              <span className="text-gray-600 text-lg font-semibold">👤</span>
            </div>
            </div>

          {/* RIGHT */}
        
        </div>

        {/* CONTENT */}
        <div className="p-6">

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-lg font-semibold mb-1">
               ALL Reports
            </h2>

            

            {role === "ADMIN" && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Edit Schema
            </button>
          )}

            {/* TABLE */}
            <ReportTable formattedData={filteredFiles} />

          </div>

        </div>
      </div>
    </div>
   </>
  );
}
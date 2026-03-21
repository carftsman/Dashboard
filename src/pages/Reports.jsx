import { useParams } from "react-router-dom";
import reportsData from "../mockdata/reportsData";
import ReportTable from "../components/ReportTable";
import Sidebar from "../common/Sidebar";

export default function Reports() {
  const { type } = useParams();
  const reports = reportsData[type] || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm border-b">

          {/* Left */}
          <div>
            <h1 className="text-xl font-semibold">Reports Management</h1>
            <p className="text-gray-500 text-sm">
              Browse, manage and export data summaries
            </p>
          </div>

          {/* Center (Search) */}
          <div className="w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Right */}
          <div className="flex items-center justify-between lg:justify-end gap-4">

            <button className="bg-[#2B3F8F] hover:bg-[#1f2f6b] text-white px-5 py-2 rounded-lg transition">
              Upload Data
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">Alex Johnson</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full"
                alt="profile"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-lg font-semibold mb-1">
              {/* {type.charAt(0).toUpperCase() + type.slice(1)} Reports */}
              <h2 className="text-lg font-semibold mb-1">
  {type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "Reports"}
</h2>
            </h2>
            

            <p className="text-gray-500 text-sm mb-4">
              Browse, manage and export data summaries
            </p>

            {/* Table */}
            <ReportTable reports={reports} />
          </div>

        </div>
      </div>
    </div>
  );
}
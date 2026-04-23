import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FiUser,  FiCalendar } from "react-icons/fi";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const profileImage = localStorage.getItem("profileImage");
  const role = localStorage.getItem("role")?.toLowerCase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session expired. Please login again.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          `https://dashboard-backend-cyrd.onrender.com/api/logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const logsData = response.data.data || [];
        setLogs(logsData);

      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authorized to view logs");
        } else {
          setError("Failed to fetch logs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [navigate]);

  const filteredLogs = logs.filter((log) => {
    const searchValue = query.toLowerCase().trim();

    const matchesSearch =
      !query ||
      log.user?.toLowerCase().includes(searchValue) ||
      log.email?.toLowerCase().includes(searchValue);

    if (!startDate && !endDate) return matchesSearch;

    const logDate = new Date(log.time);
    logDate.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return matchesSearch && logDate >= start && logDate <= end;
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      return matchesSearch && logDate >= start;
    }

    return matchesSearch;
  });
  const sortedLogs = [...filteredLogs].sort((a, b) => {
  const dateA = new Date(a.time);
  const dateB = new Date(b.time);
  return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
});

 
  const itemsPerPage = 10;

  const paginatedLogs = sortedLogs.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);

  const filteredTotalPages =
    Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  useEffect(() => {
    setPage(1);
  }, [query, startDate, endDate]);

  const badgeClass = (action) => {
    switch (action) {
      case "LOGIN":
        return "bg-green-100 text-green-600";
      case "UPDATE":
        return "bg-orange-100 text-orange-600";
      case "DELETE":
        return "bg-red-100 text-red-600";
      case "EXPORT":
        return "bg-blue-100 text-blue-600";
      case "VIEW":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "-";

    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <p className="p-5">Loading...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {(role === "admin" || role === "super_admin") ? (
        <AdminSidebar />
      ) : (
        <Sidebar />
      )}

      <div className="flex-1 ml-[220px] flex flex-col">
        {/* Header */}
        <div className="h-[60px] bg-white flex items-center px-5 border-b border-[#eee]">
          <div
            className="ml-auto w-[40px] h-[40px] bg-[#eee] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
            onClick={() => navigate("/profile")}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FiUser />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-0 px-4 md:px-8 pb-4">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-5">
              User Logs
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Monitor and audit all user activities across the platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user or email..."
              className="px-4 py-2 border rounded-lg w-[250px]"
            />

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
               <FiCalendar className="text-gray-400 text-sm" />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  const [start, end] = update;
                  setStartDate(start);
                  setEndDate(end);
                }}
                isClearable
                placeholderText="Select Date Range"
                className="bg-transparent outline-none text-sm w-40"
                maxDate={new Date()}
              />
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent outline-none text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] md:text-xs">
                  <tr>
                    {/* <th className="px-3 md:px-6 py-3 text-left">S.NO</th> */}
                    <th className="px-3 md:px-6 py-3 text-left">USER</th>
                    <th className="px-3 md:px-6 py-3 text-left">EMAIL</th>
                    <th className="px-3 md:px-6 py-3 text-left">ACTION</th>
                    <th className="px-3 md:px-6 py-3 text-left">DESCRIPTION</th>
                    <th className="px-3 md:px-6 py-3 text-left">TIME</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log, index) => (
                      <tr key={log.sNo || index}>
                        {/* <td className="px-3 md:px-6 py-3">{log.sNo}</td> */}
                        <td className="px-3 md:px-6 py-3 font-medium">{log.user}</td>
                        <td className="px-3 md:px-6 py-3 text-gray-600">{log.email || "-"}</td>
                        <td className="px-3 md:px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 text-gray-600">{log.description}</td>
                        <td className="px-3 md:px-6 py-3 text-gray-400 text-xs">
                          {formatTime(log.time)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-6">
                        No logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {filteredTotalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === filteredTotalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogs;
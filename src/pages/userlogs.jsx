import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import axios from "axios";

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      // 🚨 If no token → go to login
      if (!token) {
        setError("Session expired. Please login again.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          "https://dashboard-backend-cyrd.onrender.com/api/logs",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ correct format
            },
          },
        );

        console.log("API RESPONSE:", response.data);

        // ✅ Extract correct data
        const logsData = response.data.data || [];

        setLogs(logsData);
      } catch (err) {
        console.log("ERROR:", err.response?.data);

        // 🚨 DO NOT remove token blindly
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

  // ✅ Loading
  if (loading) return <p className="p-5">Loading...</p>;

  // ✅ Error
  if (error) return <p className="p-5 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-[220px] flex flex-col">
        {/* Header */}
        <div className="h-[60px] bg-white flex items-center px-5 border-b border-[#eee]">
          <div
            onClick={() => navigate("/profile")}
            className="ml-auto w-[35px] h-[35px] bg-[#eee] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
          >
            <FiUser />
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

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto p-0 m-0">
              <table className="w-full border-collapse m-0">
                <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] md:text-xs">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left rounded-tl-xl">
                      S.NO
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left">USER</th>
                    <th className="px-3 md:px-6 py-3 text-left">ACTION</th>
                    <th className="px-3 md:px-6 py-3 text-left">DESCRIPTION</th>
                    <th className="px-3 md:px-6 py-3 text-left rounded-tr-xl">
                      TIME
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(logs) && logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr key={log.sNo || index} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 text-gray-500">
                          {log.sNo}
                        </td>
                        <td className="px-3 md:px-6 py-3 font-medium text-gray-800">
                          {log.user}
                        </td>
                        <td className="px-3 md:px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass(
                              log.action,
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 text-gray-600 break-words max-w-xs">
                          {log.description}
                        </td>
                        <td className="px-3 md:px-6 py-3 text-gray-400 text-xs md:text-sm">
                          {log.time}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-500"
                      >
                        No logs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogs;
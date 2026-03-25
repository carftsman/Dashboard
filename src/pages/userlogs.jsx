import React from "react";
import Sidebar from "../components/Sidebar"; 

const logs = [
  { id: 1, user: "user_01", action: "LOGIN", description: "Successful login via OAuth from Chrome (macOS)", time: "2 mins ago" },
  { id: 2, user: "user_22", action: "UPDATE", description: "Updated personal profile information and changed settings", time: "14 mins ago" },
  { id: 3, user: "user_05", action: "DELETE", description: "Removed project 'Marketing Q4' from team storage", time: "1 hour ago" },
  { id: 4, user: "user_14", action: "EXPORT", description: "Downloaded annual financial report CSV", time: "3 hours ago" },
  { id: 5, user: "user_09", action: "LOGIN", description: "Logged in from new IP address: 192.168.1.1", time: "5 hours ago" },
  { id: 6, user: "user_33", action: "UPDATE", description: "Changed workspace billing cycle to Annual", time: "Yesterday" },
];

const UserLogs = () => {
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
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/*  Sidebar */}
      <Sidebar />

      {/*  Main Content */}
      <div className="flex-1 p-4 md:p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            User Logs
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Monitor and audit all user activities across the platform.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm border-collapse border-spacing-0">
              
              <thead className="bg-[#192A51] text-gray-500 uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left">S.NO</th>
                  <th className="px-3 md:px-6 py-3 text-left">USER</th>
                  <th className="px-3 md:px-6 py-3 text-left">ACTION</th>
                  <th className="px-3 md:px-6 py-3 text-left">DESCRIPTION</th>
                  <th className="px-3 md:px-6 py-3 text-left">TIME</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 text-gray-500">{log.id}</td>

                    <td className="px-3 md:px-6 py-3 font-medium text-gray-800">
                      {log.user}
                    </td>

                    <td className="px-3 md:px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass(log.action)}`}>
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
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLogs;
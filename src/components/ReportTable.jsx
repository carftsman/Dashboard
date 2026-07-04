import { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import api from "../api/apiConfig";
export default function ReportTable({ formattedData, role }) {
  const { dashboardId } = useParams();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const showDashboardColumn = !dashboardId;
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/reports/${id}`);

      toast.success("Report deleted successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error("Delete failed:", error.response || error.message);

      toast.error(
        error.response?.data?.message || "Delete failed "
      );
    }
  };
  return (
    <div className="mt-0">
      <table className="w-full">
        <thead>
          <tr className="text-gray-500 border-b text-left text-sm">
            {showDashboardColumn && <th>Dashboard Name</th>}
            <th className="py-2">Name</th>
            <th>Date Generated</th>
            <th className="text-center">Actions</th>
            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
              <th className="text-center">Delete</th>
            )}
          </tr>
        </thead>

        <tbody>
          {formattedData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {showDashboardColumn && <td>{item.dashboardName}</td>}

              <td className="py-2">{item.name}</td>

              <td>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td className="text-center">
                <button
                  onClick={() => window.open(item.fileUrl, "_blank")}
                  className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition mx-auto"
                >
                  <FiFileText size={16} />
                  View PDF
                </button>
              </td>
              {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                <td className="text-center">
                  <button
                    onClick={() => {
                      setSelectedId(item.id);
                      setShowDeletePopup(true);
                    }}
                    className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100 transition"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[320px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this report?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedId);
                  setShowDeletePopup(false);
                }}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

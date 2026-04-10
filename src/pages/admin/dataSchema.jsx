import { useEffect, useState } from "react";
import {
  getColumns,
  updateColumn,
  createColumn,
  deleteColumn,
} from "../../services/editDataSchemaService";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";
import {
  FiEdit3,
  FiCheckSquare,
  FiCircle,
  FiEdit,
  FiTrash2,
  FiSlash,
  FiCheckCircle,
  FiMinusCircle,
  FiBarChart2
} from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisualizationModal from "../../components/VisualizationModal";
export default function DataSchema() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlur, setShowBlur] = useState(false);
 
  const { id } = useParams();
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [form, setForm] = useState({
    columnKey: "",
    displayName: "",
    dataType: "STRING",
    required: false,
  });
 
  const fetchColumns = async () => {
    try {
      const data = await getColumns(id);
      setColumns(data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (!id) return;
    fetchColumns();
  }, [id]);
 
  const handleEdit = (col) => {
    setIsEditMode(true);
    setSelectedColumn(col);
 
    setForm({
      columnKey: col.columnKey,
      displayName: col.displayName,
      dataType: col.dataType,
      required: col.required,
    });
 
    setIsModalOpen(true);
  };
 
  const handleAdd = () => {
    setIsEditMode(false);
    setForm({
      columnKey: "",
      displayName: "",
      dataType: "STRING",
      required: false,
    });
    setIsModalOpen(true);
  };
 
  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateColumn(id, selectedColumn.id, form);
        fetchColumns();
 
        setShowBlur(true);
        toast.success("Column updated successfully");
 
        setTimeout(() => setShowBlur(false), 2000);
      } else {
        await createColumn(id, form);
        fetchColumns();
 
        setShowBlur(true);
        toast.success("Column added successfully");
 
        setTimeout(() => setShowBlur(false), 2000);
      }
 
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      toast.error(err?.response?.data?.message || "Something went wrong ");
    }
  };
 
  const handleDelete = async (col) => {
    try {
      await deleteColumn(id, col.id);
 
      setColumns((prev) => prev.filter((c) => c.id !== col.id));
 
      setShowBlur(true);
      toast.error("Column deleted successfully");
 
      setTimeout(() => setShowBlur(false), 2000);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.response?.data?.message || "Delete failed ");
    }
  };
 
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
 
      <div className="flex-1 flex flex-col lg:ml-[220px]">
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <div className="space-y-0">
              <h1 className="text-xl md:text-2xl font-semibold leading-tight m-0">
                Edit Data Schema
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-tight m-0">
                Define and manage the underlying data structures
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-[#18154F] text-white px-4 py-2 rounded-md text-sm hover:bg-[#23206b] transition"
              >
                <FiEdit3 size={16} />
                Add Column
              </button>

              <button
                onClick={() => {
                  setSelectedChart(null);
                  setOverlayOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
              >
                <FiBarChart2 size={16} />
                Add Chart
              </button>
            </div>
          </div>

 
          {showBlur && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40 pointer-events-none"></div>
          )}
 
          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-semibold text-lg mb-4">Transaction_Logs_v2</h2>
 
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2">Column Name</th>
                        <th>Data Type</th>
                        <th className="text-center">Required</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
 
                    <tbody>
                      {columns.map((col) => (
                        <tr
                          key={col.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3 font-medium">
                            {col.displayName}
                          </td>
 
                          <td>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                              {col.dataType}
                            </span>
                          </td>
 
                          <td className="py-3">
                            <div className="flex items-center justify-center">
                              {col.required ? (
                                <FiCheckSquare
                                  className="text-green-600"
                                  size={18}
                                />
                              ) : (
                                <FiCircle className="text-gray-300" size={18} />
                              )}
                            </div>
                          </td>
 
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                onClick={() => handleEdit(col)}
                                className="group p-2 rounded-lg hover:bg-blue-50 transition"
                              >
                                <FiEdit
                                  className="text-gray-500 group-hover:text-blue-600"
                                  size={18}
                                />
                              </button>
 
                              <button
                                onClick={() => handleDelete(col)}
                                className="group p-2 rounded-lg hover:bg-red-50 transition"
                              >
                                <FiTrash2
                                  className="text-gray-500 group-hover:text-red-600"
                                  size={18}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
 
                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      className="border rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{col.displayName}</h3>
 
                        <div className="flex gap-3">
                          <button onClick={() => handleEdit(col)}>
                            <FiEdit size={18} />
                          </button>
                          <button onClick={() => handleDelete(col)}>
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
 
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                          {col.dataType}
                        </span>

                        <span className="flex items-center gap-1.5 font-medium">
                          {col.required ? (
                            <>
                              <FiCheckCircle className="text-green-600" size={14} />
                              <span className="text-green-600">Required</span>
                            </>
                          ) : (
                            <>
                              <FiMinusCircle className="text-gray-400" size={14} />
                              <span className="text-gray-500">Optional</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

         
          {isModalOpen && (
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50"
              onClick={() => setIsModalOpen(false)} 
            >
              <div 
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
                onClick={(e) => e.stopPropagation()} 
              >
                <h2 className="text-lg font-semibold mb-4">
                  {isEditMode ? "Edit Column" : "Add Column"}
                </h2>
 
                <input
                  value={form.columnKey}
                  onChange={(e) =>
                    setForm({ ...form, columnKey: e.target.value })
                  }
                  placeholder="Column Key"
                  className="border border-gray-300 focus:border-[#18154F] focus:ring-1 focus:ring-[#18154F] outline-none p-2.5 w-full mb-3 rounded-lg text-sm transition"
                />
 
                <input
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                  placeholder="Display Name"
                  className="border border-gray-300 focus:border-[#18154F] focus:ring-1 focus:ring-[#18154F] outline-none p-2.5 w-full mb-3 rounded-lg text-sm transition"
                />
 
                <select
                  value={form.dataType}
                  onChange={(e) =>
                    setForm({ ...form, dataType: e.target.value })
                  }
                  className="border border-gray-300 focus:border-[#18154F] focus:ring-1 focus:ring-[#18154F] outline-none p-2.5 w-full mb-4 rounded-lg text-sm transition"
                >
                  <option>STRING</option>
                  <option>NUMBER</option>
                  <option>DATE</option>
                  <option>FLOAT</option>
                  <option>BOOLEAN</option>
                  <option>INT</option>
                  <option>CHAR</option>
                </select>
                <label className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg mb-5">
                  <span className="text-sm font-medium text-gray-700">
                    Required Field
                  </span>
 
                  <input
                    type="checkbox"
                    checked={form.required}
                    onChange={(e) =>
                      setForm({ ...form, required: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#18154F] cursor-pointer"
                  />
                </label>
 
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <FiSlash size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 bg-[#18154F] text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-[#23206b] transition"
                  >
                    <FiCheckSquare size={16} />
                    {isEditMode ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <VisualizationModal
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        dashboardId={id}
        onSuccess={fetchColumns}
      />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

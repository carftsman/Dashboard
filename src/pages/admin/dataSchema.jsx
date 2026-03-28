import { useEffect, useState } from "react";
import { getColumns, updateColumn, createColumn , deleteColumn} from "../../services/editDataSchemaService";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";

export default function DataSchema() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

// modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

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

// open modal for edit
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

  // open modal for add (future)
  const handleAdd = () => {
    setIsEditMode(false);
    setForm({ columnKey: "", displayName: "", dataType: "STRING", required: false });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateColumn(id, selectedColumn.id, form);
        fetchColumns();
        toast.success("Column updated successfully ✏️");
      }
      else {
        await createColumn(id, form);
        fetchColumns();
        toast.success("Column added successfully ➕");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);

    toast.error(
      err?.response?.data?.message || "Something went wrong ❌"
    );
    }
  };

  
  const handleDelete = async (col) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${col.columnKey}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteColumn(id, col.id);

      // remove from UI instantly
      setColumns((prev) => prev.filter((c) => c.id !== col.id));
       toast.success("Column deleted successfully 🗑️");
    } catch (err) {
      console.error("Delete failed", err);
       toast.error(
      err?.response?.data?.message || "Delete failed ❌"
    );
    }
  };

  return (
  <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <AdminSidebar />

    {/* Main Content */}
    <div className="flex-1 flex flex-col lg:ml-[220px]">
      <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Edit Data Schema
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Define and manage the underlying data structures
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-black text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
          >
            + Add Column
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-4">
            Transaction_Logs_v2
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* ================== DESKTOP TABLE ================== */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2">Column Name</th>
                      <th>Data Type</th>
                      <th>Required</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {columns.map((col) => (
                      <tr key={col.id} className="border-b">
                        <td className="py-3 font-medium">
                          {col.displayName}
                        </td>

                        <td>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                            {col.dataType}
                          </span>
                        </td>

                        <td>
                          {col.required ? (
                            <span className="text-green-600">✔</span>
                          ) : (
                            <span className="text-gray-300">○</span>
                          )}
                        </td>

                        <td className="text-right space-x-3">
                          <button onClick={() => handleEdit(col)}>✏</button>
                          <button onClick={() => handleDelete(col)}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================== MOBILE CARDS ================== */}
              <div className="md:hidden space-y-3">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="border rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {col.displayName}
                      </h3>

                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(col)}>✏</button>
                        <button onClick={() => handleDelete(col)}>🗑</button>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                        {col.dataType}
                      </span>

                      <span>
                        {col.required ? "Required ✔" : "Optional"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">

              <h2 className="text-lg font-semibold mb-4">
                {isEditMode ? "Edit Column" : "Add Column"}
              </h2>

              <input
                value={form.columnKey}
                onChange={(e) =>
                  setForm({ ...form, columnKey: e.target.value })
                }
                placeholder="Column Key"
                className="border p-2 w-full mb-2 rounded"
              />

              <input
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                placeholder="Display Name"
                className="border p-2 w-full mb-2 rounded"
              />

              <select
                value={form.dataType}
                onChange={(e) =>
                  setForm({ ...form, dataType: e.target.value })
                }
                className="border p-2 w-full mb-2 rounded text-sm"
              >
                <option>STRING</option>
                <option>NUMBER</option>
                <option>DATETIME</option>
                <option>FLOAT</option>
              </select>

              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={form.required}
                  onChange={(e) =>
                    setForm({ ...form, required: e.target.checked })
                  }
                />
                Required
              </label>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border px-4 py-2 rounded w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}



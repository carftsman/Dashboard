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

  useEffect(() => {
    if (!id) return;

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

  // open modal for add
  const handleAdd = () => {
    setIsEditMode(false);
    setForm({ columnKey: "", displayName: "", dataType: "STRING", required: false });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateColumn(id, selectedColumn.id, form);

        setColumns((prev) =>
          prev.map((c) =>
            c.id === selectedColumn.id ? { ...c, ...form } : c
          )
        );

        toast.success("Column updated successfully ✏️");
      } else {
        // ✅ FIX: use backend response instead of Date.now()
        const response = await createColumn(id, form);

        const newCol = response.data.data || response.data; // real id from backend

        setColumns((prev) => [...prev, newCol]);

        toast.success("Column added successfully ➕");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      toast.error(err?.response?.data?.message || "Something went wrong ❌");
    }
  };

  const handleDelete = async (col) => {
    console.log("Deleting column:", col); // ✅ debug added

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${col.columnKey}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteColumn(id, col.id);

      setColumns((prev) => prev.filter((c) => c.id !== col.id));

      toast.success("Column deleted successfully 🗑️");
    } catch (err) {
      console.error("Delete failed", err);
      console.log("Backend error:", err?.response?.data); // ✅ debug

      toast.error(
        err?.response?.data?.message || "Delete failed ❌"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-[220px]">
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">

          <h1 className="text-xl md:text-2xl font-semibold mb-4">Edit Data Schema</h1>
          <p className="text-gray-500 mb-6 text-sm md:text-base">
            Define and manage the underlying data structures for the Analytics Dashboard.
          </p>

          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Transaction_Logs_v2</h2>
              <button onClick={handleAdd} className="text-black-600 ">
                + Add New Column
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Column Name</th>
                    <th>Data Type</th>
                    <th>Required</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {columns.map((col) => (
                    <tr key={col.id} className="border-b">
                      <td className="py-3">
                        <div className="font-medium">{col.displayName}</div>
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

                      <td className="space-x-2">
                        <button
                          className="text-white-500"
                          onClick={() => handleEdit(col)}
                        >
                          ✏
                        </button>
                        <button
                          className="text-white-500"
                          onClick={() => handleDelete(col)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">

                <h2 className="text-lg font-semibold mb-4">
                  {isEditMode ? "Edit Column" : "Add Column"}
                </h2>

                <input
                  value={form.columnKey}
                  onChange={(e) => setForm({ ...form, columnKey: e.target.value })}
                  placeholder="Column Key"
                  className="border p-2 w-full mb-2 rounded"
                />

                <input
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="Display Name"
                  className="border p-2 w-full mb-2 rounded"
                />

                <select
                  value={form.dataType}
                  onChange={(e) => setForm({ ...form, dataType: e.target.value })}
                  className="border p-2 w-full mb-2 rounded italic text-xs"
                >
                  <option>STRING</option>
                  <option>NUMBER</option>
                  <option>DATETIME</option>
                  <option>FLOAT</option>
                </select>

                <label>
                  <input
                    type="checkbox"
                    checked={form.required}
                    onChange={(e) => setForm({ ...form, required: e.target.checked })}
                  />
                  Required
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
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
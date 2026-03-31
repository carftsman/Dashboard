import React, { useState } from "react";
import api from "../api/apiConfig";

const CreateDashboard = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [dashboardId, setDashboardId] = useState(null);

  const [columnName, setColumnName] = useState("");
  const [dataType, setDataType] = useState("");

  const [columns, setColumns] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");

  const dataTypes = ["STRING", "NUMBER", "DATE", "BOOLEAN"];

  if (!isOpen) return null;

  // 🔹 Create Dashboard
  const createDashboard = async () => {
    try {
      const res = await api.post("/api/dashboards", {
        name,
        description,
        image,
      });

      setDashboardId(res.data.dashboardId);
      return res.data.dashboardId;
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Add Column (FIXED)
  const addColumn = async () => {
    if (!columnName || !dataType) return;

    let id = dashboardId;

    if (!id) {
      id = await createDashboard();
    }

    try {
      const res = await api.post(
        `/api/dashboards/${id}/columns`,
        {
          columns: [
            {
              columnKey: columnName.toLowerCase().replace(/\s+/g, "_"),
              displayName: columnName,
              dataType,
              required: true,
            },
          ],
        }
      );

      console.log("ADD COLUMN RESPONSE:", res.data);

      // ✅ IMPORTANT FIX: use backend response directly
      const newCol = res.data?.columns?.[0];

      if (!newCol) {
        console.error("Column not returned from API");
        return;
      }

      setColumns((prev) => [...prev, newCol]);

      setColumnName("");
      setDataType("");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete Column (FIXED)
  const deleteColumn = async (columnId) => {
    if (!dashboardId || !columnId) {
      console.error("Missing dashboardId or columnId");
      return;
    }

    try {
      await api.delete(
        `/api/dashboards/${dashboardId}/columns/${columnId}`
      );

      setColumns((prev) =>
        prev.filter((col) => col.id !== columnId)
      );
    } catch (err) {
      console.error(err.response || err.message);
    }
  };

  // 🔹 Start Edit
  const startEdit = (col) => {
    setEditingId(col.id);
    setEditName(col.displayName);
    setEditType(col.dataType);
  };

  // 🔹 Update Column
  const updateColumn = async () => {
    try {
      await api.put(
        `/api/dashboards/${dashboardId}/columns/${editingId}`,
        {
          displayName: editName,
          dataType: editType,
        }
      );

      setColumns((prev) =>
        prev.map((col) =>
          col.id === editingId
            ? {
                ...col,
                displayName: editName,
                dataType: editType,
              }
            : col
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Next
  const handleNext = async () => {
    let id = dashboardId;

    if (!id) {
      id = await createDashboard();
    }

    if (id) {
      onSuccess(id);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl p-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          Create New Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div>
            <label className="text-sm font-medium">
              Dashboard Name
            </label>
            <input
              className="w-full mt-2 p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="text-sm font-medium mt-4 block">
              Description
            </label>
            <textarea
              className="w-full mt-2 p-2 border rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="text-sm font-medium mt-4 block">
              Image URL
            </label>
            <input
              className="w-full mt-2 p-2 border rounded-md"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="font-semibold mb-2">
              Add New Column
            </h3>

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Column Name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded mb-2"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="">Select Data Type</option>
              {dataTypes.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <button
              onClick={addColumn}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              + Add Column
            </button>

            {/* COLUMN LIST */}
            <div className="mt-4 space-y-2">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  {editingId === col.id ? (
                    <div className="flex gap-2 w-full">
                      <input
                        className="border p-1 rounded w-1/2"
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                      />

                      <select
                        className="border p-1 rounded w-1/2"
                        value={editType}
                        onChange={(e) =>
                          setEditType(e.target.value)
                        }
                      >
                        {dataTypes.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>

                      <button
                        onClick={updateColumn}
                        className="text-green-600 text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>
                        {col.displayName} - {col.dataType}
                      </span>

                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(col)}
                          className="text-blue-600"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => deleteColumn(col.id)} // ✅ NOW WORKS
                          className="text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-700 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDashboard;
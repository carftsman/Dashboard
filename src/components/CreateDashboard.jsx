import React, { useState } from "react";
import api from "../api/apiConfig";
import { FaEdit, FaTrash } from "react-icons/fa";

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

  const createDashboard = async () => {
    try {
      const res = await api.post("/api/dashboards", {
        name,
        description,
        image,
      });

      const id = res.data.dashboardId;
      setDashboardId(id);
      return id;
    } catch (err) {
      console.error("Dashboard create failed ❌", err);
    }
  };

  const addColumn = async () => {
    if (!columnName || !dataType) return;

    let id = dashboardId;

    if (!id) {
      id = await createDashboard();
    }

    const columnKey = columnName.toLowerCase().replace(/\s+/g, "_");

    try {
      await api.post(`/api/dashboards/${id}/columns`, {
        columns: [
          {
            columnKey,
            displayName: columnName,
            dataType,
            required: true,
          },
        ],
      });

      await fetchColumns(id);

      setColumnName("");
      setDataType("");
    } catch (err) {
      console.error("Add column failed", err.response?.data || err);
    }
  };

  const fetchColumns = async (id) => {
    try {
      const res = await api.get(`/api/dashboards/${id}`);
      const cols = res.data?.columns || [];

      const formatted = cols.map((col) => ({
        id: col.id,
        columnKey: col.columnKey,
        displayName: col.displayName,
        dataType: col.dataType,
        required: col.required,
      }));

      setColumns(formatted);
    } catch (err) {
      console.error("Fetch columns failed ❌", err);
    }
  };

  const deleteColumn = async (columnId) => {
    try {
      await api.delete(
        `/api/dashboards/${dashboardId}/columns/${columnId}`
      );

      setColumns((prev) =>
        prev.filter((col) => col.id !== columnId)
      );
    } catch (err) {
      console.error("Delete failed ❌", err.response?.data || err);
    }
  };

  const startEdit = (col) => {
    setEditingId(col.id);
    setEditName(col.displayName);
    setEditType(col.dataType);
  };

  const updateColumn = async () => {
    try {
      const column = columns.find((c) => c.id === editingId);
      if (!column) return;

      await api.put(
        `/api/dashboards/${dashboardId}/columns/${editingId}`,
        {
          columnKey: column.columnKey,
          displayName: editName,
          dataType: editType,
          required: true,
        }
      );

      setColumns((prev) =>
        prev.map((col) =>
          col.id === editingId
            ? { ...col, displayName: editName, dataType: editType }
            : col
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error("Update failed ❌", err.response?.data || err);
    }
  };

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
        className="bg-white w-full max-w-2xl p-5 rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Create New Dashboard
        </h2>

        {/* ✅ ONLY FIX APPLIED */}
        <div className="flex gap-6">

          <div className="flex-1">
            <label className="text-sm font-medium">Dashboard Name</label>
            <input
              className="w-full mt-2 p-2 border rounded-md text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="text-sm font-medium mt-4 block">
              Description
            </label>
            <textarea
              className="w-full mt-2 p-2 border rounded-md text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="text-sm font-medium mt-4 block">
              Image URL
            </label>
            <input
              className="w-full mt-2 p-2 border rounded-md text-sm"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-700 mb-2">
              Add New Column
            </h3>

            {/* SAME CODE CONTINUES */}

            <input
              className="w-full p-2 border rounded-md text-sm mb-2"
              placeholder="Column Name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded-md text-sm mb-2"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="">Select</option>
              {dataTypes.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <button
              onClick={addColumn}
              className="w-full bg-[#1e3a8a] text-white py-2 rounded-md"
            >
              + Add Column
            </button>

<div className="mt-3 flex flex-col gap-2">
  {columns.map((col) => (
    <div
      key={col.id}
      className="flex justify-between px-4 py-3 border border-blue-300 bg-blue-50 rounded-lg"
    >
      {editingId === col.id ? (
        <div className="flex gap-2 w-full">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border px-2 py-1 w-[40%]"
          />

          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            className="border px-2 py-1"
          >
            {dataTypes.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* SAVE BUTTON */}
          <button
            onClick={updateColumn}
            className="px-3 py-1.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-md"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <div>
            {col.displayName} ({col.dataType})
          </div>

          <div className="flex gap-2">
             {/* EDIT BUTTON */}
<button
  onClick={() => startEdit(col)}
  className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af]"
>
  <FaEdit className="text-white text-lg" />
</button>

{/* DELETE BUTTON */}
<button
  onClick={() => deleteColumn(col.id)}
  className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af]"
>
  <FaTrash className="text-white text-lg" />
</button>
          </div>
        </>
      )}
    </div>
  ))}
</div>
</div>
</div>

<div className="flex justify-end mt-6 gap-3">
  {/*CANCEL BUTTON */}
  <button
    onClick={onClose}
    className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-md"
  >
    Cancel
  </button>

  {/* NEXT BUTTON  */}
  <button
    onClick={handleNext}
    className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-md"
  >
    Next
  </button>
</div>
      </div>
    </div>
  );
};

export default CreateDashboard;
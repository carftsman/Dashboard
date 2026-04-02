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
 
  // Create Dashboard
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
      console.error("Dashboard create failed ", err);
    }
  };
 
  // ADD COLUMN
  const addColumn = () => {
    if (!columnName || !dataType) return;
 
    const columnKey = columnName.toLowerCase().replace(/\s+/g, "_");
 
    const newColumn = {
      id: Date.now(),
      columnKey,
      displayName: columnName,
      dataType,
      required: true,
    };
 
    setColumns((prev) => [...prev, newColumn]);
 
    setColumnName("");
    setDataType("");
  };
 
  //  DELETE (LOCAL)
  const deleteColumn = (columnId) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  };
 
  //  START EDIT
  const startEdit = (col) => {
    setEditingId(col.id);
    setEditName(col.displayName);
    setEditType(col.dataType);
  };
 
  //  UPDATE (LOCAL)
  const updateColumn = () => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === editingId
          ? { ...col, displayName: editName, dataType: editType }
          : col
      )
    );
 
    setEditingId(null);
  };
 
  //  FINAL SUBMIT
  const handleNext = async () => {
    try {
      let id = dashboardId;
 
      if (!id) {
        id = await createDashboard();
      }
 
      //  SEND ALL COLUMNS TO BACKEND
      if (columns.length > 0) {
        await api.post(`/api/dashboards/${id}/columns`, {
          columns: columns.map((col) => ({
            columnKey: col.columnKey,
            displayName: col.displayName,
            dataType: col.dataType,
            required: true,
          })),
        });
      }
 
      onSuccess(id);
    } catch (err) {
      console.error("Final submit failed", err.response?.data || err);
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
 
        <div className="flex gap-6">
          {/* LEFT SIDE */}
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
 
          {/* RIGHT SIDE */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-700 mb-2">
              Add New Column
            </h3>
 
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
 
            {/* COLUMN LIST */}
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
 
                      <button
                        onClick={updateColumn}
                        className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-md"
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
                        <button
                          onClick={() => startEdit(col)}
                          className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#1e3a8a]"
                        >
                          <FaEdit className="text-white text-lg" />
                        </button>
 
                        <button
                          onClick={() => deleteColumn(col.id)}
                          className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#1e3a8a]"
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
 
        {/* FOOTER */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1e3a8a] text-white rounded-md"
          >
            Cancel
          </button>
 
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-[#1e3a8a] text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default CreateDashboard;
 
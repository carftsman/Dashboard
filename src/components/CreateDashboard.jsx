import React, { useState } from "react";
import api from "../api/apiConfig";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  FiPlus,
  FiUpload,
  FiGrid,
  FiFileText,
  FiImage,
  FiXCircle,
  FiArrowRight,
  FiCheck,
  FiToggleRight,
} from "react-icons/fi";
 import { useLocation, useNavigate } from "react-router-dom";
const CreateDashboard = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  
  const editMode = location.state?.isEdit || false;
  const initialData = location.state?.dashboardData || null;
  const [dashboardId, setDashboardId] = useState(null);
 
  const [columnName, setColumnName] = useState("");
  const [dataType, setDataType] = useState("");
 
  const [columns, setColumns] = useState([]);
 
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
 
  const [errors, setErrors] = useState({});
 
  const dataTypes = [
    "STRING",
    "NUMBER",
    "DATE",
    "BOOLEAN",
    "FLOAT",
    "INT",
    "CHAR",
  ];
 
  if (!isOpen) return null;
 
  // 1. Updated Create Dashboard Function (No changes needed, but ensure it receives the base64)
  const createDashboard = async () => {
    try {
      const res = await api.post("/api/dashboards", {
        name,
        description,
        image, // This will now be the base64 string
      });

      const id = res.data.dashboardId;
      setDashboardId(id);
      return id;
    } catch (err) {
      console.error("Dashboard create failed ", err);
    }
  };

  // 2. Updated File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This converts the image to a long data string that Prisma/Database can store
        setImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  // ... inside your return (JSX) ...

  <input
    type="file"
    accept="image/*"
    id="imageUpload"
    className="hidden"
    onChange={handleFileUpload} // Use the new handler here
  />
 
  const addColumn = () => {
    if (!columnName || !dataType) {
      setErrors((prev) => ({ ...prev, column: true }));
      return;
    }
 
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
    setErrors((prev) => ({ ...prev, column: false }));
  };
 
  const deleteColumn = (columnId) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  };
 
  const startEdit = (col) => {
    setEditingId(col.id);
    setEditName(col.displayName);
    setEditType(col.dataType);
  };
 
  const updateColumn = () => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === editingId
          ? { ...col, displayName: editName, dataType: editType }
          : col,
      ),
    );
    setEditingId(null);
    setEditName("");
    setEditType("");
  };
 
  const handleNext = async () => {
    let newErrors = {};
 
    if (!name.trim()) newErrors.name = true;
    if (!description.trim()) newErrors.description = true;
    if (!image) newErrors.image = true;
    if (columns.length === 0) newErrors.columns = true;
 
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
 
    try {
      let id = dashboardId;
 
      if (!id) {
        id = await createDashboard();
        setDashboardId(id);
      }
 
      onSuccess(id, columns);
 
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
    } catch (err) {
      console.error("Final submit failed", err.response?.data || err);
    }
  };
 
  return (
   <div
    className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/30"
    onClick={onClose}
  >
    <div
      className="bg-white w-full max-w-2xl p-5 rounded-2xl shadow-lg max-h-[85vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Create New Dashboard
        </h2>
 
        <div className="flex gap-6 flex-1 overflow-hidden">
 
          {/* LEFT SIDE */}
          <div className="flex-1">
 
            {/* Dashboard Name */}
            <label className="text-sm font-medium flex items-center gap-2">
              Dashboard Name
            </label>
            <div className="relative mt-2">
              <FiGrid className="absolute left-2 top-2.5 text-gray-400" />
              <input
                className="w-full pl-8 p-2 border rounded-md text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter dashboard name"
              />
            </div>
 
            {/* Description */}
            <label className="text-sm font-medium mt-4 block flex items-center gap-2">
              Description
            </label>
            <div className="relative mt-2">
              <FiFileText className="absolute left-2 top-3 text-gray-400" />
              <textarea
                className="w-full pl-8 p-2 border rounded-md text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter dashboard description"
              />
            </div>
 
            {/* IMAGE SECTION */}
            <label className="text-sm font-medium mt-4 block flex items-center gap-2">
              Image URL
            </label>
 
            <div className="relative mt-2">
              <FiImage className="absolute left-2 top-2.5 text-gray-400" />
              <input
                className="w-full pl-8 p-2 border rounded-md text-sm"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste image URL here"
              />
            </div>
 
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-2 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
 
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setImage(imageUrl);
                  }
                }}
              />
 
            <div className="w-full flex justify-center">
  <label
    htmlFor="imageUpload"
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 text-sm font-medium border
    ${
      image
        ? "bg-green-50 text-green-700 border-green-300"
        : "bg-[#1e3a8a] text-white border-[#1e3a8a] hover:bg-[#172554]"
    }`}
  >
    <FiUpload className={`${image ? "text-green-600" : "text-white"}`} />
    {image ? "Image Uploaded" : "Upload Image"}
  </label>
</div>
 
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="w-12 h-12 object-cover rounded-md border"
                />
              )}
            </div>
          </div>
 
 
          {/* RIGHT */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="font-medium mb-2">Add New Column *</h3>
 
            {/* Inputs */}
            <div>
              <div className="relative mb-2">
                <FiToggleRight className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]" />
 
                <input
                  className="w-full h-[42px] pl-10 pr-3 border border-gray-300 rounded-lg text-sm"
                  placeholder="Column name"
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                />
              </div>
 
              <select
                className="p-2 border rounded mb-2 w-full"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                <option value="">Select type</option>
                {dataTypes.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
 
              {errors.column && (
                <p className="text-red-500 text-xs mb-2">
                  This field is required
                </p>
              )}
 
              <button
                onClick={addColumn}
                className="bg-[#1e3a8a] text-white py-2 rounded-md w-full"
              >
                Add Column
              </button>
            </div>
 
            {/* Scroll Area */}
            <div className="mt-3 flex-1 overflow-y-auto pr-2 pb-10 min-h-0">
              <div className="space-y-2">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="flex justify-between items-center p-2 bg-blue-50 rounded"
                  >
                    {editingId === col.id ? (
                      <div className="flex gap-2 w-full">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border p-1 rounded w-1/2"
                        />
 
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          className="border p-1 rounded w-1/2"
                        >
                          {dataTypes.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        {col.displayName} ({col.dataType})
                      </div>
                    )}
 
                    <div className="flex gap-2 ml-2">
                      {editingId === col.id ? (
                        <button
                          onClick={updateColumn}
                          className="bg-green-500 p-2 rounded text-white"
                        >
                          <FiCheck />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(col)}
                          className="bg-[#1e3a8a] p-2 rounded text-white"
                        >
                          <FaEdit />
                        </button>
                      )}
 
                      <button
                        onClick={() => deleteColumn(col.id)}
                        className="bg-red-500 p-2 rounded text-white"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        {/* FOOTER */}
 
      <div className="flex justify-end mt-4 gap-3 pt-3 border-t">
  <button
    onClick={onClose}
   className="px-4 py-2 bg-red-50 text-red-700 border border-red-400 rounded-md flex items-center gap-2 hover:bg-red-100 active:bg-red-100 focus:bg-red-100 transition"
  >
    <FiXCircle/> Cancel
  </button>
 
  <button
    onClick={handleNext}
   className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md flex items-center gap-2 hover:bg-blue-100 transition"
  >
    Next <FiArrowRight />
  </button>
</div>
      </div>
    </div>
  );
};
 
export default CreateDashboard;
 
 
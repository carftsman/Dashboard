import React, { useEffect, useState } from "react";
import api from "../api/apiConfig";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { FaTimes } from "react-icons/fa";
import {
  FiPlus,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiGrid,
  FiDatabase,
} from "react-icons/fi";
 
const VisualizationModal = ({ isOpen, onClose, dashboardId, onSuccess }) => { // ✅ added onSuccess
 
  const [columns, setColumns] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [formData, setFormData] = useState({});
  const [chartConfigs, setChartConfigs] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [pendingWidgets, setPendingWidgets] = useState([]);
 
  const iconMap = {
    BAR: <FiBarChart2 />,
    LINE: <FiTrendingUp />,
    PIE: <FiPieChart />,
    KPI: <FiGrid />,
    TABLE: <FiDatabase />,
    DONUT: <FiPieChart />,
    AREA: <FiTrendingUp />,
    STACKED_BAR: <FiBarChart2 />,
  };
 
  useEffect(() => {
    if (!dashboardId || !isOpen) return;
 
    const fetchData = async () => {
      try {
        await new Promise((res) => setTimeout(res, 300));
        const res = await api.get(`/api/dashboards/${dashboardId}`);
        const dashboard = res.data.dashboard || res.data;
        setColumns(dashboard.columns || []);
      } catch (err) {
        console.error("Fetch columns error:", err);
      }
    };
 
    fetchData();
  }, [dashboardId, isOpen]);
 
  useEffect(() => {
    const fetchChartConfig = async () => {
      const res = await api.get("/api/chart-types/config");
      setChartConfigs(res.data.charts || []);
    };
 
    fetchChartConfig();
  }, []);
 
  if (!isOpen) return null;
 
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
 
  const createWidget = () => {
    if (!selectedWidget || !formData.title) {
      alert("Please select a chart and enter a title.");
      return;
    }
 
    const newWidget = {
      type: selectedWidget.type,
      name: formData.title,
      config: {
        ...formData,
        type: selectedWidget.type,
        title: formData.title,
      },
    };
 
    setPendingWidgets((prev) => [...prev, newWidget]);
    setFormData({});
    setSelectedFields({});
    setSelectedWidget(null);
  };
 
  const submitAllWidgets = async () => {
    let widgetsToSubmit = [...pendingWidgets];
 
    if (selectedWidget && formData.title) {
      const currentWidget = {
        type: selectedWidget.type,
        name: formData.title,
        config: {
          ...formData,
          type: selectedWidget.type,
          title: formData.title,
        },
      };
      widgetsToSubmit.push(currentWidget);
    }
 
    if (widgetsToSubmit.length === 0) return;
 
    try {
      console.log("Payload:", { widgets: widgetsToSubmit });
 
      await api.post(`/api/dashboards/${dashboardId}/widgets`, {
        widgets: widgetsToSubmit,
      });
 
      // ✅ IMPORTANT FIX: trigger dashboard refresh
      if (onSuccess) {
        onSuccess();
      }
 
      setPendingWidgets([]);
      setSelectedWidget(null);
      setFormData({});
      setSelectedFields({});
      onClose();
 
    } catch (err) {
      console.error("Server Error Detail:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.error || "Check console for Prisma error"));
    }
  };
 
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
 
    const column = columns.find(
      (c) => String(c.id) === String(active.id)
    );
    const field = over.id;
 
    if (!column) return;
 
    setSelectedFields((prev) => {
      const existing = prev[field] || [];
      if (existing.includes(column.displayName)) return prev;
 
      const updated = [...existing, column.displayName];
 
      setFormData((prevData) => ({
        ...prevData,
        [field]: updated,
      }));
 
      return { ...prev, [field]: updated };
    });
  };
 
  const DraggableItem = ({ col }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: col.id,
    });
 
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="p-2 bg-white border border-gray-200 rounded-md mb-2 cursor-grab shadow-sm"
      >
        {col.displayName}
      </div>
    );
  };
 
  const DroppableField = ({ field, children }) => {
    const { setNodeRef } = useDroppable({ id: field });
 
    return (
      <div
        ref={setNodeRef}
        className="flex flex-wrap gap-2 mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 min-h-[40px]"
      >
        {children}
      </div>
    );
  };
 
  const renderFields = () => {
    if (!selectedWidget) return null;
 
    const config = chartConfigs.find(
      (c) => c.type === selectedWidget.type
    );
 
    if (!config) return null;
 
    return config.requiredFields.map((field) => (
      <div key={field} className="mb-2">
        <label className="text-xs text-gray-700 font-medium">
          {field}
        </label>
        <DroppableField field={field}>
          {(selectedFields[field] || []).map((col) => (
            <span
              key={col}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-[10px] rounded-full"
            >
              {col}
              <button
                onClick={() => {
                  setSelectedFields((prev) => {
                    const updated = prev[field].filter(
                      (c) => c !== col
                    );
 
                    setFormData((prevData) => ({
                      ...prevData,
                      [field]: updated,
                    }));
 
                    return { ...prev, [field]: updated };
                  });
                }}
              >
                <FaTimes className="text-red-500 text-[10px]" />
              </button>
            </span>
          ))}
        </DroppableField>
      </div>
    ));
  };
 
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
 
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        ></div>
 
        <div
          className={`relative bg-white p-5 rounded-2xl shadow-2xl transition-all duration-300 animate-[fadeIn_0.2s_ease]
          ${selectedWidget ? "w-full max-w-[900px]" : "w-full max-w-[500px]"}
          h-[85vh] flex flex-col`}
        >
 
          <div className={`flex gap-4 flex-1 min-h-0 ${!selectedWidget ? "justify-center" : ""}`}>
 
            {selectedWidget && (
              <div className="flex-1 flex flex-col border-r pr-3 min-h-0">
                <h3 className="text-sm font-semibold mb-2 sticky top-0 bg-white z-10">
                  Columns
                </h3>
 
                <div className="flex-1 overflow-y-auto pr-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300">
                  {columns.map((col) => (
                    <DraggableItem key={col.id} col={col} />
                  ))}
                </div>
              </div>
            )}
 
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300">
 
                <h3 className="text-sm font-semibold mb-3 text-center sticky top-0 bg-white z-10">
                  Visualizations
                </h3>
 
                <div className={`grid gap-2 ${selectedWidget ? "grid-cols-5" : "grid-cols-3"}`}>
                  {chartConfigs.map((chart) => (
                    <div
                      key={chart.type}
                      onClick={() => {
                        setSelectedWidget(chart);
                        setFormData({});
                        setSelectedFields({});
                      }}
                      className={`w-[55px] h-[55px] rounded-md border flex flex-col items-center justify-center cursor-pointer transition
                      ${selectedWidget?.type === chart.type
                        ? "border-[#1e3a8a] bg-blue-50"
                        : "border-gray-200"
                      }`}
                    >
                      <div className="text-xs text-[#1e3a8a]">
                        {iconMap[chart.type] || <FiBarChart2 />}
                      </div>
 
                      <p className="text-[8px] mt-1 text-gray-600 text-center">
                        {chart.title}
                      </p>
                    </div>
                  ))}
                </div>
 
                {selectedWidget && (
                  <>
                    {renderFields()}
 
                    <input
                      type="text"
                      placeholder="Enter chart title"
                      className="w-full mt-2 p-2 border rounded-md text-xs"
                      value={formData.title || ""}
                      onChange={(e) =>
                        handleChange("title", e.target.value)
                      }
                    />
                  </>
                )}
              </div>
 
              {selectedWidget && (
                <div className="flex justify-between items-center pt-3 mt-3 border-t bg-white">
 
                  <button
                    onClick={createWidget}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <FiPlus /> Add Widget
                  </button>
 
                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 transition"
                    >
                      Cancel
                    </button>
 
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        submitAllWidgets();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-300 hover:bg-green-100 transition"
                    >
                      Create
                    </button>
 
                  </div>
                </div>
              )}
 
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};
 
export default VisualizationModal;
 
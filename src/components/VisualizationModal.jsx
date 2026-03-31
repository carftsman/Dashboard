import React, { useEffect, useState } from "react";
import api from "../api/apiConfig";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { FaTimes } from "react-icons/fa";

const VisualizationModal = ({ isOpen, onClose, dashboardId }) => {
  const [columns, setColumns] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [formData, setFormData] = useState({});
  const [chartConfigs, setChartConfigs] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [pendingWidgets, setPendingWidgets] = useState([]);

  const graphList = [
    { type: "BAR", icon: "📊" },
    { type: "LINE", icon: "📈" },
    { type: "PIE", icon: "🥧" },
    { type: "KPI", icon: "🔢" },
    { type: "TABLE", icon: "📋" },
  ];

  useEffect(() => {
    if (!dashboardId || !isOpen) return;

    const fetchData = async () => {
      const res = await api.get(`/api/dashboards/${dashboardId}`);
      const dashboard = res.data.dashboard || res.data;
      setColumns(dashboard.columns || []);
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
    if (!selectedWidget) return;

    const newWidget = {
      type: selectedWidget.type,
      name: formData.title || selectedWidget.type,
      config: {
        type: selectedWidget.type.toLowerCase(),
        title: formData.title || selectedWidget.type,
        ...formData,
      },
    };

    setPendingWidgets((prev) => [...prev, newWidget]);
    setFormData({});
  };

  const submitAllWidgets = async () => {
    if (pendingWidgets.length === 0) return;

    try {
      await api.post(`/api/dashboards/${dashboardId}/widgets`, {
        widgets: pendingWidgets,
      });

      setPendingWidgets([]);
      onClose(); // close popup
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const column = columns.find((c) => c.id === active.id);
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
        className="p-3 bg-gray-100 rounded-md mb-2 cursor-grab"
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
        className="flex flex-wrap gap-2 mt-2 p-2 border rounded-md bg-gray-50 min-h-[45px]"
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
      <div key={field} className="mb-3">
        <label className="text-sm text-gray-600">{field}</label>

        <DroppableField field={field}>
          {(selectedFields[field] || []).map((col) => (
            <span
              key={col}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-[#1e3a8a] text-xs rounded-md"
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
                className="ml-1 flex items-center justify-center w-4 h-4 rounded hover:bg-red-100"
              >
                <FaTimes size={10} className="text-red-500" />
              </button>
            </span>
          ))}
        </DroppableField>
      </div>
    ));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white w-[1000px] max-w-[95%] p-4 rounded-xl shadow-lg">
          <div className="flex gap-4">

            {/* LEFT */}
            <div className="flex-1 border-r pr-3">
              <h3 className="text-gray-700 mb-2 text-sm">Columns</h3>
              {columns.map((col) => (
                <DraggableItem key={col.id} col={col} />
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex-1 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1e3a8a]">
              <h3 className="text-gray-700 mb-2 text-sm">
                Visualizations
              </h3>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {graphList.map((g) => (
                  <div
                    key={g.type}
                    onClick={() => {
                      setSelectedWidget({ type: g.type });
                      setFormData({});
                      setSelectedFields({});
                    }}
                    className={`p-2 border rounded-md flex flex-col items-center cursor-pointer ${
                      selectedWidget?.type === g.type
                        ? "border-[#1e3a8a] bg-blue-50"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div>{g.icon}</div>
                    <p className="text-[10px]">{g.type}</p>
                  </div>
                ))}
              </div>

              {selectedWidget && (
                <>
                  {renderFields()}

                  <input
                    type="text"
                    placeholder="Enter chart title"
                    className="w-full mt-2 p-2 border rounded-md text-sm"
                    value={formData.title || ""}
                    onChange={(e) =>
                      handleChange("title", e.target.value)
                    }
                  />

                  {pendingWidgets.length > 0 && (
                    <div className="mt-3 text-sm text-[#1e3a8a]">
                      {pendingWidgets.map((w, i) => (
                        <div key={i}>{w.name}</div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between mt-3">
                    <button
                      onClick={createWidget}
                      className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-md text-sm"
                    >
                      + Add
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={submitAllWidgets}
                        className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-md text-sm"
                      >
                        Create
                      </button>

                      <button
                        onClick={onClose}
                        className="px-3 py-1.5 bg-gray-300 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default VisualizationModal;
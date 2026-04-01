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
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [formData, setFormData] = useState({});
  const [chartConfigs, setChartConfigs] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});

  const graphList = [
    { type: "BAR", icon: "📊" },
    { type: "LINE", icon: "📈" },
    { type: "PIE", icon: "🥧" },
    { type: "KPI", icon: "🔢" },
    { type: "TABLE", icon: "📋" },
    { type: "FUNNEL", icon: "🕳️" },
    { type: "COMBO", icon: "📉" },
    { type: "SCATTER", icon: "📍" },
  ];

  useEffect(() => {
    if (!dashboardId || !isOpen) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/dashboards/${dashboardId}`);
        const dashboard = res.data.dashboard || res.data;

        setColumns(dashboard.columns || []);
        setWidgets(dashboard.widgets || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [dashboardId, isOpen]);

  useEffect(() => {
    const fetchChartConfig = async () => {
      try {
        const res = await api.get("/api/chart-types/config");
        setChartConfigs(res.data.charts || []);
      } catch (err) {
        console.error("Chart config error:", err);
      }
    };

    fetchChartConfig();
  }, []);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const createWidget = async () => {
    if (!selectedWidget) return;

    try {
      await api.post(`/api/dashboards/${dashboardId}/widgets`, {
        widgets: [
          {
            type: selectedWidget.type.toLowerCase(),
            title: formData.title || selectedWidget.type,
            ...formData,
          },
        ],
      });

      setFormData({});
      setSelectedFields({});
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

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const DraggableItem = ({ col }) => {
    const { attributes, listeners, setNodeRef, transform } =
      useDraggable({ id: col.id });

    const style = {
      transform: transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : undefined,
    };

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="p-2 text-sm bg-gray-100 rounded-md mb-2 cursor-grab"
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
        className="flex flex-wrap gap-2 mt-2 mb-2 min-h-[40px] p-2 border rounded-md bg-gray-50"
      >
        {children}
      </div>
    );
  };

  // ✅ UPDATED WITH REMOVE ICON
  const renderFields = () => {
    if (!selectedWidget) return null;

    const config = chartConfigs.find(
      (c) => c.type === selectedWidget.type
    );

    if (!config) return null;

    return config.requiredFields.map((field) => (
      <div key={field} className="mb-4">
        <label className="text-xs font-semibold text-gray-600 uppercase">
          {field}
        </label>

        <DroppableField field={field}>
          {(selectedFields[field] || []).map((col) => (
            <span
              key={col}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md"
            >
              {col}

              {/*  REMOVE ICON */}
              <button
                onClick={() => {
                  setSelectedFields((prev) => {
                    const updated = prev[field].filter((c) => c !== col);

                    setFormData((prevData) => ({
                      ...prevData,
                      [field]: updated,
                    }));

                    return {
                      ...prev,
                      [field]: updated,
                    };
                  });
                }}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                <FaTimes size={10} />
              </button>
            </span>
          ))}
        </DroppableField>
      </div>
    ));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white w-[820px] max-w-[95%] p-4 rounded-2xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-4">

            <div className="flex-1 border-r pr-3">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                Columns
              </h3>

              {columns.map((col) => (
                <DraggableItem key={col.id} col={col} />
              ))}
            </div>

            <div className="flex-1 max-h-[500px] overflow-y-auto pr-2">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">
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
                    <p className="text-[9px]">{g.type}</p>
                  </div>
                ))}
              </div>

              {selectedWidget && (
                <>
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    BUILD VISUAL
                  </p>

                  {renderFields()}

                  <div className="mb-3">
                    <label className="text-xs font-semibold text-gray-600">
                      TITLE
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      placeholder="Enter chart title"
                      onChange={(e) =>
                        handleChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={onClose}
                      className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-md text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={createWidget}
                      className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-md text-sm"
                    >
                      + Create
                    </button>
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
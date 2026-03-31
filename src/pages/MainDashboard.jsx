import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChartRenderer from "../components/ChartRenderer";
import api from "../api/apiConfig";

export default function Dashboard() {
  const location = useLocation();

  const fileId = location.state?.fileId;
  const mappings = location.state?.mappings;

  // ✅ FIX: dynamic dashboardId (NO HARDCODE)
  const dashboardId = location.state?.dashboardId;

  const [dashboard, setDashboard] = useState(null);
  const [widgetData, setWidgetData] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dashboard
  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/api/dashboards/${dashboardId}`);
      setDashboard(res.data);
    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Convert displayName → columnKey
  const getColumnKey = (name) => {
  if (!name || !dashboard?.columns) return null;

  const col = dashboard.columns.find(
    (c) =>
      c.displayName?.toLowerCase().trim() ===
      name.toLowerCase().trim()
  );

  if (!col) {
    console.warn("❌ Column not found for:", name);
  }

  return col?.columnKey || null;
};

  // ✅ Fetch widget data
   const fetchWidgetData = async (widget) => {
  try {
    let mappedConfig = { ...widget.config };

    // ✅ safe groupBy
    const groupBy = mappedConfig.groupBy?.map((g) =>
      getColumnKey(g)
    ) || [];

    // ✅ safe metric
    const metric = mappedConfig.metric?.map((m) =>
      getColumnKey(m)
    ) || [];

    // ✅ FIX mappings format (VERY IMPORTANT)
    const formattedMappings = Object.entries(mappings || {}).map(
      ([templateField, fileColumn]) => ({
        templateField,
        fileColumn,
      })
    );

    console.log("FINAL PAYLOAD:", {
      dashboardId: widget.dashboardId,
      fileId,
      chartType: widget.type,
      groupBy,
      metric,
      mappings: formattedMappings,
    });

    const res = await api.post(`/api/upload/analyze`, {
      dashboardId: widget.dashboardId,
      fileId: fileId,
      chartType: widget.type,
      groupBy,
      metric, // ✅ REQUIRED
      aggregation: "COUNT",
      mappings: formattedMappings, // ✅ FIXED
    });

    console.log("API RESPONSE:", res.data);

    setWidgetData((prev) => ({
      ...prev,
      [widget.id]: res.data?.data || [],
    }));

  } catch (err) {
    console.error("Widget error:", err.response?.data || err.message);
  }
};

  // ✅ FIX: wait for dashboardId
  useEffect(() => {
    if (!dashboardId) {
      console.error("Dashboard ID missing");
      return;
    }
    fetchDashboard();
  }, [dashboardId]);

  useEffect(() => {
    if (dashboard?.widgets && mappings && fileId) {
      dashboard.widgets.forEach((widget) => {
        fetchWidgetData(widget);
      });
    }
  }, [dashboard, mappings, fileId]);

  if (loading) return <p className="p-6">Loading...</p>;

  console.log("dashbiard",dashboard)
  console.log("widgets", widgetData)

  return (
    <div className="flex h-screen bg-[#020617] text-white">
      <Sidebar />

      <div className="ml-[220px] w-full p-6">
        <h1 className="text-xl font-bold mb-6">
          📊 {dashboard?.name}
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {dashboard?.widgets?.map((widget) => (
            <div
              key={widget.id}
              className="bg-[#0f172a] p-4 rounded-xl"
            >
              <h2 className="text-sm mb-3">{widget.name}</h2>

              <ChartRenderer
                type={widget.type}
                data={widgetData[widget.id]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
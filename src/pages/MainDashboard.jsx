import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChartRenderer from "../components/ChartRenderer";
import api from "../api/apiConfig";

export default function Dashboard() {
  const location = useLocation();

  const fileId = location.state?.fileId;
  const mappings = location.state?.mappings;

  const [dashboard, setDashboard] = useState(null);
  const [widgetData, setWidgetData] = useState({});
  const [loading, setLoading] = useState(true);

  const dashboardId = 133;

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
    const col = dashboard?.columns?.find(
      (c) => c.displayName.toLowerCase() === name.toLowerCase()
    );
    return col?.columnKey;
  };

  // ✅ Fetch widget data (🔥 FINAL FIXED)
  const fetchWidgetData = async (widget) => {
    try {
      let mappedConfig = { ...widget.config };

      if (mappedConfig.groupBy) {
        mappedConfig.groupBy = mappedConfig.groupBy.map((g) =>
          getColumnKey(g)
        );
      }

      console.log("FILE ID:", fileId);
      console.log("MAPPINGS:", mappings);
      console.log("CONFIG:", mappedConfig);

      const res = await api.post(`/api/upload/analyze`, {
        dashboardId: widget.dashboardId,
        fileId: fileId,
        chartType: widget.type,

        groupBy: mappedConfig.groupBy,
        aggregation: "COUNT",

        mappings: mappings, // 🔥 CRITICAL FIX
      });

      console.log("API RESPONSE:", res.data);

      setWidgetData((prev) => ({
        ...prev,
        [widget.id]: res.data.data || [],
      }));

    } catch (err) {
      console.error("Widget error:", err.response?.data);
    }
  };
  const generatePieData = (data, groupBy, metric) => {
  if (!data || data.length === 0) return [];

  const map = {};

  data.forEach((row) => {
    const key = row[groupBy];
    const value = Number(row[metric]) || 0;

    if (!key) return;

    map[key] = (map[key] || 0) + value;
  });

  return Object.keys(map).map((key) => ({
    name: key,
    value: map[key],
  }));
};

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboard?.widgets && mappings && fileId) {
      dashboard.widgets.forEach((widget) => {
        fetchWidgetData(widget);
      });
    }
  }, [dashboard, mappings, fileId]);

  if (loading) return <p className="p-6">Loading...</p>;

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
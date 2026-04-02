import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import ChartRenderer from "../components/ChartRenderer";

import api from "../api/apiConfig";
 
export default function Dashboard() {

  const location = useLocation();
 
  const fileId = location.state?.fileId;

  const mappings = location.state?.mappings;

  const dashboardId = location.state?.dashboardId;
 
  const [dashboard, setDashboard] = useState(null);

  const [widgetData, setWidgetData] = useState({});

  const [loading, setLoading] = useState(true);
 
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
 
  //////////////////////////////////////////////////////

  // ✅ FINAL FIXED FUNCTION

  //////////////////////////////////////////////////////

  const fetchWidgetData = async (widget) => {

    try {

      let mappedConfig =

        widget.config?.config || widget.config || {};
 
      const normalizeArray = (val) =>

        Array.isArray(val) ? val : val ? [val] : [];
 
      const rawGroupBy = normalizeArray(

        mappedConfig?.xAxis ||

        mappedConfig?.groupBy ||

        []

      );
 
      const rawMetric = normalizeArray(

        mappedConfig?.yAxis ||

        mappedConfig?.metrics ||

        mappedConfig?.metric ||

        []

      );
 
      //////////////////////////////////////////////////////

      // 🔥 IMPORTANT FIX: displayName → columnKey

      //////////////////////////////////////////////////////

      const getColumnKeyFromMapping = (key) => {

        const fileColumn = mappings?.[key];
 
        if (!fileColumn) return null;
 
        const col = dashboard?.columns?.find(

          (c) =>

            c.displayName?.toLowerCase().trim() ===

            fileColumn.toLowerCase().trim()

        );
 
        return col?.columnKey || null;

      };
 
      const mappedGroupBy = rawGroupBy

        .map((g) => getColumnKeyFromMapping(g))

        .filter(Boolean);
 
      const mappedMetric = rawMetric

        .map((m) => getColumnKeyFromMapping(m))

        .filter(Boolean);
 
      console.log("✅ FINAL groupBy:", mappedGroupBy);

      console.log("✅ FINAL metric:", mappedMetric);
 
      //////////////////////////////////////////////////////

      // 🚨 VALIDATION

      //////////////////////////////////////////////////////

      if (mappedGroupBy.length === 0 || mappedMetric.length === 0) {

        console.warn(

          "❌ Skipping widget (mapping missing):",

          widget.name

        );

        return;

      }
 
      //////////////////////////////////////////////////////

      // FORMAT MAPPINGS

      //////////////////////////////////////////////////////

      const formattedMappings = Object.entries(mappings || {}).map(

        ([templateField, fileColumn]) => ({

          templateField,

          fileColumn,

        })

      );
 
      //////////////////////////////////////////////////////

      // FINAL PAYLOAD

      //////////////////////////////////////////////////////

      const payload = {

        dashboardId: widget.dashboardId,

        fileId,

        chartType: widget.type,

        groupBy: mappedGroupBy,   // ✅ FIXED

        metric: mappedMetric,     // ✅ FIXED

        aggregation: "COUNT",

        mappings: formattedMappings,

      };
 
      console.log("🚀 FINAL PAYLOAD:", payload);
 
      //////////////////////////////////////////////////////

      // API CALL

      //////////////////////////////////////////////////////

      const res = await api.post(`/api/upload/analyze`, payload);
 
      setWidgetData((prev) => ({

        ...prev,

        [widget.id]: res.data?.data || [],

      }));
 
    } catch (err) {

      console.error(

        "❌ Widget error:",

        err.response?.data || err.message

      );

    }

  };
 
  //////////////////////////////////////////////////////
 
  useEffect(() => {

    if (!dashboardId) return;

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
 
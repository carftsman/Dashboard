import React, { useState, useEffect } from "react";
 
export default function ChartOverlay({ open, onClose, dashboardId, onChartSaved, chart }) {
  const [showVisuals, setShowVisuals] = useState(true);
  const [showData, setShowData] = useState(true);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [chartType, setChartType] = useState("BAR");
  const [title, setTitle] = useState("");
  const [chartConfigs, setChartConfigs] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState(null);
 
 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };
 
  const token = localStorage.getItem("token");
 
  const chartOptions = [
    { type: "BAR", icon: "📊" },
    { type: "LINE", icon: "📈" },
    { type: "PIE", icon: "🥧" },
    { type: "AREA", icon: "📉" },
    { type: "SCATTER", icon: "🔵" },
  ];
 
  const getChartIcon = (type) => {
    switch (type) {
      case "BAR": return "📊";
      case "LINE": return "📈";
      case "PIE": return "🥧";
      case "AREA": return "📉";
      case "SCATTER": return "🔵";
      case "DONUT": return "🍩";
      case "STACKED_BAR": return "📚";
      case "FUNNEL": return "🔻";
      case "TABLE": return "📋";
      case "KPI": return "📌";
      default: return "📊";
    }
  };
 
  useEffect(() => {
    if (chart) {
      const cfg = chart.config || {};
      setXAxis(cfg.xAxis?.[0] || cfg.groupBy || null);
      setYAxis(cfg.yAxis?.[0] || cfg.metrics?.[0] || null);
      setChartType(chart.type?.toUpperCase() || "BAR");
      setTitle(chart.name || "");
    } else {
      setXAxis(null);
      setYAxis(null);
      setChartType("BAR");
      setTitle("");
    }
  }, [chart, open]);
 
  const fetchChartConfigs = async () => {
    try {
      const response = await fetch("https://dashboard-backend-cyrd.onrender.com/api/chart-types/config", {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await response.json();
      if (response.ok) setChartConfigs(data.charts || []);
    } catch (error) {}
  };
 
  const fetchColumns = async () => {
    try {
      const response = await fetch(`https://dashboard-backend-cyrd.onrender.com/api/upload/builder/${dashboardId}`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await response.json();
      if (response.ok) {
        setColumns(data.columns || []);
        setFileId(data.fileId);
      }
    } catch (error) {}
  };
 
  useEffect(() => {
    if (open) {
      fetchChartConfigs();
      fetchColumns();
    }
  }, [open]);
 
  const handleSaveChart = async () => {
    if (!fileId) return showToast("File not loaded yet ", "error");
    if (!xAxis || !yAxis) return showToast("Please drag and drop fields ❌", "error");
 
    try {
      setLoading(true);
      const typeUpper = chartType.toUpperCase();
      let config = {};
 
      if (["LINE", "AREA", "STACKED_BAR", "SCATTER"].includes(typeUpper)) {
        config = { xAxis: [xAxis], metrics: [yAxis], yAxis: [yAxis] };
      } else if (["PIE", "DONUT", "BAR"].includes(typeUpper)) {
        config = { groupBy: xAxis, metrics: [yAxis] };
      } else if (typeUpper === "FUNNEL") {
        config = { steps: [xAxis, yAxis] };
      } else if (typeUpper === "TABLE") {
        config = { columns: [xAxis, yAxis] };
      } else if (typeUpper === "KPI") {
        config = { metrics: [yAxis] };
      }
 
      const payload = {
        dashboardId: Number(dashboardId),
        fileId: fileId,
        name: title || `${xAxis} by ${yAxis}`,
        type: typeUpper === "DONUT" ? "PIE" : typeUpper,
        config: config,
        replaceWidgetId: chart?.id ? Number(chart.id) : 0,
      };
 
      const response = await fetch("https://dashboard-backend-cyrd.onrender.com/api/widgets/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
 
      const result = await response.json();
 
      if (response.ok) {
       
        onChartSaved({ ...result.widget, type: chartType });
        onClose();
      } else {
        showToast(result.message || "Failed to save chart ", "error");
      }
    } catch (error) {
      showToast("Network error while saving chart", "error");
    } finally {
      setLoading(false);
    }
  };
 
  if (!open) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex">
     
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300">
          <div className={`px-6 py-2 rounded-full shadow-lg text-sm font-medium border flex items-center gap-2 ${
            toast.type === "success" ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"
          }`}>
            {toast.message}
          </div>
        </div>
      )}
 
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="ml-auto h-full bg-[#f8fafc] text-black shadow-xl relative z-10 p-3 flex transition-all duration-300">
     
        <div className={`transition-all duration-300 border-r p-2 ${showVisuals ? "w-1/3" : "w-[40px]"} overflow-hidden`}>
          <div className="flex justify-between items-center mb-2">
            {showVisuals && <h3 className="text-xs font-semibold">{chartType}</h3>}
            <button onClick={() => setShowVisuals(!showVisuals)} className="text-xs">{showVisuals ? "‹" : "›"}</button>
          </div>
          {showVisuals && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {(chartConfigs.length ? chartConfigs : chartOptions).map((c, i) => (
                  <div key={i} onClick={() => setChartType(c.type)} className={`h-10 rounded flex items-center justify-center text-lg cursor-pointer border ${chartType === c.type ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    {getChartIcon(c.type)}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs">
                <p className="font-semibold">Chart Title</p>
                <input className="w-full border p-1 mt-1 rounded outline-none focus:ring-1 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
              </div>
              <div className="mt-3 text-xs">
                {(chartConfigs.find(c => c.type === chartType) || { requiredFields: ["xAxis", "yAxis"] }).requiredFields.map((field) => (
                  <div key={field} className="mt-2">
                    <p className="capitalize font-medium text-gray-600">{field}</p>
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const data = e.dataTransfer.getData("text/plain");
                        if (field === "xAxis" || field === "groupBy") setXAxis(data);
                        else setYAxis(data);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className={`border-2 border-dashed p-2 min-h-[40px] rounded mt-1 flex items-center justify-center ${
                        ((field === "xAxis" || field === "groupBy") ? xAxis : yAxis) ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      {((field === "xAxis" || field === "groupBy") ? xAxis : yAxis) || "Drop here"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
 
       
        <div className="flex-1 p-3 flex flex-col overflow-hidden w-74">
          <div className="flex justify-between items-center mb-2">
            {showData && <h3 className="text-[12px] font-semibold">Data Columns</h3>}
            <button onClick={() => setShowData(!showData)} className="text-xs">{showData ? "‹" : "›"}</button>
          </div>
          {showData && (
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {columns.map((col) => (
                <div
                  key={col.key}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", col.key)}
                  className="flex justify-between text-[11px] px-2 py-2 bg-white border rounded hover:border-blue-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
                >
                  <span className="truncate">{col.key}</span>
                  <span className="text-gray-400">⋮⋮</span>
                </div>
              ))}
            </div>
          )}
        </div>
 
   
        <div className="absolute top-2 right-2 flex gap-2">
          <button onClick={handleSaveChart} disabled={loading} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-medium transition-colors shadow-sm">
            {loading ? "Saving..." : "Save Chart"}
          </button>
          <button onClick={onClose} className="text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded font-medium transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}
 
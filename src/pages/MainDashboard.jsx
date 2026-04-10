import React, { useEffect, useState } from "react";
 
import { useLocation, useNavigate } from "react-router-dom";
 
import ChartRenderer from "../components/ChartRenderer";
 
import ChartOverlay from "../components/ChartOverLay";
 
import api from "../api/apiConfig";
 
import html2canvas from "html2canvas";
 
import jsPDF from "jspdf";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
 
export default function Dashboard() {
 
  const location = useLocation();
 
  const navigate = useNavigate();
 
  const [darkMode, setDarkMode] = useState(true);
 
  const fileId = location.state?.fileId;
 
  const dashboardId = location.state?.dashboardId;
 
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
 
  const [editIndex, setEditIndex] = useState(null);
 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 
  const showToast = (message, type = "success") => {
 
    setToast({ show: true, message, type });
 
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
 
  };
 
  const cardBg = darkMode ? "bg-[#0f172a]" : "bg-white";
 
  const textMain = darkMode ? "text-white" : "text-black";
 
  const textSub = darkMode ? "text-gray-400" : "text-gray-600";
 
  const buttonBg = darkMode
 
    ? "bg-gray-700 hover:bg-gray-600 text-white"
 
    : "bg-gray-200 hover:bg-gray-300 text-black";
 
  const [dashboard, setDashboard] = useState(null);
 
  const [charts, setCharts] = useState([]);
 
  const [loading, setLoading] = useState(true);
 
  const [showSaveModal, setShowSaveModal] = useState(false);
 
  const [fileName, setFileName] = useState("Dashboard_Report");
 
  const [isExporting, setIsExporting] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const handleChartUpdated = async (updatedChart) => {
  // ✅ 1. Update UI instantly (optional but good)
  setCharts((prevCharts) =>
    prevCharts.map((c) =>
      c.id === updatedChart.id
        ? { ...c, ...updatedChart }
        : c
    )
  );
 
  // ✅ 2. REFETCH FROM BACKEND (IMPORTANT)
  await fetchDashboardData();
 
  setIsOverlayOpen(false);
  showToast("Chart updated successfully!");
};
 
  const handleExportPDF = async () => {
 
    try {
 
setIsExporting(true);
 
// ✅ GET ELEMENT
const element = document.getElementById("dashboard-content");
 
// ✅ REMOVE SCROLL (CLEAN WAY)
document.body.classList.add("pdf-export");
 
// ✅ OPTIONAL HEIGHT FIX
element.style.height = "auto";
 
const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,
  backgroundColor: darkMode ? "#020617" : "#f3f4f6",
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,
});
 
// ✅ RESTORE UI
document.body.classList.remove("pdf-export");
element.style.height = "";
 
      const imgData = canvas.toDataURL("image/png");
 
      const pdf = new jsPDF("p", "mm", "a4");
 
      const pdfWidth = pdf.internal.pageSize.getWidth();
 
      const pdfHeight = pdf.internal.pageSize.getHeight();
 
      const imgProps = pdf.getImageProperties(imgData);
 
      const ratio = imgProps.width / imgProps.height;
 
      const finalWidth = pdfWidth;
 
      const finalHeight = pdfWidth / ratio;
 
      if (darkMode) {
 
        pdf.setFillColor(2, 6, 23);
 
        pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
 
      }
 
      pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);

 
element.style.height = "";
      const pdfBlob = pdf.output("blob");
 
      // Automatic download for the user immediately
 
      const url = window.URL.createObjectURL(pdfBlob);
 
      const link = document.createElement("a");
 
      link.href = url;
 
      link.setAttribute("download", `${fileName}.pdf`);
 
      document.body.appendChild(link);
 
      link.click();
 
      document.body.removeChild(link);
 
      const formData = new FormData();
 
      formData.append("file", pdfBlob, `${fileName}.pdf`);
 
      formData.append("name", fileName);
 
      formData.append("dashboardId", dashboardId);
 
      formData.append("fileId", fileId);
 
      await api.post("/api/reports/upload", formData, {
 
        headers: { "Content-Type": "multipart/form-data" },
 
      });
 
      showToast("Report generated successfully! ");
 
      setShowSaveModal(false);
 
    } catch (err) {
 
      console.error("PDF Export/Upload Error:", err);
 
      showToast("Failed to generate report ", "error");
 
    } finally {
 
      setIsExporting(false);
 
    }
 
  };
 
  const fetchDashboard = async () => {
 
    try {
 
      const res = await api.get(`/api/dashboards/${dashboardId}`);
 
      setDashboard(res.data);
 
    } catch (err) {
 
      setDashboard({ name: "ROI Dashboard", description: "Marketing performance dashboard" });
 
    }
 
  };
 
  // ✅ ADD THIS (no UI impact)
 
  const normalizeData = (data) => {
 
    if (!data) return [];
 
 
    if (Array.isArray(data)) {
 
      return data.map((item, i) => {
 
        if (typeof item !== "object") {
 
          return {
 
            name: `Item ${i + 1}`,
 
            value: Number(item) || 0
 
          };
 
        }
 
        return {
 
          ...item,
 
          name:
 
            item.name ||
 
            item.campaign_name ||
 
            item.displayX ||
 
            `Item ${i + 1}`,
 
          value:
 
            Number(item.value) ||
 
            Number(item.reach) ||
 
            Number(item.clicks) ||
 
            0
 
        };
 
      });
 
    }
 
    return [];
 
  };
 
  const fetchDashboardData = async () => {
 
    try {
 
      const res = await api.get(`/api/dashboard-data/${dashboardId}`, {
 
        params: {
          fileId,
 
        },
 
      });
 
      const safeCharts = res.data?.charts || []
 
      setCharts(safeCharts);
 
    } catch (err) {
 
      console.error(err);
 
    } finally {
 
      setLoading(false);
 
    }
 
  };
 
  useEffect(() => {
 
    if (!dashboardId) return;
 
    fetchDashboard();
 
    fetchDashboardData();
 
  }, [dashboardId, fileId]);
  useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
 
  window.addEventListener("resize", handleResize);
 
  return () => window.removeEventListener("resize", handleResize);
}, []);
 
  if (loading) return <p className="p-6">Loading...</p>;
  const savedLayout = JSON.parse(localStorage.getItem("dashboardLayout"));
 
  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-[#020617]" : "bg-gray-100"} transition-all duration-300 relative`}>
 
      {toast.show && (
        <div className="fixed top-5 right-5 z-[100] animate-bounce-in">
          <div className={`px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border ${toast.type === "success"
 
            ? "bg-green-600 border-green-400 text-white"
 
            : "bg-red-600 border-red-400 text-white"
 
            }`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="text-white/70 hover:text-white">✕</button>
          </div>
        </div>
 
      )}
 
      <div className="w-full p-6 flex flex-col">
        <div id="dashboard-content" className={`${darkMode ? "bg-[#020617]" : "bg-gray-100"} p-2`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${textMain}`}>{dashboard?.name || "ROI Dashboard"}</h1>
              <p className={`text-sm ${textSub}`}>{dashboard?.description || "Marketing performance dashboard"}</p>
            </div>
 
            <div className="flex items-center gap-4" data-html2canvas-ignore="true">
              <div
 
                onClick={() => setDarkMode(!darkMode)}
 
                className="relative w-[76px] h-[34px] bg-[#717171] rounded-xl cursor-pointer p-[3px] transition-all duration-300 flex items-center shadow-inner"
              >
                <div className="absolute inset-0 flex justify-between items-center px-2.5 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                </div>
                <div
 
                  className={`relative w-[34px] h-[28px] bg-white rounded-lg shadow-md transform transition-transform duration-300 flex items-center justify-center ${darkMode ? "translate-x-0" : "translate-x-[36px]"}`}
                >
 
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
 
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
 
                  )}
                </div>
              </div>
 
              <button
 
                onClick={() => setShowSaveModal(true)}
 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
 
                Export PDF
              </button>
            </div>
          </div>
 
        <GridLayout

  className="layout"

layout={
  savedLayout ||
  charts.map((c, i) => ({
    i: String(c.id || i),
    x: (i % 4) * 3,
    y: Math.floor(i / 4) * 4,
    w: 3,
    h: 5   // 🔥 INCREASE HEIGHT
  }))
}

  cols={12}

  rowHeight={60}

  width={width - 100}   // 🔥 FIX RESPONSIVE

  draggableHandle=".drag-handle"
 
  // 🔥 ADD THESE

  isResizable={true}

  isDraggable={true}

  resizeHandles={['se', 'e', 's']}
 
  onLayoutChange={(layout) => {

    localStorage.setItem("dashboardLayout", JSON.stringify(layout));

  }}
>
 
  {charts

  .filter((c) => c.type?.toLowerCase() !== "kpi")

  .map((chart, index) => (
<div
  key={chart.id || index}
  className={`${cardBg} p-3 rounded-xl shadow border border-transparent hover:border-blue-500`}
  style={{ height: "100%", overflow: "hidden" }}

      onClick={(e) => {
  if (e.target.closest(".drag-handle")) return;
  setEditIndex(index);
  setIsOverlayOpen(true);
}}
>

      {/* 🔥 DRAG HANDLE */}
<div className="drag-handle cursor-move text-xs mb-2 text-gray-400">

        Drag
</div>
 
      <h2 className={`text-sm mb-3 ${textMain}`}>
                    {chart.config?.config?.title || chart.title_name || chart.name || chart.type}
                  </h2>
 
 
  <div style={{ width: "100%", height: "calc(100% - 40px)" }}>
<ChartRenderer
    type={chart.type}
    data={Array.isArray(chart.data) ? chart.data : []}
    config={chart.config}
    darkMode={darkMode}
  />
</div>
</div>

))}
 </GridLayout>
        </div>
 
        <ChartOverlay
 
          open={isOverlayOpen}
 
          chart={editIndex !== null ? charts[editIndex] : null}
 
          dashboardId={dashboardId}
 
          onClose={() => setIsOverlayOpen(false)}
 
          onChartSaved={handleChartUpdated}
 
        />
      </div>
 
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className={`${cardBg} p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700`}>
            <h2 className={`text-xl font-semibold mb-2 ${textMain}`}>Export Report</h2>
            <p className={`text-sm mb-4 ${textSub}`}>Enter a name for your PDF report.</p>
 
            <input
 
              value={fileName}
 
              onChange={(e) => setFileName(e.target.value)}
 
              placeholder="Report Name"
 
              className={`w-full p-3 rounded-lg border mb-6 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "border-gray-600 text-white" : "border-gray-300 text-black"}`}
 
            />
 
            <div className="flex justify-end gap-3">
              <button
 
                onClick={() => setShowSaveModal(false)}
 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${buttonBg}`}
 
                disabled={isExporting}
              >
 
                Cancel
              </button>
              <button
 
                onClick={handleExportPDF}
 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
 
                disabled={isExporting}
              >
 
                {isExporting ? "Exporting..." : "Generate PDF"}
              </button>
            </div>
          </div>
        </div>
 
      )}
    </div>
 
  );
 
}
 
 
 
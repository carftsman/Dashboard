import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChartRenderer from "../components/ChartRenderer";
import ChartOverlay from "../components/ChartOverLay";
import api from "../api/apiConfig";
// --- NEW IMPORTS FOR PDF GENERATION ---
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const fileId = location.state?.fileId;
  const dashboardId = location.state?.dashboardId;

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // --- Notification State ---
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

  const handleChartUpdated = (updatedChart) => {
    setCharts((prev) => {
      const exists = prev.find((c) => c.id === updatedChart.id);
      if (exists) {
        return prev.map((c) =>
          c.id === updatedChart.id ? { ...c, ...updatedChart } : c
        );
      }
      return [...prev, updatedChart];
    });
    fetchDashboardData();
    setIsOverlayOpen(false);
    showToast("Chart updated successfully!");
  };

  // --- UPDATED EXPORT LOGIC ---
  const handleExportPDF = async () => {
  try {
    setIsExporting(true);

    // 1. Select the element
    const element = document.getElementById("dashboard-content");
    
    // 2. Capture with specific dark mode overrides
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      // Force the canvas to use your specific dark background hex
      backgroundColor: darkMode ? "#020617" : "#f3f4f6", 
      logging: false,
      // Ensure it captures the full scrollable height/width
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // This ensures that even inside the "cloned" version for the screenshot, 
        // the background is forced to dark.
        const clonedElement = clonedDoc.getElementById("dashboard-content");
        if (clonedElement) {
          clonedElement.style.backgroundColor = darkMode ? "#020617" : "#f3f4f6";
          clonedElement.style.color = darkMode ? "#ffffff" : "#000000";
        }
      }
    });
    
    const imgData = canvas.toDataURL("image/png");

    // 3. Setup jsPDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;
    const finalWidth = pdfWidth;
    const finalHeight = pdfWidth / ratio;

    // --- NEW: Fill the PDF background color before adding the image ---
    // This prevents white borders if the image doesn't perfectly fill the A4 page
    if (darkMode) {
      pdf.setFillColor(2, 6, 23); // Matches #020617
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
    }

    pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);

    // 4. Download and Upload
    const pdfBlob = pdf.output("blob");
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

    showToast("Report generated and uploaded successfully! ✅");
    setShowSaveModal(false);
  } catch (err) {
    console.error("PDF Export/Upload Error:", err);
    showToast("Failed to generate report ❌", "error");
  } finally {
    setIsExporting(false);
  }
};

  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/api/dashboards/${dashboardId}`);
      // This maps "ROI Dashboard" and "Marketing performance dashboard"
      setDashboard(res.data);
    } catch (err) {
      setDashboard({ name: "ROI Dashboard", description: "Marketing performance dashboard" });
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await api.get(`/api/dashboard-data/${dashboardId}`, {
        params: { fileId },
      });
      setCharts(res.data?.charts || []);
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-[#020617]" : "bg-gray-100"} transition-all duration-300 relative`}>
      
      {/* --- TOAST POPUP --- */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-[100] animate-bounce-in">
          <div className={`px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border ${
            toast.type === "success" 
            ? "bg-green-600 border-green-400 text-white" 
            : "bg-red-600 border-red-400 text-white"
          }`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="text-white/70 hover:text-white">✕</button>
          </div>
        </div>
      )}

      <div className="w-full p-6 flex flex-col">
        {/* IMPORTANT: This ID captures the content with the background color applied */}
        <div id="dashboard-content" className={`${darkMode ? "bg-[#020617]" : "bg-gray-100"} p-2`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${textMain}`}>{dashboard?.name || "ROI Dashboard"}</h1>
              <p className={`text-sm ${textSub}`}>{dashboard?.description || "Marketing performance dashboard"}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* --- THEME TOGGLE --- */}
              <div 
                onClick={() => setDarkMode(!darkMode)}
                className="relative w-[76px] h-[34px] bg-[#717171] rounded-xl cursor-pointer p-[3px] transition-all duration-300 flex items-center shadow-inner"
              >
                <div className="absolute inset-0 flex justify-between items-center px-2.5 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </div>
                <div 
                  className={`relative w-[34px] h-[28px] bg-white rounded-lg shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    darkMode ? "translate-x-0" : "translate-x-[36px]"
                  }`}
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  )}
                </div>
              </div>

              {/* <button
                onClick={() => {
                  setEditIndex(null);
                  setIsOverlayOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                + Add Chart
              </button> */}

              <button 
                onClick={() => setShowSaveModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-4 flex gap-4 overflow-x-auto pb-2">
              {charts
                .filter((c) => c.type?.toLowerCase() === "kpi")
                .flatMap((chart) =>
                  Object.entries(chart.data || {}).map(([key, value], i) => (
                    <div key={i} className={`${cardBg} p-4 rounded-xl shadow min-w-[150px] transition-all border border-transparent hover:border-gray-500`}>
                      <p className={`text-xs ${textSub}`}>{key}</p>
                      <p className={`text-lg font-bold ${textMain}`}>{value}</p>
                    </div>
                  ))
                )}
            </div>

            {charts
              .filter((c) => c.type?.toLowerCase() !== "kpi")
              .map((chart, index) => (
                <div
                  key={index}
                  className={`${cardBg} p-4 rounded-xl shadow transition-all cursor-pointer border border-transparent hover:border-blue-500`}
                  onClick={() => {
                    setEditIndex(index);
                    setIsOverlayOpen(true);
                  }}
                >
                  <h2 className={`text-sm mb-3 ${textMain}`}>{chart.name || chart.type}</h2>
                  <ChartRenderer type={chart.type} data={chart.data} config={chart.config} darkMode={darkMode} />
                </div>
              ))}
          </div>
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
              className={`w-full p-3 rounded-lg border mb-6 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode ? "border-gray-600 text-white" : "border-gray-300 text-black"
              }`} 
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
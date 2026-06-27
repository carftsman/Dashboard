import React, { useEffect, useState, useCallback } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import ChartRenderer from "../components/ChartRenderer";

import ChartOverlay from "../components/ChartOverLay";
import {
  uploadReport,
  getReportSummary,
  updateReportSummary,
  saveReportSummary,
} from "../services/reportService";
import api from "../api/apiConfig";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function Dashboard() {

  const location = useLocation();

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  
  const fileId = location.state?.fileId;
  const [reportSummary, setReportSummary] = useState(
  sessionStorage.getItem(`reportSummary_${fileId}`) || ""
);
  const dashboardId = location.state?.dashboardId;

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const [editChartId, setEditChartId] = useState(null);


  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const showToast = (message, type = "success") => {
    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
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
  const fetchReportSummary = async () => {
    try {
      const res = await getReportSummary(fileId);

      setReportSummary(
        res.reportSummary ||
        res.data?.reportSummary ||
        ""
      );
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };
  const handleChartUpdated = async (updatedChart) => {

    setCharts((prevCharts) =>
      prevCharts.map((c) => {
        if (c.id !== updatedChart.id) return c;

        return {
          ...c,
          ...updatedChart,
          config: {
            ...(c.config || {}),
            ...(updatedChart.config || {}),
          },
        };
      })
    );


    await fetchDashboardData();

    setIsOverlayOpen(false);
    setEditChartId(null);
    showToast("Chart updated successfully!");
  };
  const handleSaveReport = async () => {
  try {
    console.log("fileId:", fileId);
    console.log("reportSummary:", reportSummary);

    const response = await saveReportSummary({
      dashboardId,
      fileId,
      reportSummary,
    });

    console.log(response);

    showToast("Report saved successfully");
  } catch (error) {
    console.error("SAVE ERROR:", error.response?.data);
    console.error(error);

    showToast("Failed to save report", "error");
  }
};
  const handleExportPDF = async () => {

    try {

      setIsExporting(true);

      const element = document.getElementById("dashboard-content");

      const canvas = await html2canvas(element, {

        scale: 2,

        useCORS: true,

        backgroundColor: darkMode ? "#020617" : "#f3f4f6",

        logging: false,

        windowWidth: element.scrollWidth,

        windowHeight: element.scrollHeight,

        onclone: (clonedDoc) => {
  const clonedElement = clonedDoc.getElementById("dashboard-content");

  if (clonedElement) {
    clonedElement.style.backgroundColor = darkMode
      ? "#020617"
      : "#f3f4f6";

    clonedElement.style.color = darkMode
      ? "#ffffff"
      : "#000000";

    const toIgnore = clonedElement.querySelectorAll(
      "[data-html2canvas-ignore]"
    );

    toIgnore.forEach((el) => {
      el.style.display = "none";
    });
  }

  // Preserve textarea line breaks in PDF
  const textareas = clonedDoc.querySelectorAll("textarea");

  textareas.forEach((textarea) => {
    const div = clonedDoc.createElement("div");

    const styles = window.getComputedStyle(textarea);

    div.style.whiteSpace = "pre-wrap";
    div.style.wordBreak = "break-word";
    div.style.minHeight = textarea.offsetHeight + "px";
    div.style.padding = styles.padding;
    div.style.border = styles.border;
    div.style.borderRadius = styles.borderRadius;
    div.style.backgroundColor = styles.backgroundColor;
    div.style.color = styles.color;
    div.style.font = styles.font;
    div.style.lineHeight = styles.lineHeight;

    div.textContent = textarea.value;

    textarea.parentNode.replaceChild(div, textarea);
  });
}

      });

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
      await uploadReport(formData);


      showToast("Report generated successfully! ");

      setShowSaveModal(false);

    } catch (err) {

      console.error("PDF Export/Upload Error:", err);

      showToast("Failed to generate report ", "error");

    } finally {

      setIsExporting(false);

    }

  };

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get(`/api/dashboards/${dashboardId}`);
      setDashboard(res.data);
    } catch (err) {
      setDashboard({ name: "ROI Dashboard", description: "Marketing performance dashboard" });
    }
  }, [dashboardId]);

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

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await api.get(`/api/dashboard-data/${dashboardId}`, {
        params: { fileId },
      });

      const safeCharts = res.data?.charts || [];
      setCharts(safeCharts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dashboardId, fileId]);

  useEffect(() => {

    if (!dashboardId) return;

    fetchDashboard();

    fetchDashboardData();
    if (fileId) {
      fetchReportSummary();
    }

  }, [dashboardId, fileId, fetchDashboard, fetchDashboardData]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-[#020617]" : "bg-gray-100"} transition-all duration-300 relative`}>



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

          <div className="grid grid-cols-4 gap-6">

            {/* KPI SECTION (UNCHANGED) */}
            <div className="col-span-4 flex flex-wrap gap-3 pb-2">
              {charts
                .filter((c) => c.type?.toLowerCase() === "kpi")
                .flatMap((chart) =>
                  (chart.data || []).map((item, i) => (
                    <div
                      key={`${chart.id}-${item?.name}-${i}`}
                      className={`${cardBg} px-4 py-2 rounded-xl shadow transition-all border border-transparent hover:border-gray-500 w-fit`}
                    >
                      <p className={`text-xs ${textSub}`}>
                        {
                          chart?.config?.title ||
                          chart?.name ||
                          item?.name ||
                          "N/A"
                        }
                      </p>
                      <p className={`text-lg font-bold ${textMain}`}>
                        {Number(item?.value || item?.reach || item?.clicks || 0)}
                      </p>
                    </div>
                  ))
                )}
            </div>


            <div className="col-span-4">
              <GridLayout
                className="layout"
                layout={charts
                  .filter((c) => c.type?.toLowerCase() !== "kpi")
                  .map((chart, i) => ({
                    i: String(chart.id),
                    x: (i % 4) * 3,
                    y: Math.floor(i / 4) * 3,
                    w: 3,
                    h: 2.5
                  }))
                }
                cols={12}
                rowHeight={50}
                width={width - 120}
                draggableHandle=".drag-handle"
                isResizable={true}
                isDraggable={true}
                resizeHandles={['se', 'e', 's']}
              >

                {charts
                  .filter((c) => c.type?.toLowerCase() !== "kpi")
                  .map((chart) => (
                    <div
                      key={String(chart.id)}
                      className={`${cardBg} p-4 rounded-xl shadow border border-transparent hover:border-blue-500 flex flex-col`}
                    >

                      {/* DRAG HANDLE */}
                      <div className="drag-handle cursor-move text-xs mb-2 text-gray-400">

                      </div>

                      <h2 className={`text-sm mb-3 ${textMain}`}>
                        {
                          chart.name ||
                          chart.config?.config?.title ||
                          chart.config?.title ||
                          chart.type
                        }
                      </h2>

                      <div className="flex-1 min-h-0"
                        onClick={() => {
                          setEditChartId(chart.id);
                          setIsOverlayOpen(true);
                        }}
                      >
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
                    </div>

          {/* Report Summary Section */}
          <div className={`${cardBg} mt-6 p-5 rounded-xl shadow border border-gray-700`}>
            <h2 className={`text-lg font-semibold mb-3 ${textMain}`}>
              Report Summary
            </h2>

            <textarea
  value={reportSummary}
  onChange={(e) => {
    const value = e.target.value
    setReportSummary(value);
    sessionStorage.setItem(
      `reportSummary_${fileId}`,
      value
    )
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }}
  placeholder="Write your report summary here..."
  rows={2}
  className={`w-full p-4 rounded-lg border resize-none overflow-hidden outline-none transition-all ${
    darkMode
      ? "bg-[#1e293b] border-gray-600 text-white"
      : "bg-white border-gray-300 text-black"
  }`}
/>

{/* PDF Export Version */}
<div
  className={`hidden-print whitespace-pre-wrap ${
    darkMode ? "text-white" : "text-black"
  }`}
  style={{
    whiteSpace: "pre-wrap",
    display: "none",
  }}
>
  {reportSummary}
</div>
            <div className="flex justify-between items-center mt-2">
              <p className={`text-xs ${textSub}`}>
                {reportSummary.length} characters
              </p>

              
            </div>
          </div>
        </div> {/* dashboard-content ends here */}

        <ChartOverlay

          open={isOverlayOpen}

          chart={charts.find(c => c.id === editChartId) || null}

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




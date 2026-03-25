import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMappingData, postManualMapping } from "../services/uploadService";

// ─── Icons ────────────────────────────────────────────────────────────────
const SpeakerIcon = () => (
  <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);
const MoneyIcon = () => (
  <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const CursorIcon = () => (
  <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);
const DocumentIcon = () => (
  <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
const BackIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const InfoIcon = () => (
  <svg className="w-5 h-5 text-[#3b4b86]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const MinusCircleIcon = () => (
  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const getSystemIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("campaign")) return <SpeakerIcon />;
  if (n.includes("spend") || n.includes("cost")) return <MoneyIcon />;
  if (n.includes("impression") || n.includes("view")) return <EyeIcon />;
  if (n.includes("click")) return <CursorIcon />;
  return <DocumentIcon />;
};

export default function ColumnMapping() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileId = location.state?.fileId;
  console.log("fileId",fileId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mappingData, setMappingData] = useState(null);
  
  // Custom mappings state: { [systemKey]: fileColumnName }
  const [mappings, setMappings] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setError("No file ID provided. Please upload a file first.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("fetchData entered....",fileId);
        setLoading(true);
        const data = await getMappingData(fileId);
        console.log("mapping data",data);
        setMappingData(data);

        // Auto-match system columns with file columns
        const sysCols = data.dashboardColumns || [];
        const fileCols = data.fileColumns || [];
        console.log("sysCols",sysCols,"fileCols",fileCols);
        const initialMappings = {};

        sysCols.forEach((sysCol) => {
          console.log("one sys col",sysCol);
          const sysNameClean = (sysCol.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const sysKeyClean = (sysCol.key || "").toLowerCase().replace(/[^a-z0-9]/g, "");

          // 1. Try exact match loosely
          let match = fileCols.find((fc) => {
            const fcClean = fc.toLowerCase().replace(/[^a-z0-9]/g, "");
            return fcClean === sysNameClean || (sysKeyClean && fcClean === sysKeyClean);
          });
          
          // 2. Try partial match if no exact
          if (!match) {
            match = fileCols.find((fc) => {
              const fcClean = fc.toLowerCase().replace(/[^a-z0-9]/g, "");
              return fcClean.includes(sysNameClean) || (sysKeyClean && fcClean.includes(sysKeyClean));
            });
          }

          if (match) {
            // we use the templateField as key, assuming it's sysCol.key or sysCol.name
            initialMappings[sysCol.key || sysCol.name] = match;
          }
        });

        setMappings(initialMappings);
      } catch (err) {
        setError(err?.message || err?.error || "Failed to fetch mapping data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  const handleSelectChange = (sysColKey, value) => {
    setMappings((prev) => {
      const newMappings = { ...prev };
      if (value) {
        newMappings[sysColKey] = value;
      } else {
        delete newMappings[sysColKey];
      }
      return newMappings;
    });
  };

  const handleReviewData = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const dashboardId = mappingData?.dashboardId || mappingData?.dashboardColumns?.[0]?.dashboardId || 1;

      // Formatting payload to hit postManualMapping
      const payloadMappings = Object.entries(mappings).map(([templateField, fileColumn]) => ({
        dashboardId,
        templateField,
        fileColumn,
      }));

      if (payloadMappings.length === 0) {
        setError("At least one column must be mapped.");
        setSubmitting(false);
        return;
      }

      await postManualMapping({
        fileId,
        mappings: payloadMappings,
      });

      // Show success message as per user's request
      setSuccess("Mappings successfully saved! The file is being processed.");
    } catch (err) {
      setError(err?.message || err?.error || "Failed to submit column mappings.");
    } finally {
      setSubmitting(false);
    }
  };

  // Safe checks
  const sysCols = mappingData?.dashboardColumns || [];
  const fileCols = mappingData?.fileColumns || [];
  const totalCols = sysCols.length;
  const mappedCols = Object.keys(mappings).length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-[220px]">
        <main className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#eef2f6] text-[#475569] hover:bg-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm font-semibold mb-8 transition-colors"
          >
            <BackIcon />
            Back to Upload
          </button>

          {/* Header section */}
          <div className="mb-8">
            <h1 className="text-3xl font-[800] text-[#1e293b] tracking-tight mb-2">Map your columns</h1>
            <p className="text-[15px] text-[#64748b] max-w-4xl tracking-wide leading-relaxed">
              Match your uploaded dataset columns to the required system fields to ensure data accuracy and reporting consistency across your marketing campaigns.
            </p>
          </div>

          {/* Loading / Error / Success States */}
          {loading && (
            <div className="flex justify-center py-20">
              <span className="flex items-center gap-2 text-gray-500 font-medium">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading mapping data...
              </span>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {!loading && success && (
            <div className="bg-green-50 text-green-700 border border-green-200 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium">
              <CheckCircleIcon />
              {success}
            </div>
          )}

          {!loading && sysCols.length > 0 && (
            <>
              {/* Mapping Table Component */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden mb-6">
                
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_1fr_160px] gap-6 bg-[#4e74ca] px-8 py-4">
                  <div className="text-white text-sm font-semibold tracking-wide">System Column</div>
                  <div className="text-white text-sm font-semibold tracking-wide">Uploaded Column</div>
                  <div className="text-white text-sm font-semibold tracking-wide">Mapping Status</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                  {sysCols.map((sysCol, index) => {
                    const colKey = sysCol.key || sysCol.name;
                    const isMapped = !!mappings[colKey];
                    const selectedValue = mappings[colKey] || "";

                    return (
                      <div
                        key={colKey}
                        className={`grid grid-cols-[1fr_1fr_160px] gap-6 px-8 py-5 items-center border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors ${
                          index === sysCols.length - 1 ? "border-0" : ""
                        }`}
                      >
                        {/* System Column Name */}
                        <div className="flex items-center gap-3">
                          {getSystemIcon(sysCol.name)}
                          <span className="text-[14px] font-medium text-[#334155]">
                            {sysCol.name}
                          </span>
                        </div>

                        {/* Uploaded Column Selector */}
                        <div>
                          <select
                            value={selectedValue}
                            onChange={(e) => handleSelectChange(colKey, e.target.value)}
                            className={`w-full appearance-none px-4 py-2.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#4e74ca]/40 focus:border-[#4e74ca] cursor-pointer bg-no-repeat ${
                              isMapped
                                ? "bg-white border border-[#cbd5e1] text-[#0f172a]"
                                : "bg-[#f8fafc] border border-dashed border-[#b6c2d1] text-[#94a3b8]"
                            }`}
                            style={{
                              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1rem'
                            }}
                          >
                            <option value="" disabled className="text-gray-400">
                              Select Column
                            </option>
                            {fileCols.map((fc) => (
                              <option key={fc} value={fc} className="text-[#0f172a]">
                                {fc}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Pill */}
                        <div className="flex items-center">
                          {isMapped ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#eafbf0] text-[#1aa454] px-3 py-1 pb-1.5 rounded-full text-[11px] font-[800] tracking-wider uppercase border border-[#bbf3d0]/30 shadow-sm">
                              <CheckCircleIcon />
                              Mapped
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-[#fff8e6] text-[#eab308] px-3 py-1 pb-1.5 rounded-full text-[11px] font-[800] tracking-wider uppercase border border-[#fef08a]/30 shadow-sm">
                              <MinusCircleIcon />
                              Unmapped
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[14px] font-medium text-[#64748b]">
                  {mappedCols} of {totalCols} columns mapped
                </span>

                <button
                  onClick={handleReviewData}
                  disabled={submitting || mappedCols === 0}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    submitting || mappedCols === 0
                      ? "bg-[#94a3b8] text-white cursor-not-allowed opacity-70"
                      : "bg-[#1e293b] hover:bg-[#0f172a] text-white shadow-md active:scale-[0.98]"
                  }`}
                >
                  {submitting ? "Submitting..." : "Review Data"}
                  {!submitting && (
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Informational Tip */}
              <div className="bg-[#f0f4ff] border border-[#e2e8f6] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="mt-0.5"><InfoIcon /></div>
                <div>
                  <h4 className="text-[14px] font-[800] text-[#1e293b] mb-1">Mapping Tip</h4>
                  <p className="text-[13px] text-[#64748b] leading-relaxed">
                    NexusFlow uses smart-detection to automatically match common column names. Review each row to ensure the values are being assigned to the correct destination fields.
                  </p>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

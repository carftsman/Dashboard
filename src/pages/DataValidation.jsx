import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getValidationResults, processFile } from "../services/uploadService";
 
// Icons
const CloudUploadIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const DatabaseIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);
const ErrorIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const WarningIcon = () => (
  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
 
export default function DataValidation() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileId = location.state?.fileId;
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState("");
 
  useEffect(() => {
    if (!fileId) {
      setError("No file ID provided. Please upload a file first.");
      setLoading(false);
      return;
    }
 
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getValidationResults(fileId);
        setData(res);
      } catch (err) {
        setError(err?.message || err?.error || "Failed to fetch validation results.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, [fileId]);
 
  const totalRows = data?.totalRows || 0;
 
  const missingDataCount = data?.summary?.criticalErrors?.missingData || 0;
  const dataTypeErrorsCount = data?.summary?.criticalErrors?.dataTypeErrors || 0;
  const formatErrorsCount = data?.summary?.criticalErrors?.formatErrors || 0;
  const duplicateRowsCount = data?.summary?.warnings?.duplicateRows || 0;
 
  const totalCriticalErrors = missingDataCount + dataTypeErrorsCount + formatErrorsCount;
  const totalMinorWarnings = duplicateRowsCount;
 
  // Let's create an array of checks to map over to generate the table rows exactly like the design
  const validationChecks = [
    {
      title: "Missing Columns",
      desc: "Ensures all required data fields are present.",
      count: missingDataCount,
      isCritical: true,
      successDetails: "All required columns were successfully identified in the CSV file.",
      failDetails: `${missingDataCount} rows contain missing or null required fields.`,
      actionBtn: "View Mapping",
    },
    {
      title: "Invalid Data Types",
      desc: "Checks for email format and date inconsistencies.",
      count: dataTypeErrorsCount,
      isCritical: true,
      successDetails: "All data types are valid and match expected formats.",
      // Using exactly what's inside the image for "Warning" style but user image shows 3 Warning
      // The wording in image is "3 rows contain non-standard date formats that will be auto-corrected."
      // I'll make it generic.
      failDetails: `${dataTypeErrorsCount} rows contain non-standard formats that require attention.`,
      actionBtn: "Fix Errors",
    },
    {
      title: "Format Errors",
      desc: "Checks for formatting issues in text and numeric fields.",
      count: formatErrorsCount,
      isCritical: true,
      successDetails: "No formatting errors detected.",
      failDetails: `${formatErrorsCount} formatting errors found.`,
      actionBtn: "Fix Errors",
    },
    {
      title: "Duplicate IDs",
      desc: "Detects multiple entries for the same Customer ID.",
      count: duplicateRowsCount,
      isCritical: false,
      successDetails: "No duplicate entries found.",
      failDetails: `${duplicateRowsCount} duplicate entries found. These records will be ignored if not resolved.`,
      actionBtn: "Remove Duplicates",
    }
  ];
 
  const handleReupload = () => {
    navigate("/upload-data");
  };
 
  const handleProcess = async () => {
  if (totalCriticalErrors > 0) return;

  try {
    setProcessing(true);
    setProcessError("");

    // ✅ Step 1: process file
    const res = await processFile(fileId);

    if (res.status === "FAILED") {
      setProcessError(res.message || "Processing failed");
      return;
    }

    // ✅ Step 2: get mappings from previous page
    const mappings = location.state?.mappings;

    if (!mappings) {
      setProcessError("Mappings missing. Please go back and map columns.");
      return;
    }
    // ✅ Step 3: navigate to dashboard with data
    navigate("/dashboard", {
      state: {
         dashboardId: location.state?.dashboardId, // ✅ ADD
    fileId,
    mappings,
      },
    });
  } catch (err) {
    setProcessError(err?.message || "Processing error");
  } finally {
    setProcessing(false);
  }
};
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-[220px]">
        <main className="flex-1 p-4 sm:p-6 lg:p-12 max-w-6xl mx-auto w-full">
         
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-2xl sm:text-[32px] font-[800] text-[#1e293b] tracking-tight mb-2">Data Validation</h1>
              <p className="text-sm sm:text-[15px] text-[#64748b] tracking-wide">
                Review and verify data quality before final processing.
              </p>
            </div>
           
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleReupload}
                className="flex items-center justify-center gap-2 bg-white border border-[#cbd5e1] text-[#334155] hover:bg-gray-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex-1 sm:flex-none"
              >
                <CloudUploadIcon />
                <span className="whitespace-nowrap">Re-upload</span>
              </button>
              <button
                onClick={handleProcess}
                disabled={totalCriticalErrors > 0 || processing}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all flex-1 sm:flex-none ${
                  totalCriticalErrors > 0 || processing
                    ? "bg-[#1e293b] text-white opacity-50 cursor-not-allowed"
                    : "bg-[#1e293b] hover:bg-[#0f172a] text-white shadow-md active:scale-[0.98]"
                }`}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CheckCircleIcon />
                    <span className="whitespace-nowrap">Confirm and Process</span>
                  </>
                )}
              </button>
            </div>
          </div>
 
          {loading && (
            <div className="flex justify-center py-20">
              <span className="flex items-center gap-2 text-gray-500 font-medium">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading validation results...
              </span>
            </div>
          )}
 
          {!loading && error && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium">
              <ErrorIcon />
              {error}
            </div>
          )}
 
          {processError && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium">
              <ErrorIcon />
              {processError}
            </div>
          )}
 
          {!loading && !error && data && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {/* Total Records */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <span className="text-xs sm:text-[14px] font-semibold text-[#64748b] mb-2 tracking-wide">Total Records</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-[800] text-[#1e293b]">
                      {totalRows.toLocaleString()}
                    </span>
                    <DatabaseIcon />
                  </div>
                </div>
 
                {/* Critical Errors */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <span className="text-xs sm:text-[14px] font-semibold text-[#64748b] mb-2 tracking-wide">Critical Errors</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl sm:text-4xl font-[800] ${totalCriticalErrors > 0 ? 'text-red-500' : 'text-[#1e293b]'}`}>
                      {totalCriticalErrors.toLocaleString()}
                    </span>
                    {totalCriticalErrors > 0 && <ErrorIcon />}
                  </div>
                </div>
 
                {/* Minor Warnings */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between sm:col-span-2 md:col-span-1">
                  <span className="text-xs sm:text-[14px] font-semibold text-[#64748b] mb-2 tracking-wide">Minor Warnings</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-[800] text-[#0f172a]">
                      {totalMinorWarnings.toLocaleString()}
                    </span>
                    {totalMinorWarnings > 0 && (
                      <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
 
              {/* Validation Checks Table (Desktop) / Cards (Mobile) */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden mb-6">
               
                {/* Table Header - Only visible on sm and above */}
               <div className="hidden sm:grid grid-cols-[3fr_1.5fr_5fr] gap-4 bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-4">
  <div className="text-[#475569] text-xs font-[800] uppercase tracking-widest">Validation Check</div>
  <div className="text-[#475569] text-xs font-[800] uppercase tracking-widest">Status</div>
  <div className="text-[#475569] text-xs font-[800] uppercase tracking-widest">Details</div>
</div>
 
                {/* Table Body */}
                <div className="flex flex-col">
                  {validationChecks.map((check, index) => {
                    const hasIssue = check.count > 0;
                   
                    let statusLabel = "PASSED";
                    let statusStyles = "bg-[#eafbf0] text-[#1aa454] border-[#bbf3d0]/30";
                    let StatusIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
 
                    if (hasIssue) {
                      if (check.isCritical && check.title === "Missing Columns") {
                        statusLabel = "FAILED";
                        statusStyles = "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]/30";
                        StatusIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
                      } else if (check.isCritical && check.title === "Invalid Data Types") {
                        statusLabel = "WARNING";
                        statusStyles = "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]/30";
                        StatusIcon = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
                      } else if (check.title === "Duplicate IDs" || check.title === "Format Errors") {
                        statusLabel = "FAILED";
                        statusStyles = "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]/30";
                        StatusIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
                      }
                    }
 
                    return (
                      <div
                        key={check.title}
                        className={`flex flex-col sm:grid sm:grid-cols-[3fr_1.5fr_5fr] gap-4 px-5 sm:px-6 py-5 sm:py-6 items-start border-b border-[#f1f5f9] hover:bg-[#f8fafc]/50 transition-colors ${
                          index === validationChecks.length - 1 ? "border-0" : ""
                        }`}
                      >
                        {/* Check Name */}
                        <div className="w-full">
                          <h3 className="text-[15px] font-[800] text-[#1e293b] mb-1">{check.title}</h3>
                          <p className="text-[13px] text-[#64748b] leading-relaxed pr-0 sm:pr-4">{check.desc}</p>
                        </div>
 
                        {/* Status */}
                        <div className="flex pt-1 mt-2 sm:mt-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 pb-1.5 rounded-full text-[11px] font-[800] tracking-wider uppercase border shadow-sm ${statusStyles}`}>
                            <StatusIcon />
                            {statusLabel}
                          </span>
                        </div>
 
                        {/* Details */}
                        <div className="pt-1 pr-0 sm:pr-6 mt-2 sm:mt-0 w-full">
                          {hasIssue ? (
                            <p className="text-sm sm:text-[14px] text-[#334155] leading-relaxed">
                              {/* If count is present, we highlight the number in bold red/dark as seen in mockup */}
                              <span className={statusLabel === 'FAILED' ? 'font-[700] text-[#e11d48]' : 'font-[700] text-[#1e293b]'}>
                                {check.count} {check.title === "Duplicate IDs" ? "duplicate entries" : "rows"}
                              </span>{" "}
                              {check.failDetails.replace(`${check.count} rows `, '').replace(`${check.count} duplicate entries `, '').replace(`${check.count} `, '')}
                            </p>
                          ) : (
                            <p className="text-sm sm:text-[14px] text-[#64748b] leading-relaxed">
                              {check.successDetails}
                            </p>
                          )}
                        </div>
 
                      
                 
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
 
        </main>
      </div>
    </div>
  );
}
 
 
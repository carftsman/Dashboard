import React, { useState, useRef, useCallback, useEffect } from "react"; // Added useEffect
import { useLocation, useNavigate } from "react-router-dom";
 
import { uploadSalesFile } from "../services/uploadService";
import Sidebar from "../components/Sidebar";
 
// ─── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];
const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidFileType(file) {
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext);
}
 
function isValidFileSize(file) {
  return file.size <= MAX_SIZE_BYTES;
}
 
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
 
// ─── Upload Icon ──────────────────────────────────────────────────────────────
function UploadIcon() {
  return (
    <div className="w-14 h-14 rounded-full bg-[#1e2d6b] flex items-center justify-center mx-auto mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    </div>
  );
}
 
// ─── Main Component ───────────────────────────────────────────────────────────
export default function UploadData() {
  const location = useLocation();
  const navigate = useNavigate();
 
  // ─── UPDATED DASHBOARD ID LOGIC ───
  // We initialize the ID from state or localStorage
  const [dashboardId, setDashboardId] = useState(
    location.state?.dashboardId || localStorage.getItem("lastDashboardId")
  );

  // If a new ID comes in via navigation state, we update our state and save to localStorage
  useEffect(() => {
    if (location.state?.dashboardId) {
      setDashboardId(location.state.dashboardId);
      localStorage.setItem("lastDashboardId", location.state.dashboardId);
    }
  }, [location.state?.dashboardId]);
  // ──────────────────────────────────

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
 
  const inputRef = useRef(null);
 
  // ── File Validation ──────────────────────────────────────────────────────
  const validateAndSet = useCallback((selectedFile) => {
    setError("");
    setSuccess("");
    setUploadProgress(0);
 
    if (!selectedFile) return;
 
    if (!isValidFileType(selectedFile)) {
      setError("Invalid file type. Please upload a CSV, XLS, or XLSX file.");
      setFile(null);
      return;
    }
    if (!isValidFileSize(selectedFile)) {
      setError(`File is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  }, []);
 
  // ── Drag Events ─────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);
 
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);
 
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) validateAndSet(dropped);
    },
    [validateAndSet]
  );
 
  // ── Click to select ──────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e) => {
      const selected = e.target.files?.[0];
      if (selected) validateAndSet(selected);
      e.target.value = "";
    },
    [validateAndSet]
  );
 
  const openFilePicker = () => inputRef.current?.click();
 
  const removeFile = () => {
    setFile(null);
    setError("");
    setSuccess("");
    setUploadProgress(0);
  };
 
  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }
 
    if (!dashboardId) {
      setError(
        "Dashboard ID not found. Please make sure you are logged in and have a dashboard selected."
      );
      return;
    }
 
    setUploading(true);
    setError("");
    setSuccess("");
    setUploadProgress(0);
 
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 5 : prev));
    }, 200);
 
    try {
      const response = await uploadSalesFile(dashboardId, file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(
        "File uploaded and analysis started successfully! Your data is being processed."
      );
      setFile(null);
 
      setTimeout(() => {
        // Use the local dashboardId variable for navigation
        navigate("/column-mapping", { state: { dashboardId: dashboardId, fileId: response.fileId } });
      }, 1500);
 
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      const msg =
        err?.message ||
        err?.error ||
        (typeof err === "string" ? err : "Upload failed. Please try again.");
      setError(msg);
    } finally {
      setUploading(false);
    }
  };
 
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <Sidebar/>
 
      <div className="flex-1 flex flex-col min-w-0 ml-[220px]">
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Upload data
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Import your marketing data to generate advanced insights. NexusFlow
              will automatically clean and categorize your data for the dashboard.
            </p>
          </div>
 
          <div className="max-w-2xl space-y-5">
            <div
              role="button"
              tabIndex={0}
              aria-label="File upload drop zone. Click to choose files or drag and drop."
              onClick={openFilePicker}
              onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                px-6 py-10 text-center
                ${
                  dragging
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }
                ${uploading ? "pointer-events-none opacity-60" : ""}
              `}
            >
              <UploadIcon />
 
              {file ? (
                <div
                  className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-2 mx-auto max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                    aria-label="Remove selected file"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-base font-bold text-gray-800">
                    Choose file or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum file size: {MAX_SIZE_MB}MB
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    Upload files only that are in CSV, XLS/XLSX.
                  </p>
                </>
              )}
 
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
 
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
 
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
 
            {success && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}
 
            {!success && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4">
                <svg
                  className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Upload Tip
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    For best results, ensure your first row contains descriptive
                    headers for your columns (e.g., &quot;Campaign Name&quot;,
                    &quot;Spend&quot;, &quot;Conversions&quot;).
                  </p>
                </div>
              </div>
            )}
 
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !file}
              className={`w-full py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200
                ${
                  uploading || !file
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1e2d6b] hover:bg-[#162357] active:scale-[0.99] cursor-pointer"
                }
              `}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Uploading… {uploadProgress}%
                </span>
              ) : (
                "Upload and Analyze"
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
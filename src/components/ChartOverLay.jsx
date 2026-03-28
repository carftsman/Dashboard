import React, { useState } from "react";

export default function ChartOverlay({ open, onClose }) {
  const [showFilters, setShowFilters] = useState(true);
  const [showVisuals, setShowVisuals] = useState(true);
  const [showData, setShowData] = useState(true);

  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (type === "x") setXAxis(data);
    if (type === "y") setYAxis(data);
  };

  const allowDrop = (e) => e.preventDefault();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Main panel */}
      <div className="ml-auto h-full bg-[#f8fafc] text-black shadow-xl relative z-10 p-3 flex transition-all duration-300">

        {/* FILTERS */}
        <div className={`transition-all duration-300 border-r p-2 ${showFilters ? "w-1/3" : "w-[40px]"} overflow-hidden`}>
          <div className="flex justify-between items-center mb-2">
            {showFilters && <h3 className="text-xs font-semibold">Filters</h3>}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-black text-xs px-1 bg-transparent focus:outline-none"
            >
              {showFilters ? "‹" : "›"}
            </button>
          </div>

          {showFilters && (
            <>
              <input
                placeholder="Search"
                className="w-full text-xs border px-2 py-1 mb-2 focus:outline-none"
              />
              <div className="border border-dashed p-3 text-[10px] text-gray-400 mb-2">
                Add data fields here
              </div>
              <div className="border border-dashed p-3 text-[10px] text-gray-400">
                Add data fields here
              </div>
            </>
          )}
        </div>

        {/* VISUALS */}
        <div className={`transition-all duration-300 border-r p-2 ${showVisuals ? "w-1/3" : "w-[40px]"} overflow-hidden`}>
          <div className="flex justify-between items-center mb-2">
            {showVisuals && <h3 className="text-xs font-semibold">Visualizations</h3>}
            <button
              onClick={() => setShowVisuals(!showVisuals)}
              className="text-black text-xs px-1 bg-transparent focus:outline-none"
            >
              {showVisuals ? "‹" : "›"}
            </button>
          </div>

          {showVisuals && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded flex items-center justify-center text-xs"
                  >
                    📊
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs">
                <p>X-Axis</p>
                <div
                  onDrop={(e) => handleDrop(e, "x")}
                  onDragOver={allowDrop}
                  className="border p-2 text-[10px] min-h-[40px]"
                >
                  {xAxis || "Add data fields"}
                </div>

                <p className="mt-2">Y-Axis</p>
                <div
                  onDrop={(e) => handleDrop(e, "y")}
                  onDragOver={allowDrop}
                  className="border p-2 text-[10px] min-h-[40px]"
                >
                  {yAxis || "Add data fields"}
                </div>
              </div>
            </>
          )}
        </div>

        {/* DATA panel grows and moves right */}
        <div className={`flex-1 transition-all duration-300 p-3 flex flex-col h-full overflow-hidden`}>
          <div className="flex justify-between items-center mb-2">
            {showData && <h3 className="text-[12px] font-semibold text-gray-700">Data</h3>}
            <button
              onClick={() => setShowData(!showData)}
              className="text-black text-xs px-1 bg-transparent focus:outline-none"
            >
              {showData ? "‹" : "›"}
            </button>
          </div>

          {showData && (
            <>
              <input
                placeholder="Search"
                className="w-full text-[11px] border rounded px-2 py-1 mb-3 outline-none focus:outline-none"
              />

              <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                {[
                  "All Clicks",
                  "City",
                  "Cost Per Result",
                  "Date",
                  "Email",
                  "Followers",
                  "Full Name",
                  "Impressions",
                  "Reach",
                  "State",
                ].map((item, i) => (
                  <label
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="flex items-center justify-between text-[11px] text-gray-700 px-2 py-1.5 rounded hover:bg-blue-50 cursor-grab"
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="accent-blue-500 w-3 h-3" />
                      <span>{item}</span>
                    </div>
                    <span className="text-gray-400 text-[10px]">⋮</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CLOSE button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded focus:outline-none"
        >
          Close
        </button>

      </div>
    </div>
  );
}
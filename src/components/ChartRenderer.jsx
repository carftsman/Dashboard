import React from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,LabelList
} from "recharts";
 
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
 
export default function ChartRenderer({ type, data, config, darkMode }) {
  const gridColor = darkMode ? "#334155" : "#e5e7eb";
  const axisColor = darkMode ? "#cbd5f5" : "#111827";
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
 
  // 1. Initial Data Check
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <p className="text-gray-400 text-center py-10">No data available</p>;
  }
 
  const chartType = type?.toLowerCase();
 
  // 2. Improved Data Mapping logic
  let safeData = [];
  const xKeyAttr = config?.xAxis?.[0] || config?.groupBy || "name";
  const yKeyAttr = config?.metrics?.[0] || config?.yAxis?.[0] || "value";
 
  if (Array.isArray(data)) {
    safeData = data.map((item, i) => ({
      ...item,
      displayX: item[xKeyAttr] !== undefined ? item[xKeyAttr] : (item.name || `Item ${i + 1}`),
      displayY: item[yKeyAttr] !== undefined ? Number(item[yKeyAttr]) : (Number(item.value) || 0),
    }));
  } else {
    safeData = Object.entries(data).map(([key, val]) => ({ displayX: key, displayY: val }));
  }
 
  // 3. Helper Components (Defined BEFORE the return statements to avoid ReferenceErrors)
  const formatYAxis = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "K";
    return value;
  };
 
  const renderXAxis = () => (
    <XAxis
      dataKey="displayX"
      stroke={axisColor}
      interval="preserveStartEnd" // Fixes overlapping text
      minTickGap={30}              // Spacing between labels
      angle={-45}                 // Better angle for long text
      textAnchor="end"
      height={80}                 // Room for angled text
      tick={{ fontSize: 10, fill: axisColor }}
      tickFormatter={(value) => (value?.toString().length > 12 ? value.slice(0, 12) + "..." : value)}
    />
  );
 
  const renderYAxis = () => (
    <YAxis
      stroke={axisColor}
      width={60}
      tick={{ fontSize: 10, fill: axisColor }}
      tickFormatter={formatYAxis}
    />
  );
 
  // 4. Component Returns by Type
 
  // PIE / DONUT
  if (chartType === "pie" || chartType === "donut") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={safeData}
            dataKey="displayY"
            nameKey="displayX"
            innerRadius={chartType === "donut" ? 60 : 0}
            label={({ percent, x, y }) => (
              <text x={x} y={y} fill={textColor} fontSize={10} textAnchor="middle" dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            )}
          >
            {safeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
 
  // BAR / STACKED BAR
  // BAR / STACKED BAR
if (chartType === "bar" || chartType === "stacked_bar") {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={safeData}
        margin={{ top: 25, right: 10, left: 10, bottom: 40 }} // Increased top margin for labels
      >
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
        {renderXAxis()}
        {renderYAxis()}
        <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
       
        <Bar
          dataKey="displayY"
          fill="#00C49F"
          stackId={chartType === "stacked_bar" ? "a" : undefined}
          radius={[4, 4, 0, 0]} // Optional: rounds the top corners like your image
        >
          {/* THIS ADDS THE VALUE ON TOP OF THE BAR */}
          <LabelList
            dataKey="displayY"
            position="top"
            fill={textColor}
            fontSize={10}
            formatter={formatYAxis} // Uses your K/M formatter
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
 
  // LINE
  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={safeData} margin={{ bottom: 20 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          {renderXAxis()}
          {renderYAxis()}
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          <Line
            type="monotone"
            dataKey="displayY"
            stroke="#0088FE"
            strokeWidth={2}
            dot={safeData.length > 40 ? false : { r: 3 }} // Hide dots if too many items
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
 
  // AREA
  if (chartType === "area") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={safeData} margin={{ bottom: 20 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          {renderXAxis()}
          {renderYAxis()}
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          <Area type="monotone" dataKey="displayY" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
 
  // SCATTER
  if (chartType === "scatter") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ bottom: 20 }}>
          <CartesianGrid stroke={gridColor} />
          <XAxis type="category" dataKey="displayX" stroke={axisColor} tick={{ fontSize: 10 }} />
          <YAxis type="number" dataKey="displayY" stroke={axisColor} tickFormatter={formatYAxis} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: tooltipBg }} />
          <Scatter name="Data" data={safeData} fill="#FF8042" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
 
  // TABLE
  if (chartType === "table") {
    const columns = safeData.length ? Object.keys(data[0]) : [];
    return (
      <div className="overflow-auto max-h-[300px] w-full border border-gray-700 rounded shadow-inner">
        <table className="w-full text-xs text-left border-collapse">
          <thead className={`sticky top-0 ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            <tr>{columns.map((col) => <th key={col} className="p-2 border-b border-gray-700 font-semibold uppercase">{col}</th>)}</tr>
          </thead>
          <tbody className={textColor}>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-blue-500/10 border-b border-gray-800">
                {columns.map((col, j) => <td key={j} className="p-2">{row[col]?.toString()}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
 
  // KPI
  if (chartType === "kpi") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6">
        <p className="text-sm text-gray-400 mb-1">{config?.metrics?.[0] || "Total"}</p>
        <p className={`text-4xl font-bold ${textColor}`}>
          {typeof data === 'object' ? formatYAxis(Object.values(data)[0]) : formatYAxis(data)}
        </p>
      </div>
    );
  }
 
  return <p className="text-red-400 p-4">Unsupported chart type: {chartType}</p>;
}
 
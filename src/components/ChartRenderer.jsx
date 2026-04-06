import React from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Legend, LabelList, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, Funnel, FunnelChart, ZAxis
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function ChartRenderer({ type, data, config, darkMode }) {
  const gridColor = darkMode ? "#334155" : "#e5e7eb";
  const axisColor = darkMode ? "#cbd5f5" : "#111827";
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <p className="text-gray-400 text-center py-10">No data available</p>;
  }

  const chartType = type?.toLowerCase();

  let safeData = [];
  const xKeyAttr = config?.xAxis?.[0] || config?.xAxis || config?.groupBy || "name";
  const yKeyAttr = config?.yAxis?.[0] || config?.yAxis || "value";
  const metrics = config?.metrics || ["value"];

  if (Array.isArray(data)) {
    safeData = data.map((item, i) => ({
      ...item,
      displayX: item[xKeyAttr] !== undefined ? item[xKeyAttr] : (item.name || `Item ${i + 1}`),
      displayY: item[yKeyAttr] !== undefined ? item[yKeyAttr] : (Number(item.value) || 0),
      value: item[metrics[0]] !== undefined ? Number(item[metrics[0]]) : (Number(item.value) || 0),
    }));
  }

  const formatYAxis = (value) => {
    if (typeof value !== 'number') return value;
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "K";
    return value;
  };

  // Helper for Heatmap color intensity
  const getHeatmapColor = (value) => {
    const max = Math.max(...safeData.map(d => d.value), 1);
    const ratio = value / max;
    return `rgba(0, 196, 159, ${0.2 + ratio * 0.8})`; // Shades of Teal
  };

  const renderXAxis = () => (
    <XAxis
      dataKey="displayX"
      stroke={axisColor}
      interval="preserveStartEnd"
      minTickGap={30}
      angle={-45}
      textAnchor="end"
      height={80}
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

  // --- HEATMAP COMPONENT ---
 // --- HEATMAP COMPONENT ---
  if (chartType === "heatmap") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart 
          margin={{ top: 20, right: 40, bottom: 60, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} horizontal={false} />
          {/* Use type="category" to ensure labels show up correctly */}
          <XAxis 
            type="category" 
            dataKey="displayX" 
            name="Category" 
            stroke={axisColor} 
            fontSize={10} 
            tick={{ fill: axisColor }}
          />
          <YAxis 
            type="category" 
            dataKey="displayY" 
            name="Group" 
            stroke={axisColor} 
            fontSize={10} 
            tick={{ fill: axisColor }}
          />
          {/* ZAxis handles the range for the value, though we use custom colors */}
          <ZAxis type="number" dataKey="value" range={[0, 1000]} /> 
          
          <Tooltip 
             cursor={{ strokeDasharray: '3 3' }}
             contentStyle={{ backgroundColor: tooltipBg, color: textColor }}
          />
          
          <Scatter 
            data={safeData} 
            shape={(props) => {
              const { cx, cy, payload } = props;
              // We adjust the width/height to fill the grid cell area
              // You can tweak these numbers based on your typical data density
              return (
                <rect 
                  x={cx - 15} 
                  y={cy - 15} 
                  width={30} 
                  height={30} 
                  fill={getHeatmapColor(payload.value)} 
                  rx={2} // Slightly rounded corners for a modern look
                />
              );
            }} 
          />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  // --- EXISTING CHART TYPES ---

  if (chartType === "pie" || chartType === "donut") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={safeData}
            dataKey="value"
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

  if (["bar", "stacked_bar", "horizontal_bar", "histogram"].includes(chartType)) {
    const isHorizontal = chartType === "horizontal_bar";
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          layout={isHorizontal ? "vertical" : "horizontal"}
          data={safeData} 
          barCategoryGap={chartType === "histogram" ? 0 : "10%"}
          margin={{ top: 40, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={isHorizontal} />
          {isHorizontal ? <XAxis type="number" stroke={axisColor} tickFormatter={formatYAxis} /> : renderXAxis()}
          {isHorizontal ? <YAxis type="category" dataKey="displayX" stroke={axisColor} width={80} tick={{fontSize: 10}} /> : renderYAxis()}
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          <Bar dataKey="value" fill="#00C49F" stackId={chartType === "stacked_bar" ? "a" : undefined} radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
            {!isHorizontal }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line" || chartType === "multi_line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={safeData} margin={{ bottom: 20 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          {renderXAxis()}
          {renderYAxis()}
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} dot={safeData.length < 40} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "area") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={safeData} margin={{ bottom: 20 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          {renderXAxis()}
          {renderYAxis()}
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "table") {
    const columns = safeData.length ? Object.keys(data[0]) : [];
    return (
      <div className="overflow-auto max-h-[300px] w-full border border-gray-700 rounded">
        <table className="w-full text-xs text-left">
          <thead className={darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}>
            <tr>{columns.map((col) => <th key={col} className="p-2 border-b border-gray-700 uppercase">{col}</th>)}</tr>
          </thead>
          <tbody className={textColor}>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-gray-800">
                {columns.map((col, j) => <td key={j} className="p-2">{row[col]?.toString()}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (chartType === "kpi") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6">
        <p className="text-sm text-gray-400 mb-1">{config?.metrics?.[0] || "Total"}</p>
        <p className={`text-4xl font-bold ${textColor}`}>
          {formatYAxis(safeData[0]?.value || 0)}
        </p>
      </div>
    );
  }

  return <p className="text-red-400 p-4">Unsupported chart type: {chartType}</p>;
}
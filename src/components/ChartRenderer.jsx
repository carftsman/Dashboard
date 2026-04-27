import React from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend, LabelList, Radar, RadialBarChart, RadarChart, RadialBar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, Funnel, FunnelChart, ZAxis
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const parseNumber = (val) => {
  if (val === null || val === undefined) return 0;
  const num = Number(String(val).replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
};

export default function ChartRenderer({ type, data, config, darkMode }) {
  const gridColor = darkMode ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb";
  const axisColor = darkMode ? "#f8fafc" : "#111827";
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const FONT_SIZE = 10;
  let normalizedData = data;

if (data && typeof data === "object" && !Array.isArray(data))  {
  normalizedData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: Number(value) || 0
  }));
}
  if (!normalizedData || (Array.isArray(normalizedData) && normalizedData.length === 0)) {
    return <p className="text-gray-400 text-center py-10">No data available</p>;
  }

  const chartType = type?.toLowerCase();
  const metrics = config?.metrics || ["value"];
  const activeMetric = metrics[0];

  let safeData = [];

  if (Array.isArray(normalizedData)) {
  safeData = normalizedData.map((item, i) => {
      const xLabel = item.displayX || item.name || item.x || item.range || item.group || `Item ${i + 1}`;
      const rawValue = item[activeMetric] ?? item.value ?? item.cumulative ?? 0;
      const yValue = parseNumber(rawValue);
      const startValue = item.cumulative !== undefined ? parseNumber(item.cumulative) - yValue : 0;

      return {
        ...item,
        displayX: xLabel,
        displayY: item.y || yValue,
        value: yValue,
        start: startValue,
        [activeMetric]: yValue
      };
    });
  }
  const buildFunnelData = (data, config) => {
    if (!Array.isArray(data)) return [];

    const groupKey = config?.groupBy || config?.steps?.[0];
    const metricKey = config?.metrics?.[0] || config?.steps?.[1];

    if (!groupKey) return [];

    const grouped = {};

    data.forEach((item) => {
      const key =
        item[groupKey] ||
        item.displayX ||
        item.name;

      const value =
        parseNumber(item[metricKey]) ||
        item.value ||
        0;

      if (!key) return;

      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += value;
    });

    return Object.entries(grouped)
      .map(([key, val]) => ({
        displayX: key,
        value: val
      }))
      .sort((a, b) => b.value - a.value); // 🔥 REQUIRED for funnel
  };
  const formatYAxis = (value) => {
    if (typeof value !== 'number') return value;
    const absValue = Math.abs(value);
    if (absValue >= 1000000) return (value / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
    if (absValue >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    return value;
  };

  const getHeatmapColor = (value) => {
    const max = Math.max(...safeData.map(d => d.value), 1);
    const ratio = value / max;
    return `rgba(0, 196, 159, ${0.2 + ratio * 0.8})`;
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

  const ScrollWrapper = ({ children }) => (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      {children}
    </div>
  );

  if (chartType === "heatmap") {
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 40, bottom: 60, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} horizontal={false} />
            <XAxis type="category" dataKey="x" stroke={axisColor} fontSize={10} tick={{ fill: axisColor }} />
            <YAxis type="category" dataKey="y" stroke={axisColor} fontSize={10} tick={{ fill: axisColor }} tickFormatter={formatYAxis} />
            <ZAxis type="number" dataKey="value" range={[0, 1000]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            <Scatter data={safeData} shape={(props) => {
              const { cx, cy, payload } = props;
              return <rect x={cx - 15} y={cy - 15} width={30} height={30} fill={getHeatmapColor(payload.value)} rx={2} />;
            }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "pie" || chartType === "donut") {
    return (
      <ScrollWrapper>
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
      </ScrollWrapper>
    );
  }

  if (["bar", "stacked_bar", "horizontal_bar", "histogram"].includes(chartType)) {
    const isHorizontal = chartType === "horizontal_bar";
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout={isHorizontal ? "vertical" : "horizontal"}
            data={safeData}
            barCategoryGap={chartType === "histogram" ? 0 : "10%"}
            margin={{ top: 40, right: 30, left: 10, bottom: 40 }}
          >
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={isHorizontal} />
            {isHorizontal ? <XAxis type="number" stroke={axisColor} tick={{ fill: axisColor }} tickFormatter={formatYAxis} /> : renderXAxis()}
            {isHorizontal ? <YAxis type="category" dataKey="displayX" stroke={axisColor} width={80} tick={{ fontSize: 10, fill: axisColor }} /> : renderYAxis()}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            <Bar dataKey="value" fill="#00C49F" stackId={chartType === "stacked_bar" ? "a" : undefined} radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "line" || chartType === "multi_line") {
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeData} margin={{ bottom: 20 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            {renderXAxis()}
            {renderYAxis()}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            {metrics.map((m, i) => (
              <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={safeData.length < 40} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "area" || chartType === "stacked_area") {
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={safeData} margin={{ bottom: 20 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            {renderXAxis()}
            {renderYAxis()}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} stackId={chartType === "stacked_area" ? "a" : undefined} />
          </AreaChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "scatter" || chartType === "bubble") {
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis type="number" dataKey="x" stroke={axisColor} tick={{ fill: axisColor, fontSize: FONT_SIZE }} tickFormatter={formatYAxis} />
            <YAxis type="number" dataKey="y" stroke={axisColor} tick={{ fill: axisColor, fontSize: FONT_SIZE }} tickFormatter={formatYAxis} />
            {chartType === "bubble" && <ZAxis type="number" dataKey="size" range={[5, 60]} />}
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                color: textColor,
                fontSize: FONT_SIZE
              }}
            />
            <Scatter data={safeData} fill={chartType === "bubble" ? "#8884d8" : "#00C49F"} />
          </ScatterChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "treemap") {
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={safeData}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#00C49F"
          >
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          </Treemap>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "funnel") {

    const funnelData = buildFunnelData(safeData, config);

    if (!funnelData.length) {
      return <p className="text-gray-400 text-center py-10">No data available</p>;
    }

    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <FunnelChart margin={{ top: 10, right: 50, left: 50, bottom: 10 }}>
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />

            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              <LabelList
                position="right"
                fill={textColor}
                dataKey="displayX"
                style={{ fontSize: 10 }}
              />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Funnel>

          </FunnelChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "table") {
    const tableData = safeData; // ✅ use cleaned data

    const columns = tableData.length
      ? Object.keys(
        tableData.reduce((acc, obj) => ({ ...acc, ...obj }), {})
      )
      : [];

    return (
      <div className="overflow-auto max-h-[300px] w-full border border-gray-700 rounded custom-scrollbar">
        <table className="w-full text-xs text-left">
          <thead className={darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}>
            <tr>
              {columns.map((col) => (
                <th key={col} className="p-2 border-b border-gray-700 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={darkMode ? "text-white" : "text-black"}>
            {tableData.map((row, i) => (
              <tr key={i} className="border-b border-gray-800">
                {columns.map((col, j) => (
                  <td key={j} className="p-2">
                    {row[col] !== undefined && row[col] !== null
                      ? row[col].toString()
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (chartType === "gauge") {
    const value = safeData?.[0]?.value || 0;
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "value", value }]} startAngle={180} endAngle={0}>
            <RadialBar minAngle={15} background clockWise dataKey="value" fill="#00C49F" />
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize="10">
              {formatYAxis(value)}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "radar") {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className="min-w-[700px] h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={safeData}
            margin={{ top: 20, right: 80, bottom: 20, left: 80 }} // ✅ extra space
          >
            <PolarGrid stroke={gridColor} />

            <PolarAngleAxis
              dataKey="displayX"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 10 }} // slightly bigger
            />

            <PolarRadiusAxis
              stroke={axisColor}
              angle={90}
              tick={{ fill: axisColor, fontSize: 10 }}
              tickFormatter={formatYAxis}
            />

            <Radar
              name={activeMetric}
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />

            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

  if (chartType === "waterfall") {
    return (
      <ScrollWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="displayX" stroke={axisColor} tick={{ fill: axisColor, fontSize: 10 }} />
            <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 10 }} tickFormatter={formatYAxis} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            <Bar dataKey="start" stackId="a" fill="transparent" />
            <Bar dataKey="value" stackId="a" fill="#00C49F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ScrollWrapper>
    );
  }

  if (chartType === "kpi") {
    return (
      <ScrollWrapper>
        <div className="flex flex-col items-center justify-center py-1">
          <p className="text-sm text-gray-400 mb-1">{activeMetric || "Total"}</p>
          <p className="text-4xl font-bold" style={{ color: textColor }}>
            {formatYAxis(safeData[0]?.value || 0)}
          </p>
        </div>
      </ScrollWrapper>
    );
  }

  return <p className="text-red-400 p-4">Unsupported chart type: {chartType}</p>;
}


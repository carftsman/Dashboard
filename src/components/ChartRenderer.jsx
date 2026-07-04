import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend, LabelList, Radar, RadialBarChart, RadarChart, RadialBar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, Funnel, FunnelChart, ZAxis, Label
} from "recharts";
import {
  CHART_COLORS as COLORS,
  buildFunnelData,
  formatAxisValue as formatYAxis,
  prepareChartData,
} from "../utils/chartData";

export default function ChartRenderer({ type, data, config, darkMode }) {
  const [isPieZoomed, setIsPieZoomed] = useState(false);
  const gridColor = darkMode ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb";
  const axisColor = darkMode ? "#f8fafc" : "#111827";
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const FONT_SIZE = 10;

  const { finalConfig, normalizedData, safeData, metrics, activeMetric, xAxisKey, yAxisKey, sizeKey, legendKey } =
    prepareChartData(type, data, config);

  if (!normalizedData || (Array.isArray(normalizedData) && normalizedData.length === 0)) {
    return <p className="text-gray-400 text-center py-10">No data available</p>;
  }

  const chartType = type?.toLowerCase();

  const getHeatmapColor = (value) => {
    const max = Math.max(...safeData.map(d => d.value), 1);
    const ratio = value / max;
    return `rgba(0, 196, 159, ${0.2 + ratio * 0.8})`;
  };

  const renderXAxis = () => (
    <XAxis
      dataKey="displayX"
      stroke={axisColor}
      interval={0}
      height={100}
      tickMargin={12}
      tick={({ x, y, payload }) => {
        const text =
          payload.value?.length > 10
            ? payload.value.substring(0, 10) + "..."
            : payload.value;

        return (
          <g transform={`translate(${x},${y})`}>
            <text
              x={0}
              y={0}
              dy={16}
              textAnchor="end"
              fill={axisColor}
              fontSize={10}
              transform="rotate(-25)"
            >
              {text}
            </text>
          </g>
        );
      }}
    >
      <Label
        value={xAxisKey}
        position="insideBottom"
        offset={-5}
        fill={axisColor}
        fontSize={12}
      />
    </XAxis>
  );

  const renderYAxis = () => (
    <YAxis
      stroke={axisColor}
      width={50}
      label={{
        value: yAxisKey,
        angle: -90,
        position: "center",
        dx: -25,
        fill: axisColor,
        fontSize: 12
      }}
      tick={{ fontSize: 10, fill: axisColor }}
      tickFormatter={formatYAxis}
    />
  );

  const ScrollWrapper = ({ children }) => (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      {children}
    </div>
  );

  const BothScrollWrapper = ({ children, minWidth, innerHeight = 300, maxHeight }) => (
    <div
      className={`w-full overflow-x-auto overflow-y-hidden custom-scrollbar ${maxHeight ? "" : "h-full"}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <div style={{ minWidth: minWidth || "100%", height: innerHeight }}>
        {children}
      </div>
    </div>
  );

  if (chartType === "heatmap") {
    return (
      <BothScrollWrapper minWidth={Math.max(600, safeData.length * 40)}>
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
      </BothScrollWrapper>
    );
  }

  if (chartType === "pie" || chartType === "donut") {
    const sortedPieData = [...safeData].sort((a, b) => b.value - a.value);
    const RADIAN = Math.PI / 180;

    // Precompute (pure, no mutation during render) which slice indices get a
    // label: every *distinct* value gets exactly one label (on its first,
    // largest-ranked occurrence, since data is pre-sorted big-to-small) —
    // later slices sharing that same value are skipped. Recharts can invoke
    // the label callback more than once per render pass, so the decision
    // can't depend on mutable state built up while rendering — it has to be
    // the same answer every time it's called.
    const pieLabeledIndices = (() => {
      const seenValues = new Set();
      const indices = new Set();
      sortedPieData.forEach((d, i) => {
        if (!seenValues.has(d.value)) {
          seenValues.add(d.value);
          indices.add(i);
        }
      });
      return indices;
    })();

    const renderLeaderLabel = ({ cx, cy, midAngle, outerRadius, percent, value, index }) => {
      if (!pieLabeledIndices.has(index)) return null;

      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const ring = index % 6;
      const stagger = 8 + ring * 10;
      const sx = cx + outerRadius * cos;
      const sy = cy + outerRadius * sin;
      const mx = cx + (outerRadius + stagger) * cos;
      const my = cy + (outerRadius + stagger) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 10;
      const ey = my;

      return (
        <g key={index}>
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={textColor} strokeWidth={0.5} fill="none" />
          <text
            x={ex + (cos >= 0 ? 2 : -2)}
            y={ey}
            textAnchor={cos >= 0 ? "start" : "end"}
            dominantBaseline="central"
            fill={textColor}
            fontSize={7}
          >
            {`${value} (${(percent * 100).toFixed(2)}%)`}
          </text>
        </g>
      );
    };

    const renderPieChart = (height, width = "100%", showLabels = false) => (
      <ResponsiveContainer width={width} height={height}>
        <PieChart margin={showLabels ? { top: 70, right: 220, bottom: 70, left: 220 } : undefined}>
          <Pie
            data={sortedPieData}
            dataKey="value"
            nameKey="displayX"
            innerRadius={chartType === "donut" ? 60 : 0}
            stroke="none"
            label={showLabels ? renderLeaderLabel : false}
            labelLine={false}
          >
            {sortedPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
        </PieChart>
      </ResponsiveContainer>
    );

    const renderSideLegend = (maxHeight) => (
      <div
        className="flex flex-col gap-2 overflow-y-auto custom-scrollbar px-4 text-sm w-[35%]"
        style={{ maxHeight }}
      >
        {sortedPieData.map((d, i) => (
          <span key={i} className="flex items-center gap-2" style={{ color: textColor }}>
            <span
              className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {d.displayX}
          </span>
        ))}
      </div>
    );

    const renderBottomLegend = () => (
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center max-h-[80px] overflow-y-auto custom-scrollbar px-2 mt-1 text-[10px]">
        {sortedPieData.map((d, i) => (
          <span key={i} className="flex items-center gap-1" style={{ color: textColor }}>
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {d.displayX}
          </span>
        ))}
      </div>
    );

    return (
      <>
        <div className="relative w-full h-full overflow-y-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setIsPieZoomed(true)}
            className="absolute top-0 right-0 z-10 text-gray-400 hover:text-white text-sm p-1"
            title="Expand"
          >
            🔍
          </button>
          {renderPieChart(300, "100%", false)}
          {renderBottomLegend()}
        </div>

        {isPieZoomed &&
          createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsPieZoomed(false)}
                className="absolute top-4 right-6 text-white text-2xl hover:text-gray-300"
                title="Close"
              >
                ×
              </button>
              <div className="w-full h-full flex items-center justify-center p-10">
                {renderPieChart(Math.min(window.innerHeight - 160, 700), "65%", true)}
                {renderSideLegend(Math.min(window.innerHeight - 160, 700))}
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  if (["bar", "stacked_bar", "horizontal_bar", "histogram"].includes(chartType)) {
    const isHorizontal = chartType === "horizontal_bar";
    return (
      <BothScrollWrapper minWidth={safeData.length * 60 > 600 ? safeData.length * 60 : "100%"}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout={isHorizontal ? "vertical" : "horizontal"}
            data={safeData}
            barCategoryGap={chartType === "histogram" ? 0 : "10%"}
            margin={{ top: 20, right: 20, left: 10, bottom: 60 }}         >
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={isHorizontal} />
            {isHorizontal ? (
              <XAxis
                type="number"
                stroke={axisColor}
                tick={{ fill: axisColor }}
                tickFormatter={formatYAxis}
              >
                <Label
                  value={yAxisKey}
                  position="insideBottom"
                  offset={-20}
                  fill={axisColor}
                  fontSize={12}
                />
              </XAxis>
            ) : (
              renderXAxis()
            )}

            {isHorizontal ? (
              <YAxis
                type="category"
                dataKey="displayX"
                stroke={axisColor}
                width={80}
                tick={{ fontSize: 8, fill: axisColor }}
              >
                <Label
                  value={xAxisKey}
                  angle={-90}
                  position="center"
                  dx={-35}
                  fill={axisColor}
                  fontSize={12}
                />
              </YAxis>
            ) : (
              renderYAxis()
            )}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            <Legend
              wrapperStyle={{
                paddingTop: 10,
                fontSize: "10px",
              }}
            />
            {metrics.map((metric, i) => (
              <Bar
                key={metric}
                dataKey={metric}
                name={metric}
                fill={COLORS[i % COLORS.length]}
                stackId={chartType === "stacked_bar" ? "a" : undefined}
                radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              />
            ))}          </BarChart>
        </ResponsiveContainer>
      </BothScrollWrapper>
    );
  }

  if (chartType === "line" || chartType === "multi_line") {
    return (
      <BothScrollWrapper minWidth={Math.max(600, safeData.length * 60)}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={safeData}
            margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
          >            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            {renderXAxis()}
            {renderYAxis()}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            {metrics.map((m, i) => (
              <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={safeData.length < 40} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </BothScrollWrapper>
    );
  }

  if (chartType === "area" || chartType === "stacked_area") {
    return (
      <BothScrollWrapper minWidth={Math.max(600, safeData.length * 60)}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={safeData}
            margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
          >            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            {renderXAxis()}
            {renderYAxis()}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: textColor }} />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} stackId={chartType === "stacked_area" ? "a" : undefined} />
          </AreaChart>
        </ResponsiveContainer>
      </BothScrollWrapper>
    );
  }

  if (chartType === "scatter" || chartType === "bubble") {
    return (
      <BothScrollWrapper minWidth={Math.max(600, safeData.length * 20)}>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis
              type="number"
              dataKey="x"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: FONT_SIZE }}
              tickFormatter={formatYAxis}
            >
              <Label
                value={xAxisKey}
                position="insideBottom"
                offset={-5}
                fill={axisColor}
                fontSize={10}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="y"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: FONT_SIZE }}
              tickFormatter={formatYAxis}
            >
              <Label
                value={yAxisKey}
                angle={-90}
                position="insideLeft"
                fill={axisColor}
                fontSize={10}
              />
            </YAxis>            {(chartType === "bubble" || sizeKey) && <ZAxis type="number" dataKey="size" range={[5, 60]} />}
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                color: textColor,
                fontSize: FONT_SIZE
              }}
            />
            {legendKey ? (
              <>
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                {Object.entries(
                  safeData.reduce((groups, d) => {
                    const key = d.legend ?? "N/A";
                    (groups[key] = groups[key] || []).push(d);
                    return groups;
                  }, {})
                ).map(([groupName, groupData], i) => (
                  <Scatter key={groupName} name={groupName} data={groupData} fill={COLORS[i % COLORS.length]} />
                ))}
              </>
            ) : (
              <Scatter data={safeData} fill={chartType === "bubble" ? "#8884d8" : "#00C49F"} />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </BothScrollWrapper>
    );
  }

  if (chartType === "treemap") {
    return (
      <BothScrollWrapper minWidth="100%">
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
      </BothScrollWrapper>
    );
  }

  if (chartType === "funnel") {

    const funnelData = buildFunnelData(safeData, finalConfig);

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
      <BothScrollWrapper minWidth={Math.max(600, safeData.length * 60)}>
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
      </BothScrollWrapper>
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



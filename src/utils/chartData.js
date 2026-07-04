// Shared chart-data normalization used by both the on-screen ChartRenderer
// and the native PDF chart drawers, so exported PDFs always match what's
// rendered on screen.

export const CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export const parseNumber = (val) => {
  if (val === null || val === undefined) return 0;
  const num = Number(String(val).replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
};

export const getFinalConfig = (config) => config?.config || config || {};

export const normalizeInputData = (data) => {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: Number(value) || 0,
    }));
  }
  return data;
};

export const resolveAxisKeys = (finalConfig) => {
  const metrics = finalConfig?.metrics || ["value"];
  const activeMetric = metrics[0];
  const xAxisKey = Array.isArray(finalConfig?.groupBy)
    ? finalConfig.groupBy[0]
    : finalConfig?.groupBy || finalConfig?.xAxis?.[0] || "displayX";
  const yAxisKey =
    finalConfig?.yAxis?.[0] ||
    (Array.isArray(finalConfig?.metrics)
      ? finalConfig?.metrics?.[0]
      : finalConfig?.metrics) ||
    "value";
  const sizeKey = Array.isArray(finalConfig?.size) ? finalConfig.size[0] : finalConfig?.size || null;
  const legendKey = Array.isArray(finalConfig?.legend) ? finalConfig.legend[0] : finalConfig?.legend || null;
  return { metrics, activeMetric, xAxisKey, yAxisKey, sizeKey, legendKey };
};

export const buildSafeData = (normalizedData, { xAxisKey, yAxisKey, activeMetric, sizeKey, legendKey }) => {
  if (!Array.isArray(normalizedData)) return [];

  return normalizedData.map((item, i) => {
    const xLabel =
      item[xAxisKey] ||
      item.displayX ||
      item.name ||
      item.x ||
      item.range ||
      item.group ||
      `Item ${i + 1}`;

    const rawValue =
      item[yAxisKey] ?? item[activeMetric] ?? item.value ?? item.cumulative ?? 0;
    const yValue = parseNumber(rawValue);
    const startValue =
      item.cumulative !== undefined ? parseNumber(item.cumulative) - yValue : 0;

    return {
      ...item,
      displayX: xLabel,
      displayY: item[yAxisKey] || yValue,
      x: parseNumber(item[xAxisKey]),
      y: parseNumber(item[yAxisKey]),
      value: yValue,
      start: startValue,
      [activeMetric]: yValue,
      size: sizeKey ? parseNumber(item[sizeKey]) : parseNumber(item.size) || 0,
      legend: legendKey ? item[legendKey] : undefined,
    };
  });
};

export const buildFunnelData = (data, config) => {
  if (!Array.isArray(data)) return [];

  const groupKey = config?.groupBy || config?.steps?.[0];
  const metricKey = config?.metrics?.[0] || config?.steps?.[1];

  if (!groupKey) return [];

  const grouped = {};

  data.forEach((item) => {
    const key = item[groupKey] || item.displayX || item.name;
    const value = parseNumber(item[metricKey]) || item.value || 0;

    if (!key) return;

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += value;
  });

  return Object.entries(grouped)
    .map(([key, val]) => ({ displayX: key, value: val }))
    .sort((a, b) => b.value - a.value);
};

export const formatAxisValue = (value) => {
  if (typeof value !== "number") return value;
  const absValue = Math.abs(value);
  if (absValue >= 1000000) return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (absValue >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return value;
};

// One-stop helper: given raw widget type/data/config, returns everything
// needed to render it (on screen or in the PDF).
export const prepareChartData = (type, rawData, rawConfig) => {
  const finalConfig = getFinalConfig(rawConfig);
  const normalizedData = normalizeInputData(rawData);
  const axisInfo = resolveAxisKeys(finalConfig);
  const safeData = Array.isArray(normalizedData)
    ? buildSafeData(normalizedData, axisInfo)
    : [];

  return { finalConfig, normalizedData, safeData, ...axisInfo };
};

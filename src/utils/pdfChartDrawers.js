// Native (vector) PDF chart drawing. Everything here draws directly with
// jsPDF's own primitives (rect/line/lines/circle/text) — no DOM screenshots,
// so charts stay crisp and full chart/table data is always included
// regardless of what was scrolled into view on screen.
import {
  CHART_COLORS,
  buildFunnelData,
  formatAxisValue,
  prepareChartData,
} from "./chartData";

const TITLE_H = 7; // mm reserved for the chart title inside a box
const CARD_PADDING = 4; // mm

export const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const lighten = ([r, g, b], amount) => [
  Math.round(r + (255 - r) * amount),
  Math.round(g + (255 - g) * amount),
  Math.round(b + (255 - b) * amount),
];

export const getPdfTheme = (darkMode) => ({
  darkMode,
  background: darkMode ? [2, 6, 23] : [255, 255, 255],
  cardBackground: darkMode ? [15, 23, 42] : [255, 255, 255],
  cardBorder: darkMode ? [51, 65, 85] : [229, 231, 235],
  grid: darkMode ? [51, 65, 85] : [229, 231, 235],
  axis: darkMode ? [248, 250, 252] : [17, 24, 39],
  text: darkMode ? [255, 255, 255] : [0, 0, 0],
  subtext: darkMode ? [148, 163, 184] : [107, 114, 128],
  colors: CHART_COLORS.map(hexToRgb),
});

const colorAt = (theme, i) => theme.colors[i % theme.colors.length];

const setFill = (pdf, rgb) => pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
const setDraw = (pdf, rgb) => pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
const setText = (pdf, rgb) => pdf.setTextColor(rgb[0], rgb[1], rgb[2]);

const truncate = (label, max = 14) => {
  const str = String(label ?? "");
  return str.length > max ? str.slice(0, max) + "..." : str;
};

// ---------- shared primitives ----------

const drawPolygon = (pdf, points, fillRgb, strokeRgb) => {
  if (points.length < 3) return;
  const [startX, startY] = points[0];
  const segs = [];
  for (let i = 1; i < points.length; i++) {
    segs.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);
  }
  let style = "F";
  if (fillRgb) setFill(pdf, fillRgb);
  if (strokeRgb) {
    setDraw(pdf, strokeRgb);
    style = fillRgb ? "FD" : "D";
  }
  pdf.lines(segs, startX, startY, [1, 1], style, true);
};

const drawWedge = (pdf, cx, cy, rOuter, rInner, a0, a1, fillRgb) => {
  const steps = Math.max(2, Math.ceil((Math.abs(a1 - a0) / (Math.PI * 2)) * 72));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * (i / steps);
    pts.push([cx + Math.cos(a) * rOuter, cy + Math.sin(a) * rOuter]);
  }
  if (rInner > 0) {
    for (let i = steps; i >= 0; i--) {
      const a = a0 + (a1 - a0) * (i / steps);
      pts.push([cx + Math.cos(a) * rInner, cy + Math.sin(a) * rInner]);
    }
  } else {
    pts.push([cx, cy]);
  }
  drawPolygon(pdf, pts, fillRgb, null);
};

const drawCardFrame = (pdf, box, chart, theme) => {
  setFill(pdf, theme.cardBackground);
  setDraw(pdf, theme.cardBorder);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(box.x, box.y, box.w, box.h, 2, 2, "FD");

  const title =
    chart.name || chart?.config?.config?.title || chart?.config?.title || chart.type || "";
  setText(pdf, theme.text);
  pdf.setFontSize(10);
  pdf.text(truncate(title, 42), box.x + CARD_PADDING, box.y + 6);
};

const innerBox = (box) => ({
  x: box.x + CARD_PADDING,
  y: box.y + TITLE_H,
  w: box.w - CARD_PADDING * 2,
  h: box.h - TITLE_H - CARD_PADDING,
});

const drawNoData = (pdf, box, theme) => {
  setText(pdf, theme.subtext);
  pdf.setFontSize(9);
  pdf.text("No data available", box.x + box.w / 2, box.y + box.h / 2, { align: "center" });
};

const drawUnsupported = (pdf, box, type, theme) => {
  setText(pdf, theme.subtext);
  pdf.setFontSize(9);
  pdf.text(`Unsupported chart type: ${type}`, box.x + 2, box.y + box.h / 2);
};

const drawLegend = (pdf, box, entries, theme) => {
  if (!entries.length) return;
  const swatch = 2.5;
  let x = box.x;
  let y = box.y;
  pdf.setFontSize(7);
  entries.forEach((entry) => {
    const label = truncate(entry.label, 12);
    const textW = pdf.getTextWidth(label);
    const itemW = swatch + 2 + textW + 5;
    if (x + itemW > box.x + box.w) {
      x = box.x;
      y += 4.5;
    }
    setFill(pdf, entry.color);
    pdf.rect(x, y - swatch + 1, swatch, swatch, "F");
    setText(pdf, theme.subtext);
    pdf.text(label, x + swatch + 1, y + 1);
    x += itemW;
  });
};

// ---------- axis helpers ----------

const axisValues = (safeData, metrics) => {
  const vals = [0];
  safeData.forEach((d) => {
    metrics.forEach((m) => vals.push(Number(d[m]) || 0));
    vals.push(Number(d.value) || 0);
    vals.push((Number(d.start) || 0) + (Number(d.value) || 0));
  });
  return { min: Math.min(...vals), max: Math.max(...vals, 1) };
};

const drawYAxisTicks = (pdf, plot, min, max, theme, tickCount = 4) => {
  setDraw(pdf, theme.grid);
  pdf.setLineWidth(0.1);
  setText(pdf, theme.subtext);
  pdf.setFontSize(6.5);
  for (let i = 0; i <= tickCount; i++) {
    const v = min + ((max - min) * i) / tickCount;
    const y = plot.y + plot.h - ((v - min) / (max - min || 1)) * plot.h;
    pdf.line(plot.x, y, plot.x + plot.w, y);
    pdf.text(String(formatAxisValue(Math.round(v))), plot.x - 1, y + 1, { align: "right" });
  }
};

const drawXLabels = (pdf, plot, labels, theme) => {
  setText(pdf, theme.subtext);
  pdf.setFontSize(6.5);
  const step = Math.max(1, Math.ceil(labels.length / 10));
  labels.forEach((label, i) => {
    if (i % step !== 0) return;
    const x = plot.x + (plot.w / Math.max(labels.length, 1)) * (i + 0.5);
    pdf.text(truncate(label, 8), x, plot.y + plot.h + 4, {
      align: "center",
      angle: labels.length > 6 ? 25 : 0,
    });
  });
};

// ---------- chart family drawers ----------

const drawBars = (pdf, box, safeData, metrics, theme, opts = {}) => {
  const { stacked, horizontal } = opts;
  const activeMetrics = metrics.length ? metrics : ["value"];
  const legendH = activeMetrics.length > 1 ? 5 : 0;
  const plot = { x: box.x, y: box.y, w: box.w, h: box.h - legendH - 6 };
  const { min, max } = axisValues(safeData, activeMetrics);

  if (!horizontal) drawYAxisTicks(pdf, plot, min, max, theme);

  const n = safeData.length;
  const groupW = plot.w / Math.max(n, 1);
  const barGap = groupW * 0.15;
  const barsPerGroup = stacked ? 1 : activeMetrics.length;
  const barW = (groupW - barGap * 2) / Math.max(barsPerGroup, 1);

  safeData.forEach((d, i) => {
    let stackBase = 0;
    activeMetrics.forEach((m, mi) => {
      const value = Number(d[m]) || 0;
      const ratio = (value - Math.min(min, 0)) / (max - Math.min(min, 0) || 1);
      const size = ratio * (horizontal ? plot.w : plot.h);
      const color = colorAt(theme, mi);

      if (horizontal) {
        const y = plot.y + i * (plot.h / n) + (plot.h / n) * 0.15;
        const h = (plot.h / n) * 0.7;
        setFill(pdf, color);
        pdf.rect(plot.x, y, size, h, "F");
      } else {
        const groupX = plot.x + i * groupW + barGap;
        const barX = stacked ? groupX : groupX + mi * barW;
        const baseRatio = (stackBase - Math.min(min, 0)) / (max - Math.min(min, 0) || 1);
        const y = plot.y + plot.h - ratio * plot.h - baseRatio * plot.h;
        setFill(pdf, color);
        pdf.rect(barX, y, stacked ? groupW - barGap * 2 : barW, size, "F");
        stackBase += value;
      }
    });
  });

  if (!horizontal) {
    drawXLabels(pdf, plot, safeData.map((d) => d.displayX), theme);
  } else {
    setText(pdf, theme.subtext);
    pdf.setFontSize(6.5);
    safeData.forEach((d, i) => {
      const y = plot.y + i * (plot.h / n) + (plot.h / n) * 0.6;
      pdf.text(truncate(d.displayX, 10), plot.x - 1, y, { align: "right" });
    });
  }

  if (activeMetrics.length > 1) {
    drawLegend(
      pdf,
      { x: box.x, y: box.y + box.h - legendH, w: box.w },
      activeMetrics.map((m, i) => ({ label: m, color: colorAt(theme, i) })),
      theme
    );
  }
};

const drawWaterfall = (pdf, box, safeData, theme) => {
  const plot = { x: box.x, y: box.y, w: box.w, h: box.h - 8 };
  const values = safeData.map((d) => d.start + d.value);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  drawYAxisTicks(pdf, plot, min, max, theme);

  const n = safeData.length;
  const groupW = plot.w / Math.max(n, 1);
  const barW = groupW * 0.6;

  safeData.forEach((d, i) => {
    const baseRatio = (d.start - min) / (max - min || 1);
    const topRatio = (d.start + d.value - min) / (max - min || 1);
    const x = plot.x + i * groupW + (groupW - barW) / 2;
    const yTop = plot.y + plot.h - Math.max(baseRatio, topRatio) * plot.h;
    const h = Math.abs(topRatio - baseRatio) * plot.h;
    setFill(pdf, colorAt(theme, 1));
    pdf.rect(x, yTop, barW, Math.max(h, 0.3), "F");
  });

  drawXLabels(pdf, plot, safeData.map((d) => d.displayX), theme);
};

const drawLines = (pdf, box, safeData, metrics, theme, opts = {}) => {
  const { filled, stacked } = opts;
  const activeMetrics = metrics.length ? metrics : ["value"];
  const legendH = activeMetrics.length > 1 ? 5 : 0;
  const plot = { x: box.x, y: box.y, w: box.w, h: box.h - legendH - 6 };
  const { min, max } = axisValues(safeData, activeMetrics);
  drawYAxisTicks(pdf, plot, min, max, theme);

  const n = safeData.length;
  const xStep = plot.w / Math.max(n - 1, 1);

  const cumulative = new Array(n).fill(0);

  activeMetrics.forEach((m, mi) => {
    const color = colorAt(theme, mi);
    const points = safeData.map((d, i) => {
      const raw = Number(d[m]) || 0;
      const base = stacked ? cumulative[i] : 0;
      const total = base + raw;
      if (stacked) cumulative[i] = total;
      const ratio = (total - Math.min(min, 0)) / (max - Math.min(min, 0) || 1);
      return [plot.x + i * xStep, plot.y + plot.h - ratio * plot.h];
    });

    if (filled) {
      const baseline = plot.y + plot.h;
      const baseStart = stacked
        ? points.map((_, i) => {
            const ratio = (cumulative[i] - (Number(safeData[i][m]) || 0) - Math.min(min, 0)) / (max - Math.min(min, 0) || 1);
            return plot.y + plot.h - ratio * plot.h;
          })
        : null;
      const areaPts = [...points];
      if (stacked) {
        for (let i = n - 1; i >= 0; i--) areaPts.push([plot.x + i * xStep, baseStart[i]]);
      } else {
        areaPts.push([plot.x + (n - 1) * xStep, baseline]);
        areaPts.push([plot.x, baseline]);
      }
      drawPolygon(pdf, areaPts, lighten(color, 0.55), null);
    }

    setDraw(pdf, color);
    pdf.setLineWidth(0.5);
    for (let i = 1; i < points.length; i++) {
      pdf.line(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
    }
  });

  drawXLabels(pdf, plot, safeData.map((d) => d.displayX), theme);

  if (activeMetrics.length > 1) {
    drawLegend(
      pdf,
      { x: box.x, y: box.y + box.h - legendH, w: box.w },
      activeMetrics.map((m, i) => ({ label: m, color: colorAt(theme, i) })),
      theme
    );
  }
};

const drawPie = (pdf, box, safeData, theme, donut) => {
  const legendH = 8;
  const cx = box.x + box.w / 2;
  const cy = box.y + (box.h - legendH) / 2;
  const r = Math.max(4, Math.min(box.w, box.h - legendH) / 2 - 2);
  const total = safeData.reduce((s, d) => s + Math.max(d.value, 0), 0) || 1;

  let angle = -Math.PI / 2;
  safeData.forEach((d, i) => {
    const sweep = (Math.max(d.value, 0) / total) * Math.PI * 2;
    drawWedge(pdf, cx, cy, r, donut ? r * 0.55 : 0, angle, angle + sweep, colorAt(theme, i));
    angle += sweep;
  });

  drawLegend(
    pdf,
    { x: box.x, y: box.y + box.h - legendH + 2, w: box.w },
    safeData.map((d, i) => ({ label: d.displayX, color: colorAt(theme, i) })),
    theme
  );
};

const drawScatter = (pdf, box, safeData, xAxisKey, yAxisKey, theme, opts = {}) => {
  const { bubble } = opts;
  const plot = { x: box.x, y: box.y, w: box.w, h: box.h - 8 };
  const xs = safeData.map((d) => d.x || 0);
  const ys = safeData.map((d) => d.y || 0);
  const xMin = Math.min(0, ...xs);
  const xMax = Math.max(1, ...xs);
  const yMin = Math.min(0, ...ys);
  const yMax = Math.max(1, ...ys);
  const sizes = safeData.map((d) => Number(d.size) || Number(d.value) || 1);
  const sMax = Math.max(...sizes, 1);

  drawYAxisTicks(pdf, plot, yMin, yMax, theme);

  safeData.forEach((d, i) => {
    const px = plot.x + ((d.x - xMin) / (xMax - xMin || 1)) * plot.w;
    const py = plot.y + plot.h - ((d.y - yMin) / (yMax - yMin || 1)) * plot.h;
    const r = bubble ? 1 + (sizes[i] / sMax) * 3.5 : 1.3;
    setFill(pdf, colorAt(theme, bubble ? 4 : 1));
    pdf.circle(px, py, r, "F");
  });

  setText(pdf, theme.subtext);
  pdf.setFontSize(6.5);
  pdf.text(truncate(xAxisKey, 20), plot.x + plot.w / 2, plot.y + plot.h + 4, { align: "center" });
};

const drawHeatmap = (pdf, box, safeData, theme) => {
  const plot = { x: box.x, y: box.y, w: box.w, h: box.h - 4 };
  const xs = [...new Set(safeData.map((d) => d.x))];
  const ys = [...new Set(safeData.map((d) => d.y))];
  const max = Math.max(...safeData.map((d) => d.value), 1);
  const cellW = plot.w / Math.max(xs.length, 1);
  const cellH = plot.h / Math.max(ys.length, 1);
  const light = [224, 247, 241];
  const dark = [0, 196, 159];

  safeData.forEach((d) => {
    const xi = xs.indexOf(d.x);
    const yi = ys.indexOf(d.y);
    const ratio = Math.min(Math.max(d.value / max, 0), 1);
    const color = [0, 1, 2].map((c) => Math.round(light[c] + (dark[c] - light[c]) * ratio));
    setFill(pdf, color);
    pdf.rect(plot.x + xi * cellW + 0.3, plot.y + yi * cellH + 0.3, cellW - 0.6, cellH - 0.6, "F");
  });
};

const drawRadar = (pdf, box, safeData, activeMetric, theme) => {
  const legendH = 0;
  const cx = box.x + box.w / 2;
  const cy = box.y + (box.h - legendH) / 2;
  const r = Math.max(4, Math.min(box.w, box.h - legendH) / 2 - 6);
  const n = safeData.length;
  const max = Math.max(...safeData.map((d) => d.value), 1);

  setDraw(pdf, theme.grid);
  pdf.setLineWidth(0.15);
  [0.33, 0.66, 1].forEach((f) => pdf.circle(cx, cy, r * f, "D"));

  const points = safeData.map((d, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const ratio = Math.max(d.value, 0) / max;
    return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio];
  });
  drawPolygon(pdf, points, lighten(colorAt(theme, 4), 0.5), colorAt(theme, 4));

  setText(pdf, theme.subtext);
  pdf.setFontSize(safeData.length > 8 ? 5.5 : 6.5);
  safeData.forEach((d, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const lx = cx + Math.cos(a) * (r + 5);
    const ly = cy + Math.sin(a) * (r + 5);
    pdf.text(truncate(d.displayX, 10), lx, ly, { align: "center" });
  });
};

const drawGauge = (pdf, box, safeData, finalConfig, theme) => {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h - 6;
  const r = Math.min(box.w / 2 - 4, box.h - 12);
  const value = safeData[0]?.value || 0;
  const max = Number(finalConfig?.max) || Math.max(value, 1);
  const ratio = Math.min(Math.max(value / max, 0), 1);

  drawWedge(pdf, cx, cy, r, r * 0.6, Math.PI, Math.PI * 2, theme.grid);
  drawWedge(pdf, cx, cy, r, r * 0.6, Math.PI, Math.PI + ratio * Math.PI, colorAt(theme, 1));

  setText(pdf, theme.text);
  pdf.setFontSize(13);
  pdf.text(String(formatAxisValue(value)), cx, cy - 4, { align: "center" });
};

const drawFunnel = (pdf, box, funnelData, theme) => {
  if (!funnelData.length) return drawNoData(pdf, box, theme);
  const max = Math.max(...funnelData.map((d) => d.value), 1);
  const rowH = box.h / funnelData.length;

  funnelData.forEach((d, i) => {
    const wTop = (Math.max(d.value, 0) / max) * box.w;
    const wBottom =
      i + 1 < funnelData.length
        ? (Math.max(funnelData[i + 1].value, 0) / max) * box.w
        : wTop * 0.85;
    const y0 = box.y + i * rowH;
    const y1 = y0 + rowH - 1;
    const cx = box.x + box.w / 2;
    const pts = [
      [cx - wTop / 2, y0],
      [cx + wTop / 2, y0],
      [cx + wBottom / 2, y1],
      [cx - wBottom / 2, y1],
    ];
    drawPolygon(pdf, pts, colorAt(theme, i), null);

    setText(pdf, theme.text);
    pdf.setFontSize(6.5);
    pdf.text(`${truncate(d.displayX, 14)} (${formatAxisValue(d.value)})`, cx, (y0 + y1) / 2, {
      align: "center",
    });
  });
};

const drawTreemap = (pdf, box, safeData, theme) => {
  const sorted = [...safeData].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, d) => s + Math.max(d.value, 0), 0) || 1;
  let x = box.x;
  let y = box.y;
  let remainingW = box.w;
  let remainingH = box.h;
  let horizontal = box.w >= box.h;

  sorted.forEach((d, i) => {
    const frac = Math.max(d.value, 0) / total;
    if (horizontal) {
      const w = frac * box.w;
      setFill(pdf, colorAt(theme, i));
      pdf.rect(x, y, Math.max(w, 0.5), remainingH, "F");
      setText(pdf, theme.text);
      pdf.setFontSize(6);
      if (w > 10) pdf.text(truncate(d.displayX, 10), x + 1, y + 5);
      x += w;
    } else {
      const h = frac * box.h;
      setFill(pdf, colorAt(theme, i));
      pdf.rect(x, y, remainingW, Math.max(h, 0.5), "F");
      setText(pdf, theme.text);
      pdf.setFontSize(6);
      if (h > 6) pdf.text(truncate(d.displayX, 14), x + 1, y + 4);
      y += h;
    }
  });
};

const drawKpi = (pdf, box, safeData, activeMetric, theme) => {
  const value = safeData[0]?.value || 0;
  setText(pdf, theme.subtext);
  pdf.setFontSize(8);
  pdf.text(truncate(activeMetric || "Total", 20), box.x + box.w / 2, box.y + box.h / 2 - 4, {
    align: "center",
  });
  setText(pdf, theme.text);
  pdf.setFontSize(18);
  pdf.text(String(formatAxisValue(value)), box.x + box.w / 2, box.y + box.h / 2 + 6, {
    align: "center",
  });
};

const drawTableSimple = (pdf, box, safeData, theme) => {
  const columns = safeData.length
    ? Object.keys(safeData.reduce((acc, obj) => ({ ...acc, ...obj }), {})).filter(
        (c) => !["displayX", "displayY", "start", "x", "y"].includes(c)
      )
    : [];
  const visibleCols = columns.slice(0, 4);
  const rowH = 4.5;
  const maxRows = Math.floor(box.h / rowH) - 1;
  const colW = box.w / Math.max(visibleCols.length, 1);

  setText(pdf, theme.text);
  pdf.setFontSize(6.5);
  visibleCols.forEach((c, i) => pdf.text(truncate(c, 14), box.x + i * colW, box.y + 3));

  setText(pdf, theme.subtext);
  safeData.slice(0, maxRows).forEach((row, r) => {
    visibleCols.forEach((c, i) => {
      const val = row[c] !== undefined && row[c] !== null ? String(row[c]) : "-";
      pdf.text(truncate(val, 14), box.x + i * colW, box.y + (r + 2) * rowH);
    });
  });

  if (safeData.length > maxRows) {
    setText(pdf, theme.subtext);
    pdf.setFontSize(6);
    pdf.text(
      `+${safeData.length - maxRows} more rows in the Table section below`,
      box.x,
      box.y + box.h - 1
    );
  }
};

// ---------- entry point ----------

export const drawChart = (pdf, chart, box, theme) => {
  const type = (chart.type || "").toLowerCase();
  const { finalConfig, safeData, metrics, activeMetric, xAxisKey, yAxisKey } = prepareChartData(
    chart.type,
    Array.isArray(chart.data) ? chart.data : [],
    chart.config
  );

  drawCardFrame(pdf, box, chart, theme);
  const inner = innerBox(box);

  if (!safeData.length && type !== "kpi") {
    drawNoData(pdf, inner, theme);
    return;
  }

  switch (type) {
    case "kpi":
      return drawKpi(pdf, inner, safeData, activeMetric, theme);
    case "table":
      return drawTableSimple(pdf, inner, safeData, theme);
    case "funnel":
      return drawFunnel(pdf, inner, buildFunnelData(safeData, finalConfig), theme);
    case "pie":
    case "donut":
      return drawPie(pdf, inner, safeData, theme, type === "donut");
    case "bar":
    case "histogram":
      return drawBars(pdf, inner, safeData, metrics, theme, {});
    case "stacked_bar":
      return drawBars(pdf, inner, safeData, metrics, theme, { stacked: true });
    case "horizontal_bar":
      return drawBars(pdf, inner, safeData, metrics, theme, { horizontal: true });
    case "waterfall":
      return drawWaterfall(pdf, inner, safeData, theme);
    case "line":
    case "multi_line":
      return drawLines(pdf, inner, safeData, metrics, theme, {});
    case "area":
      return drawLines(pdf, inner, safeData, ["value"], theme, { filled: true });
    case "stacked_area":
      return drawLines(pdf, inner, safeData, metrics.length ? metrics : ["value"], theme, {
        filled: true,
        stacked: true,
      });
    case "scatter":
      return drawScatter(pdf, inner, safeData, xAxisKey, yAxisKey, theme, {});
    case "bubble":
      return drawScatter(pdf, inner, safeData, xAxisKey, yAxisKey, theme, { bubble: true });
    case "heatmap":
      return drawHeatmap(pdf, inner, safeData, theme);
    case "radar":
      return drawRadar(pdf, inner, safeData, activeMetric, theme);
    case "gauge":
      return drawGauge(pdf, inner, safeData, finalConfig, theme);
    case "treemap":
      return drawTreemap(pdf, inner, safeData, theme);
    default:
      return drawUnsupported(pdf, inner, type, theme);
  }
};

// Full-width table renderer used for TABLE-type widgets in the PDF layout —
// paginates all rows (not just what fits/was scrolled on screen) and
// repeats the header row on every page it spans.
export const drawFullTable = (pdf, chart, box, theme, { pageBottom, addPage }) => {
  const { safeData } = prepareChartData(
    chart.type,
    Array.isArray(chart.data) ? chart.data : [],
    chart.config
  );

  const title =
    chart.name || chart?.config?.config?.title || chart?.config?.title || "Table";
  const columns = safeData.length
    ? Object.keys(safeData.reduce((acc, obj) => ({ ...acc, ...obj }), {})).filter(
        (c) => !["displayX", "displayY", "start", "x", "y"].includes(c)
      )
    : [];

  let y = box.y;
  setText(pdf, theme.text);
  pdf.setFontSize(11);
  pdf.text(truncate(title, 60), box.x, y + 5);
  y += 9;

  if (!columns.length) {
    setText(pdf, theme.subtext);
    pdf.setFontSize(9);
    pdf.text("No data available", box.x, y + 4);
    return y + 8;
  }

  const colW = box.w / columns.length;
  const rowH = 6;

  const drawHeader = (yy) => {
    setFill(pdf, theme.cardBorder);
    pdf.rect(box.x, yy - 4.5, box.w, rowH, "F");
    setText(pdf, theme.text);
    pdf.setFontSize(7.5);
    columns.forEach((c, i) => pdf.text(truncate(c, 18), box.x + i * colW + 1, yy));
    return yy + rowH;
  };

  y = drawHeader(y);

  safeData.forEach((row, idx) => {
    if (y + rowH > pageBottom) {
      y = addPage();
      y = drawHeader(y);
    }
    if (idx % 2 === 1) {
      setFill(pdf, theme.darkMode ? [30, 41, 59] : [249, 250, 251]);
      pdf.rect(box.x, y - 4.5, box.w, rowH, "F");
    }
    setText(pdf, theme.subtext);
    pdf.setFontSize(7);
    columns.forEach((c, i) => {
      const val = row[c] !== undefined && row[c] !== null ? String(row[c]) : "-";
      pdf.text(truncate(val, 22), box.x + i * colW + 1, y);
    });
    y += rowH;
  });

  return y + 4;
};

// Paginated free-text block (used for the Report Summary section).
export const drawTextBlock = (pdf, text, box, theme, { pageBottom, addPage }) => {
  setText(pdf, theme.subtext);
  pdf.setFontSize(9.5);
  const lineH = 5;
  const lines = pdf.splitTextToSize(text, box.w);
  let y = box.y;

  lines.forEach((line) => {
    if (y + lineH > pageBottom) {
      y = addPage();
    }
    pdf.text(line, box.x, y);
    y += lineH;
  });

  return y;
};

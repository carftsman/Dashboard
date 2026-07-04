// Builds the full dashboard PDF: paginated, native-vector chart grid +
// full-width tables + report summary. No DOM screenshots involved, so
// content is never cropped or shrunk into illegibility.
import jsPDF from "jspdf";
import { prepareChartData } from "./chartData";
import { drawChart, drawFullTable, drawTextBlock, getPdfTheme } from "./pdfChartDrawers";

const PAGE_MARGIN = 12;
const COLUMN_GAP = 6;
const ROW_GAP = 8;
const CHART_BOX_H = 85;
const COLUMNS = 2;
const KPI_CARD_W = 42;
const KPI_CARD_H = 18;
const KPI_GAP = 4;

const isKpi = (chart) => chart.type?.toLowerCase() === "kpi";
const isTable = (chart) => chart.type?.toLowerCase() === "table";

export function buildDashboardPdf({ dashboard, charts, reportSummary, darkMode }) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const pageBottom = pageH - PAGE_MARGIN;
  const usableW = pageW - PAGE_MARGIN * 2;
  const theme = getPdfTheme(darkMode);

  const paintBackground = () => {
    pdf.setFillColor(...theme.background);
    pdf.rect(0, 0, pageW, pageH, "F");
  };

  const addPage = () => {
    pdf.addPage();
    paintBackground();
    return PAGE_MARGIN;
  };

  paintBackground();
  let y = PAGE_MARGIN;

  const ensureSpace = (neededH) => {
    if (y + neededH > pageBottom) {
      y = addPage();
    }
  };

  // Header
  pdf.setTextColor(...theme.text);
  pdf.setFontSize(18);
  pdf.text(dashboard?.name || "Dashboard Report", PAGE_MARGIN, y + 6);
  y += 9;

  if (dashboard?.description) {
    pdf.setFontSize(10);
    pdf.setTextColor(...theme.subtext);
    pdf.text(dashboard.description, PAGE_MARGIN, y + 2);
    y += 8;
  }
  y += 3;

  const safeCharts = Array.isArray(charts) ? charts : [];

  if (!safeCharts.length) {
    pdf.setFontSize(11);
    pdf.setTextColor(...theme.subtext);
    pdf.text("No charts to export.", PAGE_MARGIN, y + 4);
    y += 10;
  }

  const kpiCharts = safeCharts.filter(isKpi);
  const tableCharts = safeCharts.filter((c) => !isKpi(c) && isTable(c));
  const gridCharts = safeCharts.filter((c) => !isKpi(c) && !isTable(c));

  // ---- KPI row(s) ----
  if (kpiCharts.length) {
    const entries = [];
    kpiCharts.forEach((chart) => {
      const { safeData } = prepareChartData(
        chart.type,
        Array.isArray(chart.data) ? chart.data : [],
        chart.config
      );
      const items = safeData.length ? safeData : [{ value: 0 }];
      items.forEach((item) => {
        entries.push({
          label:
            chart?.config?.config?.title ||
            chart?.config?.title ||
            chart.name ||
            item.displayX ||
            "N/A",
          value: item.value ?? 0,
        });
      });
    });

    const perRow = Math.max(1, Math.floor((usableW + KPI_GAP) / (KPI_CARD_W + KPI_GAP)));
    ensureSpace(KPI_CARD_H);

    entries.forEach((entry, i) => {
      const col = i % perRow;
      if (i > 0 && col === 0) {
        y += KPI_CARD_H + KPI_GAP;
        ensureSpace(KPI_CARD_H);
      }
      const x = PAGE_MARGIN + col * (KPI_CARD_W + KPI_GAP);

      pdf.setFillColor(...theme.cardBackground);
      pdf.setDrawColor(...theme.cardBorder);
      pdf.setLineWidth(0.2);
      pdf.roundedRect(x, y, KPI_CARD_W, KPI_CARD_H, 2, 2, "FD");

      pdf.setTextColor(...theme.subtext);
      pdf.setFontSize(7);
      const label = String(entry.label).slice(0, 20);
      pdf.text(label, x + 3, y + 6);

      pdf.setTextColor(...theme.text);
      pdf.setFontSize(13);
      const displayValue =
        typeof entry.value === "number" ? Math.round(entry.value * 100) / 100 : entry.value;
      pdf.text(String(displayValue), x + 3, y + 14);
    });

    y += KPI_CARD_H + ROW_GAP;
  }

  // ---- Chart grid (2 per row, flowing across pages) ----
  const colW = (usableW - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;

  for (let i = 0; i < gridCharts.length; i += COLUMNS) {
    ensureSpace(CHART_BOX_H);
    const row = gridCharts.slice(i, i + COLUMNS);
    const rowY = y;
    row.forEach((chart, colIdx) => {
      const box = {
        x: PAGE_MARGIN + colIdx * (colW + COLUMN_GAP),
        y: rowY,
        w: colW,
        h: CHART_BOX_H,
      };
      drawChart(pdf, chart, box, theme);
    });
    y += CHART_BOX_H + ROW_GAP;
  }

  // ---- Full-width tables (own pagination, all rows included) ----
  tableCharts.forEach((chart) => {
    ensureSpace(20);
    y = drawFullTable(pdf, chart, { x: PAGE_MARGIN, y, w: usableW }, theme, {
      pageBottom,
      addPage,
    });
    y += ROW_GAP;
  });

  // ---- Report summary ----
  if (reportSummary && reportSummary.trim()) {
    ensureSpace(16);
    pdf.setFontSize(13);
    pdf.setTextColor(...theme.text);
    pdf.text("Report Summary", PAGE_MARGIN, y + 5);
    y += 10;
    drawTextBlock(pdf, reportSummary, { x: PAGE_MARGIN, y, w: usableW }, theme, {
      pageBottom,
      addPage,
    });
  }

  return pdf;
}

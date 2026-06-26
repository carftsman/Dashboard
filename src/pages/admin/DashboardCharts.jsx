import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import Sidebar from "../../components/Sidebar";
import VisualizationModal from "../../components/VisualizationModal";
import api from "../../api/apiConfig";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiGrid,
  FiDatabase,
  FiFilter,
  FiDisc,
  FiActivity,
  FiTarget,
} from "react-icons/fi";


export default function DashboardCharts() {
  const { dashboardId, dashboardName } = useParams();

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [chartToDelete, setChartToDelete] = useState(null);
  const fetchCharts = async () => {
    try {
      const response = await api.get(`/api/dashboards/${dashboardId}/widgets`);

      const allCharts = response.data?.charts || response.data || [];

      const sortedCharts = allCharts.sort((a, b) => {
        if (a.type === "KPI" && b.type !== "KPI") return -1;

        if (a.type !== "KPI" && b.type === "KPI") return 1;

        return 0;
      });

      setCharts(sortedCharts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, [dashboardId]);

  const handleDelete = async (widgetId) => {
    try {
      await api.delete(`/api/dashboards/${dashboardId}/widgets/${widgetId}`);

      setCharts((prev) => prev.filter((chart) => chart.id !== widgetId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 ml-[250px] p-6 overflow-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Charts
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and customize the charts in your dashboard
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedChart(null);
              setOverlayOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
          >
            <FiPlus />
            Add Chart
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Chart Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Chart Type
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Selected Columns
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {charts.map((chart, index) => {
                  const config = chart.config?.config || chart.config || {};

                  let selectedData = [];

                  if (chart.type === "KPI") {
                    selectedData = config?.metrics || [];
                  } else if (chart.type === "FUNNEL") {
                    selectedData = config?.steps || [];
                  } else if (chart.type === "TABLE") {
                    selectedData = config?.columns || [];
                  } else {
                    selectedData = [
                      ...(config?.xAxis || []),
                      ...(config?.yAxis || []),
                      ...(config?.metrics || []),
                    ];
                  }

                  // Remove duplicates
                  selectedData = [...new Set(selectedData)];

                  return (
                    <tr
                      key={chart.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* Index */}
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {index + 1}
                      </td>

                      {/* Chart Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            {chart.type === "BAR" && <FiBarChart2 />}
                            {chart.type === "LINE" && <FiTrendingUp />}
                            {chart.type === "PIE" && <FiPieChart />}
                            {chart.type === "AREA" && <FiTrendingUp />}
                            {chart.type === "TABLE" && <FiGrid />}
                            {chart.type === "KPI" && <FiDatabase />}
                            {chart.type === "FUNNEL" && <FiFilter />}
                            {chart.type === "DONUT" && <FiDisc />}
                            {chart.type === "HORIZONTAL_BAR" && <FiBarChart2 />}
                            {chart.type === "STACKED_BAR" && <FiBarChart2 />}
                            {chart.type === "MULTI_LINE" && <FiTrendingUp />}
                            {chart.type === "STACKED_AREA" && <FiTrendingUp />}
                            {chart.type === "SCATTER" && <FiActivity />}
                            {chart.type === "BUBBLE" && <FiActivity />}
                            {chart.type === "HEATMAP" && <FiGrid />}
                            {chart.type === "RADAR" && <FiTarget />}
                            {chart.type === "GAUGE" && <FiTarget />}
                            {chart.type === "HISTOGRAM" && <FiBarChart2 />}
                            {chart.type === "WATERFALL" && <FiBarChart2 />}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {config?.title || chart.name || chart.type}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Chart Type */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-700">
                          {chart.type === "BAR" && (
                            <FiBarChart2 className="text-orange-500" />
                          )}

                          {chart.type === "LINE" && (
                            <FiTrendingUp className="text-green-500" />
                          )}

                          {chart.type === "PIE" && (
                            <FiPieChart className="text-purple-500" />
                          )}

                          {chart.type === "AREA" && (
                            <FiTrendingUp className="text-cyan-500" />
                          )}

                          {chart.type === "TABLE" && (
                            <FiGrid className="text-gray-500" />
                          )}

                          {chart.type === "KPI" && (
                            <FiDatabase className="text-indigo-500" />
                          )}

                          {chart.type === "FUNNEL" && (
                            <FiFilter className="text-orange-500" />
                          )}

                          {chart.type === "DONUT" && (
                            <FiDisc className="text-pink-500" />
                          )}

                          {chart.type === "HORIZONTAL_BAR" && (
                            <FiBarChart2 className="text-orange-500" />
                          )}

                          {chart.type === "STACKED_BAR" && (
                            <FiBarChart2 className="text-orange-500" />
                          )}

                          {chart.type === "MULTI_LINE" && (
                            <FiTrendingUp className="text-green-500" />
                          )}

                          {chart.type === "STACKED_AREA" && (
                            <FiTrendingUp className="text-cyan-500" />
                          )}

                          {chart.type === "SCATTER" && (
                            <FiActivity className="text-blue-500" />
                          )}

                          {chart.type === "BUBBLE" && (
                            <FiActivity className="text-indigo-500" />
                          )}

                          {chart.type === "HEATMAP" && (
                            <FiGrid className="text-red-500" />
                          )}

                          {chart.type === "RADAR" && (
                            <FiTarget className="text-purple-500" />
                          )}

                          {chart.type === "GAUGE" && (
                            <FiTarget className="text-green-500" />
                          )}

                          {chart.type === "HISTOGRAM" && (
                            <FiBarChart2 className="text-yellow-500" />
                          )}

                          {chart.type === "WATERFALL" && (
                            <FiBarChart2 className="text-pink-500" />
                          )}

                          <span className="text-sm font-medium">
                            {chart.type}
                          </span>
                        </div>
                      </td>


                      {/* Selected Data */}
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {/* KPI */}

                          {chart.type === "KPI" &&
                            Array.isArray(config?.metrics) && (
                              <span className="px-4 py-2 rounded-[14px] bg-green-100 text-green-700 text-[12px] font-medium">
                                Metric: {config.metrics.join(", ")}
                              </span>
                            )}

                          {/* TABLE */}

                          {chart.type === "TABLE" &&
                            Array.isArray(config?.columns) &&
                            config.columns.map((col, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 rounded-[14px] bg-purple-100 text-purple-700 text-[12px] font-medium"
                              >
                                Column: {col}
                              </span>
                            ))}

                          {/* FUNNEL */}

                          {chart.type === "FUNNEL" &&
                            Array.isArray(config?.steps) &&
                            config.steps.map((step, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 rounded-[14px] bg-orange-100 text-orange-700 text-[12px] font-medium"
                              >
                                Step: {step}
                              </span>
                            ))}

                          {/* OTHER CHARTS */}
                          {/* SCATTER */}

                          {chart.type === "SCATTER" && (
                            <>
                              {config?.xAxis && (
                                <span className="px-4 py-2 rounded-[14px] bg-blue-100 text-blue-700 text-[12px] font-medium">
                                  X-axis: {config.xAxis}
                                </span>
                              )}

                              {config?.yAxis && (
                                <span className="px-4 py-2 rounded-[14px] bg-green-100 text-green-700 text-[12px] font-medium">
                                  Y-axis: {config.yAxis}
                                </span>
                              )}

                              {config?.size && (
                                <span className="px-4 py-2 rounded-[14px] bg-yellow-100 text-yellow-700 text-[12px] font-medium">
                                  Size: {config.size}
                                </span>
                              )}

                              {config?.legend && (
                                <span className="px-4 py-2 rounded-[14px] bg-purple-100 text-purple-700 text-[12px] font-medium">
                                  Legend: {config.legend}
                                </span>
                              )}
                            </>
                          )}

                          {chart.type !== "KPI" &&
                            chart.type !== "TABLE" &&
                            chart.type !== "FUNNEL" &&
                            chart.type !== "SCATTER" && (
                              <>
                                {Array.isArray(config?.xAxis) &&
                                  config.xAxis.map((x, idx) => (
                                    <span
                                      key={idx}
                                      className="px-4 py-2 rounded-[14px] bg-blue-100 text-blue-700 text-[12px] font-medium"
                                    >
                                      X-axis: {x}
                                    </span>
                                  ))}

                                {Array.isArray(config?.metrics) &&
                                  config.metrics.map((metric, idx) => (
                                    <span
                                      key={idx}
                                      className="px-4 py-2 rounded-[14px] bg-green-100 text-green-700 text-[12px] font-medium"
                                    >
                                      Y-axis: {metric}
                                    </span>
                                  ))}
                              </>
                            )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedChart({
                                ...chart,

                                config: chart.config || {},
                              });

                              setOverlayOpen(true);
                            }}
                            className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-sm"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setChartToDelete(chart.id);

                              setDeletePopup(true);
                            }}
                            className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-sm"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {deletePopup && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeletePopup(false)}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[380px]">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete Chart
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete this chart?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeletePopup(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleDelete(chartToDelete);
                    setDeletePopup(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <VisualizationModal
          isOpen={overlayOpen}
          onClose={() => {
            setOverlayOpen(false);
            setSelectedChart(null);
          }}
          dashboardId={dashboardId}
          onSuccess={fetchCharts}
          chart={selectedChart}
        />
      </div>
    </div>
  );
}


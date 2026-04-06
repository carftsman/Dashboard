import { useParams } from "react-router-dom";
import { FiFileText } from "react-icons/fi";

export default function ReportTable({ formattedData }) {
  const { dashboardId } = useParams();
  const showDashboardColumn = !dashboardId;

  return (
    <div className="mt-0">
      <table className="w-full">
        <thead>
          <tr className="text-gray-500 border-b text-left text-sm">
            {showDashboardColumn && <th>Dashboard Name</th>}
            <th className="py-2">Name</th>
            <th>Date Generated</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {formattedData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {showDashboardColumn && <td>{item.dashboardName}</td>}

              <td className="py-2">{item.name}</td>

              <td>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td className="text-center">
                {/* Changed from button to <a> tag */}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition mx-auto"
                >
                  <FiFileText size={16} />
                  View PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
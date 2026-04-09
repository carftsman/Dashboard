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
                <button
                  onClick={() => {
                    const newWindow = window.open("", "_blank");
 
                    newWindow.document.write(`
                      <html>
                        <head>
                          <title>${item.name}</title>
                          <style>
                            body {
                              margin: 0;
                              font-family: Arial, sans-serif;
                              background: #f3f4f6;
                            }
                            .header {
                              padding: 16px;
                              background: white;
                              border-bottom: 1px solid #ddd;
                              font-size: 18px;
                              font-weight: bold;
                            }
                            .viewer {
                              width: 100%;
                              height: calc(100vh - 60px);
                              border: none;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="header">${item.name}</div>
 
                          <!-- Try iframe -->
                          <iframe
                            class="viewer"
                            src="${item.fileUrl}#toolbar=0&navpanes=0&scrollbar=0">
                          </iframe>
 
                          <!-- Fallback (some browsers) -->
                          <embed
                            class="viewer"
                            src="${item.fileUrl}#toolbar=0&navpanes=0&scrollbar=0"
                            type="application/pdf" />
                        </body>
                      </html>
                    `);
 
                    newWindow.document.close();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition mx-auto"
                >
                  <FiFileText size={16} />
                  View PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
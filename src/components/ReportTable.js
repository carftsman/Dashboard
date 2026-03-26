export default function ReportTable({ formattedData }) {

  const downloadFile = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "report.pdf"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="text-gray-500 border-b text-left">
          <th className="py-2">Name</th>
          <th>Date Generated</th>
          <th>Download Actions</th>
        </tr>
      </thead>

      <tbody>
        {formattedData.map((item, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            <td className="py-3">{item.name}</td>
            <td>
              {new Date(item.createdAt).toLocaleDateString()}
            </td>

            <td>
              <button
                className="bg-red-100 text-red-600 px-3 py-1 rounded mr-2"
                onClick={() => downloadFile(item.fileUrl, item.name)}
              >
                PDF
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
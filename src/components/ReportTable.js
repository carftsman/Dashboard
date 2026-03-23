export default function ReportTable({ reports }) {
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
        {reports.map((item, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            <td className="py-3">{item.name}</td>
            <td>{item.date}</td>
            <td>
              <button className="bg-red-100 text-red-600 px-3 py-1 rounded mr-2">
                PDF
              </button>
              <button className="bg-green-100 text-green-600 px-3 py-1 rounded">
                Excel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
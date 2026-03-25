import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ColumnMapping() {
  const location = useLocation();
  const fileId = location.state?.fileId;

  console.log("fileId in ColumnMapping:", fileId);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">
        Column Mapping Screen
      </h2>
      {fileId ? (
        <p className="text-gray-600">
          Mapping data for file ID: <span className="font-mono text-blue-600">{fileId}</span>
        </p>
      ) : (
        <p className="text-red-500">No file ID provided. Please upload a file first.</p>
      )}
    </div>
  );
}

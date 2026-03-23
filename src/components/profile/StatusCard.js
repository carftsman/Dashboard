import React from "react";

export default function StatusCard({ status }) {

return (

<div className="flex-1 bg-white p-5 rounded-lg text-center shadow-sm">

  <span className="text-xs text-gray-400 tracking-wider block mb-3">
    ACCOUNT STATUS
  </span>

  <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-xs font-semibold inline-block mb-3">
    {status}
  </div>

  <p className="text-gray-500 text-sm">
    Member since January 2021
  </p>

</div>

)
}
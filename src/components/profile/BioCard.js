import React from "react";

export default function BioCard({ bio }) {

return (

<div className="flex-[2] bg-white p-5 rounded-lg shadow-sm">
  <h3 className="font-semibold mb-2">Bio</h3>
  <p className="text-gray-600 text-sm">{bio}</p>
</div>

)
}
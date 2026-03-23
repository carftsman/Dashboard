import React from "react";
import { FaEnvelope, FaPhone, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";

export default function InfoSection({ user }) {

return (

<div className="flex gap-10 px-8 py-6">

  {/* LEFT */}
  <div className="flex-1">

    <span className="text-xs tracking-wider text-gray-400 mb-4 block">
      CONTACT DETAILS
    </span>

    <div className="flex items-center gap-3 mb-4">
      <FaEnvelope/>
      <div>
        <span className="text-sm">Email Address</span>
        <p className="text-gray-600 text-sm">{user.email}</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <FaPhone/>
      <div>
        <span className="text-sm">Phone Number</span>
        <p className="text-gray-600 text-sm">{user.phone}</p>
      </div>
    </div>

  </div>

  {/* RIGHT */}
  <div className="flex-1">

    <span className="text-xs tracking-wider text-gray-400 mb-4 block">
      WORK INFORMATION
    </span>

    <div className="flex items-center gap-3 mb-4">
      <FaBriefcase/>
      <div>
        <span className="text-sm">Current Role</span>
        <p className="text-gray-600 text-sm">{user.role}</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <FaMapMarkerAlt/>
      <div>
        <span className="text-sm">Office Location</span>
        <p className="text-gray-600 text-sm">{user.location}</p>
      </div>
    </div>

  </div>

</div>

)
}
import React from "react";
import { FaPen, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ user }) {

const navigate = useNavigate();

return (

<>
  {/* Gradient */}
  <div className="h-[110px] bg-gradient-to-r from-[#9fb6d4] to-[#1e2b44]"></div>

  <div className="flex items-center gap-5 px-8 py-5 -mt-10">

    <img 
      src={user.image} 
      alt="avatar"
      className="w-[90px] h-[90px] rounded-full border-[5px] border-white object-cover"
    />

    <div>
      <h2 className="text-[20px] font-semibold m-0">{user.name}</h2>
      <p className="text-gray-500 text-sm">
        {user.role} • {user.department}
      </p>
    </div>

    <div className="ml-auto flex gap-3">

      <button
        onClick={() => navigate("/edit-profile")}
        className="flex items-center gap-2 bg-gray border border-gray-200 px-3 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-black transition"
      >
        <FaPen className="text-xs"/>
        Edit Profile
      </button>

      <button
        onClick={() => navigate("/change-password")}
        className="flex items-center gap-2 bg-gray border border-gray-200 px-3 py-2 rounded-md text-sm hover:bg-white-600 hover:text-black transition"
      >
        <FaLock className="text-xs"/>
        Change Password
      </button>

    </div>

  </div>
</>

)
}
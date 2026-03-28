import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/adminSidebar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiBriefcase, FiEdit, FiLock, FiUser } from "react-icons/fi";
import axios from "axios";

function Profile() {

  // ✅ SAFE ROLE HANDLING (no logic change, just fix case issue)
  const role = localStorage.getItem("role")?.toLowerCase();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await axios.get(
          "https://dashboard-backend-cyrd.onrender.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API RESPONSE:", res.data);

        if (res.data) {
          setUser(res.data);

          // ✅ OPTIONAL: store role from API (SAFE)
          if (res.data.role) {
            localStorage.setItem("role", res.data.role);
          }
        }

      } catch (err) {
        console.error("Error fetching profile", err.response || err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* ✅ Sidebar condition (UNCHANGED LOGIC) */}
      {role === "admin" ? <AdminSidebar /> : <Sidebar />}

      <div className="flex-1 ml-[220px]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 font-medium bg-transparent p-0 hover:underline"
          >
            &lt; Back
          </button>

          <div className="flex-1"></div>
          <div></div>
        </div>

        <div className="p-10">

          <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto overflow-hidden">

            {/* TOP HEADER */}
            <div className="h-32 bg-gradient-to-r from-[#8FAFD1] to-[#1F2A44]"></div>

            {/* PROFILE */}
            <div className="flex items-center gap-6 px-8 -mt-12">

              <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-gray-200 flex items-center justify-center">
                <FiUser size={40} className="text-gray-500" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {user ? user.name : ""}
                </h2>
                <p className="text-gray-500 text-sm">
                  {user ? user.role : ""} • Design Department
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => navigate("/edit-profile")}
                  className="flex items-center gap-2 px-5 py-2 bg-[#1F2A44] text-white rounded-md text-sm shadow"
                >
                  <FiEdit size={16} />
                  Edit Profile
                </button>

                <button
                  onClick={() => navigate("/change-password")}
                  className="flex items-center gap-2 px-5 py-2 bg-[#2E3A4D] text-white rounded-md text-sm"
                >
                  <FiLock size={16} />
                  Change Password
                </button>

              </div>
            </div>

            <div className="px-8 mt-6">
              <hr />
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-10 px-8 py-6">

              {/* CONTACT */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-4 tracking-wide">
                  CONTACT DETAILS
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <FiMail className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium">
                      {user ? user.email : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <FiPhone className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium">
                      9988776655
                    </p>
                  </div>
                </div>
              </div>

              {/* WORK */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-4 tracking-wide">
                  WORK INFORMATION
                </h3>

                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <FiBriefcase className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Role</p>
                    <p className="text-sm font-medium">
                      {user ? user.role : ""}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
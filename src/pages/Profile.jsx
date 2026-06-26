import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiBriefcase, FiEdit, FiLock, FiUser } from "react-icons/fi";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import api from '../api/apiConfig';

function Profile() {

  const role = sessionStorage.getItem("role")?.toLowerCase();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {

    //  FETCH USER PROFILE
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }
        const res = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //  SET USER DATA
        if (res.data) {
          setUser(res.data);

          //  STORE ROLE
          if (res.data.role) {
            sessionStorage.setItem("role", res.data.role);
          }
        }

      } catch (err) {
        console.error("Error fetching profile", err.response || err.message);
      }
    };

    fetchProfile();

    // GET IMAGE FROM LOCAL STORAGE
    const img = sessionStorage.getItem("profileImage");
    if (img) {
      setProfileImage(img);
    }

  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      {(role === "admin" || role === "super_admin") ? (
        <AdminSidebar />
      ) : (
        <Sidebar />
      )}
      <div className="flex-1 ml-[220px]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">

          {/* <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-600 font-medium bg-transparent p-0 
                       hover:text-gray-600 hover:bg-transparent 
                       focus:outline-none focus:ring-0 
                       active:bg-transparent active:text-gray-600"
          >
            <FaArrowLeft />
            Back
          </button> */}

          <div className="flex-1"></div>
          <div></div>
        </div>

        <div className="p-10">

          <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto overflow-hidden">

            {/* HEADER BG */}
            <div className="h-32 bg-gradient-to-r from-[#8FAFD1] to-[#1F2A44]"></div>

            {/* PROFILE */}
            <div className="flex items-center gap-6 px-8 -mt-12">

              {/*  PROFILE IMAGE */}
              <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FiUser size={40} className="text-gray-500" />
                )}
              </div>

              {/* USER INFO */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {user ? user.name : ""}
                </h2>
                <p className="text-gray-500 text-sm">
                  {user ? user.role : ""} • Design Department
                </p>
              </div>

              {/* ACTION BUTTONS */}
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
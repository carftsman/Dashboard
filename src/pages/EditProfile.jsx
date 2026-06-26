import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiPhone } from "react-icons/fi";
import { FaArrowLeft, FaCamera, FaLaptopCode, FaBullhorn, FaUserTie } from "react-icons/fa";
import { toast } from "react-toastify";
import api from '../api/apiConfig';


function EditProfile() {

  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState("");
  const role = sessionStorage.getItem("role")?.toLowerCase();

  //  Form states
  const [name, setName] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [department, setDepartment] = useState("Engineering");

  //  File input reference (for upload button)
  const fileInputRef = useRef();

  //  Load image from sessionStorage on mount
  useEffect(() => {
    const img = sessionStorage.getItem("profileImage");
    if (img) setProfileImage(img);
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setName(res.data.name || "");
          setCurrentRole(res.data.role || "");
        }

      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  //  SAVE PROFILE FUNCTION
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");


      const res = await api.put(
        "/api/users/profile",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //  Save image locally
      if (profileImage) {
        sessionStorage.setItem("profileImage", profileImage);
      }

      //  Update username in sessionStorage
      sessionStorage.setItem("userName", res.data.name);

      // Success message
      toast.success("Profile updated successfully ");

      // Navigate back
      navigate("/profile");

    } catch (err) {
      console.error(err);

      // Error message
      toast.error("Failed to update profile ");
    }
  };

  //  Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    //  Convert image to base64
    reader.onloadend = () => setProfileImage(reader.result);

    reader.readAsDataURL(file);
  };

  //  Remove profile image
  const handleRemove = () => {
    setProfileImage(null);
    sessionStorage.removeItem("profileImage");
    toast.info("Profile image removed ");
  };

  //  Department icons


  return (
  <div className="flex bg-gray-100 min-h-screen">

    {/* Sidebar */}
    {role === "admin" ? <AdminSidebar /> : <Sidebar />}

    <div className="flex-1 ml-[220px]">

      {/*  HEADER */}
      <div className="fixed top-0 left-[220px] right-0 z-50 bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-600 font-medium bg-transparent p-0 
             hover:text-gray-600 hover:bg-transparent 
             focus:outline-none focus:ring-0 
             active:bg-transparent active:text-gray-600"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/*  MAIN CONTENT */}
      <div className="flex justify-center items-start py-6 mt-16">

        {/*  CARD */}
        <div className="bg-white rounded-xl shadow-md w-[650px] overflow-hidden">

          {/*  HEADER GRADIENT */}
          <div className="h-28 bg-gradient-to-r from-[#8FAFD1] to-[#1F2A44]"></div>

          {/*  PROFILE IMAGE SECTION */}
          <div className="flex items-center gap-6 px-6 -mt-10 border-b pb-6">

            <div className="relative">

              {/*  Profile Image */}
              <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <FiUser size={40} className="text-gray-500" />
                )}
              </div>

              {/*  Camera button */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-[#1f2a44] text-white p-2 rounded-full cursor-pointer flex items-center justify-center"
              >
                <FaCamera size={12} />
              </div>

              {/*  Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/*  Buttons */}
            <div>
              <h2 className="font-semibold text-lg">Profile Photo</h2>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-1 bg-[#1f2a44] text-white rounded-md text-sm"
                >
                  Upload New
                </button>

                <button
                  onClick={handleRemove}
                  className="px-4 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/*  FORM SECTION */}
          <div className="p-6 space-y-5">

            {/* NAME + ROLE */}
            <div className="grid grid-cols-2 gap-4">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 outline-none"
                  />
                </div>
              </div>

              {/* ROLE (READ ONLY) */}
              <div>
                <label className="text-sm text-gray-500">Current Role</label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentRole}
                    readOnly
                    className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/*  FIXED BUTTONS */}
      <div className="fixed bottom-6 right-10 flex gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#1f2a44] text-white rounded-md"
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
);
}

export default EditProfile;
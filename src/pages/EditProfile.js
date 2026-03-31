import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiPhone, FiBriefcase } from "react-icons/fi";

function EditProfile() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase();

  const [name, setName] = useState("Tulasi");
  const [phone, setPhone] = useState("9988776655");

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const img = localStorage.getItem("profileImage");
    if (img) setProfileImage(img);
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "https://dashboard-backend-cyrd.onrender.com/api/users/profile",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ SAVE IMAGE GLOBALLY
      if (profileImage) {
        localStorage.setItem("profileImage", profileImage);
      }

      alert("Profile updated successfully ");
      localStorage.setItem("userName", res.data.user.name);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ");
    }
  };

  // ✅ FILE PICKER
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ REMOVE IMAGE
  const handleRemove = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {role === "admin" ? <AdminSidebar /> : <Sidebar />}

      <div className="flex-1 ml-[220px]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
          <button
            onClick={() => navigate("/profile")}
            style={{ outline: "none" }}
            className="text-gray-600 font-medium bg-transparent p-0 
                       hover:text-gray-600 hover:bg-transparent 
                       focus:outline-none focus:ring-0 
                       active:bg-transparent active:text-gray-600"
          >
            &lt; Back
          </button>
        </div>

        <div className="flex justify-center items-start py-6">

          <div className="bg-white rounded-xl shadow-md w-[650px] overflow-hidden">

            <div className="h-28 bg-gradient-to-r from-[#8FAFD1] to-[#1F2A44]"></div>

            {/* PROFILE IMAGE */}
            <div className="flex items-center gap-6 px-6 -mt-10 border-b pb-6">

              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <FiUser size={40} className="text-gray-500" />
                  )}
                </div>

                {/* CAMERA */}
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-[#1f2a44] text-white p-1 rounded-full cursor-pointer"
                >
                  📷
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

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
                    className="px-4 py-1 bg-gray-200 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* FORM (UNCHANGED) */}
            <div className="p-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">

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

                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <div className="relative mt-1">
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 outline-none"
                    />
                  </div>
                </div>

              </div>

              <div>
                <label className="text-sm text-gray-500">Department</label>
                <div className="relative mt-1">
                  <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
                  <select className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 outline-none">
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>HR</option>
                  </select>
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className="fixed bottom-6 right-10 flex gap-4">
          <button onClick={() => navigate("/profile")} className="px-6 py-2 bg-gray-200 rounded-md">
            Cancel
          </button>

          <button onClick={handleSave} className="px-6 py-2 bg-[#1f2a44] text-white rounded-md">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProfile;
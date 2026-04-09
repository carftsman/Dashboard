import React, { useEffect, useState } from "react";
import { FiSearch, FiUser, FiMail, FiEdit, FiUserPlus, FiLock, FiEye, FiEyeOff, FiChevronDown, FiSlash, FiTrash2, FiXCircle, FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

import api from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
 
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [toasts, setToasts] = useState([]);

  const showAlert = (type, message) => {
    const id = Date.now();
    const newToast = { id, type, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data.users || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Profile error:", error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusToggle = async (user) => {
    try {
      const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.patch(`/api/users/${user.id}/status`, { status: newStatus });
      fetchUsers();
      showAlert("success", `User status changed to ${newStatus}`);
    } catch (err) {
      showAlert("error", "Failed to update status");
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "", password: "" });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowModal(true);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Name should contain only letters";
    }
    if (!/^[a-zA-Z0-9._%+-]+@dhatvibs\.com$/.test(form.email)) {
      newErrors.email = "Enter valid emails";
    }
    if (!editingUser) {
      if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,12}$/.test(form.password)) {
        newErrors.password = "Enter Valid Password";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = editingUser
        ? { name: form.name, email: form.email, role: form.role, parentId: null }
        : { ...form, parentId: null };

      if (editingUser) {
        await api.put(`/api/users/${editingUser.id}`, payload);
        fetchUsers();
        showAlert("success", "User updated successfully");
      } else {
        const res = await api.post("/api/users", payload);
        setUsers((prev) => [...prev, res.data.user]);
        showAlert("success", "User created successfully");
      }
      setShowModal(false);
      setForm({ name: "", email: "", role: "", password: "" });
    } catch (err) {
      showAlert("error", "Something went wrong. Please try again.");
    }
  };

  

  const ROLE_STYLES = {
    ADMIN: "bg-red-100 text-red-600",
    SUBUSER: "bg-blue-100 text-blue-600",
    MANAGER: "bg-indigo-100 text-indigo-600",
    ANALYST: "bg-purple-100 text-purple-600",
  };

  const roleStyle = (role) => ROLE_STYLES[role] || "bg-gray-100 text-gray-600";

  const filteredUsers = users
    .filter((user) => {
      const search = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (a.status === "ACTIVE" && b.status === "INACTIVE") return -1;
      if (a.status === "INACTIVE" && b.status === "ACTIVE") return 1;
      return 0;
    });

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-[220px] flex-1 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <div className="bg-white px-6 py-2 flex justify-end items-center gap-6 border-b">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#18154F] text-white px-3 py-2 rounded-lg hover:bg-[#18154F]"
          >
            <FiUserPlus />
            Add New User
          </button>
          <div
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center cursor-pointer"
          >
            {profile?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        {/* Title */}
        <div className="px-6 py-5 flex justify-between">
          <h1 className="text-2xl font-semibold text-[#18154F]">List Of Users</h1>
          <div className="relative w-80">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 rounded-full border"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6">
          <table className="w-full bg-white rounded-lg border-collapse">
            <thead>
              <tr className="bg-[#18154F] text-gray-500">
                <th className="p-3 text-center">SNO</th>
                <th className="p-3 text-left">NAME</th>
                <th className="p-3 text-center">ROLE</th>
                <th className="p-3 text-center">STATUS</th>
                <th className="p-3 text-center">EDIT</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-200 ${user.status === "INACTIVE" ? "bg-gray-100 opacity-60" : ""}`}
                >
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "INACTIVE" ? "bg-gray-200 text-gray-400" : roleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleStatusToggle(user)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 border ${
                        user.status === "ACTIVE"
                          ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                          : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center">
                      <FiEdit
                        onClick={() => user.status !== "INACTIVE" && openEdit(user)}
                        className={`text-lg ${user.status === "INACTIVE" ? "text-gray-300 cursor-not-allowed" : "text-blue-500 cursor-pointer"}`}
                      />
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toasts */}
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <div key={toast.id} className="flex items-start gap-3 px-4 py-3 rounded-xl min-w-[320px] shadow-md border border-gray-100 bg-white relative overflow-hidden">
              <div className={`absolute left-0 top-0 h-full w-1 ${toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"}`} />
              <div className="mt-0.5">
                {toast.type === "success" && <FiCheckCircle className="text-green-500" size={20} />}
                {toast.type === "error" && <FiAlertCircle className="text-red-500" size={20} />}
                {toast.type === "info" && <FiInfo className="text-blue-500" size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{toast.type.toUpperCase()}</p>
                <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
              </div>
              <FiX size={16} className="text-gray-400 hover:text-gray-700 cursor-pointer mt-1" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center" onClick={() => setShowModal(false)}>
            <div className="bg-white w-full max-w-xl p-8 rounded-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-200 pb-3 mb-5">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#18154F]">
                  <FiUserPlus /> {editingUser ? "Edit User" : "Add New User"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500">FULL NAME</label>
                  <div className="relative mt-2">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter name" className="w-full pl-10 py-3 border rounded-xl bg-gray-50" />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">EMAIL ADDRESS</label>
                  <div className="relative mt-2">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Enter Email" readOnly={!!editingUser} className={`w-full pl-10 py-3 border rounded-xl ${editingUser ? "bg-gray-200 cursor-not-allowed" : "bg-gray-50"}`} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">ROLE</label>
                  <div className="relative mt-2">
                    <select name="role" value={form.role} onChange={handleChange} className="w-full py-3 pl-4 pr-10 border rounded-xl bg-gray-50 appearance-none">
                      <option value="" disabled>Select Role</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUBUSER">SUBUSER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="ANALYST">ANALYST</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                {!editingUser && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">PASSWORD</label>
                    <div className="relative mt-2">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Enter Password" title="Enter Valid Password" className="w-full pl-10 pr-10 py-3 border rounded-xl bg-gray-50" />
                      <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500">
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-4">
                <button onClick={handleSubmit} className="flex items-center justify-center gap-2 w-full bg-[#18154F] text-white py-3 rounded-2xl hover:bg-[#23206b] active:scale-95 transition-all duration-200">
                  {editingUser ? <><FiEdit /> Update User</> : <><FiUserPlus /> Create New User</>}
                </button>
                <button onClick={() => setShowModal(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <FiXCircle /> Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}

       
        
      </div>
    </div>
  );
};

export default ManageUsers;
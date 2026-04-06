import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiEdit,
  FiUserPlus,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import api from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import {FiChevronDown,FiSlash,FiTrash2,FiXCircle,FiCheckCircle,FiAlertCircle,FiInfo,FiX,} from "react-icons/fi";
 
const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
 
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
 
  //  Fetch Users
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
 
  //  Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  //  Open Create
  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "", password: "" });
    setShowModal(true);
  };
 
  //  Open Edit
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
 
    // Name validation (only characters)
    if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Name should contain only letters";
    }
 
    // Email validation (@dhatvibs.com only)
    if (!/^[a-zA-Z0-9._%+-]+@dhatvibs\.com$/.test(form.email)) {
      newErrors.email = "Only @dhatvibs.com emails allowed";
    }
 
    // Password validation (only for create)
    if (!editingUser) {
      if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,12}$/.test(form.password)) {
        newErrors.password = "Enter Valid Password";
      }
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //  Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = editingUser
        ? {
            name: form.name,
            email: form.email,
            role: form.role,
            parentId: null,
          }
        : {
            ...form,
            parentId: null,
          };
 
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
 
  //  Delete
  const handleDelete = async () => {
    try {
      await api.delete(`/api/users/${deleteUserId}`);
      fetchUsers();
      setDeleteUserId(null);
      showAlert("success", "User marked as inactive");
    } catch (err) {
      console.error(err);
    }
  };
 
  //  Role Style
  const ROLE_STYLES = {
    SUBUSER: "bg-blue-100 text-blue-600",
    MANAGER: "bg-indigo-100 text-indigo-600",
    ANALYST: "bg-purple-100 text-purple-600",
  };
 
  const roleStyle = (role) => ROLE_STYLES[role] || "bg-gray-100 text-gray-600";
 
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
 
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />
      <div className="ml-[220px] flex-1 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <div className="bg-white px-6 py-2 flex justify-end items-center gap-6 border-b">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#18154F] text-white px-3 py-2 rounded-lg  hover:bg-[#18154F] active:bg-[#18154F] focus:bg-[#18154F]"
          >
            <FiUserPlus />
            Add New User
          </button>
          <div
            onClick={() => navigate("/profile")}
            className="w-[35px] h-[35px] bg-[#eee] rounded-full flex items-center justify-center cursor-pointer"
          >
            <FiUser />
          </div>
        </div>
 
        {/* Title */}
        <div className="px-6 py-5 flex justify-between">
          <h1 className="text-2xl font-semibold text-[#18154F]">
            List Of Users
          </h1>
 
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
              <tr className="bg-[#18154F] text-black py-3 rounded-2xl text-gray-500">
                <th className="p-3 text-center">SNO</th>
                <th className="p-3 text-center">NAME</th>
                <th className="p-3 text-center">ROLE</th>
 
                <th className="p-3 text-center">EDIT</th>
                <th className="p-3 text-center">DELETE</th>
              </tr>
            </thead>
 
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr
  key={user.id}
  className={`border-b border-gray-200 ${
    user.status === "INACTIVE" ? "bg-gray-100 opacity-60" : ""
  }`}
>
                  <td className="p-3 text-center">{i + 1}</td>
 
                  <td className="p-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
 
                  <td className="p-3 text-center">
                    <span
  className={`px-3 py-1 rounded-full ${
    user.status === "INACTIVE"
      ? "bg-gray-200 text-gray-400"
      : roleStyle(user.role)
  }`}
>
  {user.role}
</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center">
                     <FiEdit
  onClick={() =>
    user.role !== "ADMIN" &&
    user.status !== "INACTIVE" &&
    openEdit(user)
  }
  className={`text-lg ${
    user.role === "ADMIN" || user.status === "INACTIVE"
      ? "text-gray-300 cursor-not-allowed"
      : "text-blue-500 cursor-pointer"
  }`}
/>
                    </div>
                  </td>
 
                  {/* Delete */}
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center">
                      <MdDeleteOutline
  onClick={() =>
    user.status !== "INACTIVE" && setDeleteUserId(user.id)
  }
  className={`text-lg ${
    user.status === "INACTIVE"
      ? "text-gray-300 cursor-not-allowed"
      : "text-red-500 cursor-pointer"
  }`}
/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
  {toasts.map((toast) => (
    <div
      key={toast.id}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl min-w-[320px]
      shadow-md border border-gray-100 bg-white
      transition-all duration-300 ease-in-out hover:shadow-lg
      relative overflow-hidden`}
    >
      {/* LEFT COLOR BAR */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          toast.type === "success"
            ? "bg-green-500"
            : toast.type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      />
 
      {/* ICON */}
      <div className="mt-0.5">
        {toast.type === "success" && (
          <FiCheckCircle className="text-green-500" size={20} />
        )}
        {toast.type === "error" && (
          <FiAlertCircle className="text-red-500" size={20} />
        )}
        {toast.type === "info" && (
          <FiInfo className="text-blue-500" size={20} />
        )}
      </div>
 
      {/* TEXT */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">
          {toast.type === "success" && "Success"}
          {toast.type === "error" && "Error"}
          {toast.type === "info" && "Info"}
        </p>
 
        <p className="text-sm text-gray-600 mt-0.5">
          {toast.message}
        </p>
      </div>
 
      {/* CLOSE */}
      <FiX
        size={16}
        className="text-gray-400 hover:text-gray-700 cursor-pointer mt-1"
        onClick={() =>
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }
      />
    </div>
  ))}
</div>
 
{toasts.length > 0 && (
  <div className="fixed inset-0 z-40 backdrop-blur-[2px] bg-black/10"></div>
)}
 
        {/* Add/Edit Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white w-full max-w-xl p-8 rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-gray-200 pb-3 mb-5">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#18154F]">
                  <FiUserPlus />
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    FULL NAME
                  </label>
                  <div className="relative mt-2">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="w-full pl-10 py-3 border rounded-xl bg-gray-50"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
 
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    EMAIL ADDRESS
                  </label>
 
                  <div className="relative mt-2">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                      readOnly={!!editingUser}
                      className={`w-full pl-10 py-3 border rounded-xl
        ${editingUser ? "bg-gray-200 cursor-not-allowed" : "bg-gray-50"}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
 
                {/* Role */}
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    ROLE
                  </label>
 
                  <div className="relative mt-2">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full py-3 pl-4 pr-10 border rounded-xl bg-gray-50 appearance-none"
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="SUBUSER">SUBUSER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="ANALYST">ANALYST</option>
                    </select>
 
                    {/* Custom Dropdown Icon */}
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
 
                {/* Password  */}
                {!editingUser && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">
                      PASSWORD
                    </label>
 
                    <div className="relative mt-2">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className="w-full pl-10 pr-10 py-3 border rounded-xl bg-gray-50"
                      />
 
                      {/* Eye Icon */}
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}
              </div>
 
              <div className="mt-6 space-y-4">
                {/* Primary Button */}
                <button
                  onClick={handleSubmit}
                  className="
    flex items-center justify-center gap-2
    w-full bg-[#18154F] text-white
    py-3 rounded-2xl
    hover:bg-[#23206b]
    active:scale-95
    transition-all duration-200
  "
                >
                  {editingUser ? (
                    <>
                      <FiEdit className="text-[18px]" />
                      Update User
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="text-[18px]" />
                      Create New User
                    </>
                  )}
                </button>
 
                {/* Secondary Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="
    flex items-center justify-center gap-2
    w-full py-3 rounded-2xl
    border border-gray-300
    bg-gray-100 text-gray-600
    hover:bg-gray-200
    transition-all duration-200
  "
                >
                  <FiXCircle className="text-[18px]" />
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
 
        {/* Delete Modal */}
        {deleteUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl w-[400px]">
              <h2 className="text-lg  text-center font-semibold text-[#18154F] mb-2">
                Confirm Delete
              </h2>
 
              <p className="text-gray-600 mb-5 text-center">
                Are you sure you want to delete this user?
              </p>
 
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setDeleteUserId(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-[#18154F] text-white   hover:bg-[#18154F]/90 transition-all duration-200"
                >
                  <FiSlash className="text-[16px]" />
                  Cancel
                </button>
 
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                >
                  <FiTrash2 className="text-[16px]" />
                  Delete
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
 
 
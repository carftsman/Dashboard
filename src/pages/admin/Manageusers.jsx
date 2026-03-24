import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiEdit,
} from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import api from "../../api/apiConfig";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "MANAGER",
  });

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data); // if array
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Open Create
  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "MANAGER" });
    setShowModal(true);
  };

  // 🔹 Open Edit
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  // 🔹 Create / Update
  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.put(`/api/users/${editingUser.id}`, form);
      } else {
        await api.post("/api/users", form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Role Badge
  const roleStyle = (role) => {
    if (role === "ADMIN") return "bg-blue-100 text-blue-600";
    if (role === "MANAGER") return "bg-indigo-100 text-indigo-600";
    return "bg-purple-100 text-purple-600";
  };

  // 🔹 Status Badge
  const statusStyle = (status) => {
    if (status === "ACTIVE") return "text-green-600";
    return "text-gray-400";
  };

  return (
    <div className="bg-[#F5F6FA] min-h-screen">

      {/* 🔹 Header */}
      <div className="bg-white pl-6 pr-10 py-3 flex justify-end items-center">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#18154F] text-white px-4 py-2 rounded-lg"
        >
          <FiUserPlus />
          Add New User
        </button>
      </div>

      {/* 🔹 Title + Search */}
      <div className="px-6 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#18154F]">
          List Of Users
        </h1>

        <div className="relative w-80">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search"
            className="w-full pl-10 py-2 rounded-full border"
          />
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="px-6">
       <table className="w-full bg-white rounded-lg overflow-hidden">
  
  {/* 🔹 Header */}
  <thead className="bg-[#18154F] text-white">
    <tr >
      <th className="p-3 text-left">SNO</th>
      <th className="p-3 text-left">Name</th>
      <th className="p-3 text-left">Role</th>
      <th className="p-3 text-left">Status</th>
      <th className="p-3 text-center">EDIT</th>
      <th className="p-3 text-center">DELETE</th>
      
    </tr>
  </thead>

  {/*  Body */}
  <tbody>
    {users.map((user, i) => (
      <tr key={user.id} className="border-b">

        {/* SNO */}
        <td className="p-3">{i + 1}</td>

        {/* Name + Email */}
        <td className="p-3">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </td>

        {/* Role */}
        <td className="p-3">
          <span className={`px-3 py-1 rounded-full text-sm ${roleStyle(user.role)}`}>
            {user.role}
          </span>
        </td>

        {/* Status */}
        <td className="p-3">
          <span className={`flex items-center gap-2 ${statusStyle(user.status)}`}>
            ● {user.status}
          </span>
        </td>

        {/* Actions (Edit + Delete together) */}
        <td className="p-3">
          <div className="flex items-center justify-center gap-3">
            <FiEdit
              className="cursor-pointer text-blue-500"
              onClick={() => openEdit(user)}
            />
            <MdDeleteOutline
              className="cursor-pointer text-red-500"
              onClick={() => handleDelete(user.id)}
            />
          </div>
        </td>

      </tr>
    ))}
  </tbody>
</table>
      </div>

      {/* 🔹 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white w-full max-w-xl p-6 rounded-2xl">

            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#18154F] mb-4">
              <FiUserPlus />
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label>FULL NAME</label>
                <div className="relative">
                  <FiUser className="absolute top-3 left-2 text-gray-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-8 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label>EMAIL</label>
                <div className="relative">
                  <FiMail className="absolute top-3 left-2 text-gray-400" />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-8 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label>ROLE</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full py-2 border rounded-lg"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="DATA_ANALYST">Data Analyst</option>
                </select>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#18154F] text-white py-2 rounded-lg"
              >
                {editingUser ? "Update User" : "Create New User"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl border bg-gray-50 text-gray-600"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
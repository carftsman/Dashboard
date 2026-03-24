import React, { useEffect, useState } from "react";
import "../../css/ManageUsers.css";
import api from "../../api/apiConfig";
import { FiEdit, FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FiUser, FiMail } from "react-icons/fi";
const ManageUsers = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
 
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  // FETCH USERS API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
 
      //  If no token → stop API call
      if (!token) {
        alert("Please login first");
        return;
      }
 
      setLoading(true);
 
      console.log("API CALL STARTED");
 
      const res = await api.get("/api/manage-users/logged-in-users");
 
      console.log("API RESPONSE", res);
 
      if (res.data.success) {
        setUsers(res.data.data);
      }
 
    } catch (error) {
      console.error("Error fetching users:", error);
 
      //  Handle unauthorized
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
 
        // redirect to login page (optional)
        window.location.href = "/login";
      }
 
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="manage-users-container">
 
      {/* ===== HEADER ===== */}
      <div className="header-bar">
        <div></div>
 
        <div className="header-right">
          <button
            className="add-user-btn"
            onClick={() => setShowModal(true)}
          >
            + Add New User
          </button>
 
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="profile-img"
          />
        </div>
      </div>
 
      {/* TITLE + SEARCH */}
      <div className="page-header-row">
        <h2 className="page-title">Users</h2>
 
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
      </div>
 
      {/*  TABLE */}
      <div className="users-card">
 
        {/* HEADER */}
        <div className="table-header">
          <span>SNO</span>
          <span>NAME</span>
          <span>ROLE</span>
          <span>STATUS</span>
          <span>Edit</span>
          <span>Delete</span>
        </div>
 
        {/* BODY */}
        {loading ? (
          <p style={{ padding: "20px" }}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={{ padding: "20px" }}>No users found</p>
        ) : (
          users.map((user) => (
            <div className="table-row" key={user.id}>
 
              {/* SNO */}
              <span className="sno">
                {user.sNo.toString().padStart(2, "0")}
              </span>
 
              {/* USER */}
              <div className="user-info">
                <img
                  src={`https://i.pravatar.cc/40?u=${user.id}`}
                  alt="user"
                />
                <div>
                  <p className="user-name">{user.name}</p>
                  <span className="user-email">
                    User ID: {user.id}
                  </span>
                </div>
              </div>
 
              {/* ROLE */}
              <span className={`role ${
                user.role === "ADMIN"
                  ? "admin"
                  : user.role === "MANAGER"
                  ? "manager"
                  : "analyst"
              }`}>
                {user.role}
              </span>
 
              {/* STATUS */}
              <span className={`status ${
                user.status === "ACTIVE" ? "active" : "inactive"
              }`}>
                ● {user.status}
              </span>
 
              {/* EDIT */}
              <span className="action-icon">
                <FiEdit className="edit-icon" />
              </span>
 
              {/* DELETE */}
              <span className="action-icon">
                <MdDeleteOutline className="delete-icon" />
              </span>
 
            </div>
          ))
        )}
 
      </div>
 
      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
 
            <h3 className="modal-title">👤 Add New User</h3>
 
            <div className="modal-form">
 
              <div className="form-group">
                <label>FULL NAME</label>
                 <div className="input-wrapper">
    <FiUser className="input-icon" />
                <input placeholder="Enter Name" />
              </div>
</div>
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                 <div className="input-wrapper">
    <FiMail className="input-icon" />
                <input placeholder="Enter Email" />
              </div>
</div>
              <div className="form-group">
                <label>ROLE</label>
                <select>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Data Analyst</option>
                </select>
              </div>
 
            </div>
 
            <button className="create-btn">
              Create User Account
            </button>
 
            <button
              className="discard-btn"
              onClick={() => setShowModal(false)}
            >
              Discard Changes
            </button>
 
          </div>
        </div>
      )}
 
    </div>
  );
};
 
export default ManageUsers;
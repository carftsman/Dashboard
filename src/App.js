import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import DashboardSelection from "./pages/DashboardSelection";
import MainDashboard from "./pages/MainDashboard";
import UploadData from "./pages/UploadData";
import ColumnMapping from "./pages/ColumnMapping";
import DataValidation from "./pages/DataValidation";
import VisualEditing from "./pages/VisualEditing";
// import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard-selection" element={<DashboardSelection />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/upload-data" element={<UploadData />} />
        <Route path="/column-mapping" element={<ColumnMapping />} />
        <Route path="/data-validation" element={<DataValidation />} />
        <Route path="/visual-editing" element={<VisualEditing />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile/>}/>
        <Route path="/change-password"  element={< ChangePassword/>}/>


        
      </Routes>
<ToastContainer position="top-right" autoClose={2000}></ToastContainer>

    </Router>
    
  );
}

export default App;
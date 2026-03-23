import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import LoginOtp from "./pages/LoginOtp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/loginOtp" element={<LoginOtp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
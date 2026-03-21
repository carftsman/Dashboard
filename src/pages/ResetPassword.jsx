import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/images/ZestBotHeader.png";
import { useNavigate } from "react-router-dom";

// ✅ FIXED PATH;
import "../css/ResetPassword.css";
// import ResetPassword from './ResetPassword';

export default function ResetPassword() {
  const navigate= useNavigate();
  return (
    <div className="Reset-page">
      <div className="right-panel full-center">
        <motion.div
          className="Reset-card"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={logo} className="logo" alt="logo" />

          <h2>Reset Password</h2>

          <p className="subtext">
            No worries! Enter your email and we'll send reset instructions.
          </p>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@dhatvibs.com" />
          </div>
<button
            className="Reset-btn"
            onClick={() => navigate("/loginOtp")}
          >
            Send Reset Link →
          </button>

          <div className="back-link">
            <Link to="/">← Back to login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/images/Background.png.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa"
import "../css/ResetPassword.css";
export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

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
            <input
              type="email"
              placeholder="name@dhatvibs.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="SendOtp"
            disabled={loading}
            onClick={async () => {
              if (!email.trim()) {
                alert("Enter email");
                return;
              }

              try {
                setLoading(true);

                const response = await fetch(
                  "https://dashboard-backend-cyrd.onrender.com/api/auth/forgot-password",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                  }
                );

                const data = await response.json();
                console.log("Data:", response.data)
                if (response.ok) {
                  console.log("OTP Sent:", data);
                  navigate("/loginOtp", { state: { email } });
                } else {
                  alert(data.message || "Failed to send OTP");
                }
              } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Sending..." : "Send Otp "}
          </button>

          <div className="back-link">
            <Link to="/">
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
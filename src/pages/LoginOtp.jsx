import React, { useState, useRef, useEffect } from "react";
import "../css/loginOtp.css";
import logo from "../assets/images/Background.png.png"; // your image
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
    const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30); // ✅ timer state
  const inputs = useRef([]);

  // ✅ OTP input logic
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // ✅ TIMER LOGIC
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ RESEND FUNCTION
  const handleResend = () => {
    setTimeLeft(30);
    // 👉 here you can call API for resend OTP
  };

  return (
    <div className="container">
      <div className="card">

        {/* ✅ LOGO */}
        <div className="background">
          <img src={logo} alt="logo" />
        </div>

        <h2>Verify OTP</h2>
        <p className="subtitle">
          Enter the OTP sent to your registered email
        </p>

        {/* OTP INPUT */}
        <div className="otp-wrapper">
          {otp.map((digit, index) => (
            <div key={index} className="otp-circle">
              <input
                type="password"
                maxLength="1"
                value={digit}
                ref={(el) => (inputs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>

        {/* ✅ RESEND TIMER */}
        <p className="resend">
          {timeLeft > 0 ? (
            <span style={{ color: "#888" }}>
              Resend OTP (00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft})
            </span>
          ) : (
            <span
              onClick={handleResend}
              style={{ color: "#4a6cf7", cursor: "pointer" }}
            >
              Resend OTP
            </span>
          )}
        </p>

        {/* PASSWORD */}
        <div className="input-group">
          <label>New Password</label>
          <div className="input-box">
            <input type="password" placeholder="••••••••" />
            <span className="eye">👁</span>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <div className="input-box">
            <input type="password" placeholder="••••••••" />
            <span className="eye">👁</span>
          </div>
        </div>

        <button className="submit-btn">
          Verify & Reset Password →
        </button>

        <p className="back" onClick={() => navigate("/")}>
  ← Back to Login
</p>
      </div>
    </div>
  );
};

export default OtpVerify;
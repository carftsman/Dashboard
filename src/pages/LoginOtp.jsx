import React, { useState, useRef, useEffect } from "react";
import "../css/loginOtp.css";
import logo from "../assets/images/Background.png.png";
import { useNavigate, useLocation } from "react-router-dom";

const LoginOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [otpStatus, setOtpStatus] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/reset-password");
    }
  }, [email, navigate]);

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

  //  Timer
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  //  Resend
  const handleResend = () => {
    setTimeLeft(30);
    setOtp(["", "", "", "", "", ""]);
    setOtpStatus(null);
    inputs.current[0]?.focus();

    
  };

  //  Verify OTP locally 
  const handleVerify = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length === 6) {
      setOtpStatus("valid");
    } else {
      setOtpStatus("invalid");
    }
  };

  //  Auto verify when filled
  // useEffect(() => {
  //   if (otp.every((digit) => digit !== "")) {
  //     handleVerify();
  //   }
  // }, [otp]);

  // FINAL API CALL
  const handleResetPassword = async () => {
    const enteredOtp = otp.join("");

    console.log("EMAIL:", email);
    console.log("OTP:", enteredOtp);
    console.log("PASSWORD:", password);

    if (enteredOtp.length !== 6) {
      setOtpStatus("invalid");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://dashboard-backend-cyrd.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  email: email,
  otp: enteredOtp,
  newPassword: password,
  confirmPassword: confirmPassword,
})
        }
      );

      const data = await response.json();

      console.log("STATUS:", response.status);
    console.log("Data:", data)

      if (response.ok) {
        alert("Password reset successful ✅");
        navigate("/");
      } else {
        alert(data.message || "Reset failed ❌");
        setOtpStatus("invalid");
      }
    } catch (error) {
      console.error("ERROR:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="container-otp">
      <div className="card-otp">

        {/* LOGO */}
        <div className="background-otp">
          <img src={logo} alt="logo" />
        </div>

        <h2>Verify OTP</h2>
        <p className="subtitle-otp">
          Enter the OTP sent to your registered email
        </p>

        {/* OTP INPUT */}
        <div className="otp-wrapper">
          {otp.map((digit, index) => (
            <div key={index} className={`otp-circle ${otpStatus}`}>
              <input
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>

        {/* STATUS */}
        {otpStatus === "valid" && (
          <p className="otp-success">✔ OTP Verified</p>
        )}

        {otpStatus === "invalid" && (
          <p className="otp-error">✖ Invalid OTP</p>
        )}

        {/* TIMER */}
        <p className="resend-otp">
          {timeLeft > 0 ? (
            <span style={{ color: "#888" }}>
              Resend OTP (00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft})
            </span>
          ) : (
            <span onClick={handleResend}>
              Resend OTP
            </span>
          )}
        </p>

        {/* PASSWORD */}
        <div className="input-group">
          <label>New Password</label>
          <div className="input-box">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <span className="eye">👁</span> */}
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <div className="input-box">
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* <span className="eye">👁</span> */}
          </div>
        </div>

        {/* BUTTON */}
        <button className="submit-btn" onClick={handleResetPassword}>
          Verify & Reset Password →
        </button>

        {/* BACK */}
        <p className="back" onClick={() => navigate("/reset-password")}>
          ← Back to Reset Password
        </p>
      </div>
    </div>
  );
};

export default LoginOtp;
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/images/Background.png.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpStatus, setOtpStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate("/reset-password");
  }, [email, navigate]);

  // OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Timer
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(30);
    setOtpStatus(null);
    inputs.current[0]?.focus();
  };

  // Submit
  const handleResetPassword = async () => {
    const enteredOtp = otp.join("");

    if (otp.includes("")) {
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: enteredOtp,
            newPassword: password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successful");
        navigate("/");
      } else {
        alert(data.message || "Reset failed");
        setOtpStatus("invalid");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-100 px-3 py-6 overflow-y-auto">
      
      <div className="w-full max-w-sm bg-white p-5 rounded-2xl shadow-lg text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-14 h-14 object-contain" />
        </div>

        <h2 className="text-lg font-semibold">Verify OTP</h2>

        <p className="text-xs text-gray-500 mb-5">
          Enter the OTP sent to your registered email
        </p>

        {/* OTP */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength="1"
                value={digit}
                ref={(el) => (inputs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border text-center text-sm font-semibold outline-none
                ${
                  otpStatus === "invalid"
                    ? "border-red-500 text-red-500"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ERROR */}
        {otpStatus === "invalid" && (
          <p className="text-red-500 text-xs mb-2">Invalid OTP</p>
        )}

        {/* TIMER */}
        <p className="text-xs mb-5">
          {timeLeft > 0 ? (
            <span className="text-gray-400">
              Resend OTP (00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft})
            </span>
          ) : (
            <span onClick={handleResend} className="text-blue-600 cursor-pointer">
              Resend OTP
            </span>
          )}
        </p>

        {/* PASSWORD */}
        <div className="text-left mb-4 relative">
          <label className="text-xs text-gray-500">New Password</label>

          <input
            type="text" // no browser eye
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New Password"
            autoComplete="off"
            style={{
              WebkitTextSecurity: showPassword ? "none" : "disc",
            }}
            className="w-full border rounded-md px-3 py-2 text-sm mt-1 pr-10 outline-none"
          />

          <span
            className={`absolute right-3 top-9 ${
              password
                ? "cursor-pointer text-gray-600"
                : "cursor-not-allowed text-gray-300"
            }`}
            onClick={() => {
              if (!password) return;
              setShowPassword(true);
              setTimeout(() => setShowPassword(false), 3000);
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="text-left mb-4 relative">
          <label className="text-xs text-gray-500">Confirm Password</label>

          <input
            type="text" // no browser eye
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            autoComplete="off"
            style={{
              WebkitTextSecurity: showConfirmPassword ? "none" : "disc",
            }}
            className="w-full border rounded-md px-3 py-2 text-sm mt-1 pr-10 outline-none"
          />

          <span
            className={`absolute right-3 top-9 ${
              confirmPassword
                ? "cursor-pointer text-gray-600"
                : "cursor-not-allowed text-gray-300"
            }`}
            onClick={() => {
              if (!confirmPassword) return;
              setShowConfirmPassword(true);
              setTimeout(() => setShowConfirmPassword(false), 3000);
            }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleResetPassword}
          className="w-full bg-[#192A51] text-white py-3 rounded-full flex items-center justify-center gap-2"
        >
          Verify & Reset Password
          <FaArrowRight />
        </button>

        {/* BACK */}
        <p
          onClick={() => navigate("/reset-password")}
          className="mt-4 text-sm text-gray-700 cursor-pointer flex justify-center items-center gap-2"
        >
          <FaArrowLeft />
          Back to Reset Password
        </p>

      </div>
    </div>
  );
};

export default LoginOtp;
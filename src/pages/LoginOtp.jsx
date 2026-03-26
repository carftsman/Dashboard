import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/images/Background.png.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [otpStatus, setOtpStatus] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/reset-password");
    }
  }, [email, navigate]);

  // OTP INPUT
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

  // TIMER
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(30);
    setOtp(["", "", "", "", "", ""]);
    setOtpStatus(null);
    inputs.current[0]?.focus();
  };

  // API CALL
  const handleResetPassword = async () => {
    const enteredOtp = otp.join("");

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
        alert("Password reset successful ");
        navigate("/");
      } else {
        alert(data.message || "Reset failed ");
        setOtpStatus("invalid");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[360px] bg-white p-8 rounded-2xl shadow-lg text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-lg font-semibold">Verify OTP</h2>
        <p className="text-xs text-gray-500 mb-5">
          Enter the OTP sent to your registered email
        </p>

        {/* OTP PURE CIRCLES */}
        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all
              ${
                otpStatus === "valid"
                  ? "bg-green-500 border-green-500"
                  : otpStatus === "invalid"
                  ? "bg-red-500 border-red-500"
                  : "bg-white border-gray-300"
              } focus-within:ring-2 focus-within:ring-blue-400`}
            >
              <input
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-6 h-6 text-center bg-transparent outline-none border-none text-lg font-semibold text-black caret-transparent"
              />
            </div>
          ))}
        </div>

        {/* STATUS */}
        {otpStatus === "valid" && (
          <p className="text-green-600 text-xs mb-2">✔ OTP Verified</p>
        )}
        {otpStatus === "invalid" && (
          <p className="text-red-600 text-xs mb-2">✖ Invalid OTP</p>
        )}

        {/* TIMER */}
        <p className="text-xs mb-5">
          {timeLeft > 0 ? (
            <span className="text-gray-400">
              Resend OTP (00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft})
            </span>
          ) : (
            <span
              onClick={handleResend}
              className="text-blue-600 cursor-pointer"
            >
              Resend OTP
            </span>
          )}
        </p>

        {/* PASSWORD */}
        <div className="text-left mb-4 relative">
          <label className="text-xs text-gray-500">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm mt-1 outline-none pr-10"
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="text-left mb-4 relative">
          <label className="text-xs text-gray-500">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm mt-1 outline-none pr-10"
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* BUTTON */}
        
          <button
  onClick={handleResetPassword}
  className="w-full bg-[#192A51] text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-[#0f1e3d] transition"
>
  Verify & Reset Password
  <FaArrowRight />
</button>

        {/* BACK */}
        <p
          onClick={() => navigate("/reset-password")}
          className="mt-4 text-sm text-gray-700 cursor-pointer flex items-center justify-center gap-2"
        >
          <FaArrowLeft />
          Back to Reset Password
        </p>
      </div>
    </div>
  );
};

export default LoginOtp;
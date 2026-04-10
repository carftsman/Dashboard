import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "swiper/css";
import "swiper/css/effect-fade";

import img1 from "../assets/images/Login-1.png";
import img2 from "../assets/images/Login-2.png";
import img3 from "../assets/images/Login-3.png";
import img4 from "../assets/images/Login-4.png";
import img5 from "../assets/images/Login-5.png";
import img6 from "../assets/images/Login-6.png";
import logo from "../assets/images/Background.png.png";

const sliderImages = [img1, img2, img3, img4, img5, img6];

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")?.toUpperCase();

    if (token) {
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard-selection", { replace: true });
      }
    }
  }, [navigate]);

  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(dhatvibs\.com|gmail\.com)$/;
    if (!regex.test(value)) {
      setEmailError("Invalid email!");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (value) => {
    if (value.length < 12 || value.length > 16) {
      setPasswordError("Password must be 12 to 16 characters");
      return false;
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError("Include at least one uppercase letter");
      return false;
    } else if (!/[a-z]/.test(value)) {
      setPasswordError("Include at least one lowercase letter");
      return false;
    } else if (!/[0-9]/.test(value)) {
      setPasswordError("Include at least one number");
      return false;
    } else if (!/[!@#$%^&*]/.test(value)) {
      setPasswordError("Include at least one special character");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      setPassword(value);
      validatePassword(value);
    }
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    try {
      const response = await fetch(
        "https://dashboard-backend-cyrd.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);

        const role = result.role?.toUpperCase();

        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/dashboard-selection", { replace: true });
        }
      } else {
        setPasswordError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setPasswordError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex h-screen w-full font-sans max-[900px]:flex-col max-[600px]:h-auto">
      {/* LEFT PANEL */}
      <div className="flex-1 relative overflow-hidden max-[900px]:h-[250px] max-[600px]:hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 2000 }}
          loop={true}
          className="h-full"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index} className="relative w-full h-full">
              <div
                className="absolute w-full h-full bg-cover bg-center blur-[25px] brightness-[0.6] scale-110"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
              <img
                src={image}
                alt="delivery"
                className="relative w-[65%] max-[900px]:w-[50%] max-[500px]:w-[80%] mx-auto top-1/2 -translate-y-1/2 z-10"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex justify-center items-center bg-[#f4f6fb] max-[900px]:h-auto max-[600px]:min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] p-[35px_30px] max-[500px]:p-[25px_20px] max-[400px]:p-[20px_15px] rounded-[14px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)] text-center"
        >
          <img src={logo} alt="logo" className="w-[55px] mx-auto mb-2" />
          <h2 className="mb-1 text-[22px] font-semibold text-[#1f2a44]">
            Welcome back
          </h2>
          <p className="text-[13px] text-[#8a94a6] mb-5">
            Please enter your details to access your account
          </p>

          {/* EMAIL */}
          <div className="text-left mb-3">
            <label className="text-[12px] text-gray-500 mb-1 block">
              Email or ID
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              placeholder="name@dhatvibs.com"
              className="w-full px-3 py-[11px] rounded-md border border-[#e2e6ef] text-[13px] bg-[#f9fafc] focus:border-[#4a90e2] focus:bg-white outline-none"
            />
            {emailError && (
              <p className="text-red-500 text-[11px] mt-1">{emailError}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="text-left mb-3">
            <label className="text-[12px] text-gray-500 mb-1 block">
              Password
            </label>
            <div className="flex items-center border border-[#e2e6ef] rounded-md h-[42px] px-3 bg-[#f9fafc] focus-within:border-[#4a90e2] focus-within:bg-white">
              <input
                type="text"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                autoComplete="off"
                style={{
                  WebkitTextSecurity: showPassword ? "none" : "disc",
                }}
                className="flex-1 bg-transparent border-none outline-none shadow-none focus:ring-0 text-[13px] p-0 m-0"
              />
              <span
                onClick={() => {
                  if (!password) return;
                  setShowPassword(true);
                  setTimeout(() => setShowPassword(false), 3000);
                }}
                className={`flex items-center ${password ? "cursor-pointer text-gray-500" : "cursor-not-allowed text-gray-300"
                  }`}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
            {passwordError && (
              <p className="text-red-500 text-[11px] mt-1">{passwordError}</p>
            )}
          </div>

          <div className="text-right mb-4">
            <Link to="/reset-password" alt="forgot" className="text-[12px] text-[#4a90e2] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#192A51] hover:bg-[#0f1e3d] text-white text-[14px] rounded-md transition"
          >
            Login
          </button>
        </motion.div>
      </div>
    </div>
  );
}
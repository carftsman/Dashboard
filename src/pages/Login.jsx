
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";

// import "../../src/pages/styles/login.css";
import "../css/login.css";

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

  // ✅ EMAIL VALIDATION
  const validateEmail = (value) => {
    
    const regex = /^[a-zA-Z0-9._%+-]+@(dhatvibs\.com|gmail\.com)$/;
    if (!regex.test(value)) {
      setEmailError("Invalid email! ");
    } else {
      setEmailError("");
    }
  };

  // ✅ PASSWORD VALIDATION
  const validatePassword = (value) => {
    if (value.length < 8 || value.length > 12) {
      setPasswordError("Password must be 8-12 characters only");
      return;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,12}$/;

    if (!regex.test(value)) {
      setPasswordError(
        "Must include Upper, Lower, Number & Special character"
      );
    } else {
      setPasswordError("");
    }
  };

  // ✅ HANDLE PASSWORD INPUT (LIMIT 12)
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    if (value.length <= 12) {
      setPassword(value);
      validatePassword(value);
    }
  };

const handleLogin = async () => {
  validateEmail(email);
  validatePassword(password);

  if (!emailError && !passwordError && email && password) {
    try {
      const response = await fetch(
        "https://dashboard-backend-cyrd.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // ✅ Store token (optional but recommended)
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // ✅ Role-based redirect (from API)
        if (result.data.user.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard-selection");
        }
      } else {
        // ❌ API error message
        setPasswordError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setPasswordError("Something went wrong. Try again.");
    }
  }
};
  return (
    <div className="login-page">
      {/* LEFT SLIDER */}
      <div className="left-panel">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 2000 }}
          loop={true}
          className="hero-slider"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index} className="slide-container">
              <div
                className="bg-blur"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
              <img src={image} alt="delivery" className="main-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* RIGHT LOGIN */}
      <div className="right-panel">
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="login-card"
        >
          <img src={logo} className="logo-login" alt="logo" />

          <h2>Welcome back</h2>

          <p className="subtext">
            Please enter your details to access your account
          </p>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email or ID</label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              placeholder="name@dhatvibs.com"
            />
            {emailError && (
              <p className="error-text">{emailError}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Strong Password"
            />
            {passwordError && (
              <p className="error-text">{passwordError}</p>
            )}
          </div>

          {/* FORGOT */}
          <div className="forgot-container">
            <Link to="/reset-password">
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </motion.div>
      </div>
    </div>
  );
}
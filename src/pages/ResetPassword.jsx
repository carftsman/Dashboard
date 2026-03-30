import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Background.png.png";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#f8f9fc] items-center justify-center px-4">

      <motion.div
        className="w-[360px] max-[500px]:w-full p-10 max-[500px]:p-6 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
      >
        
        {/* LOGO */}
        <img
          src={logo}
          alt="logo"
          className="w-[50px] max-[500px]:w-[45px] mx-auto mb-5"
        />

        {/* TITLE */}
        <h2 className="mb-2 text-2xl max-[500px]:text-xl text-[#333]">
          Reset Password
        </h2>

        {/* SUBTEXT */}
        <p className="text-[12px] text-[#777] mb-6">
          No worries! Enter your email and we'll send reset instructions.
        </p>

        {/* INPUT */}
        <div className="text-left mb-8">
          <label className="text-base max-[500px]:text-sm font-semibold text-[#333] mb-2 block">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@dhatvibs.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-[11px] rounded-md border border-gray-300 text-[11px] transition focus:border-[#1f2a44] focus:outline-none focus:shadow-[0_0_2px_rgba(74,144,226,0.3)]"
          />
        </div>

        {/* BUTTON */}
        <button
          type="button"
          disabled={loading}
          onClick={async () => {

            // Empty check
            if (!email.trim()) {
              alert("Enter email");
              return;
            }

            // Email validation (ONLY gmail & dhatvibs allowed)
            const regex = /^[a-zA-Z0-9._%+-]+@(dhatvibs\.com|gmail\.com)$/;
            if (!regex.test(email)) {
              alert("Invalid email!");
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
          className="w-full py-3 bg-[#1f2a44] text-white text-[12px] rounded-lg cursor-pointer mb-1 hover:bg-[#162033] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Otp"}
        </button>

        {/* BACK LINK */}
        <div className="flex justify-center mt-4">
          <Link
            to="/"
            className="flex items-center text-sm max-[500px]:text-xs text-[#1f2a44] hover:underline"
          >
            <FaArrowLeft className="mr-2" />
            Back to login
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tempUser");
      if (stored && stored !== "undefined") {
        setTempUser(JSON.parse(stored));
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong. Please sign up again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("❌ Please enter a valid 6-digit OTP.");
    }

    if (!tempUser?.email) {
      return toast.error("No user data found. Please sign up again.");
    }

    try {
      setLoading(true);

      await toast.promise(
        axios.post("/otp/verify-otp", {
          email: tempUser.email,
          otp,
          name: tempUser.name,
          gender: tempUser.gender,
          password: tempUser.password,
        }),
        {
          pending: "🔐 Verifying OTP...",
          success: "🎉 OTP verified and account created!",
          error: "❌ OTP verification failed.",
        }
      );

      localStorage.setItem("prefillEmail", tempUser.email); 

      localStorage.removeItem("tempUser");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!tempUser) {
      return toast.error("❌ No user data found. Please sign up again.");
    }

    try {
      setResendLoading(true);
      await toast.promise(
        axios.post("/otp/send-otp", {
          name: tempUser.name,
          email: tempUser.email,
          gender: tempUser.gender,
          password: tempUser.password,
        }),
        {
          pending: "📧 Resending OTP...",
          success: "✅ OTP resent successfully! Check your email.",
          error: "❌ Failed to resend OTP.",
        }
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!tempUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-100">
        <p className="text-xl text-red-600">
          No OTP session found. Please <strong>sign up again</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-2 text-center">Verify OTP</h2>

        <p className="mt-4 text-center mb-4 text-sm text-gray-600">
          If you don't see the email, check your <strong className="text-red-500">spam folder</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            inputMode="numeric"
            className="w-full p-3 border border-gray-300 rounded text-center text-lg tracking-widest"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Didn’t receive the OTP?{" "}
          <button
            onClick={handleResendOtp}
            className="text-indigo-600 hover:underline disabled:opacity-50"
            disabled={resendLoading}
            type="button"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          OTP sent to <strong>{tempUser.email}</strong>
        </p>
        
      </div>
    </div>
  );
};

export default VerifyOTP;

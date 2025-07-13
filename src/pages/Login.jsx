// ✅ Final cleaned Login.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { toast } from "react-toastify";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("prefillEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.removeItem("prefillEmail");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("❌ Please fill in all fields.");
    }

    try {
      setLoading(true);
      const response = await axios.post("/auth/login", { email, password });

      toast.success("🎉 Login successful!");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Login failed.");
    } finally {
      setLoading(false);
      localStorage.removeItem("prefillEmail");
      localStorage.removeItem("tempUser");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <PasswordInput
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-indigo-700 cursor-pointer underline"
            onClick={() => navigate("/")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

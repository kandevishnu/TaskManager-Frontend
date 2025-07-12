import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import PasswordInput from "../components/PasswordInput";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`;
      const avatar =
        form.gender === "male"
          ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          : "https://cdn-icons-png.flaticon.com/512/4140/4140051.png";

      const { data } = await api.post("/otp/send-otp", {
        name: fullName,
        email: form.email,
        gender: form.gender,
        password: form.password,
      });

      localStorage.setItem(
        "tempUser",
        JSON.stringify({ ...data.tempUser, avatar })
      );

      toast.success("✅ OTP sent to your email");
      navigate("/verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const avatarPreview =
    form.gender === "male"
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
      : "https://cdn-icons-png.flaticon.com/512/4140/4140051.png";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-700 mb-1">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Sign up to start managing your tasks!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border rounded-md"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <PasswordInput
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Create Password"
          />

          <PasswordInput
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP & Continue"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-indigo-700 cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

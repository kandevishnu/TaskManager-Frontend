import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/api";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/me");
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("user");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const avatar =
    user?.avatar || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Tasks", path: "/tasks" },
    { name: "Create Task", path: "/tasks/create" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("✅ Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:relative md:translate-x-0`}
      >
        <div className="flex flex-col items-center p-4">
          <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full" />
          <h2 className="mt-4 text-lg font-bold">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        <nav className="mt-8 space-y-2 px-4">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {link.name}
            </button>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="w-full text-left px-3 py-2 cursor-pointer rounded hover:bg-gray-100 text-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-bold text-lg">Task Manager</span>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

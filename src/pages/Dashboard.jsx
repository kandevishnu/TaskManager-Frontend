import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/me");
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks");
        setTasks(res.data.tasks);
      } catch (err) {
        toast.error("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, []);

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const priorities = {
    low: tasks.filter((t) => t.priority === "low").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    high: tasks.filter((t) => t.priority === "high").length,
  };

  const statusData = [
    { name: "Pending", value: taskCounts.pending },
    { name: "In Progress", value: taskCounts.inProgress },
    { name: "Completed", value: taskCounts.completed },
  ];

  const priorityData = [
    { name: "Low", value: priorities.low },
    { name: "Medium", value: priorities.medium },
    { name: "High", value: priorities.high },
  ];

  const COLORS = ["#a78bfa", "#38bdf8", "#34d399"];
  const PRIORITY_COLORS = ["#34d399", "#fbbf24", "#f87171"];

const handleDeleteAccount = async () => {
  if (!password) return toast.error("Please enter your password");

  try {
    await axios.delete("/user/delete", {
      data: { password },
      withCredentials: true,
    });

    toast.success("✅ Account deleted successfully", { autoClose: 2000 });

    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/";
    }, 2500); // give toast time to show before redirect
  } catch (err) {
    toast.error(err.response?.data?.message || "❌ Failed to delete account");
  }
};


  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">
        Good Morning! {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-gray-500 mb-6">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium text-gray-600">Total Tasks</h3>
          <p className="text-2xl font-bold">{taskCounts.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium text-gray-600">Pending Tasks</h3>
          <p className="text-2xl font-bold text-purple-600">
            {taskCounts.pending}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium text-gray-600">In Progress</h3>
          <p className="text-2xl font-bold text-blue-600">
            {taskCounts.inProgress}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium text-gray-600">Completed Tasks</h3>
          <p className="text-2xl font-bold text-green-600">
            {taskCounts.completed}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-lg font-semibold mb-4">Task Distribution</h4>
          <ResponsiveContainer
            width="100%"
            height={200}
            className="sm:h-64 md:h-80"
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, index) => {
                  let fillColor = "#ccc";
                  if (entry.name === "Pending") fillColor = "#a78bfa"; 
                  else if (entry.name === "In Progress")
                    fillColor = "#38bdf8"; 
                  else if (entry.name === "Completed") fillColor = "#34d399"; 
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>


        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-lg font-semibold mb-4">Task Priority Levels</h4>
          <ResponsiveContainer
            width="100%"
            height={200}
            className="sm:h-64 md:h-80"
          >
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {priorityData.map((entry, index) => {
                  let fillColor = "#ccc";
                  if (entry.name === "Low") fillColor = "#34d399"; 
                  else if (entry.name === "Medium")
                    fillColor = "#fbbf24"; 
                  else if (entry.name === "High") fillColor = "#f87171"; 
                  return <Cell key={`bar-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="text-lg font-semibold mb-4 text-red-600 cursor-pointer">
          Delete My Account
        </h4>
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-4 py-2"
            />
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

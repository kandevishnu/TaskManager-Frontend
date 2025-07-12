import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import api from "../utils/api";


const filterOptions = ["All", "Pending", "In Progress", "Completed"];

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", {
          withCredentials: true,
        });
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getFilteredTasks = () => {
    if (filter === "All") return tasks;
    return tasks.filter(
      (task) => task.status?.toLowerCase() === filter.toLowerCase()
    );
  };

  const getCount = (status) => {
    if (!Array.isArray(tasks)) return 0;
    if (status === "All") return tasks.length;
    return tasks.filter(
      (task) => task.status?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          My Tasks
        </h1>

        {/* Filters */}
        <div className="sticky top-0 z-10 bg-gray-50 flex flex-wrap gap-3">
          {filterOptions.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`relative text-sm px-4 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                filter === item
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item}
              <span
                className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  filter === item
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {getCount(item)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <p className="text-gray-600 text-center mt-8">Loading tasks...</p>
      ) : getFilteredTasks().length === 0 ? (
        <p className="text-gray-600 text-center mt-8">No tasks found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getFilteredTasks().map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTasks;

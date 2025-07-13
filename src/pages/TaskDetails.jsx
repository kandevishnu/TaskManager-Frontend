import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get("/tasks");
        const found = data.tasks.find((t) => t._id === id);
        if (!found) throw new Error("Task not found");
        setTask(found);
      } catch (err) {
        toast.error("❌ Failed to fetch task details");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const determineStatus = (checklist) => {
    const total = checklist?.length || 0;
    const completed = checklist?.filter((item) => item.done).length;
    if (total === 0 || completed === 0) return "pending";
    if (completed === total) return "completed";
    return "in progress";
  };

  const handleToggle = async (index) => {
    const updatedChecklist = [...task.checklist];
    updatedChecklist[index].done = !updatedChecklist[index].done;

    const updatedTask = {
      ...task,
      checklist: updatedChecklist,
      status: determineStatus(updatedChecklist),
    };

    try {
      await api.put(`/tasks/${task._id}`, updatedTask);
      setTask(updatedTask);
      toast.success("✅ Checklist updated");
    } catch (err) {
      toast.error("❌ Failed to update checklist");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("✅ Task deleted successfully");
      navigate("/tasks");
    } catch (err) {
      toast.error("❌ Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading task details...</div>
    );
  }

  if (!task) return null;

  const doneCount = task.checklist?.filter((item) => item.done).length || 0;
  const totalCount = task.checklist?.length || 0;
  const progress = totalCount ? (doneCount / totalCount) * 100 : 0;

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusColors = {
    pending: "bg-purple-100 text-purple-700",
    "in progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 bg-white rounded-2xl shadow-md mt-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
        <div className="flex gap-4">
          <Pencil
            className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => navigate(`/task/${task._id}/edit`)}
          />
          <Trash2
            className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* Status & Priority */}
      <div className="flex flex-wrap gap-4 mb-5">
        <span
          className={`capitalize px-3 py-1 text-sm rounded-full font-medium ${statusColors[task.status]}`}
        >
          {task.status}
        </span>
        <span
          className={`px-3 py-1 text-sm rounded-full ${priorityColors[task.priority]}`}
        >
          {task.priority} Priority
        </span>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Description</h2>
        <p className="text-gray-700 text-sm whitespace-pre-wrap">
          {task.description || "No description provided."}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-1">
          Progress: {doneCount} / {totalCount}
        </p>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="h-3 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Dates */}
      <div className="text-sm text-gray-600 flex justify-between space-y-1 mb-6">
        <p>
          <span className="font-medium">Start Date:</span>{" "}
          {formatDate(task.startDate)}
        </p>
        <p>
          <span className="font-medium">Due Date:</span>{" "}
          {formatDate(task.dueDate)}
        </p>
      </div>

      {/* Checklist */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Checklist</h2>
        {totalCount === 0 ? (
          <p className="text-gray-500">No checklist items added.</p>
        ) : (
          <ul className="space-y-3">
            {task.checklist.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 cursor-pointer select-none hover:bg-gray-50 px-2 py-1 rounded-md transition"
                onClick={() => handleToggle(index)}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  readOnly
                  className="accent-blue-600 cursor-pointer"
                />
                <span
                  className={`text-sm ${
                    item.done ? "text-gray-500 line-through" : "text-gray-800"
                  }`}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TaskDetails;

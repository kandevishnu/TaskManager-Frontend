import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    checklist: [],
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get("/tasks", { withCredentials: true });
        const found = res.data.tasks.find((t) => t._id === id);
        if (!found) throw new Error("Task not found");

        setForm({
          title: found.title,
          description: found.description,
          priority: found.priority,
          dueDate: found.dueDate?.slice(0, 10),
          checklist: found.checklist,
        });
      } catch (err) {
        toast.error("❌ Failed to fetch task for editing");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleChecklistChange = (index, field, value) => {
    const updated = [...form.checklist];
    updated[index][field] = value;
    setForm({ ...form, checklist: updated });
  };

  const addChecklistItem = () => {
    setForm({
      ...form,
      checklist: [...form.checklist, { text: "", done: false }],
    });
  };

  const removeChecklistItem = (index) => {
    const updated = form.checklist.filter((_, i) => i !== index);
    setForm({ ...form, checklist: updated });
  };

  const validateForm = () => {
    if (form.title.trim().length < 3) {
      toast.error("❌ Title must be at least 3 characters");
      return false;
    }

    if (!form.description.trim()) {
      toast.error("❌ Please enter something about your task");
      return false;
    }

    const today = new Date();
    const due = new Date(form.dueDate);
    today.setHours(0, 0, 0, 0);
    if (due < today) {
      toast.error("❌ Due date cannot be in the past");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.put(`/tasks/${id}`, form, { withCredentials: true });
      toast.success("✅ Task updated successfully");
      navigate(`/task/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update task");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Edit Task
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Priority</label>
            <select
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dueDate}
              min={new Date().toISOString().split("T")[0]} // prevent past dates
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Checklist</label>
          {form.checklist.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 mb-2 bg-gray-50 p-2 rounded-md"
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) =>
                  handleChecklistChange(index, "done", e.target.checked)
                }
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) =>
                  handleChecklistChange(index, "text", e.target.value)
                }
                placeholder="Checklist item"
                className="flex-1 border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeChecklistItem(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklistItem}
            className="text-sm text-blue-600 mt-1 hover:underline"
          >
            + Add item
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Update Task
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditTask;

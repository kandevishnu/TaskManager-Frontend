import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api"; // your axios instance

const CreateTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    checklist: [],
  });

  const [checklistItem, setChecklistItem] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addChecklistItem = () => {
    if (checklistItem.trim()) {
      setForm((prev) => ({
        ...prev,
        checklist: [...prev.checklist, { text: checklistItem, done: false }],
      }));
      setChecklistItem("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/tasks", form);
      toast.success("✅ Task created successfully");

      setForm({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
        checklist: [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to create task");
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            TODO Checklist
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={checklistItem}
              onChange={(e) => setChecklistItem(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Add a checklist item"
            />
            <button
              type="button"
              onClick={addChecklistItem}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
            >
              Add
            </button>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {form.checklist.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "✅ Create Task"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateTask;

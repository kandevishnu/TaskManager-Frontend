import React from "react";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ task }) => {
  const {
    _id,
    title,
    description,
    priority,
    dueDate,
    startDate,
    status,
    checklist,
  } = task;

  const navigate = useNavigate();

  const doneCount = checklist?.filter((item) => item.done)?.length || 0;
  const totalCount = checklist?.length || 0;
  const progress = totalCount ? (doneCount / totalCount) * 100 : 0;

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusColors = {
    pending: "text-purple-600",
    "in progress": "text-blue-600",
    completed: "text-green-600",
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      onClick={() => navigate(`/task/${_id}`)}
      className="cursor-pointer bg-white shadow-md rounded-xl p-5 w-full max-w-md sm:max-w-full hover:shadow-lg transition-all duration-300"
    >
      {/* Status & Priority */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-sm font-semibold capitalize ${statusColors[status]}`}
        >
          {status}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[priority]}`}
        >
          {priority} Priority
        </span>
      </div>

      <div className="border-l-4 border-blue-500 pl-3 mb-3">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        <p className="text-sm font-medium mb-1">
          Task Done: {doneCount} / {totalCount}
        </p>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-between text-xs text-gray-600">
        <p>
          <span className="font-semibold">Start:</span> {formatDate(startDate)}
        </p>
        <p>
          <span className="font-semibold">Due:</span> {formatDate(dueDate)}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;

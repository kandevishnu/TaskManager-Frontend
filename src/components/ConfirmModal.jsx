import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete this task?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

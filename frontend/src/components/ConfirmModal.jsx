import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue/40">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center border border-gray-300">
        <p className="mb-4 text-white font-bold">{message || "Are you sure?"}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-blue-600  text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
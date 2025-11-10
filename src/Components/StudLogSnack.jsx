import React from "react";

const SnackBar = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-end justify-end px-6 py-6 z-50">
      <div className="bg-white w-[22rem] shadow-lg border border-gray-300 rounded-lg p-4">
        <p className="text-gray-800 mb-4 font-medium">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnackBar;

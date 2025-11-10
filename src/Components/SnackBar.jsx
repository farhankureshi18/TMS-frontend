// SnackBar.jsx
import React from "react";

const colorMap = {
  success: "bg-green-500",
  error: "bg-red-500",
  pending: "bg-gray-600",
};

const SnackBar = ({ message, type }) => {
  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded-md shadow-md ${colorMap[type]} z-50`}
    >
      {message}
    </div>
  );
};

export default SnackBar;

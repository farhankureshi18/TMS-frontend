import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Eye, Upload, CreditCard } from "lucide-react";
import { useSelector } from "react-redux"; // assuming batches come from Redux

const Assignments = () => {
  const studentBatches = useSelector((state) => state.studentBatch.batches); 
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // 🔹 Fetch assignments for all batches
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!studentBatches || studentBatches.length === 0) return;
      setLoadingAssignments(true);

      try {
        const allAssignments = [];

        for (const batch of studentBatches) {
          const res = await axios.get(
            `https://tms-backend-hn7r.onrender.com/tutor/${encodeURIComponent(batch.batchName)}`
          );
          const assignmentsWithBatch = res.data.map((a) => ({
            ...a,
            batchName: batch.batchName,
          }));
          allAssignments.push(...assignmentsWithBatch);
        }

        setAssignments(allAssignments);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [studentBatches]);

  // 🔹 File upload handler (UI simulation)
  const handleFileChange = (e, title) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [title]: file.name }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm";
      case "Submitted":
        return "text-green-600 bg-green-100 px-2 py-1 rounded text-sm";
      case "Draft":
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText size={20} /> Assignments
      </h2>

      {loadingAssignments ? (
        <p className="text-gray-500">Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500">No assignments found.</p>
      ) : (
        assignments.map((item, i) => (
          <div
            key={i}
            className="border-l-4 pl-4 mb-4"
            style={{
              borderColor:
                item.subject === "Mathematics"
                  ? "#2563eb"
                  : item.subject === "Physics"
                  ? "#16a34a"
                  : "#f59e0b",
            }}
          >
            <p className="font-semibold">{item.AssignmentName || item.title}</p>
            <p className="text-sm text-gray-500">
              {item.batchName} – Due: {item.dueDate || "N/A"}
            </p>
            <span className={getStatusStyle(item.status || "Pending")}>
              {item.status || "Pending"}
            </span>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setViewAssignment(item)}
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
              >
                <Eye size={14} /> View
              </button>
              <label className="cursor-pointer text-green-600 text-sm flex items-center gap-1">
                <Upload size={14} /> Submit
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, item.AssignmentName)}
                />
              </label>
            </div>
            {uploadedFiles[item.AssignmentName] && (
              <p className="text-xs text-green-600 mt-1">
                File uploaded: {uploadedFiles[item.AssignmentName]}
              </p>
            )}
          </div>
        ))
      )}

      {viewAssignment && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h3 className="font-semibold text-gray-700 mb-1">
            {viewAssignment.AssignmentName}
          </h3>
          <p className="text-sm text-gray-600">
            {viewAssignment.desc || "No description"}
          </p>
          <button
            onClick={() => setViewAssignment(null)}
            className="mt-2 text-xs text-blue-500 underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Assignments;

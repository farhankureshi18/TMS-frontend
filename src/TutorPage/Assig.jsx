import React, { useState } from "react";

export default function Assignments() {
  const [assignments, setAssignments] = useState([
    {
      assignmentName: "Quadratic Equations Practice",
      description: "Solve the given quadratic equations using different methods",
      batchName: "Mathematics - Grade 11A",
      date: "2024-01-22",
      file: "quadratic_equations.pdf",
      completion: 77,
      stats: "18 of 23 students",
    },
    {
      assignmentName: "Newton's Laws Lab Report",
      description: "Complete lab report on Newton's three laws of motion",
      batchName: "Physics - Grade 11B",
      date: "2024-01-21",
      file: "physics_lab_report.docx",
      completion: 75,
      stats: "15 of 20 students",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    assignmentName: "",
    description: "",
    batchName: "",
    date: "",
    file: null,
    completion: 0,
    stats: "0 of 0 students",
  });

  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("batchName", newAssignment.batchName);
    formData.append("assignmentName", newAssignment.assignmentName);
    formData.append("desc", newAssignment.description);
    formData.append("date", newAssignment.date); // optional, if backend doesn't use date you can skip
    if (newAssignment.file) {
      formData.append("file", newAssignment.file);
    }

    // Make API call
    const res = await fetch("https://tms-backend-hn7r.onrender.com/tutor/upload", {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type, fetch will set multipart/form-data automatically
    });

    const data = await res.json();

    if (res.ok) {
      // Add uploaded assignment to state
      setAssignments([
        {
          assignmentName: data.assignment.assignmentName,
          description: data.assignment.desc,
          batchName: data.assignment.batchName,
          date: newAssignment.date,
          file: data.assignment.file, // filename returned from backend
          completion: 0,
          stats: "0 of 0 students",
        },
        ...assignments,
      ]);

      // Reset form
      setNewAssignment({
        assignmentName: "",
        description: "",
        batchName: "",
        date: "",
        file: null,
        completion: 0,
        stats: "0 of 0 students",
      });

      setShowForm(false);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } else {
      alert(data.msg || "Upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Error uploading assignment");
  }
};


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assignments</h2>

      {/* Upload Button */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        + Upload Assignment
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 bg-gray-100 p-4 rounded shadow space-y-3"
        >
          <input
            type="text"
            placeholder="Batch Name"
            className="border p-2 w-full rounded"
            value={newAssignment.batchName}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, batchName: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Assignment Name"
            className="border p-2 w-full rounded"
            value={newAssignment.assignmentName}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, assignmentName: e.target.value })
            }
            required
          />

          <input
            type="date"
            className="border p-2 w-full rounded"
            value={newAssignment.date}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, date: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            className="border p-2 w-full rounded"
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, description: e.target.value })
            }
          />

          {/* File Upload */}
          <input
            type="file"
            className="border p-2 w-full rounded bg-white"
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, file: e.target.files[0] })
            }
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit Assignment
          </button>
        </form>
      )}

      {/* Assignment List */}
      {assignments.map((a, idx) => (
        <div
          key={idx}
          className="border rounded-lg shadow p-4 mb-4 bg-white"
        >
          <h3 className="text-lg font-semibold">{a.assignmentName}</h3>
          <p className="text-gray-600">{a.description}</p>
          <p className="mt-2 text-sm text-gray-500">
             {a.batchName} |  Date: {a.date}
          </p>
          {a.file && <p className="text-sm text-gray-500">📄 {a.file}</p>}
          <p className="mt-2 text-orange-500 font-medium">
            {a.completion}% Submitted • {a.stats}
          </p>
        </div>
      ))}

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-slide-up">
          Assignment posted successfully!
        </div>
      )}
    </div>
  );
}

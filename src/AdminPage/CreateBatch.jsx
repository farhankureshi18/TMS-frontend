import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function BatchCreationForm() {
  const [studentsList, setStudentsList] = useState([]);
  const [tutorsList, setTutorsList] = useState([]);
  const [formData, setFormData] = useState({
    batchName: "",
    tutor: "",
    students: [],
    subject: "",
    schedule: "",
    description: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://tms-backend-hn7r.onrender.com/admin/AllUsers");
        const users = res.data;
        setStudentsList(users.filter((u) => u.role === "Student"));
        setTutorsList(users.filter((u) => u.role === "Tutor"));
      } catch (err) {
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleStudentToggle = (email) => {
    setFormData((prev) => {
      const exists = prev.students.includes(email);
      return {
        ...prev,
        students: exists
          ? prev.students.filter((s) => s !== email)
          : [...prev.students, email],
      };
    });
  };

  const handleCreateBatch = async () => {
    if (!formData.batchName || !formData.tutor || formData.students.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        batchName: formData.batchName,
        tutorEmail: formData.tutor,
        studentEmails: formData.students,
        subject: formData.subject,
        schedule: formData.schedule,
        description: formData.description || "",
      };

      const res = await axios.post("https://tms-backend-hn7r.onrender.com/admin/batch", payload);

      if (res.status === 201 || res.status === 200) {
        toast.success("Batch created successfully ");
        setFormData({
          batchName: "",
          tutor: "",
          students: [],
          subject: "",
          schedule: "",
          description: "",
        });
      } else toast.error("Failed to create batch ");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-white/40">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10 drop-shadow-sm">
          🎓 Create a New Batch
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Batch Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Batch Name</label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              placeholder="e.g., JavaScript Batch A"
              className="w-full p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Physics / ReactJS"
              className="w-full p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Students */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Select Students</label>
            <div className="h-44 overflow-y-auto border border-indigo-200 rounded-xl p-3 bg-white hover:shadow-md transition">
              {studentsList.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No students available</p>
              ) : (
                studentsList.map((student) => (
                  <label
                    key={student._id}
                    className="flex items-center gap-2 text-sm py-1 cursor-pointer hover:bg-indigo-50 rounded-lg px-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.students.includes(student.email)}
                      onChange={() => handleStudentToggle(student.email)}
                      className="accent-indigo-600"
                    />
                    <span className="text-gray-700">{student.fullName}</span>
                    <span className="text-gray-400">({student.email})</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Tutor */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Select Tutor</label>
            <select
              name="tutor"
              value={formData.tutor}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="">-- Choose Tutor --</option>
              {tutorsList.map((tutor) => (
                <option key={tutor._id} value={tutor.email}>
                  {tutor.fullName} ({tutor.email})
                </option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Schedule</label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="e.g., Mon-Wed-Fri 5PM"
              className="w-full p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description"
              className="w-full p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-10 gap-4">
          <button
            onClick={() =>
              setFormData({
                batchName: "",
                tutor: "",
                students: [],
                subject: "",
                schedule: "",
                description: "",
              })
            }
            className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateBatch}
            className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            🚀 Create Batch
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

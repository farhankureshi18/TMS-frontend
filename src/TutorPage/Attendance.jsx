import React, { useState } from "react";

const batches = [
  { id: 1, name: "Mathematics Grade 10" },
  { id: 2, name: "Physics Grade 11" },
];

const studentsData = [
  { id: 1, name: "Alice Johnson", roll: "M10A-001" },
  { id: 2, name: "Bob Smith", roll: "M10A-002" },
  { id: 3, name: "Carol Davis", roll: "M10A-003" },
  { id: 4, name: "David Lee", roll: "M10A-004" },
  { id: 5, name: "Eva Green", roll: "M10A-005" },
];

const Attendance = () => {
  const [selectedBatch, setSelectedBatch] = useState(batches[0].id);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState(
    studentsData.reduce((acc, student) => {
      acc[student.id] = ""; // "" for not marked, "present" or "absent"
      return acc;
    }, {})
  );

  const handleMark = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  const markAll = (status) => {
    const newAttendance = {};
    studentsData.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const presentCount = Object.values(attendance).filter((v) => v === "present").length;
  const absentCount = Object.values(attendance).filter((v) => v === "absent").length;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <select
          className="border p-2 rounded"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(Number(e.target.value))}
        >
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => markAll("present")}
        >
          Mark All Present
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => markAll("absent")}
        >
          Mark All Absent
        </button>
      </div>

      <div className="mb-4">
        <span className="mr-4">Present: {presentCount}</span>
        <span>Absent: {absentCount}</span>
      </div>

      <ul>
        {studentsData.map((student) => (
          <li
            key={student.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm text-gray-500">Roll No: {student.roll}</p>
            </div>

            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded border ${
                  attendance[student.id] === "present"
                    ? "bg-green-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => handleMark(student.id, "present")}
              >
                Present
              </button>
              <button
                className={`px-3 py-1 rounded border ${
                  attendance[student.id] === "absent"
                    ? "bg-red-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => handleMark(student.id, "absent")}
              >
                Absent
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;


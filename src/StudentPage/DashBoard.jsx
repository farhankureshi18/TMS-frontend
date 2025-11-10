import { useEffect, useState } from "react";
import { Calendar, BookOpen, Clock, User } from "lucide-react";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { setStudentBatches } from "../redux/studentBatchSlice";

const StudentDashboard = () => {
  const user = useSelector((state) => state.user); 
  const dispatch = useDispatch();
  const studentBatches = useSelector((state) => state.studentBatch.batches); 

  const [batches, setBatches] = useState([]); 
  const [assignments, setAssignments] = useState([]); 
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  // Fetch batches for student
  useEffect(() => {
    const fetchBatches = async () => {
      if (!user.userEmail) return;
      setLoadingBatches(true);
      try {
        const res = await axios.get(`https://tms-backend-hn7r.onrender.com/admin/batches/${user.userEmail}`);
        const studentBatchData = res.data.filter(batch =>
          batch.studentEmails.includes(user.userEmail)
        );

        setBatches(studentBatchData);

        const sliceData = studentBatchData.map(batch => ({
          _id: batch._id,
          batchName: batch.batchName,
        }));
        dispatch(setStudentBatches(sliceData));

      } catch (err) {
        console.error("Failed to fetch batches", err);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, [user.userEmail, dispatch]);

  
  // Fetch assignments for all batches
  useEffect(() => {
    const fetchAssignments = async () => {
      if (studentBatches.length === 0) return;
      setLoadingAssignments(true);

      try {
        const allAssignments = [];

        // Call getAssignmentsByBatch for each batch
        for (const batch of studentBatches) {
          const res = await axios.get(`https://tms-backend-hn7r.onrender.com/tutor/${encodeURIComponent(batch.batchName)}`);
          // Add batch info to each assignment for UI
          const assignmentsWithBatch = res.data.map(a => ({
            ...a,
            batchName: batch.batchName
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

  const progressData = [
    { month: "Jan", Mathematics: 78, Physics: 80, Chemistry: 74 },
    { month: "Feb", Mathematics: 81, Physics: 83, Chemistry: 76 },
    { month: "Mar", Mathematics: 83, Physics: 85, Chemistry: 79 },
    { month: "Apr", Mathematics: 85, Physics: 88, Chemistry: 82 },
    { month: "May", Mathematics: 87, Physics: 90, Chemistry: 84 },
    { month: "Jun", Mathematics: 89, Physics: 92, Chemistry: 86 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, <span className="text-blue-600">{user.fullName}</span>! 👋
      </h1>

      {/* Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {loadingBatches ? (
          <p>Loading Batches...</p>
        ) : batches.length === 0 ? (
          <p>No batches assigned yet.</p>
        ) : (
          batches.map((batch) => (
            <div key={batch._id} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen size={20} /> {batch.batchName}
              </h2>
              <p className="text-sm">Subject: {batch.subject}</p>
              <p className="text-sm">Tutor: {batch.tutorEmail || "N/A"}</p>
              <p className="text-sm">Schedule: {batch.schedule}</p>
            </div>
          ))
        )}
      </div>

      {/* Assignments */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Assignments</h2>
        {loadingAssignments ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p>No assignments available.</p>
        ) : (
          assignments.map((a) => (
            <div key={a._id} className="border rounded-lg shadow p-4 mb-4 bg-white">
              <h3 className="text-lg font-semibold">{a.assignmentName}</h3>
              <p className="text-gray-600">{a.desc}</p>
              <p className="mt-2 text-sm text-gray-500">
                📚 {a.batchName}
              </p>
              {a.file && (
                <p className="text-sm text-gray-500">
                  📄 <a href={`http://localhost:2000/uploads/assignments/${a.file}`} target="_blank" className="underline text-blue-600">{a.file}</a>
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Academic Progress */}
      <div className="bg-white rounded-xl shadow p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">Academic Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Mathematics" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="Physics" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="Chemistry" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentDashboard;

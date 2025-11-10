import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending users from backend
  const fetchRequests = async () => {
    try {
      const res = await fetch('https://tms-backend-hn7r.onrender.com/admin/pending');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') navigate('/login');
    fetchRequests();
  }, [navigate]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://tms-backend-hn7r.onrender.com/admin/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toLowerCase() }), // must be "approved" or "rejected"
      });
      const data = await res.json();
      if (res.ok) {
        // Update UI locally
        setUsers(users.map(user => (user._id === id ? { ...user, status: newStatus.toLowerCase() } : user)));
      } else {
        alert(data.msg || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Server error');
    }
  };

  const studentRequests = users.filter(user => user.role === 'Student');
  const tutorRequests = users.filter(user => user.role === 'Tutor');

  const renderActions = (user) =>
    user.status === "pending" ? (
      <>
        <button
          onClick={() => updateStatus(user._id, "approved")}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Approve
        </button>
        <button
          onClick={() => updateStatus(user._id, "rejected")}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Reject
        </button>
      </>
    ) : (
      <span className="text-gray-400">✔ Decision Made</span>
    );

  if (loading) return <div className="text-center mt-10">Loading requests...</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-gray-200 bg-gray-600 rounded-xl text-center">
          Registration Requests
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Student Requests */}
          <div className="bg-gray-600 rounded-xl shadow-md p-6 overflow-x-auto">
            <h2 className="text-xl font-black text-white mb-4">🧑‍🎓 Student Requests</h2>
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Std</th>
                  <th className="px-4 py-2 border">Result</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentRequests.map((user) => (
                  <tr key={user._id} className="text-center">
                    <td className="border px-4 py-2 text-white">{user.fullName}</td>
                    <td className="border px-4 py-2 text-white">{user.phoneNumber}</td>
                    <td className="border px-4 py-2 text-white">{user.standard}</td>
                    <td className="border px-4 py-2 text-white">{user.result}</td>
                    <td className="border px-4 py-2 text-white capitalize">{user.status}</td>
                    <td className="border px-4 py-2 space-x-2">{renderActions(user)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tutor Requests */}
          <div className="bg-gray-600 rounded-xl shadow-md p-6 overflow-x-auto">
            <h2 className="text-xl font-black text-white mb-4">👨‍🏫 Tutor Requests</h2>
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Subjects</th>
                  <th className="px-4 py-2 border">Experience</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutorRequests.map((user) => (
                  <tr key={user._id} className="text-center">
                    <td className="border px-4 py-2 text-white">{user.fullName}</td>
                    <td className="border px-4 py-2 text-white">{user.phoneNumber}</td>
                    <td className="border px-4 py-2 text-white">{user.subjects?.join(", ")}</td>
                    <td className="border px-4 py-2 text-white">{user.experience}</td>
                    <td className="border px-4 py-2 text-white capitalize">{user.status}</td>
                    <td className="border px-4 py-2 space-x-2">{renderActions(user)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;

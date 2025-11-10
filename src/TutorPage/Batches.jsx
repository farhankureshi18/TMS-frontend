import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const MyBatches = () => {
  const [batches, setBatches] = useState([]);
  const [openBatch, setOpenBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = useSelector((state) => state.user.userEmail); // getting email from Redux

  const toggleBatch = (id) => {
    setOpenBatch(openBatch === id ? null : id);
  };

  useEffect(() => {
    const fetchBatches = async () => {
      if (!userEmail) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `https://tms-backend-hn7r.onrender.com/admin/batches/${userEmail}`
        );
        setBatches(res.data);
      } catch (err) {
        console.error("Failed to fetch batches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [userEmail]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-4">
      <h2 className="text-2xl font-bold mb-4">My Batches</h2>

      {loading ? (
        <p>Loading Batches...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-600">No batches assigned to you yet.</p>
      ) : (
        <div className="space-y-4">
          {batches.map((batch, idx) => (
            <div
              key={batch._id || idx}
              className="rounded-lg shadow-md overflow-hidden border"
            >
              <div
                className={`${
                  ["bg-blue-500", "bg-purple-500", "bg-green-500"][idx % 3]
                } text-white p-4 flex justify-between items-center cursor-pointer`}
                onClick={() => toggleBatch(idx)}
              >
                <div>
                  <h3 className="text-lg font-bold">{batch.batchName}</h3>
                  <p className="text-sm opacity-90">Subject: {batch.subject}</p>
                  <p className="text-sm opacity-90">Schedule: {batch.schedule}</p>
                  <p className="text-sm opacity-90">
                    {batch.studentEmails?.length || 0} students
                  </p>
                </div>
                <button className="text-white font-bold text-lg">
                  {openBatch === idx ? "▲" : "▼"}
                </button>
              </div>

              {openBatch === idx && (
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold mb-2">Students</h4>
                  <ul className="space-y-2">
                    {(batch.studentEmails || []).map((email, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{email}</p>
                          <p className="text-sm text-gray-600">📧 {email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded">
                            Message
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-600 rounded">
                            Profile
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBatches;

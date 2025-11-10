import React, { useEffect, useState } from "react";
import axios from "axios";
import Requests from "./Requests";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { MdPendingActions } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { LuBookCopy } from "react-icons/lu";

const Home = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTutors: 0,
    activeBatches: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    axios
      .get("https://tms-backend-hn7r.onrender.com/admin/dashBoardStat")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Top 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-5 shadow-lg hover:scale-105 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Total Students</h2>
              <FaUserGraduate size={26} />
            </div>
            <p className="text-3xl font-bold">{stats.totalStudents}</p>
            <p className="text-sm opacity-80">Active learners</p>
          </div>

          {/* Total Tutors */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-lg hover:scale-105 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Total Tutors</h2>
              <FaChalkboardTeacher size={26} />
            </div>
            <p className="text-3xl font-bold">{stats.totalTutors}</p>
            <p className="text-sm opacity-80">Expert educators</p>
          </div>

          {/* Active Batches */}
          <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-xl p-5 shadow-lg hover:scale-105 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Active Batches</h2>
              <FiBookOpen size={26} />
            </div>
            <p className="text-3xl font-bold">{stats.activeBatches}</p>
            <p className="text-sm opacity-80">Learning groups</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-5 shadow-lg hover:scale-105 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Pending Requests</h2>
              <MdPendingActions size={26} />
            </div>
            <p className="text-3xl font-bold">{stats.pendingRequests}</p>
            <p className="text-sm opacity-80">Awaiting approval</p>
          </div>
        </div>

        {/* Bottom 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-md border hover:shadow-lg transition-all">
            <div className="flex justify-between items-center text-green-600 mb-2">
              <h2 className="text-lg font-semibold">Monthly Revenue</h2>
              <BsCurrencyDollar size={24} />
            </div>
            <p className="text-2xl font-bold text-black">$0</p>
            <p className="text-sm text-gray-500">Current month earnings</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border hover:shadow-lg transition-all">
            <div className="flex justify-between items-center text-blue-600 mb-2">
              <h2 className="text-lg font-semibold">Yearly Projection</h2>
              <GoGraph size={24} />
            </div>
            <p className="text-2xl font-bold text-black">$0</p>
            <p className="text-sm text-gray-500">Based on current batches</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border hover:shadow-lg transition-all">
            <div className="flex justify-between items-center text-purple-600 mb-2">
              <h2 className="text-lg font-semibold">Avg. Revenue/Batch</h2>
              <LuBookCopy size={24} />
            </div>
            <p className="text-2xl font-bold text-black">$0</p>
            <p className="text-sm text-gray-500">Per batch earnings</p>
          </div>
        </div>
      </div>

      {/* Requests Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-12 h-[500px] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            📥 Pending Requests
          </h2>
        </div>
        <hr className="mb-4 border-gray-200" />
        <Requests />
      </div>
    </>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { CalendarDays, Users, BookOpen, ClipboardList, CheckCircle, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import ClassSch from "../TutorPage/ClassSchDashB";

const TutorDashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [statsData, setStatsData] = useState({
    totalBatches: 0,
    totalStudents: 0,
    classesThisWeek: 0,
    assignmentsGiven: 0,
  });

  // ✅ Get tutor info directly from Redux
  const { fullName, userEmail } = useSelector((state) => state.user);

  // Extract first name
  useEffect(() => {
    if (fullName) {
      setFirstName(fullName.split(" ")[0]);
    }
  }, [fullName]);

  // Fetch Dashboard Stats dynamically using tutor email
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!userEmail) return; // Wait till email available in Redux

      try {
        const [batchRes, studentRes, classRes, assignmentRes] = await Promise.all([
          axios.get(`https://tms-backend-hn7r.onrender.com/tutor/batches/${userEmail}`),
          axios.get(`https://tms-backend-hn7r.onrender.com/tutor/students/${userEmail}`),
          axios.get(`https://tms-backend-hn7r.onrender.com/tutor/classes/${userEmail}`),
          axios.get(`https://tms-backend-hn7r.onrender.com/tutor/assignments/${userEmail}`),
        ]);

        setStatsData({
          totalBatches: batchRes.data.totalBatches || 0,
          totalStudents: studentRes.data.totalStudents || 0,
          classesThisWeek: classRes.data.totalClasses || 0,
          assignmentsGiven: assignmentRes.data.totalAssignments || 0,
        });
      } catch (error) {
        console.error("Error fetching tutor stats:", error);
      }
    };

    fetchDashboardStats();
  }, [userEmail]);

  //  Stats Boxes (Dynamic)
  const stats = [
    { label: "Total Batches", value: statsData.totalBatches, icon: BookOpen, color: "bg-blue-100 text-blue-600" },
    { label: "Total Students", value: statsData.totalStudents, icon: Users, color: "bg-green-100 text-green-600" },
    { label: "Classes This Week", value: statsData.classesThisWeek, icon: CalendarDays, color: "bg-purple-100 text-purple-600" },
    { label: "Assignments Given", value: statsData.assignmentsGiven, icon: ClipboardList, color: "bg-yellow-100 text-yellow-600" },
    { label: "Students Attendance", value: "87%", icon: CheckCircle, color: "bg-pink-100 text-pink-600" },
    { label: "Unread Messages", value: 12, icon: Mail, color: "bg-red-100 text-red-600" },
  ];

  //  Static upcoming classes & recent activities remain unchanged
  const upcomingClasses = [
    { subject: "Mathematics", grade: "10A", time: "10:00 AM", day: "Today" },
    { subject: "Physics", grade: "11B", time: "2:00 PM", day: "Today" },
    { subject: "Chemistry", grade: "12A", time: "4:00 PM", day: "Tomorrow" },
    { subject: "Mathematics", grade: "9C", time: "9:00 AM", day: "Tomorrow" },
  ];

  const recentActivities = [
    { activity: "New assignment uploaded", detail: "Math grade 10", time: "2 hours ago" },
    { activity: "Attendance marked", detail: "Physics grade 11", time: "4 hours ago" },
    { activity: "Message received from student", detail: "Chemistry grade 12", time: "6 hours ago" },
    { activity: "Class scheduled", detail: "Math grade 9", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold">Welcome {firstName || "Tutor"}!</h1>
        <p className="text-sm mt-1 opacity-90">Here's what's happening with your classes today.</p>
      </div>

      {/*Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-6 flex items-center space-x-4 hover:shadow-md transition"
          >
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Classes & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <CalendarDays size={20} className="text-blue-500" />
            <span>Upcoming Classes</span>
          </h2>
          <ul className="space-y-4">
            {upcomingClasses.map((cls, idx) => (
              <li key={idx} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">{cls.subject}</p>
                  <p className="text-sm text-gray-500">Grade {cls.grade}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{cls.time}</p>
                  <p className="text-sm text-gray-500">{cls.day}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Recent Activities</h2>
          <ul className="space-y-4">
            {recentActivities.map((act, idx) => (
              <li key={idx} className="border-b pb-2">
                <p className="font-semibold">{act.activity}</p>
                <p className="text-sm text-gray-500">{act.detail}</p>
                <p className="text-xs text-gray-400">{act.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Class Schedule Component */}
      <div>
        <ClassSch />
      </div>
    </div>
  );
};

export default TutorDashboard;

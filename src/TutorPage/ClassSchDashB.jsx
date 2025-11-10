import React from "react";
import { FiClock, FiMapPin } from "react-icons/fi";

const scheduleData = [
  {
    day: "Sunday",
    date: "Jul 6",
    classes: []
  },
  {
    day: "Monday",
    date: "Jul 7",
    classes: [
      {
        subject: "Mathematics",
        grade: "Grade 10A",
        time: "10:00 AM - 11:30 AM",
        room: "Room 101",
        students: 25,
        color: "bg-blue-500"
      },
      {
        subject: "Chemistry",
        grade: "Grade 12A",
        time: "4:01 PM - 5:30 PM",
        room: "Lab 301",
        students: 18,
        color: "bg-green-500"
      }
    ]
  },
  {
    day: "Tuesday",
    date: "Jul 8",
    classes: [
      {
        subject: "Physics",
        grade: "Grade 11B",
        time: "2:00 PM - 2:30 PM",
        room: "Lab 201",
        students: 20,
        color: "bg-purple-500"
      },
      {
        subject: "Biology",
        grade: "Grade 11A",
        time: "11:00 AM - 12:30 PM",
        room: "Room 205",
        students: 22,
        color: "bg-orange-500"
      }
    ]
  },
  {
    day: "Wednesday",
    date: "Jul 9",
    classes: [
      {
        subject: "Mathematics",
        grade: "Grade 10A",
        time: "10:00 AM - 11:30 AM",
        room: "Room 101",
        students: 25,
        color: "bg-blue-500"
      },
      {
        subject: "Chemistry",
        grade: "Grade 12A",
        time: "4:01 PM - 5:30 PM",
        room: "Lab 301",
        students: 18,
        color: "bg-green-500"
      }
    ]
  },
  {
    day: "Thursday",
    date: "Jul 10",
    classes: [
      {
        subject: "Physics",
        grade: "Grade 11B",
        time: "2:00 PM - 3:30 PM",
        room: "Lab 201",
        students: 20,
        color: "bg-purple-500"
      },
      {
        subject: "Biology",
        grade: "Grade 11A",
        time: "11:00 AM - 12:30 PM",
        room: "Room 205",
        students: 22,
        color: "bg-orange-500"
      }
    ]
  },
  {
    day: "Friday",
    date: "Jul 11",
    classes: [
      {
        subject: "Mathematics",
        grade: "Grade 10A",
        time: "10:00 AM - 11:30 AM",
        room: "Room 101",
        students: 25,
        color: "bg-blue-500"
      },
      {
        subject: "Chemistry",
        grade: "Grade 12A",
        time: "4:01 PM - 5:20 PM",
        room: "Lab 301",
        students: 18,
        color: "bg-green-500"
      }
    ]
  },
  {
    day: "Saturday",
    date: "Jul 12",
    classes: [
      {
        subject: "Physics",
        grade: "Grade 11B",
        time: "2:00 PM - 3:20 PM",
        room: "Lab 201",
        students: 20,
        color: "bg-purple-500"
      }
    ]
  }
];

const ClassSchedule = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Class Schedule</h2>
        <span className="text-gray-500">Jul 6 - Jul 12</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {scheduleData.map((daySchedule, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-lg shadow-sm flex flex-col gap-3"
          >
            <div className="text-center">
              <h3 className="font-semibold">{daySchedule.day}</h3>
              <p className="text-sm text-gray-500">{daySchedule.date}</p>
            </div>
            {daySchedule.classes.length > 0 ? (
              daySchedule.classes.map((cls, idx) => (
                <div
                  key={idx}
                  className={`${cls.color} text-white p-3 rounded-lg shadow-md`}
                >
                  <h4 className="font-bold text-sm">{cls.subject}</h4>
                  <p className="text-xs">{cls.grade}</p>
                  <div className="flex items-center gap-1 text-xs mt-2">
                    <FiClock /> {cls.time}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <FiMapPin /> {cls.room}, {cls.students}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm mt-4">
                No Classes
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;

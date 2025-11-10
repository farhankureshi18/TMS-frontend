import { Bell, Book, CalendarCheck2, Eye, Download } from "lucide-react";

const Profile = () => {
  const notifications = [
    { text: "Your assignment 'Chapter 4' is due tomorrow.", time: "2 hours ago" },
    { text: "Final Chemistry test scheduled for 22 July.", time: "1 day ago" },
    { text: "Admin: Independence Day celebration on 15th Aug.", time: "3 days ago" },
  ];

  const studyMaterials = [
    { subject: "Mathematics", title: "Integration Notes.pdf", url: "https://example.com/integration-notes.pdf" },
    { subject: "Physics", title: "Laws of Motion.pptx", url: "https://example.com/laws-of-motion.pptx" },
    { subject: "Chemistry", title: "Periodic Table Video.mp4", url: "https://example.com/periodic-table-video.mp4" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Attendance Box */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-indigo-800 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4 border-b border-white/30 pb-3">
          <CalendarCheck2 size={24} className="text-white" />
          <h2 className="text-xl font-bold">Attendance Record</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm text-gray-200">Total Classes</p>
            <p className="text-2xl font-bold">48</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm text-gray-200">Present</p>
            <p className="text-2xl font-bold">44</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm text-gray-200">Attendance %</p>
            <p className="text-2xl font-bold">91.6%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications Box */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Notifications & Announcements</h2>
          </div>
          <ul className="space-y-3">
            {notifications.map((note, idx) => (
              <li key={idx} className="bg-gray-50 border p-3 rounded text-sm text-gray-800">
                <p>{note.text}</p>
                <span className="text-xs text-gray-400">{note.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Study Material Box */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Book size={20} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Study Materials</h2>
          </div>
          <ul className="space-y-3">
            {studyMaterials.map((item, idx) => (
              <li
                key={idx}
                className="border-l-4 pl-3 py-2 bg-gray-50 rounded text-sm flex justify-between items-center"
                style={{ borderColor: item.subject === "Mathematics" ? "#2563eb" : item.subject === "Physics" ? "#16a34a" : "#f59e0b" }}
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <span className="text-gray-500 text-xs">{item.subject}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 p-2 rounded"
                  >
                    <Eye size={16} className="text-blue-700" />
                  </a>
                  <a
                    href={item.url}
                    download
                    className="bg-green-100 hover:bg-green-200 p-2 rounded"
                  >
                    <Download size={16} className="text-green-700" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
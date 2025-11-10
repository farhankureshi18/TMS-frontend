import React, { useEffect, useState } from "react";
import { Send, Paperclip, Search } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const socket = io("https://tms-backend-hn7r.onrender.com");

export default function TutorContact() {
  const { userEmail } = useSelector((state) => state.user); // tutor email
  const [studentSearch, setStudentSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentMsg, setStudentMsg] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  // Fetch students + previous messages
  useEffect(() => {
    if (!userEmail) return;

    // Fetch all batches assigned to tutor to extract students
    axios
      .get(`https://tms-backend-hn7r.onrender.com/tutor/batches/${userEmail}`)
      .then((res) => {
        const uniqueStudents = [
          ...new Set(res.data.flatMap((batch) => batch.studentEmails)),
        ];
        setStudents(uniqueStudents);
      })
      .catch((err) => console.error("Error fetching batches:", err));
    })

    
    //get message & filtering as per user
   useEffect(() => {
  if (!userEmail) return;
  axios
    .get(`https://tms-backend-hn7r.onrender.com/admin/messages`)
    .then((res) => {
      if (res.data) {
        // Filter messages that belong to the logged-in user
        const filtered = res.data.filter(
          (msg) => msg.toEmail === userEmail || msg.fromEmail === userEmail
        );
        setMessages(filtered);
      }
    })
    .catch((err) => console.error("Error fetching messages:", err));
}, [userEmail]);


  // Join socket room
  useEffect(() => {
    if (userEmail) {
      socket.emit("join_room", userEmail);
    }
  }, [userEmail]);

  // Receive live messages
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (msg.toEmail === userEmail) {
        setMessages((prev) => [...prev, msg]);
        toast.info(`New message from ${msg.fromEmail}`);
      }
    });
    return () => socket.off("receive_message");
  }, [userEmail]);

  // Send message to student
  const handleSendStudent = async (studentEmail) => {
    if (!studentMsg.trim()) return toast.error("Enter message");
    const msgData = {
      fromEmail: userEmail,
      toEmail: studentEmail,
      role: "Tutor",
      content: studentMsg,
      timestamp: new Date().toLocaleString(),
    };

    try {
      await axios.post("https://tms-backend-hn7r.onrender.com/admin/message", msgData);
      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setStudentMsg("");
      toast.success("Message sent to student");
    } catch (err) {
      console.error(err);
      toast.error("Error sending message");
    }
  };

  // Send message to Admin
  const handleSendAdmin = async () => {
    if (!adminMsg.trim()) return toast.error("Enter message");
    const msgData = {
      fromEmail: userEmail,
      toEmail: "AdminTMS",
      role: "Tutor",
      content: adminMsg,
      timestamp: new Date().toLocaleString(),
    };

    try {
      await axios.post("https://tms-backend-hn7r.onrender.com/admin/message", msgData);
      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setAdminMsg("");
      toast.success("Message sent to Admin");
    } catch (err) {
      console.error(err);
      toast.error("Error sending message");
    }
  };

  const filteredStudents = students.filter((s) =>
    s.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* LEFT: Send Messages */}
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📩 Contact Panel</h2>

        {/* Message to Students */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="font-medium text-gray-700">Message to Students</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search student..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="max-h-20 overflow-y-auto text-sm text-gray-600">
            {filteredStudents.map((student, i) => (
              <p
                key={i}
                className="py-1 cursor-pointer hover:text-blue-600"
                onClick={() => handleSendStudent(student)}
              >
                {student}
              </p>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Write a message..."
            value={studentMsg}
            onChange={(e) => setStudentMsg(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
        </div>

        {/* Message to Admin */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Message to Admin</h3>
          <textarea
            rows="3"
            placeholder="Write a message to Admin..."
            value={adminMsg}
            onChange={(e) => setAdminMsg(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
          ></textarea>
          <button
            onClick={handleSendAdmin}
            className="w-full py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg"
          >
            Send Message
          </button>
        </div>
      </div>

      {/* RIGHT: Message History */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📨 Messages Received</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl shadow-sm ${
                msg.fromEmail === "AdminTMS"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : msg.role === "Student"
                  ? "bg-blue-50 border-l-4 border-blue-400"
                  : "bg-gray-50 border-l-4 border-gray-400"
              }`}
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{msg.fromEmail}:</span> {msg.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

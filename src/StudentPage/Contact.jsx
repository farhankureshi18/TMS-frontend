// import { useState } from "react";
// import { MessageCircle } from "lucide-react";

// const Contact = () => {
//   const [recipient, setRecipient] = useState("Tutor");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([
//     {
//       sender: "Dr. Sarah Johnson",
//       role: "Tutor",
//       time: "2 hours ago",
//       text: "Your assignment on quadratic equations looks great! Keep up the good work."
//     },
//     {
//       sender: "Admin",
//       role: "Admin",
//       time: "1 day ago",
//       text: "Your fee payment for July has been received. Thank you!"
//     }
//   ]);

//   const handleSend = () => {
//     if (!message.trim()) return;
//     const newMsg = {
//       sender: "You",
//       role: recipient,
//       time: "Just now",
//       text: message
//     };
//     setMessages([newMsg, ...messages]);
//     setMessage("");
//   };

//   return (
//     <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
//       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//         <MessageCircle size={20} /> Send Message
//       </h2>

//       {/* Recipient Selection */}
//       <div className="mb-4">
//         <label className="text-sm font-medium text-gray-700 mr-4">Send to:</label>
//         <label className="mr-4">
//           <input
//             type="radio"
//             value="Tutor"
//             checked={recipient === "Tutor"}
//             onChange={(e) => setRecipient(e.target.value)}
//             className="mr-1"
//           /> Tutor
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="Admin"
//             checked={recipient === "Admin"}
//             onChange={(e) => setRecipient(e.target.value)}
//             className="mr-1"
//           /> Admin
//         </label>
//       </div>

//       {/* Message Input */}
//       <textarea
//         rows={4}
//         placeholder={`Type your message to ${recipient.toLowerCase()}...`}
//         className="w-full border rounded-md p-2 text-sm mb-4 focus:outline-none focus:ring focus:ring-blue-200"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       ></textarea>

//       {/* Send Button */}
//       <button
//         onClick={handleSend}
//         className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md font-semibold"
//       >
//         Send Message
//       </button>

//       {/* Recent Messages */}
//       <div className="mt-6">
//         <h3 className="text-md font-semibold mb-2">Recent Messages</h3>
//         <div className="space-y-3">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className="bg-gray-50 border rounded-md p-3 text-sm text-gray-800"
//             >
//               <p className="font-medium text-blue-600">{msg.sender} <span className="text-gray-400 text-xs ml-2">{msg.time}</span></p>
//               <p className="mt-1">{msg.text}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;



import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const socket = io("http://localhost:2000");

export default function StudentContact() {
  const { userEmail } = useSelector((state) => state.user);
  const [recipient, setRecipient] = useState("Tutor");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userEmail) return;
    socket.emit("join_room", userEmail);
    axios
      .get("https://tms-backend-hn7r.onrender.com/admin/messages")
      .then((res) => {
        const filtered = res.data.filter(
          (msg) => msg.toEmail === userEmail || msg.fromEmail === userEmail
        );
        setMessages(filtered);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [userEmail]);

  // Receive new message
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (msg.toEmail === userEmail) {
        setMessages((prev) => [...prev, msg]);
        toast.info(`New message from ${msg.fromEmail}`);
      }
    });
    return () => socket.off("receive_message");
  }, [userEmail]);

  const handleSend = async () => {
    if (!message.trim()) return toast.error("Enter message");

    const toEmail = recipient === "Tutor" ? "tutor@example.com" : "AdminTMS"; // replace dynamically if needed
    const msgData = {
      fromEmail: userEmail,
      toEmail,
      role: "Student",
      content: message,
      timestamp: new Date().toLocaleString(),
    };

    try {
      await axios.post("https://tms-backend-hn7r.onrender.com/admin/message", msgData);
      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
      toast.success("Message sent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {/* LEFT: Send Message */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle size={20} /> Send Message
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mr-4">Send to:</label>
          <label className="mr-4">
            <input
              type="radio"
              value="Tutor"
              checked={recipient === "Tutor"}
              onChange={(e) => setRecipient(e.target.value)}
              className="mr-1"
            /> Tutor
          </label>
          <label>
            <input
              type="radio"
              value="Admin"
              checked={recipient === "Admin"}
              onChange={(e) => setRecipient(e.target.value)}
              className="mr-1"
            /> Admin
          </label>
        </div>

        <textarea
          rows={4}
          placeholder={`Type your message to ${recipient.toLowerCase()}...`}
          className="w-full border rounded-md p-2 text-sm mb-4 focus:outline-none focus:ring focus:ring-blue-200"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          onClick={handleSend}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md font-semibold"
        >
          Send Message
        </button>
      </div>

      {/* RIGHT: Received Messages */}
      <div>
        <h3 className="text-lg font-semibold mb-3">📨 Messages</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-md shadow-sm text-sm ${
                msg.fromEmail === "AdminTMS"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : msg.role === "Tutor"
                  ? "bg-blue-50 border-l-4 border-blue-400"
                  : "bg-gray-50 border-l-4 border-gray-400"
              }`}
            >
              <p className="font-semibold text-gray-800">
                {msg.fromEmail} <span className="text-xs text-gray-500 ml-2">{msg.timestamp}</span>
              </p>
              <p className="text-gray-700 mt-1">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";

const socket = io("https://tms-backend-hn7r.onrender.com");

export default function AdminMessagingPanel() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("Student");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [messageToUser, setMessageToUser] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [fetchedUser, setFetchedUser] = useState(null);
  const [fetchedBatch, setFetchedBatch] = useState(null); // <-- new state for batch info
  const [loading, setLoading] = useState(false);

  //display message in ui from localStorage
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("tutionUsers")) || [];
    setUsers(allUsers);

    const sentMessages = JSON.parse(localStorage.getItem("adminMessages")) || [];
    setMessages(sentMessages);
  }, []);

   useEffect(() => {
    // Admin joins their own room to send/receive messages
    socket.emit("join_room", "AdminTMS");
  }, []);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      toast.info(`New message from ${msg.fromEmail}`);
    });

    return () => socket.off("receive_message");
  }, []);

  const handleSend = async () => {
  if (!recipientEmail || !messageToUser)
    return toast.error("Fill recipient & message");

  const msgData = {
    fromEmail: "AdminTMS",
    toEmail: recipientEmail,
    role,
    content: messageToUser,
    timestamp: new Date().toLocaleString(),
  };

  try {
    // Save message to database via API
    await axios.post("https://tms-backend-hn7r.onrender.com/admin/message", msgData);

    // Send via Socket.IO for real-time
    socket.emit("send_message", msgData);

    // Update UI locally
    setMessages((prev) => [...prev, msgData]);
    setMessageToUser("");
    toast.success("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
  }
};

  const handleAnnounce = () => {
    if (!announcementMessage) {
      toast.error("Announcement message cannot be empty");
      return;
    }
    const announcement = {
      id: Date.now(),
      role: "All",
      to: "Everyone",
      content: announcementMessage,
      timestamp: new Date().toLocaleString()
    };
    const updatedMessages = [...messages, announcement];
    localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setAnnouncementMessage("");
    toast.success("Announcement sent to all users");
  };

  //  Fetch user + batch info by email
  const handleFetchUser = async () => {
    if (!searchEmail) {
      toast.error("Please enter an email to fetch details");
      return;
    }

    try {
      setLoading(true);

      // Fetch user
      const userRes = await axios.get(`https://tms-backend-hn7r.onrender.com/admin/user`, {
        params: { email: searchEmail },
      });
      setFetchedUser(userRes.data);

      // Fetch batch info
      const batchRes = await axios.get(`https://tms-backend-hn7r.onrender.com/admin/batches/${searchEmail}`);
      setFetchedBatch(batchRes.data);

      toast.success("User & batch details fetched successfully");
    } catch (err) {
      console.error("Error fetching user or batch:", err);
      setFetchedUser(null);
      setFetchedBatch(null);
      toast.error("User not found or error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">
        📨 Admin Messaging & Announcements
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left: Fetch User & Batch Details */}
        <div className="bg-gray-200 p-6 rounded-2xl shadow-xl border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🔍 Fetch User Details</h3>
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter user email"
            className="w-full p-3 border rounded-lg shadow-sm mb-4 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFetchUser}
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            {loading ? "Fetching..." : "Fetch Details"}
          </button>

          {fetchedUser && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-inner border border-gray-300">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">User Info:</h4>
              <p><strong>Name:</strong> {fetchedUser.fullName}</p>
              <p><strong>Email:</strong> {fetchedUser.email}</p>
              <p><strong>Role:</strong> {fetchedUser.role}</p>
              <p><strong>Phone:</strong> {fetchedUser.phoneNumber || "N/A"}</p>

              {fetchedUser.role === "Tutor" ? (
                <p><strong>Subjects:</strong> {fetchedUser.subjects?.join(", ") || "None"}</p>
              ) : (
                <>
                  <p>
                    <strong>School:</strong> {fetchedUser.standard} standard — {fetchedUser.schoolCollege}
                  </p>
                  <p><strong>Last Result:</strong> {fetchedUser.result}</p>
                </>
              )}

              {/* Display Batch Info */}
              {fetchedBatch && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Batch Info:</h4>
                  {fetchedBatch.length === 0 ? (
                    <p>No batches assigned</p>
                  ) : (
                    <ul className="list-disc list-inside">
                      {fetchedBatch.map((batch, idx) => (
                        <li key={idx}>
                          <strong>{batch.batchName}</strong> — Tutor: {batch.tutorName} — Students: {batch.students?.join(", ") || "None"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Middle: Compose Message */}
        <div className="bg-gray-200 p-6 rounded-2xl shadow-xl border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Compose Message</h3>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Enter recipient email"
            className="w-full p-3 border rounded-lg shadow-sm mb-4 focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={messageToUser}
            onChange={(e) => setMessageToUser(e.target.value)}
            rows={4}
            placeholder="Type your message here..."
            className="w-full p-3 border rounded-lg shadow-inner mb-4"
          />
          <button
            onClick={handleSend}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Send Message
          </button>
        </div>

        {/* Right: Announcements */}
        <div className="bg-gray-200 p-6 rounded-2xl shadow-xl border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-gray-800"> Make Announcement</h3>
          <textarea
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
            rows={6}
            placeholder="Enter announcement message for all users"
            className="w-full p-3 border rounded-lg shadow-inner mb-4"
          ></textarea>

          <button
            onClick={handleAnnounce}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Announce to Everyone
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="mt-12 bg-gray-200 p-6 rounded-2xl shadow-xl border border-gray-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📜 Message History</h3>
        {messages.length === 0 ? (
          <p className="text-gray-600">No messages sent yet.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg.id} className="border-b border-gray-300 pb-2">
                <p className="text-sm text-gray-700">
                  To <strong>{msg.to}</strong> ({msg.role}) at {msg.timestamp}
                </p>
                <p className="text-gray-800">{msg.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

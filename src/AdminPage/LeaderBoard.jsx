import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://tms-backend-hn7r.onrender.com/admin/cards"; 

const LeaderboardCardInput = () => {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    std: "",
    school: "",
    result: "",
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [savedNote, setSavedNote] = useState("");

  // Fetch all cards on page load
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add / Update Card
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, std, school, result } = formData;
    if (!name || !std || !school || !result) return;

    try {
      if (editId) {
        // Update API
        const res = await axios.put(`${API_URL}/${editId}`, formData);
        setCards(cards.map((c) => (c._id === editId ? res.data : c)));
        setEditId(null);
      } else {
        // Add API
        const res = await axios.post(API_URL, formData);
        setCards([...cards, res.data]);
      }
      setFormData({ photo: "", name: "", std: "", school: "", result: "" });
      setSnackbar(true);
      setTimeout(() => setSnackbar(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const handleEdit = (card) => {
    setFormData({
      photo: card.photo,
      name: card.name,
      std: card.std,
      school: card.school,
      result: card.result,
    });
    setEditId(card._id);
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCards(cards.filter((c) => c._id !== id));
      if (editId === id) {
        setEditId(null);
        setFormData({ photo: "", name: "", std: "", school: "", result: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Notes
  const handleSaveNote = () => setSavedNote(adminNote);
  const handleDeleteNote = () => {
    setAdminNote("");
    setSavedNote("");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        🏆 Leaderboard Section
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Add/Edit Form */}
        <div className="w-80 sm:w-96 bg-white shadow-xl rounded-2xl p-6 border border-gray-300">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
            {editId ? "✏️ Edit Student" : "Add Student"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 text-sm"
          >
            {["photo", "name", "std", "school", "result"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={
                  field === "std"
                    ? "Class"
                    : field === "result"
                    ? "Result (e.g., 92.3%)"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={formData[field]}
                onChange={handleChange}
                className="px-3 py-2 rounded-lg border border-blue-200 shadow-sm"
              />
            ))}

            <button
              type="submit"
              className="py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              {editId ? "Update" : " Submit"}
            </button>
          </form>

          {snackbar && (
            <div className="mt-3 text-green-600 text-sm text-center">
               {editId ? "Card Updated" : "Card Added"} Successfully!
            </div>
          )}
        </div>

        {/* Admin Notes */}
        <div className="w-80 sm:w-96 bg-white shadow-xl rounded-2xl p-6 border border-gray-300">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
             Admin Notes
          </h2>
          <textarea
            placeholder="Write notes here..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full h-36 p-3 rounded-lg border border-gray-300 text-sm resize-none shadow-inner"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleSaveNote}
              className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleDeleteNote}
              className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
          {savedNote && (
            <p className="mt-3 text-xs text-green-600 italic">
              ✅ Saved Note: "{savedNote}"
            </p>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {cards.map((card) => (
          <div
            key={card._id}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden w-72 mx-auto flex flex-col hover:scale-[1.02] transition-all duration-300"
          >
            {/* Image */}
            {card.photo && (
              <div className="w-full h-48 bg-gray-100">
                <img
                  src={card.photo}
                  alt="Student"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-blue-800">
                {card.name}
              </h3>
              <p className="text-sm mt-1">
                Class: <span className="font-medium">{card.std}</span>
              </p>
              <p className="text-sm">
                School: <span className="font-medium">{card.school}</span>
              </p>
              <p className="text-sm">
                Result: <span className="font-medium">{card.result}</span>
              </p>

              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => handleEdit(card)}
                  className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card._id)}
                  className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCardInput;

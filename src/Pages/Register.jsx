import React, { useState, useEffect } from 'react';

function MainRegister() {
  const [cards, setCards] = useState([]); 
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', pass: '', role: '',
    school: '', standard: '', result: '', address: '',
    subjects: '', experience: '', age: ''
  });

  const [showToast, setShowToast] = useState(false);

  // fetch cards from DB
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("https://tms-backend-hn7r.onrender.com/admin/cards");
        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };
    fetchCards();
  }, []);    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Construct payload based on role
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.pass,
        role: formData.role,
        address: formData.address
      };

      if (formData.role === "Student") {
        payload.schoolCollege = formData.school;
        payload.standard = formData.standard;
        payload.result = formData.result;
      } else if (formData.role === "Tutor") {
        payload.subjects = formData.subjects; // comma separated string
        payload.experience = formData.experience;
        payload.age = formData.age;
      }

      const res = await fetch("https://tms-backend-hn7r.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Reset form
        setFormData({
          name: '', email: '', phone: '', pass: '', role: '',
          school: '', standard: '', result: '', address: '',
          subjects: '', experience: '', age: ''
        });
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white flex justify-between items-center px-6 py-4 rounded-md mb-8">
        <div className="text-xl font-bold">Tuition Management</div>
        <div className="space-x-4">
          <span className="cursor-pointer hover:text-gray-300">Our Courses</span>
          <span className="cursor-pointer hover:text-gray-300">Reviews</span>
          <span className="cursor-pointer hover:text-gray-300">Contact Us</span>
        </div>
      </nav>

      {/* Page Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Form */}
        <div className="bg-gray-400 text-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Register Yourself
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-950">Full Name</label>
              <input type="text" name="name" required onChange={handleChange} value={formData.name} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
            </div>

            <div>
              <label className="block text-gray-950">Email</label>
              <input type="email" name="email" required onChange={handleChange} value={formData.email} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
            </div>

            <div>
              <label className="block text-gray-950">Phone Number</label>
              <input type="tel" name="phone" required pattern="[0-9]{10}" maxLength={10} onChange={handleChange} value={formData.phone} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
            </div>

            <div>
              <label className="block text-gray-950">Set Password</label>
              <input type="password" name="pass" required maxLength={10} minLength={4} onChange={handleChange} value={formData.pass} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
            </div>

            <div>
              <label className="block text-gray-950">Who are you?</label>
              <div className="flex gap-4 mt-1 text-gray-950">
                <label>
                  <input type="radio" name="role" value="Student" checked={formData.role === 'Student'} onChange={handleChange} /> Student
                </label>
                <label>
                  <input type="radio" name="role" value="Tutor" checked={formData.role === 'Tutor'} onChange={handleChange} /> Tutor
                </label>
              </div>
            </div>

            {/* Conditional Fields */}
            {formData.role === 'Student' && (
              <>
                <label className="block text-gray-950">School/College</label>
                <input type="text" name="school" onChange={handleChange} value={formData.school} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
                <label className="block text-gray-950">Standard</label>
                <input type="text" name="standard" onChange={handleChange} value={formData.standard} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
                <label className="block text-gray-950">Result (%)</label>
                <input type="number" name="result" required onChange={handleChange} value={formData.result} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
                <label className="block text-gray-950">Address</label>
                <input type="text" name="address" onChange={handleChange} value={formData.address} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
              </>
            )}

            {formData.role === 'Tutor' && (
              <>
                <label className="block text-gray-950">Subjects</label>
                <input type="text" name="subjects" onChange={handleChange} value={formData.subjects} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
                <label className="block text-gray-950">Experience</label>
                <input type="text" name="experience" onChange={handleChange} value={formData.experience} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
                <label className="block text-gray-950">Age</label>
                <input type="number" name="age" onChange={handleChange} value={formData.age} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
                <label className="block text-gray-950">Address</label>
                <input type="text" name="address" onChange={handleChange} value={formData.address} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-950" />
              </>
            )}

            <button type="submit" className="w-full bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded-md">
              Request
            </button>

            <div className="mt-6 text-center text-sm text-gray-800">
              Already Registered?
              <a href="/login" className="text-blue-700 font-medium hover:underline ml-1">
                Login
              </a>
            </div>
          </form>

          {showToast && (
            <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
              Request Sent Successfully!
            </div>
          )}
        </div>

        {/* Leaderboard Cards */}
        <div className="bg-slate-100 py-8 px-4 rounded-lg shadow-inner">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🏆 2024 Toppers</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cards.length === 0 ? (
              <p className="text-gray-500 italic text-center col-span-full">No topper data available yet.</p>
            ) : (
              cards.map((card) => (
                <div key={card._id} className="bg-gray-800 text-white rounded-xl shadow-md p-4 text-center hover:scale-[1.03] transition">
                  <img src={card.photo} alt="Student" className="w-full h-40 object-contain rounded-md mb-4 bg-gray-100" />
                  <div className="text-sm leading-6">
                    <p><strong>Name:</strong> {card.name}</p>
                    <p><strong>Std:</strong> {card.std}</p>
                    <p><strong>School:</strong> {card.school}</p>
                    <p><strong>Result:</strong> {card.result}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainRegister;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-700 shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div
        className="text-2xl font-extrabold text-blue-600 cursor-pointer hover:text-blue-800 "
        onClick={() => navigate("/")}
      >
        TMS
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center px-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search student or tutor by name..."
          className="w-full max-w-xl px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
      <button
        onClick={() => alert("Courses Clicked")} // You can navigate or open modal here
        className="bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition"
        >
        Courses
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded text-center hover:bg-red-600 transition"
        >
         <MdLogout size={20} className="inline-block"  />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;



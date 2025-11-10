import React, { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SnackBar from "../Components/StudLogSnack";

const StudNavbar = ({ active, setActive }) => {
  const navItems = ["Dashboard", "Assignments", "Contact", "Profile"];
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    setShowSnackBar(false);
    navigate("/");
  };

  return (
    <>
      {/* Navbar Container */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-lg px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">TMS Student</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-150 ${
                active === item
                  ? "bg-white text-indigo-600"
                  : "hover:bg-white/20"
              }`}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => setShowSnackBar(true)}
            className="flex items-center gap-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition duration-150"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-600 text-white px-4 py-3 rounded-md shadow-md mt-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                active === item
                  ? "bg-white text-indigo-600"
                  : "hover:bg-white/20"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            onClick={() => {
              setShowSnackBar(true);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md mt-2 w-full justify-center"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      )}

      {/* SnackBar */}
      {showSnackBar && (
        <SnackBar
          message="Are you sure you want to logout?"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowSnackBar(false)}
        />
      )}
    </>
  );
};

export default StudNavbar;

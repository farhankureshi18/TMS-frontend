import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import SnackBar from "../Components/SnackBar";

import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const roles = ["Admin", "Student", "Tutor"];

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [snackBar, setSnackBar] = useState({ message: "", type: "" });

  const showSnackBar = (message, type) => {
    setSnackBar({ message, type });
    setTimeout(() => setSnackBar({ message: "", type: "" }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      showSnackBar("Please select a role", "error");
      return;
    }

    // Admin Login
    if (
      selectedRole === "Admin" &&
      emailOrPhone.trim() === "AdminTMS" &&
      password === "farhanTMS"
    ) {
      localStorage.setItem("isAdminAuthenticated", "true");
      localStorage.setItem("userEmail", "admin@tms.com");
      showSnackBar("Admin Login Successful ", "success");
      setTimeout(() => navigate("/Admin"), 1000);
      return;
    }

    //  Student / Tutor Login using backend API
    try {
      const res = await fetch("https://tms-backend-hn7r.onrender.com/auth/login", {   //login api
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          emailOrPhone: emailOrPhone.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showSnackBar(data.msg || "Login failed ", "error");
        return;
      }

      // Save user in Redux
      dispatch(
        setUser({
          fullName: data.user.fullName,
          userEmail: data.user.email,
          role: data.user.role,
          _id: data.user._id,
        })
      );  

      //  Save JWT in localStorage
      localStorage.setItem("token", data.token);
      // console.log(data.token);
      const token = localStorage.getItem("token");
      //jwt verify api

      const jwtverify = await fetch(`https://tms-backend-hn7r.onrender.com/auth/${data.user.role.toLowerCase()}Panel`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,   // send JWT here
          "Content-Type": "application/json",
        },
      });

      const verifyData = await jwtverify.json();

    if (!jwtverify.ok) {
      showSnackBar(verifyData.msg || "Not authorized", "error");
      return;
    }
      showSnackBar(`Welcome, ${data.user.fullName} 👋`, "success");

      //  Redirect based on role
      setTimeout(() => {
        if (data.user.role === "Student") navigate("/studentPanel");
        else if (data.user.role === "Tutor") navigate("/tutorPanel");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      showSnackBar("Session expired. Please login again", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-gray-400 shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Choose Account Type
        </h2>

        {/*Role Selection */}
        <div className="flex justify-between gap-3">
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex-1 cursor-pointer border rounded-2xl p-4 text-center transition-all duration-200 ${
                selectedRole === role
                  ? "border-gray-800 text-white bg-gray-800 scale-105"
                  : "border-gray-300 text-gray-600 hover:shadow-md"
              }`}
            >
              {role}
            </div>
          ))}
        </div>

        {selectedRole && (
          <p className="text-center">
            Hello <strong>{selectedRole.toLowerCase()}</strong>, please log in:
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            className="w-full px-4 py-2 border rounded-xl"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-800 text-white py-2 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>

        {/* ✅ Google OAuth (Future Implementation) */}
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <hr className="w-full" />
          or
          <hr className="w-full" />
        </div>

        <button className="flex items-center justify-center w-full gap-3 border py-2 rounded-xl hover:bg-gray-100">
          <FcGoogle size={22} />
          <span className="text-sm text-gray-700 font-medium">
            Login with Google
          </span>
        </button>

        {/* ✅ Signup Redirect */}
        <p className="text-center text-sm text-gray-500">
          No account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Signup
          </button>
        </p>
      </div>

      {snackBar.message && (
        <SnackBar message={snackBar.message} type={snackBar.type} />
      )}
    </div>
  );
};

export default LoginForm;

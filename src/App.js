import React from 'react';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Admin from './AdminPage/Admin';
import StudentPanel from './StudentPage/StudentPanel';
import TutorPanel from './TutorPage/TutorPanel';
import { CardProvider } from './Context/CardContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <CardProvider>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/studentPanel" element={<StudentPanel />} />
            <Route path="/tutorPanel" element={<TutorPanel />} />
          </Routes>
        </CardProvider>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Jobs from "./pages/Jobs";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const CandidateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/login" />;
  if (user.role === "recruiter") return <Navigate to="/jobs" />;
  return children;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Only Routes */}
        <Route path="/" element={
          <CandidateRoute>
            <Navbar />
            <Dashboard />
          </CandidateRoute>
        } />
        <Route path="/upload" element={
          <CandidateRoute>
            <Navbar />
            <Upload />
          </CandidateRoute>
        } />

        {/* Shared Route */}
        <Route path="/jobs" element={
          <PrivateRoute>
            <Navbar />
            <Jobs />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
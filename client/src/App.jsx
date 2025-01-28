import React from "react";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { FaRegSadTear } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register"; 
import Login from "./Login";
import Todos from "./Todo"; 

const App = () => {
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Only accessible if user is logged in */}
          <Route
            path="/todos"
            element={isAuthenticated() ? <Todos /> : <Login />}
          />
          
          {/* Redirect to login if no valid route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

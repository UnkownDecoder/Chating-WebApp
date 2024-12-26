import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Body from "./Components/Body"; // Home Page
import Login from "./pages/Login"; // Login Page
import Register from "./pages/Register"; // Register Page
import Footer from "./Components/Footer"; // Footer Component

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;



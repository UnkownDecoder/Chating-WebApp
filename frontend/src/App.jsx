import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Body from "./Components/Body";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import About from "./pages/About"; 
import Footer from "./Components/Footer";
import Features from "./pages/Features"; 

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/features" element={<Features />} /> 
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

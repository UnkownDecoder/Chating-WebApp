import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Body from "./Components/Body";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import About from "./pages/About"; 
import Footer from "./Components/Footer";
import Features from "./pages/Features";
import ForgetPass from "./Components/ForgetPassword";
import Chat from "./Components/chat"; // Chat component import

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

const AppLayout = () => {
  const location = useLocation(); // Get current route location

  // Define routes where Header and Footer should not be shown
  const noHeaderFooterRoutes = ["/chat"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Conditionally render Header and Footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <Header />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />
          <Route path="/forgot-password" element={<ForgetPass />} />
          <Route path="/chat" element={<Chat />} /> {/* Chat page route */}
        </Routes>
      </div>

      {/* Conditionally render Footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default App;


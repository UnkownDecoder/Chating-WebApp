import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Body from "./Components/Body";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Reviews from "./pages/Reviews"; 
import Footer from "./Components/Footer";
import Features from "./pages/Features";
import ForgetPass from "./Components/ForgetPassword";
import Chat from "./Components/chat"; 
import Settings from "./Components/Settings";
import Developers from "./pages/Developers";
import AdminDashboard from "./pages/AdminDashboard";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { theme } = useThemeStore();
  return (
    <div data-theme={theme}>
      <AppLayout />
    </div>
  );
};

const AppLayout = () => {
  const location = useLocation();

  // Define routes where Header and Footer should not be shown
  const noHeaderFooterRoutes = ["/settings", "/chat",];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
     {/* Global Toaster for Notifications */}
     <Toaster position="top-center" reverseOrder={false} />
      {/* Conditionally render Header */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <Header />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />
          <Route path="/forgot-password" element={<ForgetPass />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/developers" element={<Developers />} /> 
          <Route path="/admin" element={<AdminDashboard />} /> 
        </Routes>
      </div>

      {/* Conditionally render Footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default App;

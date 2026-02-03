import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// AEGIS Core Components
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Legacy Components (To be Upgraded)
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import OfficerDashboard from "./components/OfficerDashboard";
import CitizenDashboard from "./components/CitizenDashboard";
import AlertsPage from "./components/AlertsPage";
import RescueTasks from "./components/RescueTasks";
import BoardAdmin from "./components/BoardAdmin";
import Profile from "./components/Profile";

import AuthService from "./services/auth.service";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user || undefined);
    };

    updateUser();
    window.addEventListener('storage', updateUser);
    window.addEventListener('authChange', updateUser);

    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('authChange', updateUser);
    };
  }, []);

  return (
    <RouterWrapping>
      <Routes>
        {/* Public Routes (Wrapped in Layout internally or here) */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        {/* Authenticated Routes - Standalone Dashboards (No Global Layout) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

        {/* Other Authenticated Routes (Wrapped in Layout) */}
        <Route path="/alerts" element={<Layout><AlertsPage /></Layout>} />
        <Route path="/rescue-tasks" element={<Layout><RescueTasks /></Layout>} />
        <Route path="/admin" element={<Layout><BoardAdmin /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
      </Routes>
    </RouterWrapping>
  );
}

// Helper to avoid nesting issues if Router is already in index.js
const RouterWrapping = ({ children }) => <>{children}</>;

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HazardListPage from './pages/HazardListPage';
import HazardDetailPage from './pages/HazardDetailPage';
import ReportHazardPage from './pages/ReportHazardPage';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import useAuthStore from './store/authStore';

function App() {
  const { setUser } = useAuthStore();
  
  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/hazards" element={<HazardListPage />} />
        <Route path="/hazards/:id" element={<HazardDetailPage />} />
        <Route path="/report" element={<ReportHazardPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
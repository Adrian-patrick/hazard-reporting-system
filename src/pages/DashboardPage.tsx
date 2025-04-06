import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import HazardMap from '../components/dashboard/HazardMap';
import Chatbot from '../components/ui/Chatbot'; // ✅ Import Chatbot
import useAuthStore from '../store/authStore';
import useHazardStore from '../store/hazardStore';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { fetchHazards } = useHazardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => navigate('/login'), 100); // 🚀 Prevents rapid redirects
      return;
    }

    fetchHazards(); // Ensure fetchHazards is memoized in the store
  }, [isAuthenticated, navigate, fetchHazards]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            
            <Button variant="primary" onClick={() => navigate('/report')}>
              <Plus className="h-5 w-5 mr-2" />
              Report Hazard
            </Button>
          </div>
          
          <div className="space-y-8">
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivity />
              <HazardMap />
            </div>

            {/* 🧠 Chatbot Widget */}
            <Chatbot />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;

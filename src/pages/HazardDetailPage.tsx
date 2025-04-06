import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HazardDetail from '../components/hazards/HazardDetail';
import useAuthStore from '../store/authStore';
import useHazardStore from '../store/hazardStore';

const HazardDetailPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchHazards } = useHazardStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => navigate('/login'), 100);
      return;
    }

    fetchHazards()
      .finally(() => setLoading(false)); // Ensure loading state updates
  }, [isAuthenticated, navigate, fetchHazards]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading hazard details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HazardDetail />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HazardDetailPage;

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HazardDetail from '../components/hazards/HazardDetail';
import useAuthStore from '../store/authStore';
import useHazardStore from '../store/hazardStore';

const HazardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { fetchHazards } = useHazardStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    fetchHazards();
  }, [isAuthenticated, navigate, fetchHazards]);
  
  if (!isAuthenticated) {
    return null;
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
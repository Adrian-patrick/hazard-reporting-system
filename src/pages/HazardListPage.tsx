import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import HazardList from '../components/hazards/HazardList';
import useAuthStore from '../store/authStore';

const HazardListPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hazard Reports</h1>
              <p className="text-gray-600">
                View and manage all reported hazards
              </p>
            </div>
            
            <Button
              variant="primary"
              onClick={() => navigate('/report')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Report Hazard
            </Button>
          </div>
          
          <HazardList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HazardListPage;
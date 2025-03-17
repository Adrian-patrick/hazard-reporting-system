import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import HazardForm from '../components/hazards/HazardForm';
import useAuthStore from '../store/authStore';

const ReportHazardPage: React.FC = () => {
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Report a Hazard</h1>
            <p className="text-gray-600">
              Provide details about the hazard you've encountered
            </p>
          </div>
          
          <Card>
            <HazardForm />
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportHazardPage;
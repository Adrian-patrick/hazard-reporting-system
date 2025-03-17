import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Shield, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Report Hazards, Keep Your Community Safe
                </h1>
                <p className="mt-6 text-xl text-blue-100">
                  HazardAlert is a community-driven platform that helps identify, track, and resolve hazards in your area.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-blue-700"
                    onClick={() => navigate('/map')}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    View Hazard Map
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                  alt="Community safety" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform connects community members with local authorities to quickly identify and resolve hazards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Report Hazards</h3>
                <p className="text-gray-600">
                  Quickly report hazards in your community with our easy-to-use form. Add photos and pinpoint the exact location on a map.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Authority Response</h3>
                <p className="text-gray-600">
                  Local authorities receive real-time notifications and can update the status as they work to resolve the issue.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Community Awareness</h3>
                <p className="text-gray-600">
                  Stay informed about hazards in your area through our interactive map and receive updates on reported issues.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/about')}
              >
                Learn More About Our Platform
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 lg:px-16 lg:py-14">
                  <h2 className="text-3xl font-bold text-white">
                    Ready to make your community safer?
                  </h2>
                  <p className="mt-4 text-lg text-blue-100">
                    Join thousands of community members and local authorities who are working together to identify and resolve hazards.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50"
                      onClick={() => navigate('/register')}
                    >
                      Sign Up Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-blue-800"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Community collaboration"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
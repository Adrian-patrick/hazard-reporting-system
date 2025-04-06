import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Shield, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EmergencyChatbot from '../components/layout/Emergency Chatbot';
import img from './Collaboration.jpg';
import img1 from './pot.jpg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Report Hazards, Keep Your Community Safe
                </h1>
                <p className="mt-6 text-xl text-purple-100">
                  HazardAlert is a community-driven platform that helps identify, track, and resolve hazards in your area.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-purple-700"
                    onClick={() => navigate('/map')}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    View Hazard Map
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src={img1}
                  className="rounded-3xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Emergency Information Banner */}
        <section className="bg-red-50 border-y border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <p className="text-gray-800">
                  <span className="font-medium">Need immediate assistance?</span> Use our emergency chatbot for guidance during hazardous situations.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => document.getElementById('emergency-contacts').scrollIntoView({ behavior: 'smooth' })}
              >
                Emergency Contacts
              </Button>
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
              <div className="bg-purple-50 rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Report Hazards</h3>
                <p className="text-gray-600">
                  Quickly report hazards in your community with our easy-to-use form. Add photos and pinpoint the exact location on a map.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Authority Response</h3>
                <p className="text-gray-600">
                  Local authorities receive real-time notifications and can update the status as they work to resolve the issue.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
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
        
        {/* Emergency Contacts Section */}
        <section id="emergency-contacts" className="bg-red-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
                <h3 className="font-medium text-lg text-red-700 mb-2">General Emergency</h3>
                <p className="text-2xl font-bold mb-2">112</p>
                <p className="text-gray-600">For life-threatening emergencies</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
                <h3 className="font-medium text-lg text-red-700 mb-2">Non-Emergency Police</h3>
                <p className="text-2xl font-bold mb-2">1078</p>
                <p className="text-gray-600">For situations that don't require immediate response</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
                <h3 className="font-medium text-lg text-red-700 mb-2">Utility Emergencies</h3>
                <p className="text-2xl font-bold mb-2">101</p>
                <p className="text-gray-600">Gas leaks, power outages, and water main breaks</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-purple-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 lg:px-16 lg:py-14">
                  <h2 className="text-3xl font-bold text-white">
                    Ready to make your community safer?
                  </h2>
                  <p className="mt-4 text-lg text-purple-100">
                    Join thousands of community members and local authorities who are working together to identify and resolve hazards.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-purple-50"
                      onClick={() => navigate('/register')}
                    >
                      Sign Up Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-purple-800"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <img
                    src={img}
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
      
      {/* Emergency Chatbot */}
      <EmergencyChatbot />
    </div>
  );
};

export default HomePage;
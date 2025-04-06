import React from 'react';
import { MapPin, AlertTriangle, Shield, Users, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold">About HazardAlert</h1>
            <p className="mt-4 text-xl text-purple-100 max-w-3xl mx-auto">
              A community-driven platform connecting residents and authorities to identify and resolve hazards efficiently.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                <p className="mt-4 text-lg text-gray-600">
                  At HazardAlert, we believe that community safety is a shared responsibility. Our mission is to empower residents and local authorities with the tools they need to quickly identify, report, and resolve hazards in their communities.
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  By creating a transparent and collaborative platform, we aim to reduce response times, increase accountability, and ultimately create safer neighborhoods for everyone.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Community collaboration" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How HazardAlert Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform streamlines the process of reporting and resolving community hazards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">1. Report</h3>
                <p className="text-gray-600">
                  Community members report hazards through our user-friendly form, adding details, photos, and precise location.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">2. Locate</h3>
                <p className="text-gray-600">
                  Reports appear on our interactive map, allowing everyone to see hazard locations and details in real-time.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">3. Respond</h3>
                <p className="text-gray-600">
                  Local authorities receive notifications, assess the situation, and update the status as they work on resolution.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">4. Resolve</h3>
                <p className="text-gray-600">
                  Once resolved, authorities update the status and provide resolution details, keeping the community informed.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Benefits for Everyone</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform provides unique advantages for both community members and local authorities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-purple-50 rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">For Community Members</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Easy-to-use reporting system for quick hazard documentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Real-time updates on the status of reported hazards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Interactive map to view hazards in your neighborhood</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Increased transparency in the resolution process</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Ability to track the history of your reported hazards</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">For Local Authorities</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Centralized dashboard to manage all reported hazards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Efficient prioritization based on severity and location</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Improved resource allocation and response planning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Direct communication channel with community members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Data-driven insights to prevent future hazards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
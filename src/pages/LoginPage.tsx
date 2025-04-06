import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {/* Icon with accessibility support */}
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-red-600" aria-label="Warning icon" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900" role="heading">
              Sign in to your account
            </h2>
            
            <p className="mt-2 text-sm text-gray-700">
              Or{' '}
              <Link 
                to="/register" 
                className="font-medium text-purple-700 hover:text-purple-500 transition-colors duration-200"
              >
                create a new account
              </Link>
            </p>
          </div>
          
          <div className="bg-white py-8 px-6 sm:px-10 shadow-md rounded-lg">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;

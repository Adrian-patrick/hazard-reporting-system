import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useHazardStore from '../../store/hazardStore';
import useAuthStore from '../../store/authStore';
import MapView from './MapView';

const HazardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ✅ Get hazard ID from URL
  console.log(id)
  const navigate = useNavigate();
  const { getHazardById } = useHazardStore(); // 🔹 Removed unused updateHazardStatus
  const { user } = useAuthStore();

  const hazard = id ? getHazardById(id) : undefined;

  if (!hazard) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Hazard not found</h2>
        <p className="text-gray-500 mt-2">The hazard you're looking for doesn't exist or has been removed.</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{hazard.title}</h1>

      <Card>
        <h3 className="text-lg font-medium">Description</h3>
        <p className="text-gray-700">{hazard.description}</p>
      </Card>

      <Card>
        <h3 className="text-lg font-medium">Location</h3>
        <div className="flex items-center text-gray-700 mb-3">
          <MapPin className="h-5 w-5 text-gray-500 mr-2" />
          {hazard.location.address}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
          <MapView 
            latitude={hazard.location.latitude} 
            longitude={hazard.location.longitude} 
            zoom={15}
            markers={[{
              position: [hazard.location.latitude, hazard.location.longitude],
              title: hazard.title
            }]}
          />
        </div>
      </Card>

      <Button variant="outline" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default HazardDetail;

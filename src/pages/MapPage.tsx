import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import useHazardStore from '../store/hazardStore';
import useAuthStore from '../store/authStore';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage: React.FC = () => {
  const { hazards, fetchHazards } = useHazardStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to New York
  
  useEffect(() => {
    fetchHazards();
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // If geolocation fails, calculate center based on hazards
          if (hazards.length > 0) {
            const latSum = hazards.reduce((sum, hazard) => sum + hazard.location.latitude, 0);
            const lngSum = hazards.reduce((sum, hazard) => sum + hazard.location.longitude, 0);
            setMapCenter([latSum / hazards.length, lngSum / hazards.length]);
          }
        }
      );
    }
  }, [fetchHazards]);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'reported':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-blue-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Hazard Map</h1>
                <p className="text-blue-100">
                  View all reported hazards in your area
                </p>
              </div>
              
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  className="mt-4 md:mt-0 bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/report')}
                >
                  Report a Hazard
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="mt-4 md:mt-0 bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/login')}
                >
                  Sign in to Report
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-64px-80px-72px)]">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {hazards.map((hazard) => (
              <Marker 
                key={hazard.id} 
                position={[hazard.location.latitude, hazard.location.longitude]}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-medium">{hazard.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{hazard.location.address}</p>
                    <div className="mt-2">
                      <Badge variant={getStatusVariant(hazard.status)} size="sm">
                        {hazard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    {isAuthenticated ? (
                      <button
                        onClick={() => navigate(`/hazards/${hazard.id}`)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Sign in to view details
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
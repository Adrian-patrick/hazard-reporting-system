import React, { useEffect, useState, useCallback } from 'react';
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

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Default coordinates (Bangalore)
const DEFAULT_LOCATION: [number, number] = [12.91502302112966, 77.6535301548953];

const MapPage: React.FC = () => {
  const { hazards, fetchHazards } = useHazardStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_LOCATION);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  const loadHazards = useCallback(() => {
    fetchHazards();
  }, [fetchHazards]);

  useEffect(() => {
    loadHazards();
  }, [loadHazards]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      // If geolocation not supported, use default location
      setUserLocation(DEFAULT_LOCATION);
      setMapCenter(DEFAULT_LOCATION);
      setLocationPermission(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: [number, number] = [
          position.coords.latitude, 
          position.coords.longitude
        ];
        
        setUserLocation(location);
        setMapCenter(location);
        setLocationPermission(true);
      },
      (error) => {
        console.error("Location error:", error);
        // Fall back to default location if permission denied or error occurs
        setUserLocation(DEFAULT_LOCATION);
        setMapCenter(DEFAULT_LOCATION);
        setLocationPermission(true);
        // alert("Unable to retrieve location. Using default location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

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
        <div className="bg-purple-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Hazard Map</h1>
                <p className="text-purple-100">View all reported hazards in your area</p>
              </div>
              
              <Button
                variant="outline"
                className="mt-4 md:mt-0 bg-white text-purple-700 hover:bg-purple-50 cursor-pointer"
                onClick={() => navigate(isAuthenticated ? '/report' : '/login')}
              >
                {isAuthenticated ? 'Report a Hazard' : 'Sign in to Report'}
              </Button>
            </div>
          </div>  
        </div>
        
        {!locationPermission ? (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
            <h2 className="text-xl mb-4">Allow Location Access</h2>
            <p className="mb-4 text-center">
              To view hazards near you, please grant location permission.
            </p>
            <Button 
              variant="primary" 
              onClick={requestLocation}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Grant Location Access
            </Button>
          </div>
        ) : (
          <div className="h-[calc(100vh-64px-80px-72px)]">
            <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {mapCenter && (
                <Marker 
                  position={mapCenter} 
                  icon={L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: blue; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                  })}
                >
                  <Popup>Current Location</Popup>
                </Marker>
              )}
              
              {hazards?.map((hazard) => (
                <Marker key={hazard.id} position={[hazard.location.latitude, hazard.location.longitude]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-medium">{hazard.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{hazard.location.address}</p>
                      <div className="mt-2">
                        <Badge variant={getStatusVariant(hazard.status)} size="sm">
                          {hazard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      <button
                        onClick={() => navigate(isAuthenticated ? `/hazards/${hazard?.id}` : '/login')}
                        className="mt-3 text-sm text-purple-600 hover:text-purple-800 cursor-pointer"
                      >
                        {isAuthenticated ? 'View Details' : 'Sign in to view details'}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
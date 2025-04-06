import React, { useState, useEffect, useCallback } from 'react';
import useHazardStore from '../../store/hazardStore';

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Status color mapping
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'reported': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'dismissed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Hazard {
  _id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location: Location;
}

const HazardMap: React.FC = () => {
  const { hazards, fetchHazards } = useHazardStore(); // Zustand store
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyHazards, setNearbyHazards] = useState<Hazard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const MAX_DISTANCE = 10; // Distance threshold in km

  // Fetch hazards
  const loadHazards = useCallback(() => {
    fetchHazards();
  }, [fetchHazards]);

  useEffect(() => {
    loadHazards();
  }, [loadHazards]);

  useEffect(() => {
    console.log('Fetched Hazards:', hazards);
  }, [hazards]);

  // Get user location
  useEffect(() => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Current Location',
          };
          setUserLocation(location);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      console.error('Geolocation not supported.');
      setIsLoading(false);
    }
  }, []);

  // Filter hazards based on distance
  useEffect(() => {
    if (userLocation && hazards.length > 0) {
      const filteredHazards = hazards.filter((hazard) => {
        if (!hazard.location?.latitude || !hazard.location?.longitude) return false;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hazard.location.latitude,
          hazard.location.longitude
        );
        return distance <= MAX_DISTANCE;
      });

      console.log('Filtered Hazards:', filteredHazards);
      setNearbyHazards(filteredHazards);
    } else {
      setNearbyHazards([]);
    }
  }, [userLocation, hazards]);

  return (
    <div className="hazard-map-container">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {userLocation ? `Hazards within ${MAX_DISTANCE} km` : 'Hazard Map'}
      </h3>

      {isLoading ? (
        <div className="text-center text-gray-600 p-4">Loading location and hazards...</div>
      ) : (
        <>
          {userLocation && (
            <div className="user-location mb-4 p-2 bg-blue-50 rounded">
              <p className="text-sm">
                Your Location: Lat {userLocation.latitude.toFixed(4)}, Lon {userLocation.longitude.toFixed(4)}
              </p>
            </div>
          )}

          <div className="hazards-list space-y-4">
            {nearbyHazards.length === 0 ? (
              <div className="text-center text-gray-600 p-4">
                {userLocation ? `No hazards found within ${MAX_DISTANCE} km.` : 'No hazards available.'}
              </div>
            ) : (
              nearbyHazards.map((hazard) => (
                <div key={hazard._id} className="hazard-card border rounded p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{hazard.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(hazard.status)}`}>
                      {hazard.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{hazard.location?.address || 'No address'}</p>
                  <div className="text-sm">
                    <strong>Type:</strong> {hazard.type}
                    <span className="ml-4">
                      <strong>Severity:</strong> {hazard.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HazardMap;

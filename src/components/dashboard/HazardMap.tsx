import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import useHazardStore from '../../store/hazardStore';

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

const HazardMap: React.FC = () => {
  const { hazards, fetchHazards } = useHazardStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchHazards();
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
  
  // Calculate center of the map based on hazard locations
  const calculateMapCenter = () => {
    if (hazards.length === 0) {
      return [40.7128, -74.0060]; // Default to New York
    }
    
    const latSum = hazards.reduce((sum, hazard) => sum + hazard.location.latitude, 0);
    const lngSum = hazards.reduce((sum, hazard) => sum + hazard.location.longitude, 0);
    
    return [latSum / hazards.length, lngSum / hazards.length] as [number, number];
  };
  
  return (
    <Card className="overflow-hidden">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Hazard Map</h3>
      <div className="h-96 -mx-6 -mb-6">
        <MapContainer
          center={calculateMapCenter()}
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
                  <button
                    onClick={() => navigate(`/hazards/${hazard.id}`)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default HazardMap;
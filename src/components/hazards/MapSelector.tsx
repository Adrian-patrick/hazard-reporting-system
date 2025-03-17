import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

const LocationMarker: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}> = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);
  
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (!position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          map.flyTo([latitude, longitude], 13);
        },
        () => {
          // Default position if geolocation fails
          setPosition([40.7128, -74.0060]); // New York
          map.flyTo([40.7128, -74.0060], 13);
        }
      );
    }
  }, [map, position]);

  return position ? <Marker position={position} /> : null;
};

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect, initialPosition }) => {
  return (
    <MapContainer
      center={initialPosition || [40.7128, -74.0060]} // Default to New York if no initial position
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} initialPosition={initialPosition} />
    </MapContainer>
  );
};

export default MapSelector;
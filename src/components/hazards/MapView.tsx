import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface MapMarker {
  position: [number, number];
  title: string;
  description?: string;
}

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: MapMarker[];
}

const MapView: React.FC<MapViewProps> = ({ 
  latitude, 
  longitude, 
  zoom = 13,
  markers = []
}) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.length > 0 ? (
        markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            {(marker.title || marker.description) && (
              <Popup>
                {marker.title && <strong>{marker.title}</strong>}
                {marker.description && <p>{marker.description}</p>}
              </Popup>
            )}
          </Marker>
        ))
      ) : (
        <Marker position={[latitude, longitude]} />
      )}
    </MapContainer>
  );
};

export default MapView;
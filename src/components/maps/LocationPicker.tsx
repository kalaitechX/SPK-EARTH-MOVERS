import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { customIcons } from './MapView';

interface LocationPickerProps {
  defaultLat?: number;
  defaultLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker = ({ position, setPosition }: any) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcons.farmer} />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ defaultLat, defaultLng, onLocationSelect }) => {
  const defaultCenter = { lat: defaultLat || 11.1085, lng: defaultLng || 77.3411 }; // Default to some central location (e.g. Tiruppur)
  const [position, setPosition] = useState<any>(
    defaultLat && defaultLng ? { lat: defaultLat, lng: defaultLng } : null
  );
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (position) {
      onLocationSelect(position.lat, position.lng);
    }
  }, [position]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    setErrorMsg('');
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        setIsLocating(false);
        if (mapRef.current) {
          mapRef.current.setView(newPos, 15);
        }
      },
      () => {
        setIsLocating(false);
        setErrorMsg('Location permission was not granted. You can enter the work address manually or pick on the map.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="font-bold text-gray-900">Select Work Location on Map (Optional)</h3>
        <button 
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-100 transition-colors"
        >
          <Navigation size={18} className={isLocating ? 'animate-pulse' : ''} />
          <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
        </button>
      </div>
      
      {errorMsg && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div className="h-64 w-full rounded-2xl overflow-hidden border-2 border-gray-100" style={{ zIndex: 1 }}>
        <MapContainer 
          center={position || defaultCenter} 
          zoom={position ? 15 : 8} 
          scrollWheelZoom={false}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {position && (
        <div className="bg-green-50 p-3 rounded-xl flex items-center space-x-2 text-green-800 text-sm font-bold">
          <MapPin size={16} />
          <span>Location selected</span>
          <span className="text-xs text-green-600 font-normal hidden sm:inline ml-2">
            ({position.lat.toFixed(5)}, {position.lng.toFixed(5)})
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

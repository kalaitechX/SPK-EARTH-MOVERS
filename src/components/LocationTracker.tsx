import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const LocationTracker = () => {
  const { user } = useAuth();
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user || !user.locationSharingEnabled) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by your browser');
      return;
    }

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        // Send to backend
        api.post('/locations', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          sessionActive: true
        }).catch(err => console.error('Failed to update location', err));
      },
      (error) => {
        console.error('Error watching location', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        
        // Notify backend session ended (best effort)
        api.post('/locations', {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          sessionActive: false
        }).catch(() => {});
      }
    };
  }, [user]);

  return null;
};

export default LocationTracker;

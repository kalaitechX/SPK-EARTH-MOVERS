import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Truck, User } from 'lucide-react';
import MapView, { type MapMarker } from '../../../components/maps/MapView';

const FarmerTracking = () => {
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.1085, 77.3411]);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const savedBookings = localStorage.getItem('spk_bookings');
    if (savedBookings) {
      const allBookings = JSON.parse(savedBookings);
      const active = allBookings.find((b: any) => 
        b && ['Accepted', 'Driver Assigned', 'In Progress'].includes(b.status)
      );
      
      if (active) {
        setActiveBooking(active);
        if (active.latitude && active.longitude) {
          setMapCenter([active.latitude, active.longitude]);
        }
        
        // Init driver location
        if (active.workStartedLocation && active.workStartedLocation.latitude) {
          setDriverLocation([active.workStartedLocation.latitude, active.workStartedLocation.longitude]);
        } else if (active.latitude && active.longitude) {
          // Simulate driver starting from a nearby location
          setDriverLocation([active.latitude + 0.02, active.longitude - 0.02]);
        }
      }
    }
  }, []);

  // Simulate Live Movement
  useEffect(() => {
    if (!driverLocation || !activeBooking || !activeBooking.latitude) return;

    const targetLat = activeBooking.latitude;
    const targetLng = activeBooking.longitude;

    const interval = setInterval(() => {
      setDriverLocation((prev) => {
        if (!prev) return null;
        const [lat, lng] = prev;
        
        const latDiff = targetLat - lat;
        const lngDiff = targetLng - lng;
        
        // Stop moving if very close
        if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
          return prev;
        }

        // Move 5% of remaining distance every 2 seconds
        return [lat + latDiff * 0.05, lng + lngDiff * 0.05];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeBooking, driverLocation]); // Added driverLocation to deps is okay, but prev is used so we can omit it to avoid reset. Actually, just activeBooking is enough.

  // Update Markers when driver moves
  useEffect(() => {
    if (activeBooking && activeBooking.latitude) {
      const markers: MapMarker[] = [
        {
          id: 'farmer-loc',
          lat: activeBooking.latitude,
          lng: activeBooking.longitude,
          title: 'Your Work Location',
          type: 'farmer'
        }
      ];

      if (driverLocation) {
        markers.push({
          id: 'driver-loc',
          lat: driverLocation[0],
          lng: driverLocation[1],
          title: 'Driver Location',
          description: activeBooking.assignedDriverName || 'Driver',
          type: 'driver'
        });
      }
      
      setMapMarkers(markers);
    }
  }, [activeBooking, driverLocation]);

  if (!activeBooking) {
    return (
      <div className="animate-fade-in-up pb-24 max-w-lg mx-auto mt-10">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Track Your Vehicle</h1>
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
          <Truck className="mx-auto text-gray-300 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Booking</h2>
          <p className="text-gray-500 mb-6">You don't have any vehicles on the way right now.</p>
          <button 
            onClick={() => navigate('/farmer/book')}
            className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-hover transition-colors"
          >
            Book a Vehicle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Track Your Vehicle</h1>
        <p className="text-gray-500 font-medium mt-1">Live status of your booking.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Status Header */}
        <div className={`p-4 flex items-center justify-between border-b border-gray-100 ${
          activeBooking.status === 'In Progress' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-900'
        }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Status</span>
            <p className="font-black text-lg">{activeBooking.status}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Booking ID</span>
            <p className="font-bold">{activeBooking.bookingId}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Vehicle</p>
              <p className="font-bold text-gray-900">{activeBooking.assignedVehicleName || activeBooking.vehicleName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Driver</p>
              <p className="font-bold text-gray-900">{activeBooking.assignedDriverName || 'Assigning...'}</p>
              {activeBooking.assignedDriverPhone && (
                <p className="text-sm text-gray-500">+91 {activeBooking.assignedDriverPhone}</p>
              )}
            </div>
          </div>
          <div className="md:col-span-2 flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
            <MapPin size={24} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Work Location</p>
              <p className="font-bold text-gray-900">{activeBooking.address}, {activeBooking.village}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[400px]">
        <div className="flex-1 relative z-0">
          <MapView 
            center={mapCenter} 
            zoom={13} 
            markers={mapMarkers} 
          />
        </div>
        {(!activeBooking.workStartedLocation || !activeBooking.workStartedLocation.latitude) && (
          <div className="bg-yellow-50 p-3 text-center text-sm font-medium text-yellow-800 border-t border-yellow-100 z-10 relative">
            Driver location is currently unavailable.
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerTracking;

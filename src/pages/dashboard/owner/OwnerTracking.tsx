import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Map as MapIcon, Compass } from 'lucide-react';
import MapView, { type MapMarker } from '../../../components/maps/MapView';
import { api } from '../../../services/api';
import { bookingService } from '../../../services/bookingService';

const OwnerTracking = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.1085, 77.3411]); // Default Tiruppur region

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active locations
        const locRes = await api.get('/locations');
        // Fetch active bookings (for farmer location/job details)
        // Note: we can fetch all bookings, but pagination might be an issue. Let's assume we get top 50
        const bookRes = await bookingService.getOwnerBookings({ limit: 50 });
        
        let active = [];
        if (bookRes.success) {
          active = bookRes.bookings.filter((b: any) => 
            b.status === 'Driver Assigned' || b.status === 'In Progress'
          );
          setActiveJobs(active);
        }

        const markers: MapMarker[] = [];
        let lastLocation: [number, number] | null = null;

        // Farmer work locations from bookings
        active.forEach((job: any) => {
          if (job.location && job.location.coordinates && job.location.coordinates.length === 2) {
            markers.push({
              id: `farmer-${job._id}`,
              lat: job.location.coordinates[0], // Assuming [lat, lng] or we use job.location.lat
              lng: job.location.coordinates[1],
              title: `Farmer: ${job.farmerId?.name || 'Unknown'}`,
              description: `Booking: ${job.bookingId}`,
              type: 'farmer'
            });
            lastLocation = [job.location.coordinates[0], job.location.coordinates[1]];
          } else if (job.latitude && job.longitude) {
            // fallback if coordinates are stored flat
            markers.push({
              id: `farmer-${job._id}`,
              lat: job.latitude,
              lng: job.longitude,
              title: `Farmer: ${job.farmerId?.name || 'Unknown'}`,
              description: `Booking: ${job.bookingId}`,
              type: 'farmer'
            });
            lastLocation = [job.latitude, job.longitude];
          }
        });

        // Driver/Farmer live locations from the locations API
        if (locRes.success && locRes.locations) {
          locRes.locations.forEach((loc: any) => {
            const user = loc.userId || {};
            markers.push({
              id: `live-${loc._id}`,
              lat: loc.latitude,
              lng: loc.longitude,
              title: `${user.role === 'driver' ? 'Driver' : 'Farmer'}: ${user.name || 'Unknown'}`,
              description: user.role === 'driver' ? `Licence: ${user.licenceNumber || 'N/A'}` : 'Live tracking',
              type: user.role === 'driver' ? 'driver' : 'farmer'
            });
            lastLocation = [loc.latitude, loc.longitude];
          });
        }

        setMapMarkers(markers);
        if (lastLocation) {
          setMapCenter(lastLocation);
        }
      } catch (err) {
        console.error('Failed to fetch tracking data', err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Vehicle Tracking</h1>
        <p className="text-gray-500 font-medium mt-1">View assigned vehicles and work locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center space-x-2 text-gray-700 font-bold">
                <MapIcon size={20} className="text-primary" />
                <span>Live Map View</span>
              </div>
              <div className="flex space-x-4 text-xs font-bold text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Farmer</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Driver</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative z-0">
              <MapView 
                center={mapCenter} 
                zoom={10} 
                markers={mapMarkers} 
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Active Jobs Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Active Jobs</h2>
          {activeJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
              <Compass className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-gray-500 font-medium">No active jobs to track right now.</p>
            </div>
          ) : (
            activeJobs.map(job => (
              <div key={job.bookingId} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">ACTIVE JOB</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Farmer:</span>
                    <span className="font-bold">{job.farmerId?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle Type:</span>
                    <span className="font-bold">{job.vehicleType || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Driver:</span>
                    <span className="font-bold">{job.driverId?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Work:</span>
                    <span className="font-bold truncate max-w-[120px] text-right">{job.workType || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-bold truncate max-w-[120px] text-right">{job.location?.village || job.village || 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (job.latitude && job.longitude) {
                        setMapCenter([job.latitude, job.longitude]);
                      }
                    }}
                    className="flex-1 py-2 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Navigation size={14} />
                    <span>View on Map</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/owner/bookings/${job.bookingId}`)}
                    className="flex-1 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    View Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerTracking;

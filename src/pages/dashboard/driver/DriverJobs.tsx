import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ChevronRight, Truck } from 'lucide-react';

const DriverJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { api } = await import('../../../services/api');
        const res = await api.get('/drivers/jobs');
        const activeJobs = res.jobs.filter((b: any) => b.status === 'Driver Assigned' || b.status === 'In Progress');
        
        // Also fetch from legacy if needed to not break existing flow
        const savedBookings = localStorage.getItem('spk_bookings');
        let legacyActive: any[] = [];
        if (savedBookings) {
          const allBookings = JSON.parse(savedBookings);
          legacyActive = allBookings.filter((b: any) => 
            b && (b.assignedDriverId === 'SPK-DRV-001' || b.assignedDriverId === 'D001') &&
            (b.status === 'Driver Assigned' || b.status === 'In Progress')
          );
        }
        
        setJobs([...activeJobs, ...legacyActive]);
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="animate-fade-in-up pb-20 md:pb-0">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Assigned Jobs</h1>
      
      {loading ? (
        <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading Jobs...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-bold">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Assigned Jobs</h2>
          <p className="text-gray-500">You don't have any jobs currently assigned.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.bookingId} 
              onClick={() => navigate(`/driver/jobs/${job.bookingId}`)}
              className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                job.status === 'In Progress' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900">{job.bookingId}</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mt-1">{job.farmerName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {job.status}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Vehicle</p>
                  <p className="text-sm font-bold text-gray-900">{job.assignedVehicleName || job.vehicleType || 'Vehicle'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Work Type</p>
                  <p className="text-sm font-bold text-gray-900">{job.workType}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center space-x-1.5 flex-1">
                  <MapPin size={16} className="text-primary" />
                  <span className="truncate">{job.location?.village || job.village || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-1.5 border-l border-gray-200 pl-4">
                  <Clock size={16} className="text-primary" />
                  <span>{job.startTime}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-end text-primary font-bold text-sm">
                <span>View Details</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverJobs;

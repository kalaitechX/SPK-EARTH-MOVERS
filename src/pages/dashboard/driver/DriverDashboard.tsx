import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, Clock, Play, CheckCircle } from 'lucide-react';
import { PushNotificationSettings } from '../../../components/notifications/PushNotificationSettings';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState({
    name: 'Driver One',
    id: 'SPK-DRV-001',
    status: 'Available'
  });

  const [todaysJob, setTodaysJob] = useState<any>(null);

  useEffect(() => {
    // Initialize mock driver if not present
    const savedDrivers = localStorage.getItem('spk_drivers');
    if (!savedDrivers) {
      localStorage.setItem('spk_drivers', JSON.stringify([
        { id: 'SPK-DRV-001', name: 'Driver One', phone: '9876543210', status: 'Available' },
        { id: 'D001', name: 'Ramesh Kumar', phone: '9876543210', status: 'Available' } // For compatibility with OwnerBookingDetails
      ]));
    }

    const savedBookings = localStorage.getItem('spk_bookings');
    if (savedBookings) {
      const bookings = JSON.parse(savedBookings);
      // Find a job assigned to this driver that is either assigned or in progress
      const job = bookings.find((b: any) => 
        b && (b.assignedDriverId === 'SPK-DRV-001' || b.assignedDriverId === 'D001') && 
        (b.status === 'Driver Assigned' || b.status === 'In Progress')
      );
      if (job) {
        setTodaysJob(job);
        setDriver(prev => ({ ...prev, status: job.status === 'In Progress' ? 'Working' : 'Assigned' }));
      }
    }
  }, []);

  return (
    <div className="animate-fade-in-up">
      {/* Driver Info Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
              {driver.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
              <p className="text-sm font-medium text-gray-500">{driver.id}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
            driver.status === 'Available' ? 'bg-green-50 text-green-700' :
            driver.status === 'Working' ? 'bg-blue-50 text-blue-700' :
            'bg-yellow-50 text-yellow-700'
          }`}>
            {driver.status}
          </div>
        </div>
      </div>

      <PushNotificationSettings />

      {todaysJob ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Today's Job</h2>
          
          <div className={`rounded-3xl p-6 shadow-md border ${
            todaysJob.status === 'In Progress' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-white border-gray-100'
          }`}>
            {todaysJob.status === 'In Progress' && (
              <div className="bg-blue-600 text-white p-3 rounded-xl mb-6 flex items-center justify-center space-x-2 font-bold animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span>WORK IN PROGRESS</span>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</span>
                <p className="font-bold text-gray-900">{todaysJob.bookingId}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                <p className="font-bold text-primary">{todaysJob.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Farmer</p>
                <p className="font-bold text-gray-900">{todaysJob.farmerName}</p>
                <p className="text-sm text-gray-500">+91 {todaysJob.farmerPhone || '9876543210'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Vehicle</p>
                <p className="font-bold text-gray-900">{todaysJob.assignedVehicleName}</p>
                <p className="text-sm text-gray-500">{todaysJob.assignedVehicleId}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="text-gray-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-gray-900">{todaysJob.workType}</p>
                  <p className="text-sm text-gray-500">{todaysJob.workDate} • {todaysJob.startTime}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{todaysJob.address}</p>
                  <p className="text-sm text-gray-500">{todaysJob.village}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate(`/driver/jobs/${todaysJob.bookingId}`)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <span>View Details</span>
              </button>
              
              {todaysJob.status === 'Driver Assigned' && (
                <button 
                  onClick={() => navigate(`/driver/jobs/${todaysJob.bookingId}`)}
                  className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-primary-hover shadow-md transition-all active:scale-95"
                >
                  <Play size={20} />
                  <span>Start Work</span>
                </button>
              )}

              {todaysJob.status === 'In Progress' && (
                <button 
                  onClick={() => navigate(`/driver/jobs/${todaysJob.bookingId}`)}
                  className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-green-700 shadow-md transition-all active:scale-95"
                >
                  <CheckCircle size={20} />
                  <span>Complete Work</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Jobs</h2>
          <p className="text-gray-500">You don't have any jobs assigned for today.</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;

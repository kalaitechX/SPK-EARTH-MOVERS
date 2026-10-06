import { useState, useEffect } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';

const DriverHistory = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedBookings = localStorage.getItem('spk_bookings');
    if (savedBookings) {
      const allBookings = JSON.parse(savedBookings);
      // Filter for this driver and only completed jobs
      const completedJobs = allBookings.filter((b: any) => 
        b && (b.assignedDriverId === 'SPK-DRV-001' || b.assignedDriverId === 'D001') &&
        b.status === 'Completed'
      );
      // Sort by latest completed work first
      completedJobs.sort((a: any, b: any) => new Date(b.workCompletedAt).getTime() - new Date(a.workCompletedAt).getTime());
      setHistory(completedJobs);
    }
  }, []);

  return (
    <div className="animate-fade-in-up pb-20 md:pb-0">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Work History</h1>
      
      {history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h2>
          <p className="text-gray-500">Your completed jobs will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((job) => (
            <div key={job.bookingId} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{job.bookingId}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">{job.farmerName}</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <CheckCircle size={14} />
                  <span>Completed</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Vehicle</p>
                  <p className="text-sm font-bold text-gray-900">{job.assignedVehicleName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Work Type</p>
                  <p className="text-sm font-bold text-gray-900">{job.workType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                  <p className="text-sm font-bold text-gray-900">{job.workDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Actual Work</p>
                  <p className="text-sm font-bold text-gray-900">{job.actualWorkHours} Hours</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                <MapPin size={16} className="text-primary shrink-0" />
                <span className="truncate">{job.address}, {job.village}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverHistory;

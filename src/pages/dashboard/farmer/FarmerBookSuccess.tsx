import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, List, Home } from 'lucide-react';

const FarmerBookSuccess = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spk_last_booking');
    if (saved && saved !== 'undefined') {
      try {
        setBooking(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse last booking:', e);
        navigate('/farmer/dashboard');
      }
    } else {
      navigate('/farmer/dashboard');
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="animate-fade-in-up min-h-[70vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
      
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 relative">
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <CheckCircle2 size={48} strokeWidth={3} />
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Request Sent</h1>
      <p className="text-gray-600 font-medium mb-8">
        Your vehicle request has been sent to SPK Earth Movers.
      </p>

      <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 text-left">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <span className="text-gray-500 font-bold">Booking ID</span>
          <span className="text-primary font-bold">{booking.bookingId}</span>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Vehicle</span>
            <span className="font-bold text-gray-900">{booking.vehicleName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Work Type</span>
            <span className="font-bold text-gray-900">{booking.workType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Location</span>
            <span className="font-bold text-gray-900">{booking.village}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Date & Time</span>
            <span className="font-bold text-gray-900">{booking.workDate} at {booking.startTime}</span>
          </div>
          <div className="flex justify-between pt-3 mt-3 border-t border-gray-100">
            <span className="text-gray-500 font-bold">Status</span>
            <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs">
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl mb-8 font-medium border border-gray-100">
        SPK Earth Movers will review your request and confirm the vehicle and driver.
      </p>

      <div className="w-full space-y-4">
        <button 
          onClick={() => navigate('/farmer/bookings')}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover flex items-center justify-center space-x-2"
        >
          <List size={20} />
          <span>View My Bookings</span>
        </button>
        <button 
          onClick={() => navigate('/farmer/dashboard')}
          className="w-full bg-white text-gray-700 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          <Home size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

    </div>
  );
};

export default FarmerBookSuccess;

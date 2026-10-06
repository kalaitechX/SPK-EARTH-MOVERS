import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';

const FarmerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [legacyBookings, setLegacyBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statuses = ['All', 'Pending', 'Accepted', 'Driver Assigned', 'In Progress', 'Completed', 'Rejected', 'Cancelled'];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { bookingService } = await import('../../../services/bookingService');
        const res = await bookingService.getMyBookings();
        setBookings(res.bookings);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load real bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    const saved = localStorage.getItem('spk_bookings');
    if (saved) {
      setLegacyBookings(JSON.parse(saved));
    }
  }, []);

  const filteredBookings = bookings.filter(b => b && (filter === 'All' || b.status === filter));
  const filteredLegacy = legacyBookings.filter(b => b && (filter === 'All' || b.status === filter));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Driver Assigned': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-purple-100 text-purple-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="animate-fade-in-up pb-24">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <p className="text-gray-500 font-medium mt-1">View and track your vehicle requests.</p>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading Bookings...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-bold">{error}</div>
      ) : bookings.length === 0 && legacyBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <Calendar size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h2>
          <p className="text-gray-500 mb-6 font-medium max-w-xs">You haven't made any vehicle booking requests yet.</p>
          <button 
            onClick={() => navigate('/farmer/book')}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
          >
            Book a Vehicle
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredBookings.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Active Bookings</h2>
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <div 
                    key={index}
                    onClick={() => navigate(`/farmer/bookings/${booking.bookingId}`)}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="text-xs font-bold text-gray-400">{booking.bookingId}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{booking.vehicleType}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-0.5">{booking.workType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{new Date(booking.workDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 font-medium">{booking.location?.village || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    {booking.paymentMethod && <p className="text-xs mt-2 text-gray-500">Payment: {booking.paymentMethod}</p>}
                    
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <span>View Details</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredLegacy.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-400 mb-4 mt-8 uppercase tracking-wider">Legacy / Demo Bookings</h2>
              <div className="space-y-4 opacity-70">
                {filteredLegacy.map((booking, index) => (
                  <div 
                    key={`legacy-${index}`}
                    onClick={() => navigate(`/farmer/bookings/${booking.bookingId}`)}
                    className="bg-gray-50 rounded-2xl p-5 border border-gray-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status} (Legacy)
                      </span>
                      <span className="text-xs font-bold text-gray-400">{booking.bookingId}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-600">{booking.vehicleName || booking.vehicleType}</h3>
                        <p className="text-sm font-medium text-gray-400 mt-0.5">{booking.workType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-600">{booking.workDate}</p>
                        <p className="text-xs text-gray-400 font-medium">{booking.village}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerBookings;

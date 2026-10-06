import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Inbox } from 'lucide-react';

const OwnerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [legacyBookings, setLegacyBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { bookingService } = await import('../../../services/bookingService');
      const res = await bookingService.getOwnerBookings({
        page,
        limit: 9,
        status: filter
      });
      setBookings(res.bookings);
      setTotalPages(res.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, filter]);

  useEffect(() => {
    const saved = localStorage.getItem('spk_bookings');
    if (saved) {
      setLegacyBookings(JSON.parse(saved));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Driver Assigned': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-purple-100 text-purple-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Legacy local filtering
  const filteredLegacy = filter === 'All' 
    ? legacyBookings.filter(b => b)
    : legacyBookings.filter(b => b && b.status === filter);

  const tabs = ['All', 'Pending', 'Accepted', 'Driver Assigned', 'In Progress', 'Completed', 'Rejected'];

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Booking Requests</h1>
          <p className="text-gray-500 font-medium mt-1">Review and manage vehicle requests.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 pb-px">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`whitespace-nowrap px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
              filter === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
            {tab === 'Pending' && legacyBookings.filter(b => b?.status === 'Pending').length + bookings.filter(b => b?.status === 'Pending').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {legacyBookings.filter(b => b?.status === 'Pending').length + bookings.filter(b => b?.status === 'Pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
         <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading Bookings...</div>
      ) : bookings.length === 0 && filteredLegacy.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
            <Inbox size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">No bookings found</h2>
          <p className="text-gray-500 font-medium">There are no bookings matching this status.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Active Database Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.bookingId} 
                    onClick={() => navigate(`/owner/bookings/${booking.bookingId}`)}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="text-xs font-bold text-gray-400">{booking.bookingId}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{booking.farmerId?.name || 'Farmer'}</h3>
                      <p className="text-sm font-bold text-primary">{booking.vehicleType}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs mb-4 flex-1">
                      <div>
                        <p className="text-gray-400 font-bold uppercase">Work</p>
                        <p className="font-semibold text-gray-900 truncate">{booking.workType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold uppercase">Location</p>
                        <p className="font-semibold text-gray-900 truncate">{booking.location?.village || 'Unknown'}</p>
                      </div>
                      <div className="col-span-2 mt-1 pt-2 border-t border-gray-200">
                        <p className="text-gray-400 font-bold uppercase">Schedule</p>
                        <p className="font-semibold text-gray-900">{new Date(booking.workDate).toLocaleDateString()} at {booking.startTime}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex items-center justify-between text-sm text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <span>Manage Booking</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border rounded text-sm disabled:opacity-50 font-bold"
                  >
                    Prev
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-gray-500">Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border rounded text-sm disabled:opacity-50 font-bold"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {filteredLegacy.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-wider">Legacy / Demo Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
                {filteredLegacy.map((booking) => (
                  <div 
                    key={booking.bookingId} 
                    onClick={() => navigate(`/owner/bookings/${booking.bookingId}`)}
                    className="bg-gray-50 rounded-2xl p-5 border border-gray-200 cursor-pointer flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status} (Legacy)
                      </span>
                      <span className="text-xs font-bold text-gray-400">{booking.bookingId}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-600">{booking.farmerName}</h3>
                      <p className="text-sm font-bold text-gray-500">{booking.vehicleName || booking.vehicleType}</p>
                    </div>
                    
                    <div className="bg-gray-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs mb-4 flex-1">
                      <div>
                        <p className="text-gray-400 font-bold uppercase">Work</p>
                        <p className="font-semibold text-gray-700 truncate">{booking.workType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold uppercase">Location</p>
                        <p className="font-semibold text-gray-700 truncate">{booking.village}</p>
                      </div>
                      <div className="col-span-2 mt-1 pt-2 border-t border-gray-200">
                        <p className="text-gray-400 font-bold uppercase">Schedule</p>
                        <p className="font-semibold text-gray-700">{booking.workDate} at {booking.startTime}</p>
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

export default OwnerBookings;

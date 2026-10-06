import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { PushNotificationSettings } from '../../components/notifications/PushNotificationSettings';

const FarmerDashboard = () => {
  const navigate = useNavigate();

  const activeBooking = null; // null for now, can be populated from localStorage later

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Welcome back, Farmer</h1>
        <p className="text-gray-500 font-medium mt-1">Book reliable machines for your work.</p>
      </div>

      <PushNotificationSettings />

      {/* Active Booking Summary */}
      {activeBooking ? (
        <div className="bg-primary text-white rounded-3xl p-6 shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-green-200 text-sm font-bold uppercase tracking-wider mb-1">Active Booking</div>
              <h3 className="text-2xl font-bold mb-2">JCB Excavator</h3>
              <div className="flex space-x-4 text-sm text-green-50">
                <span>📍 Trichy Road Farm</span>
                <span>• Pending</span>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Active Booking</div>
            <h3 className="text-gray-600 font-medium">No active bookings</h3>
          </div>
        </div>
      )}

      {/* Primary Call to Action */}
      <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-black mb-2">Need a Vehicle?</h2>
          <p className="text-green-100 font-medium max-w-sm">Choose a JCB, Tractor or Tipper for your work.</p>
        </div>
        <button 
          onClick={() => navigate('/farmer/book')}
          className="relative z-10 w-full md:w-auto bg-white text-primary px-8 py-4 rounded-2xl font-black text-lg shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-transform"
        >
          Book a Vehicle
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/farmer/book')}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlusCircle size={24} />
          </div>
          <h3 className="font-bold text-gray-900">Book Vehicle</h3>
        </button>
        
        <button 
          onClick={() => navigate('/farmer/bookings')}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <h3 className="font-bold text-gray-900">My Bookings</h3>
        </button>
        
        <button className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-left relative overflow-hidden">
          <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-gray-400">Track Vehicle</h3>
          <span className="absolute top-4 right-4 bg-gray-200 text-gray-500 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Coming Soon</span>
        </button>
        
        <button className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-left relative overflow-hidden">
          <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <CreditCard size={24} />
          </div>
          <h3 className="font-bold text-gray-400">Payments</h3>
          <span className="absolute top-4 right-4 bg-gray-200 text-gray-500 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Coming Soon</span>
        </button>
      </div>

    </div>
  );
};

export default FarmerDashboard;

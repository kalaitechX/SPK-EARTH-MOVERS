import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CalendarClock, Briefcase, FileCheck, ChevronRight, BellRing, IndianRupee, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { initialVehicles } from '../../data/vehicles';
import { PushNotificationSettings } from '../../components/notifications/PushNotificationSettings';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    newRequests: 0,
    activeJobs: 0,
    completedJobs: 0,
    availableVehicles: 0
  });

  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentSummary, setPaymentSummary] = useState({ totalRevenue: 0, pendingCash: 0, completedPayments: 0 });

  useEffect(() => {
    // Load bookings
    const savedBookings = localStorage.getItem('spk_bookings');
    let allBookings: any[] = [];
    if (savedBookings) {
      const parsed = JSON.parse(savedBookings);
      allBookings = Array.isArray(parsed) ? parsed.filter(b => b) : [];
    }

    const pending = allBookings.filter(b => b.status === 'Pending');
    const active = allBookings.filter(b => ['Accepted', 'Driver Assigned', 'In Progress'].includes(b.status));
    const completed = allBookings.filter(b => b.status === 'Completed');

    setPendingBookings(pending.slice(0, 5)); // Show max 5 recent pending

    // Load vehicles
    const savedVehicles = localStorage.getItem('spk_vehicles');
    let allVehicles = initialVehicles;
    if (savedVehicles) {
      allVehicles = JSON.parse(savedVehicles);
    }
    const available = allVehicles.filter(v => v.status === 'Available').length;

    setStats({
      newRequests: pending.length,
      activeJobs: active.length,
      completedJobs: completed.length,
      availableVehicles: available
    });

    const savedPayments = localStorage.getItem('spk_payments');
    if (savedPayments) {
      const p = JSON.parse(savedPayments);
      setPayments(p.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      let totalRev = 0;
      let pendCash = 0;
      let completedCount = 0;

      p.forEach((pay: any) => {
        if (pay.status === 'Paid') {
          totalRev += pay.amount || 0;
          completedCount++;
        } else if (pay.status === 'Cash Pending') {
          pendCash += pay.amount || 0;
        }
      });
      setPaymentSummary({ totalRevenue: totalRev, pendingCash: pendCash, completedPayments: completedCount });
    }

  }, []);

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Business Overview</h1>
        <p className="text-gray-500 font-medium mt-1">Here's what's happening today.</p>
      </div>

      <PushNotificationSettings />

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
            <BellRing size={48} />
          </div>
          <p className="text-sm font-bold text-gray-500 mb-1">New Requests</p>
          <p className="text-3xl font-black text-gray-900">{stats.newRequests}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500">
            <Briefcase size={48} />
          </div>
          <p className="text-sm font-bold text-gray-500 mb-1">Active Jobs</p>
          <p className="text-3xl font-black text-gray-900">{stats.activeJobs}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500">
            <FileCheck size={48} />
          </div>
          <p className="text-sm font-bold text-gray-500 mb-1">Completed</p>
          <p className="text-3xl font-black text-gray-900">{stats.completedJobs}</p>
        </div>
        
        <div 
          onClick={() => navigate('/owner/vehicles')}
          className="bg-primary text-white rounded-2xl p-5 shadow-lg shadow-primary/20 relative overflow-hidden cursor-pointer hover:bg-primary-hover transition-colors group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Truck size={48} />
          </div>
          <p className="text-sm font-bold text-green-100 mb-1">Available Vehicles</p>
          <p className="text-3xl font-black text-white">{stats.availableVehicles}</p>
        </div>
      </div>

      {/* Payment Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 mb-1">₹{paymentSummary.totalRevenue.toLocaleString()}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 mb-1">₹{paymentSummary.pendingCash.toLocaleString()}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Cash</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 mb-1">{paymentSummary.completedPayments}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Paid Jobs</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/owner/payments')}>
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 mb-4">
            <ChevronRight size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 mb-1">{payments.length}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Payments</p>
          </div>
        </div>
      </div>

      {/* New Booking Requests */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <CalendarClock className="text-primary" size={24} />
          <span>New Booking Requests</span>
        </h2>
        {stats.newRequests > 0 && (
          <button 
            onClick={() => navigate('/owner/bookings')}
            className="text-primary font-bold text-sm hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {pendingBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
            <BellRing size={24} />
          </div>
          <p className="text-gray-500 font-medium">No pending booking requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
            <div key={booking.bookingId} className="bg-white rounded-3xl p-6 shadow-sm border border-l-4 border-l-red-500 border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-red-50 text-red-600 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-red-100">
                      NEW REQUEST
                    </span>
                    <span className="text-sm font-bold text-gray-400">{booking.bookingId}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Farmer</p>
                      <p className="font-bold text-gray-900 truncate">{booking.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vehicle</p>
                      <p className="font-bold text-primary">{booking.vehicleName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Work</p>
                      <p className="font-bold text-gray-900 truncate">{booking.workType}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                      <p className="font-bold text-gray-900">{booking.workDate}</p>
                      <p className="text-xs text-gray-500">{booking.startTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => navigate(`/owner/bookings/${booking.bookingId}`)}
                    className="flex-1 bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center space-x-1"
                  >
                    <span>Review</span>
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/owner/bookings/${booking.bookingId}`)}
                    className="flex-1 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover shadow-sm shadow-primary/20"
                  >
                    Accept
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Payments */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
          <button 
            onClick={() => navigate('/owner/payments')}
            className="text-primary font-bold text-sm hover:text-primary-hover flex items-center"
          >
            <span>View All Payments</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        {payments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">No payment records yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {payments.slice(0, 3).map((payment: any) => (
              <div key={payment.paymentId} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-gray-400">{payment.paymentId}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${
                    payment.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                    payment.status === 'Cash Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{payment.farmerName}</h3>
                <p className="text-xs text-gray-500 font-medium mb-3">{payment.vehicleName}</p>
                <div className="flex justify-between items-end mt-2 pt-3 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase">Amount</span>
                  <span className={`font-black ${payment.amount ? 'text-gray-900 text-lg' : 'text-gray-400 text-sm'}`}>
                    {payment.amount ? `₹${payment.amount.toLocaleString()}` : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default OwnerDashboard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, FileText } from 'lucide-react';
import { initialVehicles } from '../../../data/vehicles';

const FarmerBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spk_bookings');
    if (saved) {
      const allBookings = JSON.parse(saved);
      const found = allBookings.find((b: any) => b?.bookingId === id);
      if (found) {
        setBooking(found);
        
        // Also look up payment
        const savedPayments = localStorage.getItem('spk_payments');
        if (savedPayments) {
          const payments = JSON.parse(savedPayments);
          const foundPayment = payments.find((p: any) => p?.bookingId === id);
          if (foundPayment) setPayment(foundPayment);
        }
      } else {
        navigate('/farmer/bookings');
      }
    } else {
      navigate('/farmer/bookings');
    }
  }, [id, navigate]);

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

  if (!booking) return null;

  const vehicleDetails = initialVehicles.find(v => v.id === booking.vehicleId);

  return (
    <div className="animate-fade-in-up pb-24 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <button onClick={() => navigate('/farmer/bookings')} className="p-2 -ml-2 text-gray-600 bg-white rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-sm font-medium text-gray-500">{booking.bookingId}</p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Vehicle Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {vehicleDetails && (
            <div className="h-48 relative">
              <img src={vehicleDetails.image} alt={vehicleDetails.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
                  {booking.vehicleName}
                  {booking.equipmentName && <span className="text-primary text-sm bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">+ {booking.equipmentName}</span>}
                </h2>
                <p className="text-sm font-medium opacity-90">{booking.vehicleType}</p>
              </div>
            </div>
          )}
        </div>

        {/* Work Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText size={20} className="text-primary" />
            <span>Work Details</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Work Type</p>
              <p className="font-semibold text-gray-900">{booking.workType}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {booking.billingType === 'Loads' ? 'Estimated Loads' : 'Duration'}
              </p>
              <p className="font-semibold text-gray-900">
                {booking.estimatedQuantity || booking.estimatedHours} {booking.billingType === 'Loads' ? 'Loads' : 'Hours'} (Est.)
              </p>
            </div>
          </div>
          {booking.requirements && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Requirements</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg font-medium">{booking.requirements}</p>
            </div>
          )}
        </div>

        {/* Location & Time */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar size={20} className="text-primary" />
            <span>Schedule & Location</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</p>
                <p className="font-semibold text-gray-900">{booking.workDate}</p>
                <p className="text-sm font-medium text-gray-500">Starts at {booking.startTime}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                <p className="font-semibold text-gray-900">{booking.address}</p>
                <p className="text-sm font-medium text-gray-500">{booking.village}, {booking.district}</p>
                {booking.landmark && <p className="text-sm text-gray-400">Landmark: {booking.landmark}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <CreditCard size={20} className="text-primary" />
            <span>Payment Info</span>
          </h3>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="font-medium text-gray-600">Method</span>
            <span className="font-bold text-gray-900">{booking.paymentMethod || 'Cash'}</span>
          </div>
          
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="font-medium text-gray-600">Amount</span>
            {payment && payment.amount ? (
              <span className="font-black text-xl text-gray-900">₹{payment.amount.toLocaleString()}</span>
            ) : (
              <span className="font-bold text-gray-400 italic">Pending confirmation</span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <span className="font-medium text-gray-600">Status</span>
            <span className={`font-bold text-sm px-2 py-1 rounded-md uppercase border ${payment ? getStatusColor(payment.status) : getStatusColor('Pending')}`}>
              {payment ? payment.status : 'Pending'}
            </span>
          </div>

          {!payment?.amount && (
            <div className="mt-4 bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm font-medium border border-yellow-100">
              Amount will be confirmed by SPK Earth Movers upon review.
            </div>
          )}
          
          {payment?.status === 'Cash Pending' && (
            <div className="mt-4 bg-orange-50 text-orange-800 p-3 rounded-lg text-sm font-medium border border-orange-100">
              Please make the cash payment to SPK Earth Movers.
            </div>
          )}
          
          {payment?.status === 'Paid' && (
            <button 
              onClick={() => navigate(`/farmer/payments/${payment.paymentId}`)}
              className="mt-4 w-full bg-green-50 text-green-700 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200"
            >
              View Receipt
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default FarmerBookingDetails;

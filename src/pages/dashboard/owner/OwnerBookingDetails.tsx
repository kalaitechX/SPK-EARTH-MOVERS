import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, FileText, CheckCircle, XCircle, Truck, Info, Settings } from 'lucide-react';
import { initialVehicles } from '../../../data/vehicles';
import MapView, { type MapMarker } from '../../../components/maps/MapView';
import { bookingService } from '../../../services/bookingService';

// Dummy drivers for UI demo
const dummyDrivers = [
  { id: 'SPK-DRV-001', name: 'Driver One', phone: '9876543210', status: 'Available' },
  { id: 'D001', name: 'Ramesh Kumar', phone: '9876543210', status: 'Available' },
  { id: 'D002', name: 'Suresh Menon', phone: '9876543211', status: 'Available' },
  { id: 'D003', name: 'Karthik Raja', phone: '9876543212', status: 'Assigned' }
];

const OwnerBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  
  // Modals state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const data = await bookingService.getBookingById(id);
        const found = data.booking || data; // Handle different response formats
        
        if (found) {
          setBooking(found);
          
          // Load available vehicles of same type
          const savedVehicles = localStorage.getItem('spk_vehicles');
          const vehicles = savedVehicles ? JSON.parse(savedVehicles) : initialVehicles;
          const typeStr = (found.vehicleName || found.vehicleType || '').toLowerCase();
          
          let available = vehicles.filter((v: any) => 
            v.status === 'Available' && (v.name.toLowerCase() === typeStr || v.type.toLowerCase() === typeStr || typeStr.includes(v.name.toLowerCase()))
          );

          if (available.length === 0) {
            if (typeStr.includes('agricultur') || typeStr.includes('field') || typeStr.includes('plough')) {
              available = vehicles.filter((v: any) => v.status === 'Available' && v.name.toLowerCase().includes('tractor'));
            } else if (typeStr.includes('earth') || typeStr.includes('excavat') || typeStr.includes('level')) {
              available = vehicles.filter((v: any) => v.status === 'Available' && v.name.toLowerCase().includes('jcb'));
            } else if (typeStr.includes('transport') || typeStr.includes('material') || typeStr.includes('sand')) {
              available = vehicles.filter((v: any) => v.status === 'Available' && v.name.toLowerCase().includes('tipper'));
            }
          }
          setAvailableVehicles(available);
        } else {
          navigate('/owner/bookings');
        }
      } catch (error) {
        console.error("Failed to fetch booking", error);
        navigate('/owner/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const updateBookingStatus = async (newStatus: string, updates: any = {}) => {
    try {
      if (!id) return;
      const res = await bookingService.updateBookingStatus(id, { status: newStatus, ...updates });
      setBooking((prev: any) => ({ ...prev, status: newStatus, ...updates }));
    } catch (error) {
      console.error("Failed to update booking status", error);
      alert("Failed to update booking status");
    }
  };

  const handleAccept = async () => {
    if (window.confirm('Are you sure you want to accept this booking request?')) {
      const defaultDriver = dummyDrivers.find(d => d.status === 'Available') || dummyDrivers[0];
      
      try {
        if (id) {
          await bookingService.assignBooking(id, { 
            vehicleId: booking.vehicleId || 'AUTO-VEHICLE-1', 
            driverId: defaultDriver.id 
          });
          
          await updateBookingStatus('Driver Assigned', {
            assignedVehicleId: booking.vehicleId || 'AUTO-VEHICLE-1',
            assignedVehicleName: booking.vehicleName,
            assignedDriverId: defaultDriver.id,
            assignedDriverName: defaultDriver.name,
            assignedDriverPhone: defaultDriver.phone
          });
          
          alert('Booking accepted and driver assigned successfully.');
        }
      } catch (error) {
        console.error("Failed to accept booking", error);
        alert('Failed to accept booking. Note: Make sure backend supports assignBooking.');
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return alert('Please select a reason');
    await updateBookingStatus('Rejected', { rejectReason, rejectReasonText });
    setShowRejectModal(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading Booking Details...</div>;

  if (!booking) return null;

  // Build Map Markers
  const mapMarkers: MapMarker[] = [];
  let mapCenter: [number, number] | null = null;
  
  if (booking.latitude && booking.longitude) {
    mapMarkers.push({
      id: 'farmer-loc',
      lat: booking.latitude,
      lng: booking.longitude,
      title: 'Farmer Work Location',
      type: 'farmer'
    });
    mapCenter = [booking.latitude, booking.longitude];
  }
  
  if (booking.workStartedLocation && booking.workStartedLocation.latitude) {
    mapMarkers.push({
      id: 'driver-start-loc',
      lat: booking.workStartedLocation.latitude,
      lng: booking.workStartedLocation.longitude,
      title: 'Work Started Location',
      description: 'Where the driver started the work.',
      type: 'driver'
    });
    mapCenter = [booking.workStartedLocation.latitude, booking.workStartedLocation.longitude];
  }

  if (booking.workCompletedLocation && booking.workCompletedLocation.latitude) {
    mapMarkers.push({
      id: 'driver-complete-loc',
      lat: booking.workCompletedLocation.latitude,
      lng: booking.workCompletedLocation.longitude,
      title: 'Work Completed Location',
      type: 'vehicle'
    });
  }

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/owner/bookings')} className="p-2 -ml-2 text-gray-600 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{booking.bookingId}</h1>
            <p className="text-gray-500 font-medium mt-1">Requested on {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl font-bold border ${
          booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
          booking.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
          booking.status === 'Driver Assigned' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          booking.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-gray-50 text-gray-700 border-gray-200'
        }`}>
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Farmer Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User size={20} className="text-primary" />
              <span>Farmer Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                <p className="font-semibold text-gray-900">{booking.farmerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mobile</p>
                <p className="font-semibold text-gray-900">+91 {booking.farmerPhone || '9876543210'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Work Location</p>
                <p className="font-semibold text-gray-900">{booking.address}</p>
                <p className="text-sm text-gray-500">{booking.village}, {booking.district}</p>
                {booking.landmark && <p className="text-sm text-gray-400">Landmark: {booking.landmark}</p>}
              </div>
            </div>
          </div>

          {/* Work & Schedule Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText size={20} className="text-primary" />
              <span>Work Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Requested Vehicle</p>
                <p className="font-bold text-primary flex items-center gap-2">
                  {booking.vehicleName}
                  {booking.equipmentName && <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">+ {booking.equipmentName}</span>}
                </p>
                <p className="text-xs text-gray-500">{booking.vehicleType}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Work Type</p>
                <p className="font-semibold text-gray-900">{booking.workType}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Schedule</p>
                <p className="font-semibold text-gray-900">{booking.workDate}</p>
                <p className="text-sm text-gray-500">{booking.startTime}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {booking.billingType === 'Loads' ? 'Estimated Loads' : 'Duration'}
                </p>
                <p className="font-semibold text-gray-900">
                  {booking.estimatedQuantity || booking.estimatedHours} {booking.billingType === 'Loads' ? 'Loads' : 'Hours'} (Est.)
                </p>
              </div>
              {booking.requirements && (
                <div className="sm:col-span-2 bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Additional Requirements</p>
                  <p className="text-sm font-medium text-gray-700">{booking.requirements}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Info (If assigned) */}
          {(booking.status === 'Driver Assigned' || booking.status === 'In Progress' || booking.status === 'Completed') && (
            <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] rounded-3xl p-6 shadow-md text-white">
              <h3 className="text-lg font-bold text-green-100 mb-4 flex items-center space-x-2">
                <Settings size={20} />
                <span>Assignment Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div>
                  <p className="text-xs font-bold text-green-200 uppercase tracking-wider mb-1">Assigned Vehicle</p>
                  <p className="font-bold text-white">{booking.assignedVehicleName}</p>
                  <p className="text-xs text-green-100">{booking.assignedVehicleId}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-200 uppercase tracking-wider mb-1">Assigned Driver</p>
                  <p className="font-bold text-white">{booking.assignedDriverName}</p>
                  <p className="text-xs text-green-100">+91 {booking.assignedDriverPhone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Completion Info */}
          {booking.status === 'Completed' && (
            <div className="bg-green-50 rounded-3xl p-6 shadow-sm border border-green-200 text-green-900">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>WORK COMPLETED ✅</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Started</p>
                  <p className="font-semibold">{new Date(booking.workStartedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Completed</p>
                  <p className="font-semibold">{new Date(booking.workCompletedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Actual Work Hours</p>
                  <p className="font-semibold">{booking.actualWorkHours} Hours</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Payment</p>
                  <p className="font-semibold">Cash on Delivery</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Amount</p>
                  <p className="font-semibold text-primary">Pending Owner Confirmation</p>
                </div>
                {booking.driverNotes && (
                  <div className="sm:col-span-2 bg-white/50 p-4 rounded-xl border border-green-100 mt-2">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Driver Notes</p>
                    <p className="text-sm font-medium">{booking.driverNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Map Location Info */}
          {mapCenter && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="p-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50">
                <MapPin size={20} className="text-primary" />
                <h3 className="font-bold text-gray-900">Locations on Map</h3>
              </div>
              <div className="h-[300px] relative z-0">
                <MapView 
                  center={mapCenter} 
                  zoom={12} 
                  markers={mapMarkers} 
                  className="h-full w-full"
                />
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {booking.status === 'Rejected' && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-red-900">
              <h3 className="text-lg font-bold mb-2 flex items-center space-x-2">
                <XCircle size={20} />
                <span>Booking Rejected</span>
              </h3>
              <p className="font-bold text-sm">Reason: {booking.rejectReason}</p>
              {booking.rejectReasonText && <p className="text-sm mt-1">{booking.rejectReasonText}</p>}
            </div>
          )}

        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
            
            {booking.status === 'Pending' && (
              <div className="space-y-3">
                <button 
                  onClick={handleAccept}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-primary-hover shadow-sm shadow-primary/20 transition-all active:scale-95"
                >
                  <CheckCircle size={20} />
                  <span>Accept Booking</span>
                </button>
                <button 
                  onClick={() => setShowRejectModal(true)}
                  className="w-full bg-white text-red-600 border border-red-200 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-red-50 transition-all active:scale-95"
                >
                  <XCircle size={20} />
                  <span>Reject</span>
                </button>
              </div>
            )}



            {(booking.status !== 'Pending' && booking.status !== 'Accepted') && (
              <p className="text-sm text-gray-500 font-medium italic">No actions available for current status.</p>
            )}

          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Booking?</h3>
            <p className="text-sm text-gray-500 mb-6">Please provide a reason for rejecting this request.</p>
            
            <select 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary mb-4"
            >
              <option value="">Select Reason</option>
              <option value="Vehicle unavailable">Vehicle unavailable</option>
              <option value="Driver unavailable">Driver unavailable</option>
              <option value="Schedule conflict">Schedule conflict</option>
              <option value="Location unavailable">Location unavailable</option>
              <option value="Other">Other</option>
            </select>
            
            <textarea 
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              placeholder="Additional reason (Optional)"
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary mb-6 resize-none"
            ></textarea>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default OwnerBookingDetails;

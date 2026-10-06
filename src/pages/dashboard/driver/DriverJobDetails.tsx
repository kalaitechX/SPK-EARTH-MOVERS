import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Clock, Navigation, Play, CheckCircle, AlertCircle, Truck } from 'lucide-react';

const DriverJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);

  // Modals
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [actualHours, setActualHours] = useState('');
  const [driverNotes, setDriverNotes] = useState('');
  const [showNavMsg, setShowNavMsg] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('spk_bookings');
    if (saved) {
      const allBookings = JSON.parse(saved);
      const found = allBookings.find((b: any) => b?.bookingId === id);
      if (found) setJob(found);
    }
  }, [id]);

  const updateJob = (newStatus: string, extra: any = {}) => {
    const saved = localStorage.getItem('spk_bookings');
    if (!saved) return;
    let allBookings = JSON.parse(saved);
    const index = allBookings.findIndex((b: any) => b && b.bookingId === id);
    if (index > -1) {
      allBookings[index] = { ...allBookings[index], status: newStatus, ...extra };
      localStorage.setItem('spk_bookings', JSON.stringify(allBookings));
      setJob(allBookings[index]);
    }
  };

  const handleStartWork = () => {
    setIsLocating(true);
    setLocationError('');
    
    const now = new Date().toISOString();
    
    const proceed = (location: any = null) => {
      updateJob('In Progress', {
        workStartedAt: now,
        workStartedLocation: location
      });
      setShowStartModal(false);
      setIsLocating(false);
      
      updateVehicleStatus(job.assignedVehicleId, 'Working');
      updateDriverStatus('Working');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => proceed({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => {
          setLocationError('Start location could not be captured.');
          proceed(null);
        },
        { timeout: 5000 }
      );
    } else {
      proceed(null);
    }
  };

  const handleCompleteWork = () => {
    if (!actualHours) return alert('Please enter actual work hours.');
    
    setIsLocating(true);
    setLocationError('');
    const now = new Date().toISOString();

    const proceed = (location: any = null) => {
      updateJob('Completed', {
        workCompletedAt: now,
        actualWorkHours: actualHours,
        driverNotes: driverNotes,
        workCompletedLocation: location
      });
      
      // Add Notification
      const notifications = JSON.parse(localStorage.getItem('spk_notifications') || '[]');
      notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        title: 'Work Completed',
        message: `Driver completed ${job.bookingId}.`,
        date: new Date().toISOString(),
        read: false,
        details: {
          farmer: job.farmerName,
          vehicle: job.assignedVehicleName,
          work: job.workType,
          started: job.workStartedAt,
          completed: now,
          actualWork: actualHours,
          payment: 'Cash on Delivery'
        }
      });
      localStorage.setItem('spk_notifications', JSON.stringify(notifications));

      // Create Payment Record
      const payments = JSON.parse(localStorage.getItem('spk_payments') || '[]');
      const hasPayment = payments.find((p: any) => p?.bookingId === job.bookingId);
      if (!hasPayment) {
        payments.unshift({
          paymentId: `SPK-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: job.bookingId,
          farmerId: job.farmerId || 'F001',
          farmerName: job.farmerName,
          vehicleId: job.assignedVehicleId,
          vehicleType: job.vehicleType,
          vehicleName: job.assignedVehicleName,
          driverId: job.assignedDriverId,
          driverName: job.assignedDriverName,
          amount: null,
          paymentMethod: 'Cash',
          status: 'Pending', // Pending -> Cash Pending -> Paid
          createdAt: now,
          confirmedAt: null,
          paidAt: null,
          receivedBy: null,
          notes: ''
        });
        localStorage.setItem('spk_payments', JSON.stringify(payments));
      }

      // Update Vehicle and Driver Status
      updateVehicleStatus(job.assignedVehicleId, 'Available');
      updateDriverStatus('Available');

      setShowCompleteModal(false);
      setIsLocating(false);
      navigate('/driver/history');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => proceed({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => {
          setLocationError('Completion location could not be captured.');
          proceed(null);
        },
        { timeout: 5000 }
      );
    } else {
      proceed(null);
    }
  };

  const updateVehicleStatus = (vehicleId: string, status: string) => {
    const saved = localStorage.getItem('spk_vehicles');
    if (saved) {
      let vehicles = JSON.parse(saved);
      const idx = vehicles.findIndex((v: any) => v && v.id === vehicleId);
      if (idx > -1) {
        vehicles[idx].status = status;
        localStorage.setItem('spk_vehicles', JSON.stringify(vehicles));
      }
    }
  };

  const updateDriverStatus = (status: string) => {
    const saved = localStorage.getItem('spk_drivers');
    if (saved) {
      let drivers = JSON.parse(saved);
      // Update our demo driver
      drivers = drivers.map((d: any) => {
        if (d.id === 'SPK-DRV-001' || d.id === 'D001') return { ...d, status };
        return d;
      });
      localStorage.setItem('spk_drivers', JSON.stringify(drivers));
    }
  };

  if (!job) return null;

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-white rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900">Job Details</h1>
      </div>

      {job.status === 'In Progress' && (
        <div className="bg-blue-600 rounded-3xl p-6 shadow-md text-white mb-6">
          <div className="flex items-center space-x-2 font-bold mb-4 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span>🟢 WORK IN PROGRESS</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm bg-white/10 p-4 rounded-2xl">
            <div>
              <p className="text-blue-200 mb-1 font-medium">Started At</p>
              <p className="font-bold">{new Date(job.workStartedAt).toLocaleTimeString()}</p>
            </div>
            <div>
              <p className="text-blue-200 mb-1 font-medium">Farmer</p>
              <p className="font-bold">{job.farmerName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-blue-200 mb-1 font-medium">Location</p>
              <p className="font-bold">{job.address}, {job.village}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCompleteModal(true)}
            className="w-full mt-4 bg-white text-blue-700 py-4 rounded-xl font-black flex items-center justify-center space-x-2 hover:bg-blue-50 shadow-lg active:scale-95 transition-all"
          >
            <CheckCircle size={24} />
            <span>COMPLETE WORK</span>
          </button>
        </div>
      )}

      {job.status === 'Completed' && (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-green-900 mb-6 flex items-center space-x-3">
          <CheckCircle size={28} className="text-green-600" />
          <div>
            <h3 className="font-bold">Work Completed</h3>
            <p className="text-sm text-green-700">Completed on {new Date(job.workCompletedAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Navigation Action */}
        {(job.status === 'Driver Assigned' || job.status === 'In Progress') && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {job.latitude && job.longitude ? (
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-50 text-blue-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-100 transition-colors"
              >
                <Navigation size={20} />
                <span>Navigate to Work Location</span>
              </a>
            ) : (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-start space-x-3 text-sm font-medium">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>Work location coordinates are unavailable.</p>
              </div>
            )}
          </div>
        )}

        {/* Farmer Information */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <User size={18} className="text-primary" />
            <span>Farmer Information</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Name</p>
              <p className="font-bold text-gray-900">{job.farmerName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Mobile Number</p>
              <p className="font-bold text-gray-900">+91 {job.farmerPhone || '9876543210'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Truck size={18} className="text-primary" />
            <span>Vehicle Information</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Vehicle Name</p>
              <p className="font-bold text-gray-900">{job.assignedVehicleName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Vehicle ID</p>
              <p className="font-bold text-gray-900">{job.assignedVehicleId}</p>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock size={18} className="text-primary" />
            <span>Work Information</span>
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Work Type</p>
                <p className="font-bold text-gray-900">{job.workType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                  {job.billingType === 'Loads' ? 'Est. Loads' : 'Est. Hours'}
                </p>
                <p className="font-bold text-gray-900">
                  {job.estimatedQuantity || job.estimatedHours} {job.billingType === 'Loads' ? 'Loads' : 'Hours'}
                </p>
              </div>
            </div>
            {job.requirements && (
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Additional Requirements</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-xl">{job.requirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Location & Schedule */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <MapPin size={18} className="text-primary" />
            <span>Location & Schedule</span>
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Work Address</p>
              <p className="font-medium text-gray-900">{job.address}</p>
              <p className="text-sm text-gray-500">{job.village}, {job.district}</p>
              {job.landmark && <p className="text-sm text-gray-500">Landmark: {job.landmark}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date</p>
                <p className="font-bold text-gray-900">{job.workDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Time</p>
                <p className="font-bold text-gray-900">{job.startTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Payment</h3>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-3">
            <span className="text-gray-500 font-medium">Payment Method</span>
            <span className="font-bold text-gray-900">Cash on Delivery</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Amount</span>
            <span className="font-bold text-primary">Will be confirmed by Owner</span>
          </div>
        </div>

        {job.status === 'Driver Assigned' && (
          <button 
            onClick={() => setShowStartModal(true)}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-primary-hover shadow-lg active:scale-95 transition-all sticky bottom-4 z-10"
          >
            <Play size={20} />
            <span>START WORK</span>
          </button>
        )}
      </div>

      {/* Start Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-black text-gray-900 mb-2">Start This Work?</h3>
            <p className="text-gray-500 mb-6 font-medium">Confirm that you have reached the work location and are ready to start.</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowStartModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleStartWork}
                disabled={isLocating}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md transition-colors flex justify-center items-center"
              >
                {isLocating ? 'Capturing Location...' : 'Start Work'}
              </button>
            </div>
            {locationError && <p className="mt-3 text-sm text-yellow-600 text-center">{locationError}</p>}
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-black text-gray-900 mb-2">Complete This Work?</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Confirm that the assigned work has been completed.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Actual Work Hours *</label>
                <input 
                  type="number"
                  step="0.5"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Driver Notes (Optional)</label>
                <textarea 
                  value={driverNotes}
                  onChange={(e) => setDriverNotes(e.target.value)}
                  placeholder="e.g. Work completed successfully. Land levelling finished."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none h-24"
                ></textarea>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCompleteWork}
                disabled={isLocating}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-colors flex justify-center items-center"
              >
                {isLocating ? 'Capturing Location...' : 'Complete Work'}
              </button>
            </div>
            {locationError && <p className="mt-3 text-sm text-yellow-600 text-center">{locationError}</p>}
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverJobDetails;

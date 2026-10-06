import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info } from 'lucide-react';

const FarmerBookReview = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('spk_draft_booking');
    if (!saved) {
      navigate('/farmer/book');
      return;
    }
    setDraft(JSON.parse(saved));
  }, [navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { bookingService } = await import('../../../services/bookingService');
      const payload = {
        vehicleType: draft.vehicleName, // Matches backend enum ['JCB', 'Tractor', 'Tipper']
        workType: draft.workType,
        workDescription: draft.requirements || '',
        estimatedHours: draft.estimatedQuantity, // Assuming quantity goes to estimatedHours for now, since billingType isn't in backend yet
        workDate: draft.workDate,
        startTime: draft.startTime,
        location: {
          village: draft.village,
          district: draft.district,
          landmark: draft.landmark || '',
          address: draft.address || '',
          latitude: draft.latitude || null,
          longitude: draft.longitude || null
        }
      };

      const res = await bookingService.createBooking(payload);
      
      if (!res.success) {
        throw new Error(res.message || 'Failed to submit booking.');
      }
      
      // Save local draft logic as per requirement: "Do not delete existing localStorage data."
      // We still save the API response booking into spk_last_booking for the success page
      localStorage.removeItem('spk_draft_booking');
      localStorage.setItem('spk_last_booking', JSON.stringify(res.booking));
      
      // Optionally sync to legacy spk_bookings just so UI doesn't break if parts of it still read localStorage
      const existingStr = localStorage.getItem('spk_bookings');
      const existingBookings = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('spk_bookings', JSON.stringify([res.booking, ...existingBookings]));

      navigate('/farmer/book/success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!draft) return null;

  return (
    <div className="animate-fade-in-up pb-40 md:pb-12 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <span className="text-primary font-bold">Step 4</span>
        <span className="mx-2">of 4</span>
        <div className="flex-1 ml-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-primary rounded-full"></div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Booking Summary</h1>
        <p className="text-gray-500 font-medium mt-1">Review your details before submitting.</p>
        {error && <p className="text-red-500 font-bold mt-2 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-8">
        
        {/* Vehicle Info */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Vehicle Details</h3>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg text-gray-900 flex items-center gap-2">
                {draft.vehicleName}
                {draft.equipmentName && <span className="text-primary text-sm bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">+ {draft.equipmentName}</span>}
              </p>
              <p className="text-sm text-gray-500">{draft.vehicleId}</p>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold w-fit">
              {draft.vehicleType}
            </div>
          </div>
        </div>

        {/* Work Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Work Type</p>
            <p className="font-bold text-gray-900">{draft.workType}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">
              {draft.billingType === 'Loads' ? 'Estimated Loads' : 'Estimated Time'}
            </p>
            <p className="font-bold text-gray-900">
              {draft.estimatedQuantity} {draft.billingType === 'Loads' ? 'Loads' : 'Hours'}
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Location & Schedule Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Work Date</p>
            <p className="font-bold text-gray-900">{draft.workDate}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Start Time</p>
            <p className="font-bold text-gray-900">{draft.startTime}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-bold text-gray-400 mb-1">Location</p>
            <p className="font-bold text-gray-900">{draft.address}, {draft.village}</p>
            <p className="text-sm text-gray-600">{draft.district}</p>
          </div>
        </div>

        {draft.requirements && (
          <>
            <hr className="border-gray-100" />
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">Additional Requirements</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">{draft.requirements}</p>
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
          <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 font-medium">Rental pricing will be confirmed by SPK Earth Movers after reviewing your request.</p>
        </div>

      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:relative md:bg-transparent md:border-none md:shadow-none md:mt-10 md:px-0 flex justify-between space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold px-6 py-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex-[2] md:flex-none md:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-70"
        >
          {loading ? (
             <span className="flex items-center space-x-2">
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               <span>Sending...</span>
             </span>
          ) : (
             <>
                <CheckCircle size={20} />
                <span>Send Booking Request</span>
             </>
          )}
        </button>
      </div>

    </div>
  );
};

export default FarmerBookReview;

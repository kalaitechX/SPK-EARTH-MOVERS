import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import LocationPicker from '../../../components/maps/LocationPicker';

const FarmerBookLocation = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    village: '',
    district: '',
    landmark: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    workDate: '',
    startTime: ''
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const saved = localStorage.getItem('spk_draft_booking');
    if (!saved) {
      navigate('/farmer/book');
      return;
    }
    const draft = JSON.parse(saved);
    setFormData({
      village: draft.village || '',
      district: draft.district || '',
      landmark: draft.landmark || '',
      address: draft.address || '',
      latitude: draft.latitude || null,
      longitude: draft.longitude || null,
      workDate: draft.workDate || '',
      startTime: draft.startTime || ''
    });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleContinue = () => {
    const newErrors: any = {};
    if (!formData.village) newErrors.village = 'Required';
    if (!formData.district) newErrors.district = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.workDate) newErrors.workDate = 'Required';
    if (!formData.startTime) newErrors.startTime = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const saved = localStorage.getItem('spk_draft_booking');
    const draft = saved ? JSON.parse(saved) : {};
    
    localStorage.setItem('spk_draft_booking', JSON.stringify({
      ...draft,
      ...formData
    }));
    
    navigate('/farmer/book/review');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="animate-fade-in-up pb-40 md:pb-12 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <span className="text-primary font-bold">Step 3</span>
        <span className="mx-2">of 4</span>
        <div className="flex-1 ml-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-primary rounded-full"></div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Location & Time</h1>
        <p className="text-gray-500 font-medium mt-1">Where and when do you need the vehicle?</p>
      </div>

      <div className="space-y-6">
        {/* Location Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Where is the Work?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Village / Area <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className={`w-full border ${errors.village ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">District <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`w-full border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">Landmark</label>
              <input 
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby recognizable place"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">Work Address <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <LocationPicker 
              defaultLat={formData.latitude || undefined}
              defaultLng={formData.longitude || undefined}
              onLocationSelect={async (lat, lng) => {
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                  const data = await res.json();
                  if (data && data.address) {
                    const village = data.address.village || data.address.suburb || data.address.town || data.address.city || '';
                    const district = data.address.state_district || data.address.county || data.address.state || '';
                    const fullAddress = data.display_name || '';
                    
                    setFormData(prev => ({
                      ...prev,
                      village: prev.village || village,
                      district: prev.district || district,
                      address: fullAddress
                    }));
                  }
                } catch (err) {
                  console.error("Reverse geocoding failed", err);
                }
              }}
            />
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Date and Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Select Work Date <span className="text-red-500">*</span></label>
              <input 
                type="date"
                name="workDate"
                min={getTodayDate()}
                value={formData.workDate}
                onChange={handleChange}
                className={`w-full border ${errors.workDate ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Preferred Start Time <span className="text-red-500">*</span></label>
              <input 
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full border ${errors.startTime ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
              />
            </div>
          </div>
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
          onClick={handleContinue}
          className="flex-[2] md:flex-none md:w-64 flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all"
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default FarmerBookLocation;

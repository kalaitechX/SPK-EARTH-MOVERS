import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const FarmerBookWork = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    workType: '',
    estimatedQuantity: '',
    requirements: ''
  });

  const [errors, setErrors] = useState<{workType?: string, estimatedQuantity?: string}>({});
  const [vehicleName, setVehicleName] = useState<string>('');
  const [equipmentId, setEquipmentId] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('spk_draft_booking');
    if (!saved) {
      navigate('/farmer/book');
      return;
    }
    const draft = JSON.parse(saved);
    if (draft.vehicleName) {
      setVehicleName(draft.vehicleName);
    }
    if (draft.equipmentId) {
      setEquipmentId(draft.equipmentId);
    }
    setFormData({
      workType: draft.workType || '',
      estimatedQuantity: draft.estimatedQuantity || draft.estimatedHours || '',
      requirements: draft.requirements || ''
    });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const isLoadBased = (vehicleName || '').toLowerCase().includes('tipper') || 
                      equipmentId === 'EQ-TRAILER' || 
                      equipmentId === 'EQ-WATER-TANK';

  const handleContinue = () => {
    const newErrors: any = {};
    if (!formData.workType) newErrors.workType = 'Please select a work type';
    if (!formData.estimatedQuantity || Number(formData.estimatedQuantity) <= 0) {
      newErrors.estimatedQuantity = `Please enter valid estimated ${isLoadBased ? 'loads' : 'hours'}`;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const saved = localStorage.getItem('spk_draft_booking');
    const draft = saved ? JSON.parse(saved) : {};
    
    localStorage.setItem('spk_draft_booking', JSON.stringify({
      ...draft,
      ...formData,
      billingType: isLoadBased ? 'Loads' : 'Hours'
    }));
    
    navigate('/farmer/book/location');
  };

  const getWorkOptions = () => {
    const vName = (vehicleName || '').toLowerCase();
    if (vName.includes('tractor')) {
      return ['Agricultural Work', 'Field Operations', 'Hauling / Transportation', 'Ploughing', 'Other'];
    }
    if (vName.includes('tipper')) {
      return ['Material Transportation', 'Sand / Gravel Delivery', 'Soil Moving', 'Construction Waste Removal', 'Other'];
    }
    if (vName.includes('jcb')) {
      return ['Excavation', 'Land Levelling', 'Trench Digging', 'Demolition', 'Heavy Lifting', 'Other'];
    }
    return ['Agricultural Work', 'Land Levelling', 'Excavation', 'Material Transportation', 'Construction Work', 'Other'];
  };

  return (
    <div className="animate-fade-in-up pb-40 md:pb-12 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <span className="text-primary font-bold">Step 2</span>
        <span className="mx-2">of 4</span>
        <div className="flex-1 ml-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-2/4 h-full bg-primary rounded-full"></div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Tell Us About Your Work</h1>
        <p className="text-gray-500 font-medium mt-1">Provide details for the <span className="text-primary font-bold">{vehicleName}</span>.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Work Type <span className="text-red-500">*</span></label>
          <select 
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className={`w-full border ${errors.workType ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium`}
          >
            <option value="">Select Work Type</option>
            {getWorkOptions().map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.workType && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.workType}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            {isLoadBased ? 'Estimated Loads / Trips' : 'Estimated Hours'} <span className="text-red-500">*</span>
          </label>
          <input 
            type="number"
            name="estimatedQuantity"
            value={formData.estimatedQuantity}
            onChange={handleChange}
            placeholder={isLoadBased ? 'e.g. 5 loads' : 'e.g. 5 hours'}
            min="1"
            className={`w-full border ${errors.estimatedQuantity ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium`}
          />
          {errors.estimatedQuantity && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.estimatedQuantity}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Additional Requirements (Optional)</label>
          <textarea 
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Describe any special requirements..."
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium resize-none"
          ></textarea>
        </div>
      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:relative md:bg-transparent md:border-none md:shadow-none md:mt-10 md:px-0 flex justify-between space-x-4">
        <button 
          onClick={() => navigate('/farmer/book')}
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

export default FarmerBookWork;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialVehicles } from '../../../data/vehicles';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

const FarmerBook = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Load selected vehicle from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('spk_draft_booking');
    if (saved) {
      const draft = JSON.parse(saved);
      if (draft.vehicleId) setSelectedVehicle(draft.vehicleId);
    }
  }, []);

  const handleContinue = () => {
    if (!selectedVehicle) return;
    
    // Save to draft
    const saved = localStorage.getItem('spk_draft_booking');
    const draft = saved ? JSON.parse(saved) : {};
    
    const vehicle = initialVehicles.find(v => v.id === selectedVehicle);
    draft.vehicleId = selectedVehicle;
    draft.vehicleName = vehicle?.name;
    draft.vehicleType = vehicle?.type;
    
    localStorage.setItem('spk_draft_booking', JSON.stringify(draft));
    
    if (vehicle?.id === 'SPK-TRACTOR-01') {
      navigate('/farmer/book/equipment');
    } else {
      navigate('/farmer/book/details');
    }
  };

  return (
    <div className="animate-fade-in-up pb-40 md:pb-12">
      {/* Progress */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <span className="text-primary font-bold">Step 1</span>
        <span className="mx-2">of 4</span>
        <div className="flex-1 ml-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-primary rounded-full"></div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Choose Your Vehicle</h1>
        <p className="text-gray-500 font-medium mt-1">Select the machine you need for your work.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialVehicles.map(vehicle => (
          <div 
            key={vehicle.id}
            onClick={() => setSelectedVehicle(vehicle.id)}
            className={`bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border-2 relative flex flex-col ${
              selectedVehicle === vehicle.id 
                ? 'border-primary shadow-lg ring-4 ring-primary/10 transform -translate-y-1' 
                : 'border-transparent shadow-sm hover:shadow-md'
            }`}
          >
            {/* Selection Checkmark */}
            {selectedVehicle === vehicle.id && (
              <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md animate-fade-in-up">
                <Check size={18} strokeWidth={3} />
              </div>
            )}
            
            <div className="h-48 bg-gray-100 relative">
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{vehicle.name}</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">{vehicle.status}</span>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-3">{vehicle.id}</p>
              <p className="text-gray-600 text-sm flex-1 leading-relaxed">{vehicle.description}</p>
              
              <button 
                className={`w-full py-3 rounded-xl font-bold mt-6 transition-colors ${
                  selectedVehicle === vehicle.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {selectedVehicle === vehicle.id ? 'Selected' : `Select ${vehicle.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:relative md:bg-transparent md:border-none md:shadow-none md:mt-10 md:px-0 flex justify-between">
        <button 
          onClick={() => navigate('/farmer/dashboard')}
          className="hidden md:flex items-center space-x-2 text-gray-500 hover:text-gray-900 font-semibold px-6 py-4 rounded-xl border border-gray-200 bg-white"
        >
          <ArrowLeft size={20} />
          <span>Cancel</span>
        </button>
        <button 
          onClick={handleContinue}
          disabled={!selectedVehicle}
          className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            selectedVehicle 
              ? 'bg-primary text-white shadow-lg hover:bg-primary-hover active:scale-95' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default FarmerBook;

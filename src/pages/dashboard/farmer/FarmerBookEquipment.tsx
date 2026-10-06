import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import trailerImg from '../../../assets/equipment/trailer.jpg';
import cultivatorImg from '../../../assets/equipment/cultivator.jpg';
import ploughImg from '../../../assets/equipment/plough.jpg';
import rotavatorImg from '../../../assets/equipment/rotavator.webp';
import waterTankImg from '../../../assets/equipment/water tank.webp';

const equipmentOptions = [
  {
    id: 'EQ-TRAILER',
    name: 'Tractor Trailer / Dumper',
    image: trailerImg,
    description: 'Used for transporting soil, sand, crops, and construction materials.'
  },
  {
    id: 'EQ-CULTIVATOR',
    name: 'Cultivator (9-Tine)',
    image: cultivatorImg,
    description: 'Spring-loaded cultivator for tilling and preparing agricultural land.'
  },
  {
    id: 'EQ-PLOUGH',
    name: 'Plough',
    image: ploughImg,
    description: 'Heavy duty ploughing attachment for deep soil turning and preparation.'
  },
  {
    id: 'EQ-ROTAVATOR',
    name: 'Rotavator',
    image: rotavatorImg,
    description: 'Used for breaking up the soil, leveling, and seedbed preparation.'
  },
  {
    id: 'EQ-WATER-TANK',
    name: 'Water Tank',
    image: waterTankImg,
    description: 'Used for transporting water for agricultural and construction needs.'
  }
];

const FarmerBookEquipment = () => {
  const navigate = useNavigate();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spk_draft_booking');
    if (!saved) {
      navigate('/farmer/book');
      return;
    }
    const draft = JSON.parse(saved);
    if (draft.equipmentId) setSelectedEquipment(draft.equipmentId);
  }, [navigate]);

  const handleContinue = () => {
    if (!selectedEquipment) return;
    
    const saved = localStorage.getItem('spk_draft_booking');
    const draft = saved ? JSON.parse(saved) : {};
    
    const eq = equipmentOptions.find(e => e.id === selectedEquipment);
    draft.equipmentId = selectedEquipment;
    draft.equipmentName = eq?.name;
    
    localStorage.setItem('spk_draft_booking', JSON.stringify(draft));
    navigate('/farmer/book/details'); // Next step is work details
  };

  return (
    <div className="animate-fade-in-up pb-40 md:pb-12 max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <span className="text-primary font-bold">Step 1.5</span>
        <span className="mx-2">of 4</span>
        <div className="flex-1 ml-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-[37%] h-full bg-primary rounded-full"></div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Select Equipment</h1>
        <p className="text-gray-500 font-medium mt-1">You selected a Tractor. What attachment do you need?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {equipmentOptions.map(eq => (
          <div 
            key={eq.id}
            onClick={() => setSelectedEquipment(eq.id)}
            className={`bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border-2 relative flex flex-col ${
              selectedEquipment === eq.id 
                ? 'border-primary shadow-lg ring-4 ring-primary/10 transform -translate-y-1' 
                : 'border-transparent shadow-sm hover:shadow-md'
            }`}
          >
            {selectedEquipment === eq.id && (
              <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md animate-fade-in-up">
                <Check size={18} strokeWidth={3} />
              </div>
            )}
            
            <div className="h-48 bg-gray-100 relative">
              <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{eq.name}</h3>
              <p className="text-gray-600 text-sm flex-1">{eq.description}</p>
              
              <button 
                className={`w-full py-3 rounded-xl font-bold mt-4 transition-colors ${
                  selectedEquipment === eq.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {selectedEquipment === eq.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
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
          disabled={!selectedEquipment}
          className={`flex-[2] md:flex-none md:w-64 flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            selectedEquipment 
              ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95' 
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

export default FarmerBookEquipment;

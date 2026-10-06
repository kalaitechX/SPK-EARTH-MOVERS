import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, MoreVertical } from 'lucide-react';
import { initialVehicles } from '../../data/vehicles';

const OwnerVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Assigned': return 'bg-orange-100 text-orange-700';
      case 'Working': return 'bg-blue-100 text-blue-700';
      case 'Maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch(status) {
      case 'Available': return '🟢';
      case 'Assigned': return '🟠';
      case 'Working': return '🔵';
      case 'Maintenance': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Top Header for Mobile & Desktop */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/owner/dashboard')} className="text-gray-500 hover:text-gray-900 focus:outline-none p-1">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vehicle Management</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manage SPK Earth Movers vehicles and availability.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Vehicle</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Image Area */}
              <div className="h-48 bg-gray-200 relative">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center space-x-1.5 border border-white/20">
                  <span className="text-xs">{getStatusIndicator(vehicle.status)}</span>
                  <span className={`text-xs font-bold ${getStatusColor(vehicle.status).split(' ')[1]}`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{vehicle.name}</h2>
                    <p className="text-sm font-medium text-primary">{vehicle.id}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 p-1">
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <div className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium mb-3 self-start">
                  {vehicle.type}
                </div>
                
                <p className="text-gray-500 text-sm mb-6 flex-1">{vehicle.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button className="w-full py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                  <button className="w-full py-2.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl font-semibold hover:bg-secondary/20 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Vehicle Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Add New Vehicle</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Tipper" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. SPK-TIPPER-02" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerVehicles;

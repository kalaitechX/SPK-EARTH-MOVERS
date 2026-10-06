import { useNavigate } from 'react-router-dom';
import { Briefcase, Truck, PlayCircle, History, LogOut } from 'lucide-react';

const DriverDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <button 
            onClick={() => navigate('/role-selection')}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Today\'s Work', 'Assigned Vehicle', 'Start Work', 'Work History'].map((item, i) => {
            const icons = [<Briefcase />, <Truck />, <PlayCircle />, <History />];
            return (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  {icons[i]}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{item}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;

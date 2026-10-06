import { User, Tractor, Truck, Building, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-6 border border-gray-100">
          <Tractor size={32} className="text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Select Your Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium">
          Choose your account type to access the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full relative z-10 px-4">
        
        {/* Farmer */}
        <div 
          onClick={() => navigate('/farmer/login')}
          className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-in-up delay-100"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300 shadow-inner">
            <Tractor size={44} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Farmer</h2>
          <p className="text-gray-500 font-medium mb-8 flex-1 leading-relaxed">
            Book JCB, Tractor and Tipper vehicles for your agricultural needs.
          </p>
          <div className="flex items-center justify-center space-x-2 text-green-600 font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <span>Login to Portal</span>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Driver */}
        <div 
          onClick={() => navigate('/driver/login')}
          className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-in-up delay-200"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-inner">
            <Truck size={44} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Driver</h2>
          <p className="text-gray-500 font-medium mb-8 flex-1 leading-relaxed">
            View assigned jobs, manage your schedule, and track earnings.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-600 font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <span>Login to Portal</span>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Owner */}
        <div 
          onClick={() => navigate('/owner/login')}
          className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-in-up delay-300"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300 shadow-inner relative">
            <Building size={40} />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md">
              <User size={18} className="text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Owner</h2>
          <p className="text-gray-500 font-medium mb-8 flex-1 leading-relaxed">
            Manage vehicles, drivers, customer bookings and platform operations.
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-600 font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <span>Login to Portal</span>
            <ArrowRight size={20} />
          </div>
        </div>

      </div>
      
      <button 
        onClick={() => navigate('/')}
        className="mt-16 text-gray-500 hover:text-gray-900 font-semibold transition-colors flex items-center space-x-2 animate-fade-in-up delay-300 relative z-10"
      >
        <span>&larr;</span>
        <span>Back to Home</span>
      </button>
    </div>
  );
};

export default RoleSelection;

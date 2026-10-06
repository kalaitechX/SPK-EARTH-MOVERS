import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const trustFeatures = [
    "Reliable Service",
    "Experienced Drivers",
    "Flexible Rental",
    "Local Support"
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-32 bg-gradient-to-b from-gray-50 to-background">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl animate-pulse-slow delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-100 px-4 py-2 rounded-full shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700">Available for immediate booking</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Powering Your Work With <span className="text-gradient">Reliable Machines</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl font-medium leading-relaxed">
                JCB, Tractor and Tipper rental services for farming, construction and earth-moving projects. Professional equipment ready for deployment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4">
              <button 
                onClick={() => navigate('/farmer/login')}
                className="group relative flex items-center justify-center space-x-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_-10px_rgba(27,67,50,0.5)] w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative">Book a Vehicle</span>
                <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#vehicles"
                className="flex items-center justify-center space-x-2 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>View Fleet</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-8 w-full max-w-md border-t border-gray-200/60 mt-8">
              {trustFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-gray-700 font-semibold text-sm">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Abstract Image Presentation */}
          <div className="relative animate-fade-in-up delay-200 hidden lg:block h-[600px]">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-dashed border-gray-300 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

            {/* Main Floating Cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md">
                
                {/* JCB Card */}
                <div className="absolute top-10 left-0 glass p-6 rounded-2xl w-64 animate-float z-20 hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-inner">🏗️</div>
                  <h3 className="font-bold text-gray-900 text-lg">Heavy Excavator</h3>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-3/4"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Availability: High</p>
                </div>

                {/* Tractor Card */}
                <div className="absolute top-1/2 -right-10 -translate-y-1/2 glass p-6 rounded-2xl w-72 animate-float-delayed z-30 hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-3xl shadow-inner">🚜</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Pro Tractor</h3>
                      <p className="text-sm font-medium text-green-600">Farming Ready</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Deployed</span>
                    </span>
                  </div>
                </div>

                {/* Tipper Card */}
                <div className="absolute bottom-10 left-10 glass p-6 rounded-2xl w-64 animate-float z-20 hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: '1.5s' }}>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-inner">🚛</div>
                  <h3 className="font-bold text-gray-900 text-lg">Tipper Truck</h3>
                  <div className="flex space-x-1 mt-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 flex-1 bg-blue-200 rounded-full"></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Material Transport</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

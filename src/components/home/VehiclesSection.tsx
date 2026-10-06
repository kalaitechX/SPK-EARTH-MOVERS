import { Tractor, LoaderPinwheel, Truck } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import tipperImage from '../../assets/vehicles/tipper.jpg';
import jcbImage from '../../assets/vehicles/jcb.jpg';
import tractorImage from '../../assets/vehicles/tractor.webp';

interface VehicleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  buttonText: string;
}

const VehicleCard = ({ title, description, icon, image, buttonText }: VehicleCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
      {/* Image Area */}
      <div className="h-56 bg-gray-100 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-primary">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 flex-1 leading-relaxed">{description}</p>
        <button 
          onClick={() => navigate('/farmer/login')}
          className="w-full bg-white text-primary border-2 border-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors active:scale-95"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const VehiclesSection = () => {
  const vehicles = [
    {
      title: "Tractor",
      description: "Suitable for agricultural work, transportation and field operations.",
      icon: <Tractor size={24} />,
      image: tractorImage,
      buttonText: "Request Tractor"
    },
    {
      title: "JCB",
      description: "Ideal for excavation, land levelling and construction work.",
      icon: <LoaderPinwheel size={24} />,
      image: jcbImage,
      buttonText: "Request JCB"
    },
    {
      title: "Tipper",
      description: "Reliable transportation for sand, soil, gravel and construction materials.",
      icon: <Truck size={24} />,
      image: tipperImage,
      buttonText: "Request Tipper"
    }
  ];

  return (
    <section id="vehicles" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Vehicles</h2>
          <p className="text-lg text-gray-600">Choose the right machine for your work.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v, i) => (
            <VehicleCard key={i} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehiclesSection;

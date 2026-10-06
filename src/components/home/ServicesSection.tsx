import { Sprout, Ruler, Shovel, Package } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      title: "Agricultural Work",
      description: "Complete tractor and farming solutions for optimal yield.",
      icon: <Sprout size={32} />
    },
    {
      title: "Land Levelling",
      description: "Precision grading and levelling for construction and fields.",
      icon: <Ruler size={32} />
    },
    {
      title: "Excavation",
      description: "Deep excavation, trenching and earth-moving services.",
      icon: <Shovel size={32} />
    },
    {
      title: "Material Transportation",
      description: "Safe and timely delivery of construction materials.",
      icon: <Package size={32} />
    }
  ];

  return (
    <section id="services" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm text-secondary flex items-center justify-center mb-6">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

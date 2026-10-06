import { ShieldCheck, Users, BadgeIndianRupee, MapPin } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Reliable Machinery",
      icon: <ShieldCheck size={28} />
    },
    {
      title: "Experienced Drivers",
      icon: <Users size={28} />
    },
    {
      title: "Transparent Pricing",
      icon: <BadgeIndianRupee size={28} />
    },
    {
      title: "Local Service",
      icon: <MapPin size={28} />
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SPK Earth Movers?</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{f.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

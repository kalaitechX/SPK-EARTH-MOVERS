import { PhoneCall, MapPin, MessageCircle } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Need a Vehicle for Your Work?</h2>
          <p className="text-lg text-gray-600">
            Tell us what machine you need and where the work is located.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          
          <div className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl text-center border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <PhoneCall size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>
          
          <div className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl text-center border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Service Location</h3>
            <p className="text-gray-600">Tamil Nadu, India</p>
          </div>

          <div className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl text-center border border-gray-100">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;

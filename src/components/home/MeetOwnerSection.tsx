import React from 'react';
import ownerImg from '../../assets/owner/spk-owner.png';

const MeetOwnerSection = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left mb-10 md:mb-12 hidden md:block">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Meet the SPK Owner</h2>
          <p className="mt-4 text-xl text-primary font-semibold">SPK Earth Movers</p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          {/* Mobile Heading */}
          <div className="text-center md:hidden w-full mb-2">
            <h2 className="text-3xl font-extrabold text-gray-900">Meet the SPK Owner</h2>
            <p className="mt-2 text-lg text-primary font-semibold">SPK Earth Movers</p>
          </div>

          {/* LEFT: Owner Photo */}
          <div className="shrink-0">
            <div className="w-[180px] md:w-[220px] lg:w-[250px] aspect-[3/4] relative rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border-4 border-[#2E7D32]/20">
              <img 
                src={ownerImg} 
                alt="SPK Owner" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT: Text content */}
          <div className="flex flex-col justify-center text-center md:text-left h-full pt-2 md:pt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">SPK Owner</h3>
            <p className="text-lg text-gray-600 mb-6 font-medium">SPK Earth Movers</p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl italic">
              "Committed to providing reliable machinery and trusted service for every project."
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center space-x-2 bg-[#F3ECE1] px-4 py-2 rounded-full border border-[#d2b896]/30 shadow-sm transition-transform hover:scale-105 cursor-default">
                <span className="text-xl">🚜</span>
                <span className="font-semibold text-[#5c4a3d]">JCB</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#F3ECE1] px-4 py-2 rounded-full border border-[#d2b896]/30 shadow-sm transition-transform hover:scale-105 cursor-default">
                <span className="text-xl">🚜</span>
                <span className="font-semibold text-[#5c4a3d]">Tractor</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#F3ECE1] px-4 py-2 rounded-full border border-[#d2b896]/30 shadow-sm transition-transform hover:scale-105 cursor-default">
                <span className="text-xl">🚛</span>
                <span className="font-semibold text-[#5c4a3d]">Tipper</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetOwnerSection;

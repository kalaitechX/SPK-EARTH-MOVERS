const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 border-y border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About SPK Earth Movers</h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
          SPK Earth Movers provides dependable JCB, Tractor and Tipper rental services for farmers, construction projects and local earth-moving requirements.
        </p>
        <a 
          href="#contact"
          className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-black transition-colors shadow-md"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default AboutSection;

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Choose a Vehicle",
      desc: "Select JCB, Tractor or Tipper."
    },
    {
      num: "02",
      title: "Send Your Request",
      desc: "Provide your work location, date and requirements."
    },
    {
      num: "03",
      title: "Get Your Work Done",
      desc: "Our assigned driver completes the job."
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-800 -z-10"></div>
              )}
              <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-4xl font-black text-gray-600 mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-xl border-4 border-gray-900">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

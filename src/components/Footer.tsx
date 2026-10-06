const Footer = () => {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Vehicles', href: '#vehicles' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 text-center md:text-left space-y-8 md:space-y-0">
          
          <div className="max-w-sm">
            <h2 className="text-2xl font-bold text-white mb-2">SPK Earth Movers</h2>
            <p className="text-gray-400 italic">"Reliable Machines. Trusted Service."</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 SPK Earth Movers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

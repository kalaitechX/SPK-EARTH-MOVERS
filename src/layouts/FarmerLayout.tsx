import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, PlusCircle, MapPin, User, ArrowLeft, LogOut, CreditCard } from 'lucide-react';
import logoImage from '../assets/logo.png';
import { NotificationBell } from '../components/notifications/NotificationBell';

const FarmerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();
  
  const handleLogout = () => {
    if(window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/role-selection');
    }
  };

  type NavItem = {
    label: string;
    icon: React.ReactNode;
    path: string;
    isPrimary?: boolean;
    isComingSoon?: boolean;
  };

  const navItems: NavItem[] = [
    { label: 'Home', icon: <Home size={24} />, path: '/farmer/dashboard' },
    { label: 'Bookings', icon: <Calendar size={24} />, path: '/farmer/bookings' },
    { label: 'Book', icon: <PlusCircle size={24} />, path: '/farmer/book', isPrimary: true },
    { label: 'Tracking', icon: <MapPin size={24} />, path: '/farmer/tracking' },
    { label: 'Payments', icon: <CreditCard size={24} />, path: '/farmer/payments' },
    { label: 'Profile', icon: <User size={24} />, path: '#' },
  ];

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col md:flex-row font-sans overflow-hidden relative">
      
      {/* Mobile Header */}
      <div className="md:hidden shrink-0 bg-white shadow-sm px-4 h-16 flex items-center justify-between border-b border-gray-100 z-40">
        <div className="flex items-center space-x-2">
          {location.pathname !== '/farmer/dashboard' && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
              <ArrowLeft size={24} />
            </button>
          )}
          <img src={logoImage} alt="SPK Logo" className="h-8" />
        </div>
        <div className="flex items-center space-x-2">
          <NotificationBell basePath="/farmer" />
          <div className="text-sm font-semibold text-primary mr-2 hidden sm:block">Farmer</div>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 h-screen z-40">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 shrink-0">
          <img src={logoImage} alt="SPK Logo" className="h-10" />
          <span className="font-bold text-lg">Farmer Portal</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item, i) => (
            <button 
              key={i}
              onClick={() => {
                if (!item.isComingSoon) navigate(item.path);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.isComingSoon && <span className="ml-auto text-[10px] uppercase font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>}
            </button>
          ))}
        </div>
        
        {/* Desktop Logout */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative z-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden shrink-0 bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2 pb-safe z-50 h-[72px]">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              if (!item.isComingSoon) navigate(item.path);
            }}
            className={`flex flex-col items-center justify-center p-2 relative ${
              item.isPrimary ? '-mt-6' : ''
            }`}
          >
            {item.isPrimary ? (
              <div className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-gray-50">
                {item.icon}
              </div>
            ) : (
              <>
                <div className={`${location.pathname === item.path ? 'text-primary' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium mt-1 ${location.pathname === item.path ? 'text-primary' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                {item.isComingSoon && (
                  <div className="absolute -top-1 -right-2 text-[8px] uppercase font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-sm">
                    Soon
                  </div>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FarmerLayout;

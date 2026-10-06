import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, Truck, User, ArrowLeft, BarChart2, CreditCard, Users, MapPin, LogOut } from 'lucide-react';
import { useState } from 'react';
import logoImage from '../assets/logo.png';
import { NotificationBell } from '../components/notifications/NotificationBell';
import { useNotifications } from '../context/NotificationContext';

const OwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const { logout, user } = useAuth();

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
    isComingSoon?: boolean;
    badge?: number | null;
  };

  const mobileNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <Home size={24} />, path: '/owner/dashboard' },
    { label: 'Bookings', icon: <Calendar size={24} />, path: '/owner/bookings' },
    { label: 'Vehicles', icon: <Truck size={24} />, path: '/owner/vehicles' },
    { label: 'Tracking', icon: <MapPin size={24} />, path: '/owner/tracking' },
    { label: 'Payments', icon: <CreditCard size={24} />, path: '/owner/payments' },
    { label: 'Profile', icon: <User size={24} />, path: '#' },
  ];

  const desktopNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/owner/dashboard' },
    { label: 'Bookings', icon: <Calendar size={20} />, path: '/owner/bookings', badge: unreadCount > 0 ? unreadCount : null },
    { label: 'Vehicles', icon: <Truck size={20} />, path: '/owner/vehicles' },
    { label: 'Drivers', icon: <Users size={20} />, path: '#', isComingSoon: true },
    { label: 'Tracking', icon: <MapPin size={20} />, path: '/owner/tracking' },
    { label: 'Payments', icon: <CreditCard size={20} />, path: '/owner/payments' },
    { label: 'Reports', icon: <BarChart2 size={20} />, path: '#', isComingSoon: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-40 px-4 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {location.pathname !== '/owner/dashboard' && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
              <ArrowLeft size={24} />
            </button>
          )}
          <img src={logoImage} alt="SPK Logo" className="h-8" />
          <span className="font-bold text-gray-900 hidden sm:inline">Owner</span>
        </div>
        <div className="flex items-center space-x-2">
          <NotificationBell basePath="/owner" />
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
          <img src={logoImage} alt="SPK Logo" className="h-10" />
          <span className="font-bold text-lg">Owner Portal</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {desktopNavItems.map((item, i) => (
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
              {item.badge && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                  location.pathname === item.path ? 'bg-white text-primary' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.isComingSoon && <span className="ml-auto text-[10px] uppercase font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>}
            </button>
          ))}
        </div>
        
        {/* Desktop Profile & Settings */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-colors text-left">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
              {user?.name ? user.name[0].toUpperCase() : 'O'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user?.name || 'SPK Earth Movers'}</p>
              <p className="text-xs text-gray-500 font-medium">{user?.mobile || 'Owner Account'}</p>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop Topbar */}
        <div className="hidden md:flex bg-white shadow-sm h-16 items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <h1 className="font-bold text-xl text-gray-800 capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationBell basePath="/owner" />
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2 pb-safe z-50">
        {mobileNavItems.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              if (!item.isComingSoon) navigate(item.path);
            }}
            className="flex flex-col items-center justify-center p-2 relative w-1/5"
          >
            <div className={`${location.pathname === item.path ? 'text-primary' : 'text-gray-400'}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-medium mt-1 truncate w-full ${location.pathname === item.path ? 'text-primary' : 'text-gray-500'}`}>
              {item.label}
            </span>
            {item.isComingSoon && (
              <div className="absolute top-0 right-1 text-[8px] uppercase font-bold bg-orange-100 text-orange-600 px-1 rounded-sm shadow-sm scale-75 origin-right">
                Soon
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OwnerLayout;

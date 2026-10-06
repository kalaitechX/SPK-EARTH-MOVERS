import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, History, User } from 'lucide-react';
import { NotificationBell } from '../components/notifications/NotificationBell';

const DriverLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/driver/jobs', icon: Briefcase },
    { name: 'History', path: '/driver/history', icon: History },
    { name: 'Profile', path: '/driver/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div>
          <h1 className="font-black text-xl tracking-tight">SPK Earth Movers</h1>
          <p className="text-xs font-medium text-white/80">Driver Portal</p>
        </div>
        <div className="bg-white/10 rounded-full flex items-center justify-center text-white">
          <NotificationBell basePath="/driver" />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-primary text-white fixed h-full z-20">
        <div className="p-6">
          <h1 className="font-black text-2xl tracking-tight leading-tight">SPK Earth Movers</h1>
          <p className="text-sm font-medium text-white/80 mt-1">Driver Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-white text-primary shadow-lg shadow-black/10' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to logout?')) {
                logout();
                navigate('/role-selection');
              }
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <User size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative pb-20 md:pb-0">
        {/* Desktop Top Nav */}
        <div className="hidden md:flex items-center justify-between p-6 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">Driver Portal</h2>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell basePath="/driver" />
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name || 'Driver'}</p>
                <p className="text-xs text-gray-500">{user?.mobile}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {user?.name ? user.name[0].toUpperCase() : 'D'}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around pb-safe z-30">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-3 px-2 w-full transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <item.icon size={24} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DriverLayout;

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationBell = ({ basePath }: { basePath: string }) => {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    
    // Navigate based on type
    if (notification.bookingId) {
      if (basePath === '/owner') {
        navigate(`/owner/bookings/${notification.bookingId}`);
      } else if (basePath === '/farmer') {
        navigate(`/farmer/bookings/${notification.bookingId}`);
      } else if (basePath === '/driver') {
        navigate(`/driver/jobs/${notification.bookingId}`);
      }
    } else {
      navigate(`${basePath}/notifications`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors relative"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute top-[72px] sm:top-auto right-4 sm:right-0 left-4 sm:left-auto sm:mt-2 sm:w-80 bg-white rounded-3xl sm:rounded-2xl shadow-2xl sm:shadow-xl border border-gray-100 overflow-hidden z-[100] animate-fade-in-up">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div 
            onClick={() => {
              setIsOpen(false);
              navigate(`${basePath}/notifications`);
            }}
            className="p-3 text-center text-sm text-primary font-bold hover:bg-gray-50 cursor-pointer border-t border-gray-100"
          >
            View All Notifications
          </div>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Truck, Info, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';

const OwnerNotifications = () => {
  const navigate = useNavigate();
  const { notifications: contextNotifications, fetchNotifications, markAllAsRead, markAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await fetchNotifications(1, 50);
        if (res?.success) {
          setNotifications(res.notifications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotifs();
  }, []);

  // Update local list if context updates (real-time via socket)
  useEffect(() => {
    if (contextNotifications.length > 0) {
      // Simplistic merge for demo purposes
      setNotifications(prev => {
        const unique = [...contextNotifications];
        prev.forEach(p => {
          if (!unique.find(u => u._id === p._id)) unique.push(p);
        });
        return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    }
  }, [contextNotifications]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'NEW_BOOKING': return <Bell size={24} className="text-red-500" />;
      case 'BOOKING_ACCEPTED': return <CheckCircle size={24} className="text-green-500" />;
      case 'DRIVER_ASSIGNED': return <Truck size={24} className="text-blue-500" />;
      case 'WORK_COMPLETED': return <CheckCircle size={24} className="text-green-600" />;
      default: return <Info size={24} className="text-gray-500" />;
    }
  };

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 font-medium mt-1">Stay updated with your business operations.</p>
        </div>
        <button 
          onClick={async () => {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({...n, isRead: true})));
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors text-sm"
        >
          <CheckCheck size={18} />
          <span className="hidden sm:inline">Mark All as Read</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading Notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">All caught up!</h2>
          <p className="text-gray-500 font-medium">You have no new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {notifications.map((notif, index) => (
            <div 
              key={notif._id}
              onClick={() => {
                if (!notif.isRead) markAsRead(notif._id);
                if (notif.bookingId) navigate(`/owner/bookings/${notif.bookingId}`);
              }}
              className={`p-5 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                index !== notifications.length - 1 ? 'border-b border-gray-100' : ''
              } ${!notif.isRead ? 'bg-red-50/30' : ''}`}
            >
              <div className="shrink-0 pt-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  notif.type === 'NEW_BOOKING' ? 'bg-red-50' :
                  notif.type === 'BOOKING_ACCEPTED' ? 'bg-green-50' :
                  'bg-blue-50'
                }`}>
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-bold text-gray-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={`text-sm ${!notif.isRead ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {notif.message}
                </p>
              </div>
              {!notif.isRead && (
                <div className="shrink-0 flex items-center justify-center w-4">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default OwnerNotifications;

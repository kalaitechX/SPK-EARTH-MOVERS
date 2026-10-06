import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2, Send } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export const PushNotificationSettings = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const checkSubscription = async () => {
    try {
      // Check if registration exists without blocking indefinitely
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } else {
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (Notification.permission === 'denied') {
        throw new Error('Notification permission denied. Please enable it in your browser settings.');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted.');
      }

      // Ensure SW is ready and active with a timeout
      const readyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service Worker initialization timed out. Try reloading the page.')), 5000)
      );
      const registration = (await Promise.race([readyPromise, timeoutPromise])) as ServiceWorkerRegistration;

      if (!registration || !registration.active) {
         throw new Error('Service Worker is not active. Try reloading the page.');
      }

      if (!registration.pushManager) {
        throw new Error('Push Manager is not available on this browser.');
      }

      const configRes = await notificationService.getVapidPublicKey().catch(() => {
        throw new Error('Failed to reach backend for configuration.');
      });
      const vapidKey = configRes.vapidPublicKey;
      
      if (!vapidKey) {
        throw new Error('VAPID Key not returned from server');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // Send to backend
      const res = await notificationService.subscribePush(subscription);
      if (res.success) {
        setIsSubscribed(true);
      } else {
        throw new Error(res.message || 'Failed to subscribe on server');
      }
    } catch (err: any) {
      console.error('Failed to subscribe:', err);
      setError(err.message || 'Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setIsSubscribed(false);
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await notificationService.unsubscribePush(subscription.endpoint);
      }
      
      setIsSubscribed(false);
    } catch (err: any) {
      console.error('Failed to unsubscribe:', err);
      setError(err.message || 'Failed to disable notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPush = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationService.testPush();
      if (!res.success) {
        throw new Error(res.message || 'Failed to send test push.');
      }
    } catch (err: any) {
      console.error('Test push error:', err);
      setError(err.message || 'Error triggering test notification.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-gray-900 flex items-center space-x-2">
          <BellOff size={20} className="text-gray-400" />
          <span>Background Notifications</span>
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Your browser does not support background push notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            {isSubscribed ? <Bell size={20} className="text-primary" /> : <BellOff size={20} className="text-gray-400" />}
            <span>Background Notifications</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            Receive updates about your bookings and jobs even when the app is closed.
          </p>
        </div>
        
        <div>
          {loading ? (
            <button disabled className="px-6 py-2 bg-gray-100 text-gray-500 rounded-xl font-bold flex items-center space-x-2">
              <Loader2 size={18} className="animate-spin" />
              <span>Please wait...</span>
            </button>
          ) : isSubscribed ? (
            <div className="flex space-x-2">
              {user?.role === 'owner' && (
                <button 
                  onClick={handleTestPush}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-colors flex items-center space-x-1"
                >
                  <Send size={16} />
                  <span>Test</span>
                </button>
              )}
              <button 
                onClick={handleUnsubscribe}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Disable Notifications
              </button>
            </div>
          ) : (
            <button 
              onClick={handleSubscribe}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              Enable Notifications
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};

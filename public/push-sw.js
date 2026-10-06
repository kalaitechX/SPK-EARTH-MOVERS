self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'You have a new notification',
        icon: data.icon && data.icon.startsWith('/') ? data.icon : '/pwa-192x192.png',
        badge: data.badge && data.badge.startsWith('/') ? data.badge : '/pwa-192x192.png',
        vibrate: [100, 50, 100],
        data: data.data || { url: '/' },
        tag: data.tag || 'spk-notification',
        renotify: true
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'SPK Earth Movers', options)
      );
    } catch (e) {
      console.error('[Push SW] Error parsing push payload or showing notification:', e);
      event.waitUntil(
        self.registration.showNotification('SPK Earth Movers', {
          body: 'You have a new notification',
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;
    
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});

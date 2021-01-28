const cacheName = 'hirent-assets-v3';
const cacheFiles = [
  '/images/apartment.svg',
  '/images/house.svg',
  '/images/office.svg',
  '/images/favicon.ico',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-72x72.png'
]

self.addEventListener('install', event => {
  console.log('Service Worker: įrašinėjamas...');
  event
    .waitUntil(caches
      .open(cacheName)
      .then(cache => cache
        .addAll(cacheFiles)));
});

self.addEventListener('activate', event => {
  console.log('Service Worker: aktyvuojamas...');
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event
      .respondWith(
        fetch(event.request)
          .catch(() => {
            console.log(caches);
            return caches
              .match(event.request)
          })
      );
  }
});

self.addEventListener('push', event => {
  const data = event.data.json();

  console.log(event.data.json());

  const promiseNotification = self
    .registration
    .showNotification(data.title, {
      body: data.content,
      icon: 'https://hirent.herokuapp.com/images/icons/icon-96x96.png',
      badge: 'https://hirent.herokuapp.com/images/badge.png',
      vibrate: [200, 100, 200],
      silent: false,
      requireInteraction: true
    });

  event.waitUntil(promiseNotification);
});

self.addEventListener('notificationclick', event => {
  const url = 'https://hirent.herokuapp.com';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
const CACHE_NAME = 'my-site-cache-v0.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/image/ic_config.svg'
];

self.addEventListener('install', function(event) {
  // インストール処理
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(keyList => {
    return Promise.all(keyList.map(key => {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    }));
  }));
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
          // キャッシュがある場合そのレスポンスを返す
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
  );
});

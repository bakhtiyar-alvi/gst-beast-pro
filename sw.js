// Change this version number EVERY time you update your HTML code!
const CACHE_NAME = 'gst-beast-v4.5.0'; 

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg' // (Or icon.png if you kept the SVG)
];

// 1. Install Step
self.addEventListener('install', event => {
    self.skipWaiting(); // Forces the new version to take over immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// 2. NEW: Activate Step (The Cache Cleaner)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // If the cache name doesn't match the current version, delete it!
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old offline cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Applies the update to open windows immediately
});

// 3. Fetch Step
self.addEventListener('fetch', event => {
    if (event.request.url.includes('googleapis.com') || event.request.url.includes('accounts.google.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// service-worker.js
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('offline-cache').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html'
                // افزودن فایل‌های دیگر به دلخواه
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

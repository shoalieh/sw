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
            if (response) {
                return response;
            }

            // اگر محتوا در کش نباشد، از شبکه درخواست کنید
            return fetch(event.request).then(function (response) {
                // چک کردن و ذخیره محتوا در کش
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open('offline-cache').then(function (cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});

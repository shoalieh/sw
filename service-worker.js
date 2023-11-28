// service-worker.js

const CACHE_NAME = "offline-cache";
const OFFLINE_URL = "/offline-notification.html";
const ONLINE_URL = "/online.html";
const HOME_URL = "/index.html";
const NOTIFICATION_WORKER_PATH = "/notification-worker.js";

let isOffline = false;

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([OFFLINE_URL, ONLINE_URL, HOME_URL]);
        })
    );
    self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    return caches.match(new Request(OFFLINE_URL));
                })
        );
    }
});

self.addEventListener("online", () => {
    isOffline = false;
    clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
            if (client.url === self.location.href && !isOffline) {
                if (!client.url.includes(HOME_URL)) {
                    client.navigate(ONLINE_URL);
                }
            }
        });
    });
});

self.addEventListener("offline", () => {
    isOffline = true;
    clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
            if (client.url === self.location.href) {
                client.navigate(OFFLINE_URL);
            }
        });
    });

    clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "SHOW_OFFLINE_NOTIFICATION" });
        });
    });
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        self.clients.claim()
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        navigator.serviceWorker.register(NOTIFICATION_WORKER_PATH)
    );
});

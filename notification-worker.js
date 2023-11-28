// notification-worker.js

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SHOW_OFFLINE_NOTIFICATION") {
        event.waitUntil(
            self.registration.showNotification("Offline", {
                body: "You are currently offline. Please check your internet connection.",
            })
        );
    }
});

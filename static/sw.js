self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("v1").then((cache) => {
            return cache.addAll([
                "./",
                "./static/index.html",
                "./static/styles.css",
                "./static/script.js",
                "./static/manifest.json",
                "./icons/icon-192x192.png",
                "./icons/icon-512x512.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

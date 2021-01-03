console.log("in service-worker.js")

// setup service worker for offline experience
const CACHE_NAME = "static-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1"

// all static files
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/db.js",
    "/styles.css",
    "/manifest.webmanifest"
];

// install
self.addEventListener("install", (evt) => {

    // cache data
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            // start immediately 
            .then(() => self.skipWaiting())
    );
});

// activate
self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches
            .keys()
            .then(keyList => {
                return Promise.all(
                    keyList.map(key => {

                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            console.log("removeing old cache", key);
                            return caches.delete(key);

                        }

                    })
                );
            })
    );
    self.clients.claim();
});

// fetch
self.addEventListener("fetch", (evt) => {
    if (evt.request.url.includes("/api/")) {

        evt.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then(cache => {
                    return fetch(evt.request)
                        .then(response => {

                            // if valid response, clone it to cache storage
                            if (response.status === 200) {
                                caches.put(evt.request.url, response.clone());
                            }

                            return response;
                        })
                        .catch(err => {

                            // if no network access, pull from cache
                            return cache.match(evt.request);
                        });
                })
                .catch(err => console.log(err))
        );
        return;
    }

    evt.responsdWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })

    );
});


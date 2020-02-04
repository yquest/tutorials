declare const clients: any;
const sw = self as ({ clients: any[] } & ServiceWorkerContainer) | any;
const cacheName = "v7";
const assets = [
  "/",
  "/bundle.js",
  "/f6121be597a72928f54e7ab5b95512a1.woff2",
  "/tests",
  "favicon.ico"
];

function deleteOldCaches(cacheNames: any) {
  return Promise.all(
    cacheNames
      .filter(function(current) {
        const currentVersion = cacheName.substring(1);
        const checkVersion = current.substring(1);
        return checkVersion < currentVersion;
      })
      .map(function(cacheName) {
        return caches.delete(cacheName);
      })
  );
}

function cacheOnFetch(request, response, cache) {
  return response;
}

self.addEventListener("install", function(event: any) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(assets);
    }).then(() => sw.skipWaiting())
  );
});

sw.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(deleteOldCaches));
});

sw.addEventListener("fetch", function(event: any) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache
        .match(event.request, {ignoreSearch: true})
        .then(function(response) {
          const req = event.request;
          if (response && true) {
            console.log("cached:" + req.url);
          }
          return (
            response ||
            fetch(req).then(function(response) {
              return cacheOnFetch(req, response, cache);
            })
          );
        })        
    })
  );
});

sw.addEventListener("message", function handler(event) {
  console.log(event.data);
  event.ports[0].postMessage("just a test");
});

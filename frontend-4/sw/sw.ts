declare const clients: any;
const sw = self as ({ clients: any[] } & ServiceWorkerContainer) | any;
const cacheName = "v-1";
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
        const currentVersion:number = Number(cacheName.substring(1));
        const checkVersion:number = Number(current.substring(1));
        return checkVersion < currentVersion || currentVersion == -1;
      })
      .map(function(cacheName) {
        console.log(`deleting ${cacheName}`);
        return caches.delete(cacheName);
      })
  );
}

function cacheOnFetch(request, response, cache) {
  return response;
}

sw.addEventListener("install", function(event: any) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log(`cache all assets ${cacheName}`);
      return cache.addAll(assets);
    }).then(() => sw.skipWaiting())
  );
});

sw.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(deleteOldCaches));
});

sw.addEventListener("fetch", function(event: any) {
  console.log(`fetching ${event.request.url}`);
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

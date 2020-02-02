const cacheName = "v1";
const cachesAssets = ["/", "/bundle.js"];
var CURRENT_CACHES = {
  'post-message': 'post-message-cache-v' + cacheName
};
self.addEventListener("activate", e => {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });
  caches
    .keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(function() {
      console.log(clients);
      return clients.claim();
    })
    .then(function() {
      // After the activation and claiming is complete, send a message to each of the controlled
      // pages letting it know that it's active.
      // This will trigger navigator.serviceWorker.onmessage in each client.
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(
          clients.map(function(client) {
            return client.postMessage(
              "The service worker has activated and " + "taken control."
            );
          })
        );
      });
    });
});
self.addEventListener("message", function handler(event) {
  console.log(event.data);
  event.ports[0].postMessage("just a test");
});
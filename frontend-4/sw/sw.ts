declare const clients: any;
const sw = self as ({ clients: any[] } & ServiceWorkerContainer) | any;
const cacheName = "v1";

sw.addEventListener("fetch", function(event: any) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (
          response ||
          fetch(event.request).then(function(response) {
            if (event.request.url.startsWith("http") && !event.request.url.startsWith(location.origin +"/sockjs-node")){
                console.log("cached http->",event.request.url);
                cache.put(event.request, response.clone());
            }
            return response;
          })
        );
      });
    })
  );
});

sw.addEventListener("message", function handler(event) {
  console.log(event.data);
  event.ports[0].postMessage("just a test");
});

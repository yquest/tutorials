declare const clients: any;
const sw = self as ({ clients: any[] } & ServiceWorkerContainer) | any;
const cacheName = "v-1";
const assets = [
  "/",
  "/bundle.js",
  "/f6121be597a72928f54e7ab5b95512a1.woff2",
  "/tests",
  "/favicon.ico",
  "/nonet.svg"
];

var sse = null;

function deleteOldCaches(cacheNames: any) {
  return Promise.all(
    (cacheNames || [])
      .filter(function (current) {
        const currentVersion: number = Number(cacheName.substring(1));
        const checkVersion: number = Number(current.substring(1));
        return checkVersion < currentVersion || currentVersion == -1;
      })
      .map(function (cacheName) {
        console.log(`deleting ${cacheName}`);
        return caches.delete(cacheName);
      })
  );
}

function cacheOnFetch(request, response, cache) {
  return response;
}

sw.addEventListener("install", function (event: any) {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(function (cache) {
        console.log(`cache all assets ${cacheName}`);
        return cache.addAll(assets);
      })
      .then(() => sw.skipWaiting())
  );
});

sw.addEventListener("activate", function (event) {
  event.waitUntil(clients.claim().then(caches.keys()).then(deleteOldCaches));
});

sw.addEventListener("fetch", function (event: any) {
  const path = event.request.url.substring(location.origin.length);
  if ("/api/sse" === path) {
    if (sse != null) {
      console.log("previous sse", sse);
    }
    sse = event.request;
    console.log("current sse", sse);
  }
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache
        .match(event.request, { ignoreSearch: true })
        .then(function (response) {
          const req = event.request;
          if (response && true) {
            console.log("cached:" + req.url);
          }
          return (
            response ||
            fetch(req).then(function (response) {
              return cacheOnFetch(req, response, cache);
            })
          );
        });
    })
  );
});

let es: EventSource = null;

sw.addEventListener("message", function handler(event) {

  function listenSSE(evt) {
    console.log(es.readyState);
    event.ports[0].postMessage({
      command: "notification",
      message: evt.data
    });
  }

  function initiateES() {
    es = new EventSource("/api/sse");
    es.onopen = evt => {
      event.ports[0].postMessage({ command: "es-init" });
      console.log("sse initialized");
    };
    es.onmessage = listenSSE;
  }

  if (event.data.command === 'start-sse') {
    if (es === null) {
      initiateES();
    }else{
      event.ports[0].postMessage({ command: "es-init" });
    }
  } else if (event.data.command == 'listen-sse') {
    es.onmessage = listenSSE;
  }
  console.log(event.data);
});



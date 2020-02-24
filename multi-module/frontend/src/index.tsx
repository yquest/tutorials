import "./content/manifest.json";
import * as ReactDOM from "react-dom";
import { Main } from "./tpl/Main.tpl";
import * as React from "react";
import "./content/icon.png"

function twoWayCommunication(options: {
  sw: ServiceWorker;
  command: string;
  message: string;
  callback: (event) => void;
}) {
  var messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = options.callback;

  console.log("Sending message to the service worker");
  options.sw.postMessage(
    {
      command: options.command,
      message: options.message
    },
    [messageChannel.port2]
  );
}

function notifyMe(message: string) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

navigator.serviceWorker.ready.then((reg)=>{
  const sw = reg.active;
  function handler(evt) {
    if (evt.data.command === "notification") {
      notifyMe(evt.data.message);
    }
    twoWayCommunication({
      command: "listen-sse",
      callback: handler,
      message: null,
      sw
    });
  }

  twoWayCommunication({
    command: "start-sse",
    sw,
    callback: handler,
    message: null
  });

  console.log(reg.active);
  navigator.serviceWorker.addEventListener("message", handler);
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    
    navigator.serviceWorker
      .register("/sw.js")
      .then(
        function(registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
          return navigator.serviceWorker.ready;
        },
        function(err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      )
  });
}
ReactDOM.render(React.createElement(Main), document.getElementById("root"));

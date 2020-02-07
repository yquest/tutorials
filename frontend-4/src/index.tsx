import "./content/icon.png";
import "./content/manifest.json";
import * as ReactDOM from "react-dom";
import { main } from "./controller/Main.controller";

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
      .then((reg: ServiceWorkerRegistration) => {
        function handler(evt) {
          twoWayCommunication({
            command: "listen-sse",
            callback: handler,
            message: null,
            sw: reg.active
          });
        }

        twoWayCommunication({
          command: "start-sse",
          sw: reg.active,
          callback: handler,
          message: null
        });

        console.log(reg.active);
        navigator.serviceWorker.addEventListener("message", event => {
          console.log(event.data);
        });
      });
  });
}

ReactDOM.render(main.createHtml(), document.getElementById("root"));

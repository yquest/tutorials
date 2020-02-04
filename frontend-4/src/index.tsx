import "./content/icon.png";
import "./content/manifest.json";
import * as ReactDOM from "react-dom";
import { main } from "./controller/Main.controller";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
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
    );
  });
}
ReactDOM.render(main.createHtml(), document.getElementById("root"));
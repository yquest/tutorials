import { stores } from "../store/stores";
import Axios from "axios";
import { Main } from "../tpl/Main.tpl";
import * as React from "react";

export namespace main {
  function update1OnClickEvt(e: React.MouseEvent) {
    e.preventDefault();
    stores.mainStore.update1();
  }

  function update2OnClickEvt(e: React.MouseEvent) {
    e.preventDefault();
    stores.mainStore.update2(stores.mainStore.value1);
  }

  function addToList(e: React.MouseEvent) {
    e.preventDefault();
    stores.mainStore.addToList();
  }

  function loadList(e: React.MouseEvent) {
    e.preventDefault();
    Axios.get("/api/data").then(res => {
      stores.mainStore.loadList(res.data);
    });
  }

  function removeFromFrontend(value: string): (e: React.MouseEvent) => void {
    return e => {
      stores.mainStore.removeFromFrontend(value);
      e.preventDefault();
    };
  }
  function removeFromBackend(value: string): (e: React.MouseEvent) => void {
    return e => {
      stores.mainStore.removeFromBackend(value);
      e.preventDefault();
    };
  }

  function changeInputMessage(e: React.ChangeEvent<HTMLInputElement>){
    stores.mainStore.updateMessage(e.target.value);
  }

  function fireNotification(e: React.MouseEvent) {
    e.preventDefault();
    Axios.post("/api/send", { message:stores.mainStore.message });
  }

  function notifyMe(message:string) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    else if (Notification.permission === "granted") {
      new Notification(message);
    }
  
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  }

  const es = new EventSource("/api/sse");
  es.onopen = evt => {
    console.log("sse initialized");
  };
  es.onmessage = evt => {
    notifyMe(evt.data);
  };  

  export interface Props{
    update1OnClickEvt: (e: React.MouseEvent) => void;
    update2OnClickEvt: (e: React.MouseEvent) => void;
    addToList: (e: React.MouseEvent) => void;
    removeFromFrontend: (value: string) => (e: React.MouseEvent) => void;
    removeFromBackend: (value: string) => (e: React.MouseEvent) => void;
    loadList: (e: React.MouseEvent) => void;
    changeInputMessage:(e: React.ChangeEvent) => void;
    fireNotification: (e: React.MouseEvent) => void;
  }

  export function createHtml():React.ReactElement {
    const props:Props = {
      addToList, 
      loadList, 
      removeFromBackend, 
      removeFromFrontend, 
      update1OnClickEvt, 
      update2OnClickEvt, 
      changeInputMessage,
      fireNotification,
    };
    return React.createElement(Main ,props);
  }
}

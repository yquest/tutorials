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

  export interface Props{
    update1OnClickEvt: (e: React.MouseEvent) => void;
    update2OnClickEvt: (e: React.MouseEvent) => void;
    addToList: (e: React.MouseEvent) => void;
    removeFromFrontend: (value: string) => (e: React.MouseEvent) => void;
    removeFromBackend: (value: string) => (e: React.MouseEvent) => void;
    loadList: (e: React.MouseEvent) => void;
  }

  export function createHtml():React.ReactElement {
    const props:Props = {addToList, loadList, removeFromBackend, removeFromFrontend, update1OnClickEvt, update2OnClickEvt};
    return React.createElement(Main ,props);
  }
}

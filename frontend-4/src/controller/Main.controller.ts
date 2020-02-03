import { stores } from "../store/mainStore";
import Axios from "axios";
import { html } from "../tpl/Main.tpl";

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

  export function createHtml() {
    return html(
      update1OnClickEvt,
      update2OnClickEvt,
      addToList,
      removeFromFrontend,
      removeFromBackend,
      loadList
    );
  }
}

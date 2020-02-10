import { stores } from "../store/stores";
import Axios from "axios";
import { Main } from "../tpl/Main.tpl";
import * as React from "react";

export namespace main {
  function update1OnClickEvt(e: React.MouseEvent) {
    e.preventDefault();
    stores.main.update1();
  }

  function update2OnClickEvt(e: React.MouseEvent) {
    e.preventDefault();
    stores.main.update2(stores.main.value1);
  }

  function addToList(e: React.MouseEvent) {
    e.preventDefault();
    stores.main.addToList();
  }

  function loadList(e: React.MouseEvent) {
    e.preventDefault();
    Axios.get("/api/data").then(res => {
      stores.main.loadList(res.data);
    });
  }

  function removeFromFrontend(value: string): (e: React.MouseEvent) => void {
    return e => {
      stores.main.removeFromFrontend(value);
      e.preventDefault();
    };
  }
  function removeFromBackend(value: string): (e: React.MouseEvent) => void {
    return e => {
      stores.main.removeFromBackend(value);
      e.preventDefault();
    };
  }

  function changeInputMessage(e: React.ChangeEvent<HTMLInputElement>) {
    stores.main.updateMessage(e.target.value);
  }

  function fireNotification(e: React.MouseEvent) {
    e.preventDefault();
    if (stores.main.message.length > 0) {
      stores.card5.updateValidationMessage("");
      Axios.post("/api/send", { message: stores.main.message });
    } else {
      stores.card5.updateValidationMessage("expected message");
    }
  }

  export interface Props {
    update1OnClickEvt: (e: React.MouseEvent) => void;
    update2OnClickEvt: (e: React.MouseEvent) => void;
    addToList: (e: React.MouseEvent) => void;
    removeFromFrontend: (value: string) => (e: React.MouseEvent) => void;
    removeFromBackend: (value: string) => (e: React.MouseEvent) => void;
    loadList: (e: React.MouseEvent) => void;
    changeInputMessage: (e: React.ChangeEvent) => void;
    fireNotification: (e: React.MouseEvent) => void;
  }

  export function createHtml(): React.ReactElement {
    const props: Props = {
      addToList,
      loadList,
      removeFromBackend,
      removeFromFrontend,
      update1OnClickEvt,
      update2OnClickEvt,
      changeInputMessage,
      fireNotification
    };
    return React.createElement(Main, props);
  }
}

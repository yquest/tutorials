import { IObservableArray, configure, action, observable } from "mobx";
import { util } from "../util";

configure({ enforceActions: "observed" });

namespace main {
  const actions = {
    update1: action,
    update2: action,
    addToList: action,
    loadList: action,
    removeFromFrontend: action,
    removeFromBackend: action,
    updateMessage: action
  };
  export const store = observable(
    {
      value1: 0,
      value2: 0,
      frontedList: [] as IObservableArray<string>,
      backendList: window["__state"] as IObservableArray<string>,
      maxList: 0,
      message: "",
      update1() {
        store.value1 = store.value1 + 1;
      },
      update2(n: number) {
        store.value2 = n;
      },
      removeFromFrontend(value: string) {
        store.frontedList.remove(value);
      },
      removeFromBackend(value: string) {
        store.backendList.remove(value);
      },
      addToList() {
        store.maxList++;
        store.frontedList.push(`item id:${store.maxList}`);
      },
      loadList(values: string[]) {
        store.backendList = values as IObservableArray<string>;
      },
      updateMessage(message: string) {
        store.message = message;
      }
    },
    actions
  );
}

namespace card5 {
  const actions = {
    updateValidationMessage: action
  };
  export const store = observable(
    {
      validationMessage: null as string,
      updateValidationMessage(error: string) {
        store.validationMessage = error;
      },
      get validationState(): util.Validationstate{
        if(store.validationMessage === null) return util.Validationstate.NOT_VALIDATED
        else if(store.validationMessage === "") return util.Validationstate.VALID
        else return util.Validationstate.INVALID;
      }
    },
    actions
  );
}

export const stores = {
  main: main.store,
  card5: card5.store
};

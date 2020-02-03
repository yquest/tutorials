import { IObservableArray, configure, action, observable } from "mobx";

configure({ enforceActions: "observed" });

const mainStoreActions = {
  update1: action,
  update2: action,
  addToList: action,
  loadList: action,
  removeFromFrontend: action,
  removeFromBackend: action
};
const mainStore = observable(
  {
    value1: 0,
    value2: 0,
    frontedList: [] as IObservableArray<string>,
    backendList: window["__state"] as IObservableArray<string>,
    maxList: 0,
    update1() {
      mainStore.value1 = mainStore.value1 + 1;
    },
    update2(n: number) {
      mainStore.value2 = n;
    },
    removeFromFrontend(value: string) {
      mainStore.frontedList.remove(value);
    },
    removeFromBackend(value: string) {
      mainStore.backendList.remove(value);
    },
    addToList() {
      mainStore.maxList++;
      mainStore.frontedList.push(`item id:${mainStore.maxList}`);
    },
    loadList(values: string[]) {
      mainStore.backendList = values as IObservableArray<string>;
    }
  },
  mainStoreActions
);

export const stores = {mainStore};
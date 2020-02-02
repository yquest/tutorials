import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer } from "mobx-react";
import { observable, action, configure, IObservableArray } from "mobx";
import Axios from "axios";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw").then(
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

function sendMessage(message) {
  var messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = event => {
    console.log(event.data);
  };
  navigator.serviceWorker.controller.postMessage(message, [
    messageChannel.port2
  ]);
}

interface CardProps {
  title: string;
  evt: (e: React.MouseEvent) => void;
  value: number;
  btn: string;
  children: React.ReactElement[] | React.ReactElement;
}
interface BodyProps {
  title: string;
  headerBlock: React.ReactElement;
  children: React.ReactElement;
}

configure({ enforceActions: "observed" });

const storeActions = {
  update1: action,
  update2: action,
  addToList: action,
  loadList: action,
  removeFromFrontend: action,
  removeFromBackend: action
};
const store = observable(
  {
    value1: 0,
    value2: 0,
    frontedList: [] as IObservableArray<string>,
    backendList: window["__state"] as IObservableArray<string>,
    maxList: 0,
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
    }
  },
  storeActions
);

function update1OnClickEvt(e: React.MouseEvent) {
  e.preventDefault();
  store.update1();
}

function update2OnClickEvt(e: React.MouseEvent) {
  e.preventDefault();
  store.update2(store.value1);
}

function addToList(e: React.MouseEvent) {
  e.preventDefault();
  store.addToList();
}

function loadList(e: React.MouseEvent) {
  e.preventDefault();
  Axios.get("/api/data").then(res => {
    store.loadList(res.data);
  });
}

function removeFromFrontend(value: string): (e: React.MouseEvent) => void {
  return e => {
    store.removeFromFrontend(value);
    e.preventDefault();
  };
}
function removeFromBackend(value: string): (e: React.MouseEvent) => void {
  return e => {
    store.removeFromBackend(value);
    e.preventDefault();
  };
}

const Card = observer((props: CardProps) => (
  <div className="col-lg-6 mb-3">
    <div className="card box-shadow">
      <div className="card-header">
        <h4>{props.title}</h4>
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.value}</h5>
        {props.children}
        <a href="#" className="btn btn-primary" onClick={props.evt}>
          {props.btn}
        </a>
      </div>
    </div>
  </div>
));

const header = (title: string) => (
  <div className="d-flex align-items-center p-3 mb-3 border-bottom box-shadow">
    <h5 className="my-0 mr-md-auto font-weight-normal">
      <i className="fas fa-home"></i> {title}
    </h5>
    <nav className="my-2 my-md-0 mr-md-3">
      <a className="p-2 text-dark" href="#">
        link example
      </a>
    </nav>
    <a className="btn btn-outline-primary" href="#">
      <i className="fas fa-sign-in-alt"></i> Sign up
    </a>
  </div>
);

function createList(
  list: string[],
  fnRemove: (value: string) => (e: React.MouseEvent) => void
): React.ReactElement {
  return (
    list.length > 0 && (
      <ul className="list-group mb-3">
        {list.map((value, idx) => (
          <li key={`idx-${idx}`} className="list-group-item">
            <div className="row">
              <div className="col-7">{`idx=${idx} value=(${value}) `}</div>
              <div className="col text-right">
                <button
                  onClick={fnRemove(value)}
                  type="button"
                  className="btn btn-primary"
                  data-toggle="button"
                  aria-pressed="false">
                  remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  );
}

const Bottom = observer(() => (
  <div className="row">
    <Card
      title="Card 1"
      evt={update1OnClickEvt}
      value={store.value1}
      btn="increment">
      <p>Increment Card</p>
    </Card>
    <Card
      title="Card 2"
      evt={update2OnClickEvt}
      value={store.value2}
      btn="copy first">
      <p>Copy value from Card 1</p>
    </Card>
    <Card
      title="Card 3"
      evt={addToList}
      value={store.frontedList.length}
      btn="add to list">
      <p>List length</p>
      {createList(store.frontedList, removeFromFrontend)}
    </Card>
    <Card
      title="Card 4"
      evt={loadList}
      value={store.backendList.length}
      btn="load from backend">
      <p>List length</p>
      {createList(store.backendList, removeFromBackend)}
    </Card>
  </div>
));

const Body = observer((props: BodyProps) => (
  <div>
    {props.headerBlock}
    <div className="container">
      <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1>{props.title}</h1>
      </div>
      {props.children}
    </div>
  </div>
));

const html = (
  <Body title="Example title" headerBlock={header("header example")}>
    <Bottom />
  </Body>
);

ReactDOM.render(html, document.getElementById("root"));

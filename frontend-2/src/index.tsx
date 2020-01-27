import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer } from "mobx-react";
import { observable, action, configure, IObservableArray } from "mobx";

configure({ enforceActions: "observed" });

const incrementActions = {
  update1: action,
  update2: action,
  remove: action,
  addToList: action
};
const store = observable(
  {
    value1: 0,
    value2: 0,
    list: [] as IObservableArray<string>,
    maxList: 0,
    update1() {
      store.value1 = store.value1 + 1;
    },
    update2(n: number) {
      store.value2 = n;
    },
    remove(idx: number) {
      store.list.remove(store.list[idx]);
    },
    addToList() {
      store.maxList++;
      store.list.push(`item id:${store.maxList}`);
    }
  },
  incrementActions
);

function update1OnClickEvt(e: React.MouseEvent) {
  e.preventDefault();
  store.update1();
}

function update2OnClickEvt(e: React.MouseEvent) {
  e.preventDefault();
  store.update2(store.value1);
}

function addToList(e) {
  e.preventDefault();
  store.addToList();
}

function removeFromList(idx: number): (e: React.MouseEvent) => void {
  return e => {
    store.remove(idx);
    e.preventDefault();
  };
}

const Card = observer((props: { title; evt; value; btn; children }) => (
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
      value={store.list.length}
      btn="add to list">
      <p>List length</p>
      {store.list.length > 0 && (
        <ul className="list-group mb-3">
          {store.list.map((value, idx) => (
            <li key={`idx-${idx}`} className="list-group-item">
            <div className="row">
              <div className="col-7">{`idx=${idx} value=(${value}) `}</div>
              <div className="col text-right">
                <button
                  onClick={removeFromList(idx)}
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
      )}
    </Card>
  </div>
));

const Body = observer((props: { title: string; headerBlock; bottomBlock }) => (
  <div>
    {props.headerBlock}
    <div className="container">
      <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1>{props.title}</h1>
      </div>
      {props.bottomBlock}
    </div>
  </div>
));

const html = (
  <Body
    title="Example title"
    headerBlock={header("header example")}
    bottomBlock={<Bottom />}
  />
);

ReactDOM.render(html, document.getElementById("root"));

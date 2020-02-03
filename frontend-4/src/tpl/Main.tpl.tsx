import * as React from "react";
import { App } from "./App.tpl";
import { Card } from "./Card.tpl";
import { stores } from "../store/mainStore";

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
                  aria-pressed="false"
                >
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

export const html = (
  update1OnClickEvt: (e: React.MouseEvent) => void,
  update2OnClickEvt: (e: React.MouseEvent) => void,
  addToList: (e: React.MouseEvent) => void,
  removeFromFrontend: (value: string) => (e: React.MouseEvent) => void,
  removeFromBackend: (value: string) => (e: React.MouseEvent) => void,
  loadList: (e: React.MouseEvent) => void
) => (
  <App title="Example title">
    <div className="row">
      <Card
        title="Card 1"
        evt={update1OnClickEvt}
        value={stores.mainStore.value1}
        btn="increment"
      >
        <p>Increment Card</p>
      </Card>
      <Card
        title="Card 2"
        evt={update2OnClickEvt}
        value={stores.mainStore.value2}
        btn="copy first"
      >
        <p>Copy value from Card 1</p>
      </Card>
      <Card
        title="Card 3"
        evt={addToList}
        value={stores.mainStore.frontedList.length}
        btn="add to list"
      >
        <p>List length</p>
        {createList(stores.mainStore.frontedList, removeFromFrontend)}
      </Card>
      <Card
        title="Card 4"
        evt={loadList}
        value={stores.mainStore.backendList.length}
        btn="load from backend"
      >
        <p>List length</p>
        {createList(stores.mainStore.backendList, removeFromBackend)}
      </Card>
    </div>
  </App>
);

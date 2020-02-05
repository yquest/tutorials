import * as React from "react";
import { App } from "./App.tpl";
import { Card } from "./Card.tpl";
import { stores } from "../store/stores";
import { observer } from "mobx-react";
import { main } from "../controller/Main.controller";

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

export const Main = observer((props: main.Props) => (
  <App title="Example title">
    <div className="row">
      <Card
        title="Card 1"
        evt={props.update1OnClickEvt}
        value={stores.mainStore.value1}
        btn="increment"
      >
        <p>Increment Card</p>
      </Card>
      <Card
        title="Card 2"
        evt={props.update2OnClickEvt}
        value={stores.mainStore.value2}
        btn="copy first"
      >
        <p>Copy value from Card 1</p>
      </Card>
      <Card
        title="Card 3"
        evt={props.addToList}
        value={stores.mainStore.frontedList.length}
        btn="add to list"
      >
        <p>List length</p>
        {createList(stores.mainStore.frontedList, props.removeFromFrontend)}
      </Card>
      <Card
        title="Card 4"
        evt={props.loadList}
        value={stores.mainStore.backendList.length}
        btn="load from backend"
      >
        <p>List length</p>
        {createList(stores.mainStore.backendList, props.removeFromBackend)}
      </Card>
      <Card
        title="Card 5"
        evt={props.fireNotification}
        value={0}
        btn="fire notification"
      >
        <div>
          <input onChange={props.changeInputMessage} value={stores.mainStore.message}/>
        </div>
      </Card>
    </div>
  </App>
));

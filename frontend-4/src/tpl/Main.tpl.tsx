import * as React from "react";
import { App } from "./App.tpl";
import { Card } from "./Card.tpl";
import { stores } from "../store/stores";
import { observer } from "mobx-react";
import { main } from "../controller/Main.controller";
import { util } from "../util";

function createList(
  list: string[],
  fnRemove: (value: string) => (e: React.MouseEvent) => void
): JSX.Element {
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

export const Main = observer(
  (props: main.Props): JSX.Element => (
    <App title="Example title">
      <div className="row">
        <Card
          title="Card 1"
          evt={props.update1OnClickEvt}
          value={stores.main.value1}
          btn="increment"
        >
          <p>Increment Card</p>
        </Card>
        <Card
          title="Card 2"
          evt={props.update2OnClickEvt}
          value={stores.main.value2}
          btn="copy first"
        >
          <p>Copy value from Card 1</p>
        </Card>
        <Card
          title="Card 3"
          evt={props.addToList}
          value={stores.main.frontedList.length}
          btn="add to list"
        >
          <p>List length</p>
          {createList(stores.main.frontedList, props.removeFromFrontend)}
        </Card>
        <Card
          title="Card 4"
          evt={props.loadList}
          value={stores.main.backendList.length}
          btn="load from backend"
        >
          <p>List length</p>
          {createList(stores.main.backendList, props.removeFromBackend)}
        </Card>
        <Card
          title="Card 5"
          evt={props.fireNotification}
          value={0}
          btn="fire notification"
        >
          <div>
            <input
              className={"form-control mb-2" + util.validationState2ControllerClass(stores.card5.validationState)}
              onChange={props.changeInputMessage}
              value={stores.main.message}
            />
            {stores.card5.validationState === util.Validationstate.INVALID && (
              <div className="invalid-feedback mb-2">{stores.card5.validationMessage}</div>
            )}
          </div>
        </Card>
      </div>
    </App>
  )
);

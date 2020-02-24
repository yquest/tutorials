import * as React from "react";
import { App } from "./App.tpl";
import { Card } from "./Card.tpl";
import { util } from "../util";
import { useController } from "../controller/Main.controller";

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

export const Main = (): JSX.Element => {
  const controller = useController();
  return (
    <App title="Example title">
      <div className="row">
        <Card
          title="Card 1"
          evt={controller.events.clickUpdate1}
          value={controller.value1}
          btn="increment">
          <p>Increment Card</p>
        </Card>
        <Card
          title="Card 2"
          evt={controller.events.clickUpdate2}
          value={controller.value2}
          btn="copy first">
          <p>Copy value from Card 1</p>
        </Card>
        <Card
          title="Card 3"
          evt={controller.events.clickUpdateFrontendList}
          value={controller.frontEndList.length}
          btn="add to list">
          <p>List length</p>
          {createList(
            controller.frontEndList,
            controller.events.removeFromFrontend
          )}
        </Card>
        <Card
          title="Card 4"
          evt={controller.events.clickUpdateBackendList}
          value={controller.backEndList.length}
          btn="load from backend">
          <p>List length</p>
          {createList(
            controller.backEndList,
            controller.events.removeFromBackend
          )}
        </Card>
        <Card
          title="Card 5"
          evt={controller.events.clickUpdateMessage}
          value={0}
          btn="fire notification">
          <div>
            <input
              onChange={controller.events.onChangeInput}
              className={
                "form-control mb-2" +
                util.validationState2ControllerClass(controller.validationState)
              }
              value={controller.message}
            />
            {controller.validationState === util.Validationstate.INVALID && (
              <div className="invalid-feedback mb-2">
                {controller.validationMessage}
              </div>
            )}
          </div>
        </Card>
      </div>
    </App>
  );
};

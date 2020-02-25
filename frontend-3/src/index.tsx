import * as React from "react";
import * as ReactDOM from "react-dom";
import Axios from "axios";

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

interface Controller {
  events: {
    update1OnClickEvt(e: React.MouseEvent): void;
    update2OnClickEvt(e: React.MouseEvent): void;
    addToList(e: React.MouseEvent): void;
    removeFromFontendList(value: string): (e: React.MouseEvent) => void;
    removeFromBackendList(value: string): (e: React.MouseEvent) => void;
    loadList(e: React.MouseEvent): void;
  };
  readonly value1: number;
  readonly value2: number;
  readonly frontendList: string[];
  readonly backendList: string[];
}

declare const __state: string[];

function useController(): Controller {
  const [value1, setValue1] = React.useState(0);
  const [value2, setValue2] = React.useState(0);
  const [maxList, setMaxList] = React.useState(0);
  const [frontendList, setFrontendlist] = React.useState([] as string[]);
  const [backendList, setBackendlist] = React.useState(__state);

  function update1OnClickEvt(e: React.MouseEvent) {
    e.preventDefault();
    setValue1(value1 + 1);
  }
  function update2OnClickEvt(e: React.MouseEvent) {
    e.preventDefault();
    setValue2(value1);
  }
  function addToList(e: React.MouseEvent) {
    e.preventDefault();
    setMaxList(maxList + 1);
    setFrontendlist([...frontendList, `item id:${maxList}`]);
  }
  function removeFromFontendList(value: string): (e: React.MouseEvent) => void {
    return e => {
      setFrontendlist(frontendList.filter(c => c !== value));
      e.preventDefault();
    };
  }
  function removeFromBackendList(value: string): (e: React.MouseEvent) => void {
    return e => {
      setBackendlist(backendList.filter(c => c !== value));
      e.preventDefault();
    };
  }
  function loadList(e: React.MouseEvent) {
    e.preventDefault();
    Axios.get("/api/data").then(res => {
      setBackendlist(res.data);
    });
  }
  return {
    events: {
      addToList,
      loadList,
      removeFromFontendList,
      removeFromBackendList,
      update1OnClickEvt,
      update2OnClickEvt
    },
    frontendList,
    backendList,
    value1,
    value2
  };
}

const Card = (props: CardProps) => (
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
);

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

const Bottom = () => {
  const controller = useController();
  return (
    <div className="row">
      <Card
        title="Card 1"
        evt={controller.events.update1OnClickEvt}
        value={controller.value1}
        btn="increment">
        <p>Increment Card</p>
      </Card>
      <Card
        title="Card 2"
        evt={controller.events.update2OnClickEvt}
        value={controller.value2}
        btn="copy first">
        <p>Copy value from Card 1</p>
      </Card>
      <Card
        title="Card 3"
        evt={controller.events.addToList}
        value={controller.frontendList.length}
        btn="add to list">
        <p>List length</p>
        {createList(
          controller.frontendList,
          controller.events.removeFromFontendList
        )}
      </Card>
      <Card
        title="Card 4"
        evt={controller.events.loadList}
        value={controller.backendList.length}
        btn="load from backend">
        <p>List length</p>
        {createList(
          controller.backendList,
          controller.events.removeFromBackendList
        )}
      </Card>
    </div>
  );
};

const Body = (props: BodyProps) => (
  <div>
    {props.headerBlock}
    <div className="container">
      <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1>{props.title}</h1>
      </div>
      {props.children}
    </div>
  </div>
);

const html = (
  <Body title="Example title" headerBlock={header("header example")}>
    <Bottom />
  </Body>
);

ReactDOM.render(html, document.getElementById("root"));

import * as React from "react";
import { observer } from "mobx-react";
import { app } from "../controller/AppController";
import { Navigation } from "./Navigation.tpl";

export const App = observer((props: app.Props) => {
    console.log("render");
    return (
  <div>
    <Navigation title="header example" />
    <div className="container">
      <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1>{props.title}</h1>
      </div>
      {props.children}
    </div>
  </div>
)});

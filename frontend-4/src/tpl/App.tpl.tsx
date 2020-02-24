import * as React from "react";
import { app } from "../controller/AppController";
import { Navigation } from "./Navigation.tpl";

export const App = (props: app.Props) => {
  return (
    <div>
      <Navigation title="header example" />
      <div className="container mt-5">
        <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <h1>{props.title}</h1>
        </div>
        {props.children}
      </div>
    </div>
  );
};

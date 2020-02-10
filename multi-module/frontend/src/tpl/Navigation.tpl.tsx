import * as React from "react";
import { navigation } from "../controller/Navigation.controller";
import nonet from "../content/nonet.svg";

export const Navigation = (props: navigation.Props) => (
  <div className="d-flex align-items-center p-3 mb-3 border-bottom box-shadow bg-light fixed-top">
    <h5 className="my-0 mr-md-auto font-weight-normal">
      <i className="fas fa-home"></i> {props.title}
    </h5>
    {!navigator.onLine && <img src={nonet} />}
    <nav className="my-2 my-md-0 mr-md-3">
      <a className="p-2 text-dark" href="#">
        link example
      </a>
    </nav>
    {navigator.onLine && (
      <a className="btn btn-outline-primary" href="#">
        <i className="fas fa-sign-in-alt"></i> Sign up
      </a>
    )}
  </div>
);

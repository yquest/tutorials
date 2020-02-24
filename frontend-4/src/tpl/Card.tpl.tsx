import * as React from "react";
import { card } from "../controller/Card.controller";

export const Card = (props: card.Props) => {
  return (
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
};
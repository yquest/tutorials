import * as React from "react";
import * as ReactDOM from "react-dom";

const header = (title: string) => (
  <div className="d-flex align-items-center p-3 mb-3 border-bottom box-shadow">
    <h5 className="my-0 mr-md-auto font-weight-normal"><i className="fas fa-home"></i> {title}</h5>
    <nav className="my-2 my-md-0 mr-md-3">
      <a className="p-2 text-dark" href="#">
      Button example
      </a>
    </nav>
    <a className="btn btn-outline-primary" href="#">
    <i className="fas fa-sign-in-alt"></i> Sign up
    </a>
  </div>
);

const bottom = () => (
  <div className="row">
    <div className="col-lg-6 mb-3">
      <div className="card box-shadow">
        <div className="card-header">
          <h4>Title</h4>
        </div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">
            With supporting text below as a natural lead-in to additional
            content.
          </p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
    </div>
    <div className="col-lg-6 mb-3">
      <div className="card box-shadow">
        <div className="card-header">
          <h4>Title</h4>
        </div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">
            With supporting text below as a natural lead-in to additional
            content.
          </p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
    </div>
  </div>)

const body=(title:string,headerBlock,bottomBlock) => (
  <div>
    {headerBlock}
    <div className="container">
      <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1>{title}</h1>
      </div>
      {bottomBlock}
    </div>
  </div>
);

const html = body("Example title",header("Header example"),bottom());

ReactDOM.render(html, document.getElementById("root"));

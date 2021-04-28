import { React } from "react";
import "./TEMP.css";

function TEMP(props) {
  return (
    <main id="wrapper">
      <div id="edit-panal">
        <div className="row h-100">
          <div className="col col-sm-4 col-lg-3 bg-info d-flex flex-column justify-content-center ps-3 pe-1">
            <div className="my-2">
              <div className="drag-block label-block" draggable="true">
                <input placeholder="Label" readOnly></input>
              </div>
            </div>
            <div className="my-2">
              <div className="drag-block field-block" draggable="true">
                <input placeholder="Name" readOnly></input>
                <input placeholder="Data" readOnly></input>
              </div>
            </div>
            <div className="my-2">
              <div
                className="drag-block data-block text-center fs-3"
                draggable="true"
              >
                <span>DATA</span>
              </div>
            </div>
          </div>
          <div className="col col-sm-8 col-lg-9 bg-light"></div>
        </div>
      </div>
    </main>
  );
}

export default TEMP;

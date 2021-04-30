import { useEffect, useState } from "react";
import { setData } from "../../Firebase";
import "./Admin.css";


/* Function to create object tree from edit screen */
function createTree(parent, tree, valid) {
  // Input object
  const label = parent.firstChild.querySelector("input[name='label']");
  const data = parent.firstChild.querySelector("input[name='data']");

  // Check if label is not empty
  if (label.value !== "") {
    // Create a new object
    tree[label.value] = {}

    // Check if contains single data
    if (data)
      tree[label.value] = [data.value, false, false];
    
    // get list of childs labels
    const lst = parent.childNodes;
    for (let i = 1; i < lst.length; i++)
      [tree[label.value], valid] = createTree(lst[i], tree[label.value], valid);

    // Remove err notation
    parent.firstChild.querySelector('.err-notation').classList.add('d-none');
  } else {
    // Show err notation
    parent.firstChild.querySelector('.err-notation').classList.remove('d-none');
    return [tree, valid+1];
  }

  return [tree, valid];
}


/* Individual Input Row Component */
function New(props) {
  // React hook, to store current data
  const [label, setLabel] = useState(props.label);
  const [data, setData] = useState(props.data);
  const [componentList, addComponent] = useState([]);
  const index = props.index;

  // Arrow fun to remove component
  const listReset = props.listSetter;

  // React hook to run after every render
  useEffect(() => {
    // Switch vsibility of data field
    setData( data => componentList.length ? null : (data === null ? "" : data) );
  });

  return (
    <div className={`new my-1 ${props.parent ? 'ps-2' : 'ps-4'}`}>
      <div className="new-body">
        <div className="input-group input-group-sm mx-1">
          <input
            type="text"
            name="label"
            className="form-control w-100"
            placeholder="Label"
            value={label}
            onChange={(e) => { const value = e.target.value; setLabel(value); }}
            readOnly={props.readOnly}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Label" />
        </div>
        
        {data !== null && (
          <div className="input-group input-group-sm mx-1">
            <input
              type="text"
              name="data"
              className="form-control w-100"
              placeholder="Data"
              value={data}
              onChange={e => { const value = e.target.value; setData(value); }}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Data" />
          </div>
        )}
        
        <button
          className="err-notation d-none btn btn-danger btn-sm mx-1"
          style={{padding:"6px 4px 2px 4px"}}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Enter label" >
          <i
            className="bi bi-exclamation-square"
            style={{ pointerEvents: "none" }} >
          </i>
        </button>
        
        <button
          className="btns btn btn-outline-primary btn-sm mx-1"
          style={{padding:"6px 4px 2px 4px"}}
          onClick={e => {
            setData(null);  // Hide Data input
            addComponent((child) => [...child, []]);  // Add new Empty child
          }}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Add Child" >
          <i
            className="bi bi-plus-square"
            style={{ pointerEvents: "none" }} >
          </i>
        </button>
        
        {!props.parent && <button
          className="btns btn btn-outline-dark btn-sm mx-1"
          style={{padding:"6px 4px 2px 4px"}}
          onClick={e => listReset(index) }
          data-toggle="tooltip"
          data-placement="bottom"
          title="Remove" >
          <i
            className="bi bi-x-square"
            style={{ pointerEvents: "none" }} >
          </i>
        </button>}
      </div>

      { componentList.map((details, index) => {
        return (
          <New
            key={index}
            index={index}
            label={details[0] ? details[0] : ""}
            data={details[1] ? details[1] : ""}
            listSetter={ INDEX =>  addComponent( lst =>
              lst.filter( (val,index) => index !== INDEX ) ) 
            } />
        )
      })}
    </div>
  );
}


/* Edit Container Component */
function Edit(props) {
  return (
    <div
      id="edit-container-overlay"
      onClick={e => {
        // Check if clicked on empty spaces
        if (e.target === document.getElementById('edit-container-overlay')) 
          props.hide(false); // Cancel the edit pop up
      }} >
      <div id="edit-wrapper">
        <button
          id="edit-submit"
          className="btn btn-primary rounded-circle fw-bold p-0 px-2 fs-4"
          onClick={ e => {
            // Get tree & valid/invalid status
            const [tree, notValid] = createTree(document.querySelector('.new'), {}, 0);

            // If invalid
            if (notValid > 0)
              alert("Please enter empty the labels, or delete it..");
            else {
              setData(props.id+props.path, tree);
              props.hide();
            }
          }}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Submit" >
          ✓
        </button>
        <New label="" data="" parent={true} readOnly={false} />
      </div>
    </div>
  );
}

export default Edit;

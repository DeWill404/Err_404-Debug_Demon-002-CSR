import { useEffect } from "react";
import { setLabelHeight } from "../Helper";
import "./Input.css";

/* Place hint label at its position after removing focus from input */
function onFocus(event) {
  // Get tag
  var input = event.target;
  var label = event.target.nextSibling;

  // Move hint inside input tag
  if (input.value === "") label.classList.remove("hasFocus");
  // Move hint on the top of input tag
  else label.classList.add("hasFocus");
}

function Input(props) {
  // React hook to set height of input tag on every render
  useEffect(() => setLabelHeight(props.name));

  // Get optional attributes
  var attr = {};
  if (props.path) attr["data-path"] = props.path;
  if (props.val !== null) attr["value"] = props.val;
  if (props.refer) attr["ref"] = props.refer;
  if (props.update) attr["onChange"] = (e) => props.update(e.target.value);

  return (
    <div
      className={`input-wrapper position-relative ${
        props.className ? props.className : ""
      }`}
      style={props.div_style}
    >
      <input
        className="form-control input-model"
        style={props.input_style}
        type={props.type}
        name={props.name}
        onBlur={(e) => onFocus(e)}
        autoComplete="off"
        autoSave="false"
        {...attr}
      />
      <label
        className={`input-label text-start ${
          props.labelClass ? props.labelClass : ""
        }`}
        style={props.label_style}
      >
        {props.label}
      </label>
    </div>
  );
}

export default Input;

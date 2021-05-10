import { useEffect, useState } from "react";
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
  
  // React hook to set & change value
  const [value, setValue] = useState(props.val);

  // React hook to set height of input tag on every render
  useEffect(() => {
    setValue(props.val);
    setLabelHeight(props.name);
  });

  return (
    <div
      className="input-wrapper position-relative"
      style={props.div_style} >

      <input
        className="form-control input-model"
        type={props.type}
        name={props.name}
        value={value}
        data-path={props.path ? props.path : props.label}
        onBlur={(e) => onFocus(e)}
        onChange={e => {
          const val = props.toLower
                        ? e.target.value.trim().toLowerCase()
                        : e.target.value.trim();
          // Call parent onChange function
          props.onChange && props.onChange(val);
        }}
        autoComplete="off"
        autoSave="false" />

      <label className={`input-label text-start ${ props.labelClass ? props.labelClass : "" }`} >
        {props.label}
      </label>
      
    </div>
  );
}

export default Input;

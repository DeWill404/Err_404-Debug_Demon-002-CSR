import { switchBool, updateData } from "../../Firebase";
import { getPath, sep } from "../../Helper";
import Input from "../../Input/Input";

var ID = null;

/* Function to show single row of data */
function showData(id, tree, path, LABEL) {
  // Set ID only if it is empty
  if (!ID) ID = id;

  // Recursive loop to create each data row
  if (Array.isArray(tree[LABEL])) {
    return (
      tree[LABEL][2] && (
        <DataRow
          key={getPath(path, LABEL)}
          path={getPath(path, LABEL).replaceAll(sep, "/")}
          val={tree[LABEL][0]}
          name={getPath(path, LABEL)}
          validate={tree[LABEL][1]}
        /> ) );
  } else {
    return Object.keys(tree[LABEL]).map((label) =>
      showData(id, tree[LABEL], getPath(path, LABEL), label) );
  }
}

function DataRow(props) {
  // DATA
  const path = props.path;
  const val = props.val;
  const name = props.name;
  const validated = props.validate;

  return (
    <div
      className={`field-wrapper row align-items-center rounded-2 my-2 ${validated ? "bg-validate" : "bg-invalidate"}`} >
      <div className="col-2 col-md-1 text-center">
        <button
          className={`btn fs-3 ${validated ? "btn-dark" : "btn-outline-dark"}`}
          data-key={path}
          data-toggle="tooltip"
          data-placement="bottom"
          title={validated ? "Click to invalidate" : "Click to validate"}
          onClick={() => switchBool(ID, path, 1, validated)} >
          {validated ? "✓" : "✗"}
        </button>
      </div>
      
      <div className="col-10 col-md-11 pb-3">
        <Input
          type="text"
          label={name}
          name={name.replaceAll(sep, "_").replaceAll(" ", "_")}
          labelClass={val && "hasFocus"}
          val={val}
          onChange={(value) => updateData(`${ID}/${path}/0`, value)}
          path={path} />
      </div>
    </div>
  );
}

export { showData };

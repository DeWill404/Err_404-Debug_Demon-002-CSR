import { clearData, deleteData, switchBool, setData } from "../../Firebase";
import { getPath, sep } from "../../Helper";
import Input from "../../Input/Input";
import "./Admin.css";

var ID = null;

/* Function to show single row of data */
function showData(id, compressed, parent, tree, path, LABEL, bg, showEdit) {
  // Set ID only if it is empty
  if (!ID) ID = id;

  // Recursive loop to create each data row
  if (typeof tree[LABEL] !== "string") {
    if (Array.isArray(tree[LABEL]))
      return (
        <DetailField
          key={getPath(path, LABEL)}
          path={getPath(path, LABEL).replaceAll(sep, "/")}
          val={tree[LABEL][0]}
          name={compressed ? getPath(path, LABEL) : LABEL}
          validate={tree[LABEL][1]}
          visible={tree[LABEL][2]}
          parent={parent} />
      );
    else
      return compressed ? (
        Object.keys(tree[LABEL]).map((label) =>
          showData( id, compressed,
            false, tree[LABEL],
            getPath(path, LABEL), label,
            !bg, showEdit )
        )
      ) : (
        <DetailsContainer
          key={getPath(path, LABEL)}
          path={path}
          bg_color={bg}
          label={LABEL}
          parent={parent}
          showEdit={showEdit}
          func={() =>
            Object.keys(tree[LABEL]).map((label) =>
              showData( id, compressed,
                false, tree[LABEL],
                getPath(path, LABEL), label,
                !bg, showEdit )
            )
          }
        />
      );
  }
}

// Function to show container of input field
function DetailsContainer(props) {
  // Data
  const path = props.path.replaceAll(sep, "/");
  const bg_color = props.bg_color;
  const LABEL = props.label;
  const func = props.func;
  const isParent = props.parent;
  const showEdit = props.showEdit;

  return (
    <div
      className={ `field-label ps-2 border  border-dark
        ${isParent ? "my-2" : ""}
        ${!bg_color ? "bg-label text-dark" : "bg-label-white text-light"}` }
      style={{ borderRadius: "10px 0" }}
    >
      <span className="d-block label-text text-capitalize my-1" >
        {LABEL}
        <span
          class="badge bg-light text-dark mx-1 ms-2 edit-btn"
          data-toggle="tooltip"
          data-placement="bottom"
          title={`Add data`}
          data-path={getPath(path, LABEL).replace(sep, "/")}
          onClick={e => showEdit(e.target.getAttribute('data-path')) } >
          <i class="bi bi-plus-square" style={{pointerEvents:"none"}}></i>
        </span>

        <span
          class="badge bg-light text-dark mx-1 edit-btn"
          data-toggle="tooltip"
          data-placement="bottom"
          title={`Edit data`}
          data-path={getPath(path, LABEL, "/")} >
          <i class="bi bi-pencil" style={{pointerEvents:"none"}}></i>
        </span>

        <span
          class="badge bg-light text-dark mx-1 edit-btn"
          data-toggle="tooltip"
          data-placement="bottom"
          title={`Remove data`}
          onClick={() => clearData(ID, path + "/" + LABEL)}
          data-path={getPath(path, LABEL, "/")} >
          <i class="bi bi-trash" style={{pointerEvents:"none"}}></i>
        </span>
      </span>
      
      {func()}
    </div>
  );
}

// Function to show single input field
function DetailField(props) {
  // DATA
  const path = props.path;
  const val = props.val;
  const name = props.name;
  const validated = props.validate;
  const visibility = props.visible;
  const isParent = props.parent;

  return (
    <div
      className={`field-wrapper rounded-2 m-2 p-1 px-2
      ${isParent ? "mx-0" : "mt-1"}
      ${validated ? "bg-validate" : "bg-invalidate"}`}
    >
      <div className="row gy-2 align-items-center text-center">
        <div className="col-12 col-md-6 col-lg-9">
          <Input
            type="text"
            name={path.replaceAll("/", "_").replaceAll(" ", "_")}
            label={name}
            labelClass={val && "hasFocus"}
            val={val}
            onChange={(value) => setData(`${ID}/${path}/0`, value)}
            path={path}
          />
        </div>
        <div className="col-4 col-md-2 col-lg-1">
          <button
            className={`btn fs-3 btn-outline-danger`}
            data-key={path}
            data-toggle="tooltip"
            data-placement="bottom"
            title={`Delete Field\nThis action is irreversible`}
            onClick={() =>  deleteData(ID, path)}
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
        <div className="col-4 col-md-2 col-lg-1">
          <button
            className={`btn fs-3 btn-outline-primary`}
            data-key={path}
            data-toggle="tooltip"
            data-placement="bottom"
            title={visibility ? "Click to Hide" : "Click to Show"}
            onClick={() => switchBool(ID, path, 2, visibility)}
          >
            {visibility ? (
              <i className="bi bi-eye-fill"></i>
            ) : (
              <i className="bi bi-eye-slash-fill"></i>
            )}
          </button>
        </div>
        <div className="col-4 col-md-2 col-lg-1">
          <span
            data-bs-toggle="tooltip"
            data-placement="bottom"
            title={validated ? "Validated" : "Invalidated"}
          >
            <button className={`btn fs-3 btn-dark`} disabled>
              {validated ? "✓" : "✗"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export { showData, DetailsContainer };

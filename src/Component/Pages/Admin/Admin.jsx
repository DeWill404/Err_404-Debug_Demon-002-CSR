import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { deleteData, getData, syncData } from "../../Firebase";
import Info from "../../Info";
import { showData } from "./DetailRow";
import "./Admin.css";
import "../../../style.css";

function Admin(props) {
  const history = useHistory();

  // Move key from local storage to session
  if (localStorage.getItem(props.login))
    sessionStorage.setItem(props.login, localStorage.getItem(props.login));
  localStorage.removeItem(props.login);
  // Get session id
  const sessionID = history.location.pathname.substring(7);
  const csrID = sessionStorage.getItem(props.login);

  // React hook, for get csr name
  const [csr, getCSR] = useState("---");
  // React hook, to store data
  const [dataTree, getDataTree] = useState("---");
  // React hook, to compressed & expand view
  const [compressed, setCompressed] = useState(
    JSON.parse(sessionStorage.getItem("compresed"))
  );

  // Get csr name
  getData(`session/${csrID}/csr`, (val) => getCSR(val));

  // React hook, to run after first render
  useEffect(() => {
    if (csrID) {
      // Sync session details
      syncData(`session/${csrID}/${sessionID}`, getDataTree);
    }
  }, []);

  return (
    <main id="wrapper">
      {csrID ? (
        dataTree && (dataTree === "---" || dataTree.username) ? (
          <div className="container">
            <title>
              CSR | Admin(
              {dataTree && dataTree !== "---" ? dataTree.username : "---"})
            </title>
            <Info />

            <div className="row justify-content-betweeen">
              <span className="col nameStyle">
                {csr && csr !== "---" && `Hello, ${csr}`}
              </span>
              <span className="col nameStyle text-end">
                {dataTree && dataTree !== "---" && `User: ${dataTree.username}`}
              </span>
            </div>

            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="switch"
                checked={compressed}
                onClick={(e) => {
                  // Switch btn compressed view and expanded view
                  setCompressed(e.target.checked);
                  sessionStorage.setItem(
                    "isCompressed",
                    JSON.stringify(compressed)
                  );
                }}
              />
              <label class="form-check-label label-text" for="switch">
                Compressed view
              </label>
            </div>

            {dataTree !== "---" &&
              Object.keys(dataTree).map((KEY) => {
                if (KEY !== "username")
                  return compressed ? (
                    showData(
                      `${csrID}/${sessionID}`,
                      compressed,
                      dataTree,
                      "",
                      KEY,
                      false
                    )
                  ) : (
                    <div
                      key={KEY}
                      className={
                        "field-label rounded-2 px-1 my-2 border bg-label"
                      }
                    >
                      <span className="d-flex label-text text-capitalize p-1">
                        {KEY}
                        <span
                          class="badge bg-light text-dark mx-1 ms-2 pointer"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={`Add data`}
                          onClick={() => {}}
                        >
                          <i class="bi bi-plus-square"></i>
                        </span>
                        <span
                          class="badge bg-light text-dark mx-1 pointer"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={`Edit data`}
                        >
                          <i class="bi bi-pencil"></i>
                        </span>
                        <span
                          class="badge bg-light text-dark mx-1 pointer"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={`Remove data`}
                          onClick={() =>
                            deleteData(`${csrID}/${sessionID}`, KEY)
                          }
                        >
                          <i class="bi bi-trash"></i>
                        </span>
                      </span>
                      {Object.keys(dataTree[KEY]).map((key) =>
                        showData(
                          `${csrID}/${sessionID}`,
                          compressed,
                          dataTree[KEY],
                          KEY,
                          key,
                          true
                        )
                      )}
                    </div>
                  );
              })}

            <button className="add-new btn btn-success w-100 fs-3 mt-2">
              +
            </button>
          </div>
        ) : (
          history.replace("/_")
        )
      ) : (
        history.replace("/")
      )}
    </main>
  );
}

export default Admin;

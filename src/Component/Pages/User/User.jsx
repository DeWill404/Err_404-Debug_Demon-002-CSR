import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { syncData, saveSession } from "../../Firebase";
import { disableReload, enableReload } from "../../Helper";
import Info from "../../Info";
import { showData } from "./DataRow";
import "./User.css";
import "../../../style.css";

function User(props) {
  // Disable reload
  disableReload(() => {
      // Move current to safe storage
      logged && saveSession(logged.user, dataTree);
      // Log out user
      sessionStorage.removeItem(props.login);
  });

  // React history hook
  const history = useHistory();

  // Check if csr is logged in or not
  const logged = JSON.parse(sessionStorage.getItem(props.login));

  // React hook, for get csr name
  const [csr, getCSR] = useState("---");
  // React hook, to store data
  const [dataTree, getDataTree] = useState("---");

  // React hook, to run after first render
  useEffect(() => {
    if (logged) {
      // Sync session details
      syncData(`session/${logged.user}`, getDataTree);
      // Sync csr name
      syncData(
        `session/${logged.user.substring(0, logged.user.indexOf("/"))}/csr`,
        getCSR
      );
    }

    // Check if key is not valid
    if (!dataTree || (dataTree !== "---" && !dataTree.username))
      history.push("/_");

    return () => enableReload(() => logged && saveSession(logged.user, dataTree) );
  }, []);

  return (
    <main id="wrapper">
      {logged && logged.user ? (
        dataTree && (dataTree === "---" || dataTree.username) ? (
          <div className="container">
            <title>
              CSR | {dataTree && dataTree !== "---" ? dataTree.username : "---"}
            </title>
            <Info />

            <div className="row justify-content-betweeen">
              <span className="col nameStyle">
                {dataTree &&
                  dataTree !== "---" &&
                  `Hello, ${dataTree.username}`}
              </span>
              <span className="col nameStyle text-end">
                {csr && csr !== "---" && `CSR: ${csr}`}
              </span>
            </div>

            <div id="inputs">
              {!dataTree.username ? (
                <span className="col nameStyle d-block text-center fs-1 mt-2">
                  Loading..
                  <div class="ms-2 spinner-border" role="status"></div>
                </span>
              ) : Object.keys(dataTree).length === 1 ? (
                <span className="col nameStyle d-block text-center fs-1 mt-2">
                  There is not data to show..
                </span>
              ) : (
                Object.keys(dataTree).map(
                  (key) =>
                    key !== "username" &&
                    showData(logged.user, dataTree, "", key)
                )
              )}
            </div>
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

export default User;

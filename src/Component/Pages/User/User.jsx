import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { syncData, saveSession, setData } from "../../Firebase";
import { disableReload, enableReload, isSessionActive } from "../../Helper";
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
    if (dataTree?.username===null && dataTree!=="---")
      history.push("/_");

    return () => enableReload(() => logged && saveSession(logged.user, dataTree) );
  }, []);

  return (
    <main id="wrapper"> {
      logged && logged.user ? (
        dataTree?.username || dataTree==="---" ? (
          <div className="container">
            <title>
              CSR | {dataTree?.username ? dataTree.username : "---"}
            </title>
            <Info />

            <div className="row justify-content-betweeen">
              <span className="col nameStyle" >
                {dataTree?.username && `Hello, ${dataTree.username}`}
              </span>
              <span
                className={`col nameStyle text-end ${dataTree?.csr!=="offline" ? "" : "text-secondary"}`}
                data-toggle="tooltip"
                data-placement="bottom"
                title={dataTree?.csr!=="offline" ? "Online" : "Offline"}
                style={{cursor:"pointer"}} >
                {csr && csr !== "---" && `CSR: ${csr}`}
              </span>
            </div>

            <div id="inputs"> {
                // If session is not started
                dataTree==='---' ? (
                  <span className="col nameStyle d-block text-center fs-1 mt-2">
                    Loading..
                    <div className="ms-2 spinner-border" role="status"></div>
                  </span>
                ) :
                // IF a session is already undergoing
                isSessionActive(dataTree?.user, logged.user, {'user':props.login}) ? (
                  <span className="col nameStyle d-block text-center fs-1 mt-2">
                    There is another session going on, please close that session & try again...
                  </span>
                ) : (
                  <div> {
                    // If there is no data
                    Object.keys(dataTree).length <= 3 ? (
                      <span className="col nameStyle d-block text-center fs-1 mt-2">
                        There is not data to show..
                      </span>
                    ) :
                    // Show data
                    ( Object.keys(dataTree).map(
                        (key) =>
                        (typeof(dataTree[key]) !== 'string') && showData(logged.user, dataTree, "", key)
                    ))
                  } </div>
                )
            } </div>
          </div>
        ) : (
          history.replace("/_")
        )
      ) : (
        history.replace("/")
      )
    } </main>
  );
}

export default User;

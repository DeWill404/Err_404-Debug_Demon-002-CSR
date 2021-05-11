import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getData, syncData, saveSession } from "../../Firebase";
import { enableReload, disableReload, isSessionActive } from "../../Helper";
import Info from "../../Info";
import Edit from "./Edit";
import Chat from "../../Chat/Chat";
import { showData } from "./DetailRow";
import "./Admin.css";
import "../../../style.css";


function Admin(props) {
  // Disable reload
  disableReload(() => {
      // Move current to safe storage
      sessionID && saveSession(`${csrID}/${sessionID}`, dataTree);
      // Log out user
      sessionStorage.removeItem(props.login);
  });

  // React history Hook
  const history = useHistory();

  // Move key from local storage to session
  if (localStorage.getItem(props.login))
    sessionStorage.setItem(props.login, localStorage.getItem(props.login));
  localStorage.removeItem(props.login);
  // Get session id
  const sessionID = history.location.pathname.substring(7);
  const csrID = sessionStorage.getItem(props.login);

  // React hook, htmlFor get csr name
  const [csr, getCSR] = useState("---");
  // React hook, to store data
  const [dataTree, getDataTree] = useState("---");
  // React hook, to compressed & expand view
  const [compressed, setCompressed] = useState( JSON.parse(sessionStorage.getItem("compresed")) );
  // React hook, to set visibility of Edit Component
  const [path, setPath] = useState( null );
  // React hook, to set visibility of chat
  const [showChat, setChat] = useState(false);

  // Get csr name
  getData(`session/${csrID}/csr`, (val) => getCSR(val));

  // React hook, to run after first render
  useEffect(() => {
    if (csrID)
      // Sync session details
      syncData(`session/${csrID}/${sessionID}`, getDataTree);

    // Rest CSR Component
    return () => enableReload( () => sessionID && saveSession(`${csrID}/${sessionID}`, dataTree) );
  }, []);

  return (
    <main id="wrapper"> { csrID ? (
      dataTree && (dataTree === "---" || dataTree.username) ? (
        <div className="container">
          <title>
            CSR | Admin( {dataTree?.username ? dataTree.username : "---"} )
          </title>
          <Info />

          <div className="row justify-content-betweeen">
            <span className="col nameStyle">
              {csr && csr !== "---" && `Hello, ${csr}`}
            </span>

            <span
              className={`col nameStyle text-end ${dataTree?.user!=="offline" ? "" : "text-secondary"}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title={dataTree?.user!=="offline" ? "Online" : "Offline"}
              style={{cursor:"pointer"}} >
              {dataTree?.username && `User: ${dataTree.username}`}
            </span>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="switch"
              checked={compressed}
              onClick={(e) => {
                // Switch btn compressed view and expanded view
                setCompressed(!compressed);
                sessionStorage.setItem( "isCompressed", JSON.stringify(compressed) );
              }}
            />

            <label className="form-check-label label-text" htmlFor="switch">
              Compressed view
            </label>
          </div>

          { dataTree==='---' ? (
              <span className="col nameStyle d-block text-center fs-1 mt-2">
                Loading..
                <div className="ms-2 spinner-border" role="status"></div>
              </span>
            ) : (
              <div> {
                isSessionActive(dataTree?.csr, `${csrID}/${sessionID}`, {'csr':props.login}) ? (
                  <span className="col nameStyle d-block text-center fs-1 mt-2">
                    There is another session going on, please close that session & try again...
                  </span>
                ) : (
                  Object.keys(dataTree).map((KEY) => {
                    return (typeof(dataTree[KEY]) !== 'string') && showData(
                        `${csrID}/${sessionID}`, compressed,
                        true, dataTree, "", KEY,
                        false, val => setPath(val) )
                  })
                )
              } </div>
            )
          }

          <button className="add-new btn btn-success w-100 fs-3 mt-2" onClick={e => setPath('')} >
            +
          </button>

          { path !== null && 
            <Edit hide={() => setPath(null)} path={path} id={`${csrID}/${sessionID}/`} /> }

          {showChat && <Chat path={`session/${csrID}/${sessionID}/msg`} login={props.login}/>}
          <button
            className="btn btn-lg btn-primary rounded-circle position-fixed end-0 bottom-0 translate-middle me-2 mb-2"
            onClick={e => setChat(!showChat)} >
            { showChat ?
                <i class="bi bi-x"></i> :
                <i class="bi bi-chat-right-dots-fill"></i> }
          </button>
        </div>
      ) : ( history.replace("/_") )
    ) : ( history.replace("/") )
    } </main>
  );
}

export default Admin;

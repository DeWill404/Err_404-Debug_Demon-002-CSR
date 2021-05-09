import { React, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createSession, registerUser, syncData, unregisterUser } from "../../Firebase";
import { disableReload, enableReload } from "../../Helper";
import Info from "../../Info";
import Input from "../../Input/Input";
import SessionRow from "./SessionRow";
import "./CSR.css";


/* Method to show error message */
function showErr(msg) {
  if (msg) {
    document.getElementById("session-errMsg").innerHTML = msg;
    document.getElementById("session-errMsg").classList.remove("visually-hidden");
  }
  document.getElementById("btn-spinner").classList.add("visually-hidden");
}


/* Method to generate session for user */
function generateSession(key) {
  // Get input field
  const name = document.querySelector("input[name='Username']").value;
  document.querySelector("input[name='Username']").value = "";

  // If any value is entered
  if (name) {
    // Show spinner
    document.getElementById("btn-spinner").classList.remove("visually-hidden");

    // Check if username is valie
    if (name.match(/^\w+$/g)) {
      // Generate session
      const [newSession, sessionKey] = createSession(key, { username: name, user:"offline", csr:"offline" });
      newSession.then(() => {
        // Register user
        registerUser(name, `${key}/${sessionKey}`);
        // clear error
        showErr(null);
      }).catch((err) => {
        console.error(err);
        showErr("An error occured");
      });
    } else
      showErr(
        "Username is invalid <br/> It should only contain <br/> Only Alphanumeric character <br/> No spaces anywhere <br/> No special character"
      );
  } else {
    showErr("Enter the username");
  }
}

function CSR(props) {
  disableReload(() => {
      // Remove register user of current session
      logged && unregisterUser(logged.csr);
      // Log out user
      sessionStorage.removeItem(props.login);
  });

  // React history Hook
  const history = useHistory();

  // Check if csr is logged in or not
  const logged = JSON.parse(sessionStorage.getItem(props.login));

  // React hook, to store real-time all session details of login csr
  const [sessions, getSessions] = useState(null);

  // React hook, to do realtime sync data of all session
  // Delete all session when exiting
  useEffect(() => {
    logged && syncData(`session/${logged.csr}`, getSessions);

    // Rest CSR Component
    return () => enableReload(() => logged && unregisterUser(logged.csr));
  }, []);

  return (
    <main id="wrapper">
      {logged && logged.csr ? (
        <div>
          <title>CSR | Admin</title>
          <div className="container">
            <Info />
            <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
              {sessions && `Hello, ${sessions.csr}`}
            </span>

            <div className="session-div p-2">
              <span className="session-title">New Session:</span>
              <div className="row">
                <div className="col-md-6">
                  <Input type="text" name="Username" label="Username" toLower={true} style={{ maxWidth: "300px" }} />
                  <button
                    id="btn-submit"
                    className="my-2 btn btn-primary align-item-center"
                    onClick={ () => generateSession(logged.csr) } >
                    <span id="btn-txt" className="me-1">
                      Generate
                    </span>
                    <span
                      id="btn-spinner"
                      className="spinner-border spinner-border-sm visually-hidden"></span>
                  </button>
                </div>
                <div className="col-md-6">
                  <span
                    id="session-errMsg"
                    className="visually-hidden"
                    onClick={(e) => e.target.classList.add("visually-hidden")}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Click to hide" >
                    Invalid
                  </span>
                </div>
              </div>
            </div>

            <hr />
            
            <div className="session-div p-2">
              <span className="session-title">All Sessions:</span>
              {sessions &&
                Object.keys(sessions).map((key) => {
                  return (
                    (typeof(sessions[key]) !== 'string') && (
                      <SessionRow
                        key={key}
                        link={`${props.url}user/${key}`}
                        obj={sessions[key]}
                        save={() => {
                          // Save firebase path
                          localStorage.setItem(props.login, logged.csr);
                          // Save key value
                          localStorage.setItem("key", props.login);
                        } }
                      />
                    )
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        history.replace("/")
      )}
    </main>
  );
}

export default CSR;

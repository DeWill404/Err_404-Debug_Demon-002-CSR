import { React, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  createSession,
  registerUser,
  syncData,
  unregisterUser,
} from "../../Firebase";
import { disableReload, enableReload } from "../../Helper";
import Info from "../../Info";
import Input from "../../Input/Input";
import Qrcode from "../../Qrcode/Qrcode";
import SessionRow from "./SessionRow";
import "./CSR.css";

/* Method to show error message */
function showErr(msg) {
  if (msg) {
    document.getElementById("session-errMsg").innerHTML = msg;
    document
      .getElementById("session-errMsg")
      .classList.remove("visually-hidden");
  }
  document.getElementById("btn-spinner").classList.add("visually-hidden");
}

/* Method to generate session for user */
function generateSession(key, name, setKey, input) {
  // Get submit btn
  const btn = document.getElementById("btn-submit");
  const txt = document.getElementById("btn-txt");

  // Generate new user session
  if (txt.innerHTML === "Generate") {
    if (name) {
      // Show spinner
      document
        .getElementById("btn-spinner")
        .classList.remove("visually-hidden");

      // Check if username is valie
      if (name.match(/^\w+$/g)) {
        // Generate session
        const [newSession, sessionKey] = createSession(key, { username: name });
        newSession
          .then(() => {
            // Save session key
            setKey(sessionKey);

            // Register user
            registerUser(name, `${key}/${sessionKey}`);

            // switch to clear option
            btn.classList.remove("btn-primary");
            btn.classList.add("btn-secondary");
            txt.innerHTML = "Clear";
            showErr(null);
          })
          .catch((err) => {
            console.error(err);
            showErr("An error occured");
          });
      } else
        showErr(
          "Username is invalid <br/> It should only contain <br/> Only Alphanumeric character <br/> No spaces anywhere <br/> No special character"
        );
    } else showErr("Enter the username");
  }
  // Clear screen
  else {
    // Reset current key
    setKey(null);

    // Clear input
    input.current.value = "";
    input.current.nextSibling.classList.remove("hasFocus");

    // switch to generate option
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-primary");
    txt.innerHTML = "Generate";
  }
}

function CSR(props) {
  // disableReload(() => {
  //     // Remove register user of current session
  //     logged && unregisterUser(logged.csr);
  //     // Log out user
  //     sessionStorage.removeItem(props.login);
  // });

  // React history Hook
  const history = useHistory();

  // Check if csr is logged in or not
  const logged = JSON.parse(sessionStorage.getItem(props.login));

  // React hook, for storing user session key
  const [sessionKey, setKey] = useState(null);
  // React hook, to store real-time all session details of login csr
  const [sessions, getSessions] = useState(null);

  // React hook, to store reference of input tag
  const input = useRef(null);

  // React hook, to do realtime sync data of all session
  // Delete all session when exiting
  useEffect(() => {
    logged && syncData(`session/${logged.csr}`, getSessions);

    // Rest CSR Component
    // return () => enableReload(() => logged && unregisterUser(logged.csr));
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
                <div className="col-6">
                  <Input
                    type="text"
                    name="Username"
                    label="Username"
                    refer={input}
                    style={{ maxWidth: "300px" }}
                  />
                  <div>
                    <button
                      id="btn-submit"
                      className="my-2 btn btn-primary align-item-center"
                      onClick={(e) =>
                        generateSession(
                          logged.csr,
                          input.current.value,
                          setKey,
                          input
                        )
                      }
                    >
                      <span id="btn-txt" className="me-1">
                        Generate
                      </span>
                      <span
                        id="btn-spinner"
                        className="spinner-border spinner-border-sm visually-hidden"
                      ></span>
                    </button>

                    <span
                      id="session-errMsg"
                      className="visually-hidden"
                      onClick={(e) => e.target.classList.add("visually-hidden")}
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Click to hide"
                    >
                      Invalid
                    </span>

                    {sessionKey && (
                      <a
                        href={`admin/${sessionKey}`}
                        className="session-link"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          localStorage.setItem(props.login, logged.csr)
                        }
                      >
                        Admin: {props.url}admin/{sessionKey}
                      </a>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  {sessionKey && (
                    <div>
                      <Qrcode link={`${props.url}user/${sessionKey}`} />
                      <span className="session-link">
                        User: {props.url}user/{sessionKey}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className="session-div p-2">
              <span className="session-title">All Sessions:</span>
              {sessions &&
                Object.keys(sessions).map((key) => {
                  return (
                    key !== "csr" && (
                      <SessionRow
                        key={key}
                        link={`${props.url}user/${key}`}
                        obj={sessions[key]}
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

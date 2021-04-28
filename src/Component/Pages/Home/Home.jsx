import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { checkCredential, createSession } from "../../Firebase";
import Input from "../../Input/Input";
import "./Home.css";

/* Switch btn user & CSR mode */
function switchMode(mode, setter) {
  // get click btn
  var btn = document.getElementsByClassName("mode-btn")[mode];

  // Check if already set or not
  if (!btn.classList.contains("btn-active")) {
    // Reset another btn
    document
      .getElementsByClassName("mode-btn")
      [mode === 0 ? 1 : 0].classList.remove("btn-active");
    // Set click btn
    btn.classList.add("btn-active");
    setter(mode);
  }
}

/* Function to set error text */
function setErrMSG(msg) {
  document.getElementById("login-err_text").innerHTML = msg;
  document.getElementById("login-err_text").style.visibility = "visible";
  document.getElementById("btn-spinner").classList.add("visually-hidden");
}

/* Function to login user if details is valid */
function login(mode, setlog, name, pass) {
  // Make spinner visible
  document.getElementById("btn-spinner").classList.remove("visually-hidden");

  // If mode is CSR && username & password is entered
  if (mode === 0 && name && pass)
    checkCredential("csr", name)
      .then((snap) => {
        // Check if detail are valid
        if (snap.val() && snap.val().pass === pass) {
          // create a csr new session
          const [newSession, sessionKey] = createSession("", { csr: name });
          newSession
            .then(() => setlog({ csr: sessionKey }))
            .catch((err) => console.error(err));
        } else setErrMSG("Invalid Details");
      })
      .catch((err) => console.error(err));
  // If mode is CSR && username is entered
  else if (mode === 1 && name)
    checkCredential("user", name)
      .then((snap) => {
        // Check if detail are valid
        if (snap.val()) setlog({ user: snap.val() });
        else setErrMSG("Invalid Details");
      })
      .catch((err) => console.error(err));
  // If input is not entered
  else setErrMSG("Enter all details");
}

function Home(props) {
  // React history Hook
  const history = useHistory();

  // React Hook, for switch btn CSR & USER mode
  const [mode, setMode] = useState(0);
  // React Hook, to check if user is logged in or not
  const [logged, setLog] = useState(null);

  const uname = useRef(null);
  const upass = useRef(null);

  // React Hook, to run only first render
  useEffect(() => {
    // Set login value to state, if user was logged in
    var data = sessionStorage.getItem(props.login);
    if (data) setLog(JSON.parse(data));
  }, [props.login]);

  // React Hook, to run after every render
  useEffect(() => {
    // IF user was logged in
    if (logged) {
      // Set cache & open respective page
      sessionStorage.setItem(props.login, JSON.stringify(logged));
      history.push(
        logged.csr
          ? "csr"
          : `user/${logged.user.substring(logged.user.indexOf("/") + 1)}`
      );
    }
  });

  return (
    <main id="wrapper">
      <title>CSR | Home</title>

      <span
        id="login-err_text"
        onClick={(e) => (e.target.style.visibility = "hidden")}
        data-toggle="tooltip"
        data-placement="bottom"
        title="Click to hide"
      >
        Invalid
      </span>

      <div className="login-card">
        <h1 className="text-center m-0">LOGIN</h1>
        <div
          className="row"
          style={{
            borderBottom: "1px #aaa solid",
            borderTop: "1px #aaa solid",
          }}
        >
          <div
            className="mode-btn btn-active btn btn-outline-primary btn-lg col-6"
            onClick={() => switchMode(0, setMode)}
          >
            CSR
          </div>
          <div
            className="mode-btn btn btn-outline-primary btn-lg col-6"
            onClick={() => switchMode(1, setMode)}
          >
            USER
          </div>
        </div>
        <div className="form-section p-3 pt-1">
          <Input type="text" name="Username" label="Username" refer={uname} />
          {mode === 0 && (
            <Input
              type="password"
              name="Password"
              label="Password"
              refer={upass}
            />
          )}
          <button
            className="mt-4 btn btn-primary align-item-center"
            onClick={() =>
              login(
                mode,
                setLog,
                uname.current ? uname.current.value : "",
                upass.current ? upass.current.value : ""
              )
            }
          >
            <span className="me-1">login</span>
            <span
              id="btn-spinner"
              className="spinner-border spinner-border-sm visually-hidden"
            ></span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;

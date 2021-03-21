import "../App.css";
import NotFound from "./notFound";
import {useEffect, useState} from "react";
import firebase from "firebase";
import Thanks from "./Thank";

const db = firebase.database();

function syncVisibility(set) {
  db.ref("visible").set([...set]);
}

function Admin({id}) {
  // Create set listener of data
  const [data, setData] = useState("");
  var visibleSet = new Set();
  visibleSet.add("email");

	// useEffect function realtime sync data
	useEffect( () => {
		const dbRef = db.ref(`data/${id}`);
		dbRef.on("value", snap => {
			setData(snap.val());
		}, data);
		// Cancel sync if moved to different page
		return () => dbRef.off();
	}, [id]);

	// If no data is loaded
	if (data === "")
		return <main><div id="loading"><h1>Loading...</h1></div></main>;
  }
	
	// If invaid link is entered
	else if (!data)
		return <NotFound />;

	return(
		<main>
      <title>Admin</title>
      {
        Object.keys(data).map(function(keyName, keyIndex) {
          return(
            <div class="input-group my-1" key={keyName}>
              <div class="input-group-prepend">
                <span class="input-group-text" data-key={keyName}
                  onClick={e => {
                    var txt = e.target.getAttribute("data-key");
                    if (visibleSet.has(txt)) {
                      visibleSet.delete(txt);
                      e.target.innerHTML = "SHOW";
                    } else {
                      visibleSet.add(txt);
                      e.target.innerHTML = "HIDE";
                    }
                    syncVisibility(visibleSet);
                  }}
                >
                  {visibleSet.has(keyName) ? "HIDE" : "SHOW"}
                </span>
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text">{keyName}</span>
              </div>
              <input type="text" class="form-control" placeholder="Data" data-key={keyName} value={data[keyName][0]}
                onChange={e => db.ref(`data/${id}/${e.target.getAttribute("data-key")}`).set([e.target.value, false])} 
              />
              <div className="input-group-prepend">
                <span class="input-group-text">{data[keyName][1] ? "✓" : "✗"}</span>
              </div>
              <button class="btn btn-danger" data-key={keyName}
                onClick={e => db.ref(`data/${id}/${e.target.getAttribute("data-key")}`).remove()}
                disabled={keyName==="email"}
              >Delete</button>
            </div>
          ) })
      }
      <button className="d-block mx-auto btn btn-lg btn-primary my-2"
        onClick={e => {
          var ele = document.getElementById("add-field");
          if (ele.classList.contains("visually-hidden")) {
            ele.classList.remove("visually-hidden");
            document.getElementsByClassName("inputs")[0].value = "";
            document.getElementsByClassName("inputs")[1].value = "";
          } else {
            ele.classList.add("visually-hidden");
          }
        }}
      >Add</button>
      <div id="add-field" className="visually-hidden">
        <div className="input-group">
          <input className="form-control inputs m-1" placeholder="Label" />
          <input className="form-control inputs m-1" placeholder="value" />  
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn mx-2 btn-success mt-2"
            onClick={e => {
              if(document.getElementsByClassName("inputs")[0].value && document.getElementsByClassName("inputs")[1].value) {
                db.ref(`data/${id}`).update({[document.getElementsByClassName("inputs")[0].value]:[document.getElementsByClassName("inputs")[1].value, false]});
                document.getElementById("add-field").classList.add("visually-hidden");
              }
          }}
          >Done</button>
          <button className="btn mx-2 btn-danger mt-2"
            onClick={e => document.getElementById("add-field").classList.add("visually-hidden") }
          >Cancel</button>
        </div>
      </div>
		</main>
	);
}

export default Admin;
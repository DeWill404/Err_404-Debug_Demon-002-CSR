import { useEffect, useState } from "react";
import "../App.css";
import firebase from "../firebase";
import NotFound from "./notFound";
import Save from "./helper";

// Get database
const db = firebase.database();

function iteraData(id, path, key, obj, visible) {
  // Check if it is input item & should be visible by user
  if (Array.isArray(obj) && visible && visible.includes(key)) {
    // Print out the input tag
    return (
      <div key={key} className="col-3 input-effect">
        <label className="inputLabel">{(path ? `${path} ➡ ${key}` : key).replace("/", " ➡ ")}</label>
        <br />
        <input value={obj[0]}
          className="inputTag has-content" type="text" placeholder="" 
          onChange={e =>
            // Update DB
            db.ref(`data/${id}/${path}/${key}`).set( [e.target.value, true] )
          }
        />
        <input 
          className="form-check-input" type="checkbox" checked={obj[1]} 
          onClick={e =>
            // Update only checkbox in db 
            db.ref(`data/${id}/${path}/${key}`).update( {1:e.target.checked} )
          }
        />
      </div>
    );
  }
  
	// Iterate throught map insde the mat to lowest point
	if (typeof(obj) == 'object') {
		return ( Object.keys(obj).map(function(keyName, keyIndex) {
			return ( <div key={keyName}>{ 
				iteraData(id, (key ? path?`${path}/${key}`:key : ''), keyName, obj[keyName], visible) 
				}</div> );
		}) );
	}

  return <span></span>;

}


// Page on User side for verify details
function User({id}) {
  // set Message prompt
  var [msgPrompt, setPrompt] = useState("");
	
  // Create set listener of data
  const [data, setData] = useState("");

	// useEffect function realtime sync data
	useEffect( () => {
		const dbRef = db.ref(`data/${id}`);
		dbRef.on("value", snap => {
			setData(snap.val());
		}, data);
		// Cancel sync if moved to different page
		return () => dbRef.off();
	}, [id]);

  // Create a array of data which contain what should be visible to user
  const [visibilityList, getVisibility] = useState([]);
	useEffect( () => {
		const dbRef = db.ref(`visible`);
		dbRef.on("value", snap => {
      getVisibility(snap.val());
		}, visibilityList);
		// Cancel sync if moved to different page
		return () => dbRef.off();
	}, [id]);

	// If no data is loaded
	if (data === "")
		return <main><div id="loading"><h1>Loading...</h1></div></main>;
	
	// If invaid link is entered
	else if (!data)
		return <NotFound />;

	// render list of data from firebase
	return (
    <main>
      <title>User Data</title>
      <button className="btn btn-large btn-outline-primary d-block mt-3 mx-auto"
        onClick={ e => {
          var allChecked = true;
          var inputList = document.querySelectorAll("input[type='checkbox']");
          for (let i = 0; i < inputList.length; i++) {
            if (!inputList[i].checked) {
              allChecked = false;
              break;
            }
          }
          setPrompt(allChecked ? "Please recheck the field before confirming..." : "All field are not checked, are you sure?");
          document.getElementById("toast").classList.add("show");
          document.getElementById("toast").classList.remove("hide");
        }}
      >
        Verified
      </button>
		  <div> { iteraData(id, '', '', data, visibilityList) } </div>
      <div id="toast" className="mt-3 toast hide position-absolute top-0 start-50 translate-middle-x" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-body fw-bold bg-white border">
          { msgPrompt }
          <div className="mt-2 pt-2 border-top">
            <a href="/thanks" target="_blank">
              <button type="button" className="btn mx-1 btn-primary btn-sm"
                onClick={ e => {
                  //Save data to permanent storage
                  const storage = db.ref("storage").push();
                  storage.set( Save(data) );

                  // Delete current data
                  db.ref(`data/${id}`).remove();
                }}
              >
                Yes
              </button>
            </a>
            <button type="button" className="btn mx-1 btn-secondary btn-sm" data-bs-dismiss="toast"
              onClick={ e => {
                document.getElementById("toast").classList.remove("show");
                document.getElementById("toast").classList.add("hide");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
	);

}

export default User;
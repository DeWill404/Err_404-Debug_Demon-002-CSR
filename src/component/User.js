import firebase from "../firebase";
import NotFound from "./notFound";
import "../App.css";
import { useEffect, useState } from "react";

// Get database
const db = firebase.database();

function iteraDate(id, path, key, obj, visible) {
  if (Array.isArray(obj) && visible.includes(key)) {
    // Print out the input tag
    return (
      <div key={key} className="col-3 input-effect">
        <label className="inputLabel">{(path ? `${path} ➡ ${key}` : key).replace("/", " ➡ ")}</label>
        <br />
        <input value={obj[0]}
          className="inputTag has-content" type="text" placeholder="" 
          onChange={e =>
            // Update DB
            db.ref(`data/${id}/${path}/${key}`).set( [e.target.value, false] )
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
				iteraDate(id, (key ? path?`${path}/${key}`:key : ''), keyName, obj[keyName], visible) 
				}</div> );
		}) );
	}

  return <span></span>;

}


// Page on User side for verify details
function User({id}) {
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
		  <div> { iteraDate(id, '', '', data, visibilityList) } </div>

    </main>
	);

}

export default User;
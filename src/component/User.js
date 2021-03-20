import firebase from "../firebase";
import NotFound from "./notFound";
import { useEffect, useState } from "react";

// Get database
const db = firebase.database();


function iteraDate(id, path, key, obj) {
	// Iterate throught map insde the mat to lowest point
	if (typeof(obj) == 'object') {
		return (
			Object.keys(obj).map(function(keyName, keyIndex) {
				return (
					<div key={keyName}>{ 
						iteraDate(id, (key ? path?`${path}/${key}`:key : ''), keyName, obj[keyName]) 
					}</div>
				);
			}) 
		);
	}

	// Print out the input tag
	return (
		<div key={key}>
			<label>{path ? `${path}/${key}` : key}</label>
			<br />
			<input value={obj}
				onChange={e =>
					// Update DB
					db.ref(`data/${id}/${path}`).update({[key] : e.target.value})
				}
			/>
		</div>
	);
}


// Page on User side for verify details
function User({id}) {
	// Create set listener of data
  const [data, setData] = useState("");

	// useEffect function realtime sync data
	useEffect( () => {
		const dbRef = db.ref(`data/${id}`);

		dbRef.on("value", snap => {
			console.log(snap.val());
			setData(snap.val());
		}, data);

		// Cancel sync if moved to different page
		return () => dbRef.off();

	}, [id]);

	// If no data is loaded
	if (data === "")
		return <div>Loading</div>;
	
	// If invaid link is entered
	else if (!data)
		return <NotFound />;

	// render list of data from firebase
	return (
		<div> {
			iteraDate(id, '', '', data)
			// Object.keys(data).map(function(keyName, keyIndex) {
			// 	return (
			// 		<div key={keyName}>
			// 			<label>{keyName}</label>
			// 			<br />
			// 			<input value={data[keyName]}
			// 				onChange={e =>
			// 					// Update DB
			// 					db.ref(`data/${id}`).update({[keyName] : e.target.value})
			// 				}
			// 			/>
			// 		</div>
			// 	);
			// }) 
		} </div>
	);

}

export default User;
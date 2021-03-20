import firebase from "../firebase";
import NotFound from "./notFound";
import { useEffect, useState } from "react";

// Get database
const db = firebase.database();

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
			Object.keys(data).map(function(keyName, keyIndex) {
    		return (
					<div>
						<label>{keyName}</label>
						<br />
						<input value={data[keyName]}
							onChange={e => {
								// Make copy of date, so that it wont break sync loop
								const copy = { ...data };
								console.log(copy);
								// Update data
								copy[keyName] = e.target.value;
								// Update DB
								db.ref(`data/${id}`).set(copy);
							}}
							/>
					</div>
    		)
		}) }
		</div>
	)

}

export default User;
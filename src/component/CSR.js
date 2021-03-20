import { useState } from "react";
import firebase from "../firebase";
import "../App.css"

// Get Database
const db = firebase.database();
// base url
const baseURL = "http://localhost:3000";

// To show representative option to start session for user
function CSR() {
  // Get State obj for email, generated link
  const [email, setEmail] = useState("");
  var [userLink, setLink] = useState("");


  return (
    <main>
      <form 
        className="form"
        onSubmit={e => {
          e.preventDefault(); // Stop default action

          // Get new data reference
          const dbRef = db.ref("data");
          const newData = dbRef.push();

          // Send user detail
          newData.set({ email });

          // Display link
          setLink(`${baseURL}/user/${newData.key}`);
        }}
        >
        <input
          type="email" placeholder="Enter User email" name="email"
          value={email} onChange={e => setEmail(e.target.value)}
        />
        <br></br>
        <input type="submit"/>
      </form>
      <span>{userLink}</span>
    </main>
  );
}

export default CSR;
import { useState } from "react";
import "../App.css";
import firebase from "../firebase";
import QRCode from "qrcode.react";

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
          document.getElementById("qrcode").style.visibility = "visible";
        }}
        >
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input type="email" class="form-control" id="emailInput" 
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div class="mb-3">
          <input type="submit" class="btn btn-dark"/>
        </div>
      </form>
      <span>{userLink}</span>
      
      <div id="qrcode">
        <QRCode
          value={userLink}
          size={290}
          level={"H"}
          includeMargin={true}
        />
      </div>
    </main>
  );
}

export default CSR;
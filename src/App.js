import { useState } from 'react';
import firebase from "./firebase";
import "./App.css";

const db = firebase.database();

function App() {
  const [email, setEmail] = useState("");
  var [userLink, setLink] = useState("");

  return (
    <main>
      <form 
        className="form"
        onSubmit={e => {
          e.preventDefault();
          const dbRef = db.ref("data");
          const newData = dbRef.push();
          newData.set({
            email
          });
          setLink(`/data/${newData.key}`);
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

export default App;

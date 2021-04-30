import API from "./env";
import firebase from "firebase/app";
import "firebase/database";

// Your web app's Firebase configuration
var firebaseConfig = API;

// Function to initialize firebase or connect to database if not connected
function startFirebase() {
  if (firebase.apps.length === 0)
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}
startFirebase();

// Export firebase object
export default firebase;

// Get database
const db = firebase.database();

// Function of get data at given path
function getData(path, func) {
  db.ref(path)
    .get()
    .then((snap) => func(snap.val()))
    .catch((err) => console.error(err));
}

// Function to return promise to check if details are valid
function checkCredential(type, userName) {
  return db.ref(`${type}/${userName}`).get();
}

// Function to create user session
function createSession(path, inital) {
  const newSession = db.ref(`session/${path}`).push();
  return [newSession.set(inital), newSession.key];
}

// Function to register user to session
function registerUser(uname, key) {
  db.ref(`user/${uname}`).set(key);
}

// Function to do realtime sync on given path
function syncData(path, setter) {
  return db.ref(path).on(
    "value",
    (snap) => setter(snap ? snap.val() : null),
    (err) => console.log(err)
  );
}

// Funtion to remove user
function removeUser(uname) {
  db.ref(`user/${uname}`).remove();
}

// Function to unregister(remove) user from database of current session & delete data
function unregisterUser(id) {
  db.ref(`session/${id}`)
    .get()
    .then((snap) => {
      // Unregister user
      const data = snap.val();
      if (data) Object.keys(data).map((key) => removeUser(data[key].username));
      // Delete database
      db.ref(`session/${id}`).remove();
    })
    .catch((err) => console.error(err));
}

// Funtion to switch validation of input field
function switchBool(id, label, index, value) {
  db.ref(`session/${id}/${label}/${index}`).set(!value);
}

// Function to update data
function setData(path, value) {
  db.ref(`session/${path}`).update(value);
}

// Funtion to update data in input fields
function updateData(id, label, value) {
  db.ref(`session/${id}/${label}/0`).set(value);
}

// Function remove data in from input field
function deleteData(id, path) {
  db.ref(`session/${id}/${path}`).remove();
}

// Function cleas data in from input field, save as empt object
function clearData(id, path) {
  db.ref(`session/${id}/${path}`).set("");
}

// Function save user Data
function saveSession(id, data) {
  // // Remove data
  // db.ref(`session/${id}`).remove();
  // // Remove user
  // removeUser(data[key].username);
  // // push clean data to firebase
  // db.ref(`DATA/${data.username}`).set( cleanData(data) );
}

export {
  getData,
  setData,
  checkCredential,
  createSession,
  registerUser,
  syncData,
  removeUser,
  unregisterUser,
  switchBool,
  updateData,
  deleteData,
  clearData,
  saveSession,
};

import API from './env';
import firebase from 'firebase/app';
import 'firebase/database';


// Your web app's Firebase configuration
var firebaseConfig = API;

// Function to initialize firebase or connect to database if not connected
function startFirebase() {
	if (firebase.apps.length === 0)
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
}
startFirebase();


export default firebase;
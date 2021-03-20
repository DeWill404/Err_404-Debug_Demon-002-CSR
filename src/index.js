import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app'


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA07lvgSJ4hs_6JbBtfRcc4IRwp8RcGbc8",
    authDomain: "csr-app-30c29.firebaseapp.com",
    projectId: "csr-app-30c29",
    storageBucket: "csr-app-30c29.appspot.com",
    messagingSenderId: "140613045209",
    appId: "1:140613045209:web:83e3099420df6c7fbf67c8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

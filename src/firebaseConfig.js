// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxgJFWhjDLpj1XPnV6xqn7cflRoM_3MwM",
  authDomain: "healthtracker-b6543.firebaseapp.com",
  databaseURL: "https://healthtracker-b6543-default-rtdb.firebaseio.com",
  projectId: "healthtracker-b6543",
  storageBucket: "healthtracker-b6543.appspot.com",
  messagingSenderId: "8918306091",
  appId: "1:8918306091:web:5ff09385f86c7c8e23496e",
  measurementId: "G-0K4TGXFJBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app); 
const storage = getStorage(app); 

export { app, analytics, auth, db, storage };
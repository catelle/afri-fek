// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCQ_CeHDxZ2vx_s3eaGogQ0NHOdCQNdTDE",
  authDomain: "sykotibycharity.firebaseapp.com",
  projectId: "sykotibycharity",
  storageBucket: "sykotibycharity.firebasestorage.app",
  messagingSenderId: "825957335565",
  appId: "1:825957335565:web:8335c14ddd432342864b44",
  measurementId: "G-WS2HE1W350"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore(app);
const storage= getStorage(app);
const auth = getAuth();

export { db, auth , storage};
export default app;
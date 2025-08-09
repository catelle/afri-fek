// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCh-iLdbSkaUlSV3c50oOpB0Dz65PtqvXI",
  authDomain: "fadi-5c0fc.firebaseapp.com",
  projectId: "fadi-5c0fc",
  storageBucket: "fadi-5c0fc.firebasestorage.app",
  messagingSenderId: "970579628450",
  appId: "1:970579628450:web:a2e840fbb1057e801122fb",
  measurementId: "G-2YBG0L8EX1"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore(app);
const storage= getStorage(app);
const auth = getAuth();

export { db, auth , storage};
export default app;
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

  apiKey: "AIzaSyBfsLgPPwml6swsgd9yRgcaaEbSRSBakoE",

  authDomain: "afrifek-81861.firebaseapp.com",

  projectId: "afrifek-81861",

  storageBucket: "afrifek-81861.firebasestorage.app",

  messagingSenderId: "687115330310",

  appId: "1:687115330310:web:bd8f4c0ece12878c0d3487",

  measurementId: "G-4BXELCT4LB"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore(app);
const storage= getStorage(app);
const auth = getAuth();

export { db, auth , storage};
export default app;
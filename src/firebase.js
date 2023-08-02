// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe2vzAWj0kTYMlvd-W47Ws7KKkpNdNLrU",
  authDomain: "react-notes-f5ba6.firebaseapp.com",
  projectId: "react-notes-f5ba6",
  storageBucket: "react-notes-f5ba6.appspot.com",
  messagingSenderId: "177670261294",
  appId: "1:177670261294:web:a55c2cfc32a9120b936dbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, 'notes');

export { db, notesCollection };
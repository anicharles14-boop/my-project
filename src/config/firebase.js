import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDn_9h-gUxk5XrxzCAl8FBoz-aJdJ1jlys",
  authDomain: "project-firebase-6ec2e.firebaseapp.com",
  projectId: "project-firebase-6ec2e",
  storageBucket: "project-firebase-6ec2e.firebasestorage.app",
  messagingSenderId: "669960174149",
  appId: "1:669960174149:web:9eb3b6b49da2805f20c12c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 

export const db = getFirestore(app);
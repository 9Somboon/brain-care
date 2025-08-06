// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ8F9lDoSk5OLV5uuAeosHNuTmV955LPU",
  authDomain: "brain-care-3eb7c.firebaseapp.com",
  projectId: "brain-care-3eb7c",
  storageBucket: "brain-care-3eb7c.appspot.com",
  messagingSenderId: "863809198655",
  appId: "1:863809198655:web:7d660f9c4a330bff3df68a",
  measurementId: "G-KFZVQYR4F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);
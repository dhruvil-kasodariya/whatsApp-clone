// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlIde2SOgMB1y6vG2UvXkvqAeamdz57n0",
  authDomain: "whatsapp-clone-75641.firebaseapp.com",
  projectId: "whatsapp-clone-75641", 
  storageBucket: "whatsapp-clone-75641.appspot.com",
  messagingSenderId: "579774560075",
  appId: "1:579774560075:web:27828b3e9c89d59b179ace"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth =getAuth(app)
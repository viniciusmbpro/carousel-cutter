// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxE1HRJwowB4_GAENNb7pNG7Pz4uOpigQ",
  authDomain: "carousel-cutter.firebaseapp.com",
  projectId: "carousel-cutter",
  storageBucket: "carousel-cutter.firebasestorage.app",
  messagingSenderId: "78255470012",
  appId: "1:78255470012:web:060baa12f7851b324527b9",
  measurementId: "G-C6PK70CQ6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
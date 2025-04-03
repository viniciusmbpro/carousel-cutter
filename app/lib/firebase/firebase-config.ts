// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 
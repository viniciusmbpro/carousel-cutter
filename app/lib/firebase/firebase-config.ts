// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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

console.log("Inicializando Firebase...");
// Initialize Firebase
let app;
if (getApps().length === 0) {
  console.log("Criando nova instância do Firebase");
  app = initializeApp(firebaseConfig);
} else {
  console.log("Usando instância existente do Firebase");
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Descomente para depuração local, se necessário
// if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

console.log("Firebase inicializado com sucesso");

export { app, auth, db, storage }; 
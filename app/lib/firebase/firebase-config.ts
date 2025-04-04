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

// Evitar inicialização múltipla no lado do cliente
let firebaseApp;
let firebaseAuth;
let firebaseDb;
let firebaseStorage;

if (typeof window !== 'undefined') {
  // Código do lado do cliente
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
  firebaseStorage = getStorage(firebaseApp);
} else {
  // Código do lado do servidor (SSR)
  // Criamos uma nova instância a cada renderização no servidor
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
  firebaseStorage = getStorage(firebaseApp);
}

// Exportamos as variáveis em vez das funções diretas
export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firebaseDb;
export const storage = firebaseStorage; 
// Firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1cDzkck0Dcdn6jtXh4rTpBDZQ5Sis6Hg",
  authDomain: "blazar-a566f.firebaseapp.com",
  projectId: "blazar-a566f",
  storageBucket: "blazar-a566f.firebasestorage.app",
  messagingSenderId: "1023720032765",
  appId: "1:1023720032765:web:abe0e4f533b5f065bc7194",
  measurementId: "G-CW4VFB94F8",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

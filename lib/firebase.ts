import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9lIZxPHyPvJyAly1LJiSihieQNdoTA04",
  authDomain: "beauty-hub-37ba8.firebaseapp.com",
  projectId: "beauty-hub-37ba8",
  storageBucket: "beauty-hub-37ba8.firebasestorage.app",
  messagingSenderId: "877208845836",
  appId: "1:877208845836:web:59142a789f59a527e93829"
};

// Inizializza Firebase (evita doppie inizializzazioni)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
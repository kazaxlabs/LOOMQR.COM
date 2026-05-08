import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "qr-gen-professional-app",
  appId: "1:177443024720:web:904a09cb680c975c520655",
  storageBucket: "qr-gen-professional-app.firebasestorage.app",
  apiKey: "AIzaSyBhYpmvUMFn6qglktiRLZGkmH0_hMgml-k",
  authDomain: "qr-gen-professional-app.firebaseapp.com",
  messagingSenderId: "177443024720"
};

import { getAuth, GoogleAuthProvider } from "firebase/auth";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };

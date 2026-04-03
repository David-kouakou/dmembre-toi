import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCABkykUZdycmkkURXQYCQYIHLCDOHuBOw",
  authDomain: "dmembre-toi.firebaseapp.com",
  projectId: "dmembre-toi",
  storageBucket: "dmembre-toi.firebasestorage.app",
  messagingSenderId: "36787191155",
  appId: "1:36787191155:web:0879fc99839bcfd85d1906"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
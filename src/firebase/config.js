import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEetqylgkUVce5ahQtJP1fZShmjSJdr_Q",
  authDomain: "market-circle-5774f.firebaseapp.com",
  projectId: "market-circle-5774f",
  storageBucket: "market-circle-5774f.firebasestorage.app",
  messagingSenderId: "32453519427",
  appId: "1:32453519427:web:481e9039415494b1010cf6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

// Import needed Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDbu5W8-pW1AMm5YcssdKUwAttqXieC1Bw",
  authDomain: "mann-app-a21a0.firebaseapp.com",
  projectId: "mann-app-a21a0",
  storageBucket: "mann-app-a21a0.firebasestorage.app",
  messagingSenderId: "129095003715",
  appId: "1:129095003715:web:60d1d8fd2607c4ba03aef6",
  measurementId: "G-QF13M354C3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);


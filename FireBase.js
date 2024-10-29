import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzOuuJEwiHZRV15Jwx-DznCO7-OfnhHKU",
  authDomain: "finalassesment-40109.firebaseapp.com",
  projectId: "finalassesment-40109",
  storageBucket: "finalassesment-40109.appspot.com",
  messagingSenderId: "194530446031",
  appId: "1:194530446031:web:8e60146f3ad2d9125e85ba",
  measurementId: "G-Y20CH6RRJL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, auth, analytics, db };

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgHoU-rUeci4SDuw77kQ7eypOmfmw0k4U",
  authDomain: "newassesment-824d5.firebaseapp.com",
  projectId: "newassesment-824d5",
  storageBucket: "newassesment-824d5.appspot.com",
  messagingSenderId: "83872271532",
  appId: "1:83872271532:web:372003bd124fe3123ea309",
  measurementId: "G-NMLE7K4NP8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, auth, analytics, db };

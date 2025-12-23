import {
  initializeApp as initFirebaseAdminApp,
  type App,
} from "firebase-admin/app";
import {
  initializeApp as initFirebaseApp,
  type FirebaseApp,
} from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

export const adminApp: App = initFirebaseAdminApp(firebaseConfig);
export const firebaseApp: FirebaseApp = initFirebaseApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const gAuth = new GoogleAuthProvider();
export const database = getDatabase(firebaseApp);

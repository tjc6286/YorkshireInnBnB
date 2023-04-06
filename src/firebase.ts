import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APPLICATION_ID,
  measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

const signOutUser = () => {
  console.log("Signing out! ");
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("signing out!");
    })
    .catch((error) => {
      console.log(error, "error signing out");
      // An error happened.
    });
};

export { app, auth, signOutUser };

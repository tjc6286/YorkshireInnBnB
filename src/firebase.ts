import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPLICATION_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

console.log(firebaseConfig);

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log(firebaseConfig);

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

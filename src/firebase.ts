import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDe6Cx0SJ8ypa8Hc5bRgRF3AJI9E0o7r84",
  authDomain: "yorkshirebnb-5a030.firebaseapp.com",
  projectId: "yorkshirebnb-5a030",
  storageBucket: "yorkshirebnb-5a030.appspot.com",
  messagingSenderId: "417585271071",
  appId: "1:417585271071:web:f4d66ad8355a03d708e02a",
  measurementId: "G-8X7LY0MVXV",
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

import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import React from "react";
import { app } from "../../../firebase";

var uiConfig = {
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "/adminHome",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

const FirebaseAuth: React.FC = () => {
  React.useEffect(() => {
    //initialize firebase.
    const application = app;
    console.log(application);

    var ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());

    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div
      style={{
        height: "100dvh",
        transform: `translate(0%,25%)`,
      }}
    >
      <h1 className="w-full mb-4 text-center font-semibold">
        Administrator Portal
      </h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default FirebaseAuth;

import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import React from "react";
import { app } from "../../../firebase";

interface IAuthProps {
  config: any;
}

var uiConfig = {
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "/adminHome",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

const FirebaseAuth: React.FC<IAuthProps> = ({ config }) => {
  React.useEffect(() => {
    app;
    var ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());

    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return <div id="firebaseui-auth-container"></div>;
};

export default FirebaseAuth;

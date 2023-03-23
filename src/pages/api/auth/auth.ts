// /**
//  *
//  * @returns
//  */

// import firebase from "firebase/compat/app";

// const firebaseConfig = {
//   apiKey: import.meta.env.FIREBASE_API_KEY,
//   authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.FIREBASE_APPLICATION_ID,
//   measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID,
// };

// firebase.initializeApp(firebaseConfig);
// export const get = async () => {

//   const room = await getBlueRoom();
//   if (!room) {
//     return new Response(null, {
//       status: 404,
//       statusText: "Not found",
//     });
//   }

//   //TODO: CLEAN RESPONSE
//   return new Response(JSON.stringify(room), {
//     status: 200,
//   });
// };

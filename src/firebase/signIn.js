import { auth } from "./firebase";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export const signInMethod = async (email, password) => {
  await createUserWithEmailAndPassword(auth, email, password).then(
    (userCredentials) => {
      sendEmailVerification(userCredentials.user).then(() => {
        // Email verification sent!
        // ...
        console.log("success");
      });
    }
  );
};

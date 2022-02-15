import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";

export const logOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("success");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};

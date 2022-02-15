import { auth } from "./firebase";
import {
  RecaptchaVerifier,
} from "firebase/auth";

export const configureCaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
        console.log("Recaptca varified", response);
      },
    },
    auth
  );
};
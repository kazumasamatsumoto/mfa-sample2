import { auth } from "./firebase";
import {
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
} from "firebase/auth";
import { configureCaptcha } from "./configureCaptcha";

export const loginForm = async (loginEmail, loginPassword) => {
  configureCaptcha();
  try {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  } catch (error) {
    if (error.code === "auth/multi-factor-auth-required") {
      window.resolver = getMultiFactorResolver(auth, error);
    }
  }

  const phoneOptions = {
    multiFactorHint: window.resolver.hints[0],
    session: window.resolver.session,
  };

  const phoneAuthProvider = new PhoneAuthProvider(auth);

  window.verificationId = await phoneAuthProvider.verifyPhoneNumber(
    phoneOptions,
    window.recaptchaVerifier
  );

  alert("Code has been sent to your phone");
};
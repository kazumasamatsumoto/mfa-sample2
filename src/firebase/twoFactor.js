import { auth } from "./firebase";
import {
  PhoneAuthProvider,
  multiFactor,
} from "firebase/auth";
import { configureCaptcha } from "./configureCaptcha";

export const twoFactorMethod = async (mobile) => {
  configureCaptcha();
  const phoneNumber = "+81" + mobile;
  const appVerifier = window.recaptchaVerifier;
  const multiFactorUser = multiFactor(auth.currentUser);
  const multiFactorSession = await multiFactorUser.getSession();
  const phoneAuthProvider = new PhoneAuthProvider(auth);
  const phoneInfoOptions = {
    phoneNumber: phoneNumber,
    session: multiFactorSession,
  };
  window.verificationId = await phoneAuthProvider.verifyPhoneNumber(
    phoneInfoOptions,
    appVerifier
  );
  console.log(window.verificationId);
};
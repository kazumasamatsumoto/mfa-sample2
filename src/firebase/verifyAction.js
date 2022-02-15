import { auth } from "./firebase";

import {
  PhoneAuthProvider,
  multiFactor,
  PhoneMultiFactorGenerator,
} from "firebase/auth";

export const verifyAction = async (otp) => {
  try {
    const firebaseCredentials = PhoneAuthProvider.credential(
      window.verificationId,
      otp
    );
    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(firebaseCredentials);
    const multiFactorUser = multiFactor(auth.currentUser);
    await multiFactorUser.enroll(multiFactorAssertion);
    console.log("success");
  } catch (e) {
    console.log(e, "error");
  }
};

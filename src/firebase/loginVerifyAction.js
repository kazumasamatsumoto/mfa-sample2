import {
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";

export const loginVerifyAction = async (loginOpt) => {
  try {
    const firebaseCredentials = PhoneAuthProvider.credential(
      window.verificationId,
      loginOpt
    );
    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(firebaseCredentials);
    const credentials = await window.resolver.resolveSignIn(
      multiFactorAssertion
    );
    console.log(credentials, "credentials");
    console.log("success");
  } catch (e) {
    console.log(e, "error");
  }
};
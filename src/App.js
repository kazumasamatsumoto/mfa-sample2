import "./App.css";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  RecaptchaVerifier,
  signOut,
  sendEmailVerification,
  PhoneAuthProvider,
  multiFactor,
  signInWithEmailAndPassword,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
initializeApp(firebaseConfig);

const auth = getAuth();

function App() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginOpt, setLoginOpt] = useState("");

  const configureCaptcha = () => {
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

  const logOut = () => {
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

  const signInMethod = async () => {
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

  const twoFactorMethod = async () => {
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

  const verifyAction = async () => {
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

  const loginForm = async () => {
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

  const loginVerifyAction = async () => {
    try {
      const firebaseCredentials = PhoneAuthProvider.credential(
        window.verificationId,
        loginOpt
      );
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(firebaseCredentials);
      const credentials = await window.resolver.resolveSignIn(multiFactorAssertion);
      console.log(credentials)
      console.log("success");
    } catch (e) {
      console.log(e, "error");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>アカウント作成Form</h2>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signInMethod}>Submit</button>
        <h2>アカウント２段階認証Form</h2>
        <div id="sign-in-button"></div>
        <input
          type="number"
          name="mobile"
          placeholder="Mobile number"
          required
          onChange={(e) => setMobile(e.target.value)}
        />
        <button onClick={twoFactorMethod}>Submit</button>
        <h2>認証コード入力</h2>
        <div id="sign-in-button"></div>
        <input
          type="number"
          name="verify"
          placeholder="verify number"
          required
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={verifyAction}>Submit</button>
        <h2>ログアウト</h2>
        <button onClick={logOut}>Logout</button>
        <h2>ログインフォーム</h2>
        <div id="sign-in-button"></div>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          type="password"
          required
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={loginForm}>Login</button>
        <h2>ログイン認証コード入力</h2>
        <div id="sign-in-button"></div>
        <input
          type="number"
          name="verify"
          placeholder="verify number"
          required
          onChange={(e) => setLoginOpt(e.target.value)}
        />
        <button onClick={loginVerifyAction}>Submit</button>
      </header>
    </div>
  );
}

export default App;

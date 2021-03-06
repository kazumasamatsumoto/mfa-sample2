import "./App.css";
import React, { useState } from "react";
import app from "./firebase/firebase.js";
import { logOut } from "./firebase/signOut.js";
import { signInMethod } from "./firebase/signIn.js";
import { twoFactorMethod } from "./firebase/twoFactor.js";
import { verifyAction } from "./firebase/verifyAction.js";
import { loginForm } from "./firebase/login.js";
import { loginVerifyAction } from "./firebase/loginVerifyAction.js";
import { configureCaptcha } from "./firebase/configureCaptcha.js";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getMultiFactorResolver,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase/firebase.js";

onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChanged");
  if (user) {
    console.log("signIn");
  } else {
    console.log("signOut");
  }
});

function App() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginOpt, setLoginOpt] = useState("");

  const provider = new GoogleAuthProvider();

  async function googleLogin() {
    configureCaptcha();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(token, user, "signIn");
        // ...
      })
      .catch(async (error) => {
        if (error.code === "auth/multi-factor-auth-required") {
          window.resolver = getMultiFactorResolver(auth, error);
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
      });
  }

  return (
    <div className="App">
      <h4>?????????????????????Form</h4>
      <h4>?????????????????????????????????????????????????????????????????????????????????????????????</h4>
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
      <button onClick={() => signInMethod(email, password)}>
        ?????????????????????
      </button>
      <h4>Google????????????</h4>
      <button onClick={() => googleLogin()}>?????????????????????</button>
      <h4>??????????????????????????????Form</h4>
      <h4>???????????????????????????????????????????????????????????????0????????????????????????</h4>
      <div id="sign-in-button"></div>
      <input
        type="number"
        name="mobile"
        placeholder="Mobile number"
        required
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={() => twoFactorMethod(mobile)}>??????????????????</button>
      <h4>?????????????????????</h4>
      <div id="sign-in-button"></div>
      <input
        type="number"
        name="verify"
        placeholder="verify number"
        required
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={() => verifyAction(otp)}>??????</button>
      <h4>???????????????</h4>
      <button onClick={logOut}>???????????????</button>
      <h4>????????????????????????</h4>
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
      <button onClick={() => loginForm(loginEmail, loginPassword)}>
        ????????????
      </button>
      <h4>?????????????????????????????????</h4>
      <div id="sign-in-button"></div>
      <input
        type="number"
        name="verify"
        placeholder="verify number"
        required
        onChange={(e) => setLoginOpt(e.target.value)}
      />
      <button onClick={() => loginVerifyAction(loginOpt)}>
        ?????????????????????
      </button>
    </div>
  );
}

export default App;

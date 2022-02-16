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

        await phoneAuthProvider.verifyPhoneNumber(
          phoneOptions,
          window.recaptchaVerifier
        );

        alert("Code has been sent to your phone");
      });
  }

  return (
    <div className="App">
      <h4>アカウント作成Form</h4>
      <h4>アカウントを作成すると承認メールが届きますので確認してください</h4>
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
        アカウント作成
      </button>
      <h4>Googleログイン</h4>
      <button onClick={() => googleLogin()}>アカウント作成</button>
      <h4>アカウント２段階認証Form</h4>
      <h4>電話番号を入力すると認証コードが届きます。0を抜いてください</h4>
      <div id="sign-in-button"></div>
      <input
        type="number"
        name="mobile"
        placeholder="Mobile number"
        required
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={() => twoFactorMethod(mobile)}>電話番号入力</button>
      <h4>認証コード入力</h4>
      <div id="sign-in-button"></div>
      <input
        type="number"
        name="verify"
        placeholder="verify number"
        required
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={() => verifyAction(otp)}>認証</button>
      <h4>ログアウト</h4>
      <button onClick={logOut}>ログアウト</button>
      <h4>ログインフォーム</h4>
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
        ログイン
      </button>
      <h4>ログイン認証コード入力</h4>
      <div id="sign-in-button"></div>
      <input
        type="number"
        name="verify"
        placeholder="verify number"
        required
        onChange={(e) => setLoginOpt(e.target.value)}
      />
      <button onClick={() => loginVerifyAction(loginOpt)}>
        認証コード入力
      </button>
    </div>
  );
}

export default App;

import "./App.css";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
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

  const configureCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
          console.log("Recaptca varified", response);
        },
      },
      auth
    );
  };

  const onSignInSubmit = (e) => {
    e.preventDefault();
    configureCaptcha();
    const phoneNumber = "+81" + mobile;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    console.log(appVerifier);
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.log("SMS not sent", error);
      });
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const code = otp;
    console.log(code);
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(JSON.stringify(user));
        alert("User is verified");
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      });
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
  return (
    <div className="App">
      <header className="App-header">
        <h2>Login Form</h2>
        <form onSubmit={onSignInSubmit}>
          <div id="sign-in-button"></div>
          <input
            type="number"
            name="mobile"
            placeholder="Mobile number"
            required
            onChange={(e) => setMobile(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>

        <h2>Enter OTP</h2>
        <form onSubmit={onSubmitOTP}>
          <input
            type="number"
            name="otp"
            placeholder="OTP Number"
            required
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={logOut}>Logout</button>
      </header>
    </div>
  );
}

export default App;

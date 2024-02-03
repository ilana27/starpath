import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { LoginControlledInput } from "./journal/ControlledInput";
import googleLogo from "./assets/google_logo.png";
import "./styles/login.css";

interface LoginPageProps {
  onLogin: () => void; // Callback function to be called on successful login
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    email: string,
    password: string
  ) => {
    if (event.key === "Enter") {
      console.log("Enter pressed");
      handleSubmit(email, password);
    }
  };

  async function handleSubmit(email: string, password: string) {
    console.log("Logging in with email: " + email);
    // validate data

    // if data is valid, query firebase to log user in

    // if data is invalid, display alert
    // TODO: what if the data is valid (by my standards), but doesn't exist in firebase?
    // ^^ what kind of error will firebase throw? TODO: catch that and display that there
    // is no account with that email info

    // might also need to handle if the username is valid but the password isn't
    alert("Mocked login successful!");
    onLogin();
  }

  return (
    <div className="login-page">
      <h1 className="login-header">Login:</h1>
      <LoginControlledInput
        value={email}
        setValue={setEmail}
        ariaLabel={"email text box"}
        placeholder="email"
        onKeyPress={(e) => handleKeyPress(e, email, password)} // TODO: do we want a handle keypress here?
      />

      <LoginControlledInput
        value={password}
        setValue={setPassword}
        ariaLabel={"password text box"}
        placeholder="password"
        onKeyPress={(e) => handleKeyPress(e, email, password)}
      />

      <p className="or-sign-in"> or sign in with </p>
     
      <a
        href="https://www.google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={googleLogo} alt="google logo" className="google-logo" />
      </a>

      <button
        className="login-button"
        aria-label="login button"
        id="login-button"
        onClick={() => handleSubmit(email, password)}
      >
        Login
      </button>

      <p className="registering">
        Don't have an account?{" "}
        <a
          href="https://www.gmail.com"
          className="register-link"
          aria-label="register link"
        >
          Register
        </a>
      </p>
    </div>
  );
}

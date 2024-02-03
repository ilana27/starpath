import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ControlledInput } from "./journal/ControlledInput";
import googleLogo from "../assets/google_logo.png";

export default function RegisterPage() {
  // gonna want 2 text boxes
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // TODO: I think I should modify this to take in both the username and password
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    name: string,
    email: string,
    password: string
  ) => {
    if (event.key === "Enter") {
      console.log("enter pressed");
      //   handleSubmit(text);
    }
  };

  async function handleSubmit(name: string, email: string, password: string) {
    console.log("registering " + name);

    // validate data

    // if data is valid, register new user in firebase
  }

  return (
    <div className="login-page">
      <ControlledInput
        value={name}
        setValue={setName}
        ariaLabel={"name text box"}
        placeholder="name"
        onKeyPress={(e) => handleKeyPress(e, name, email, password)} // TODO: do we want a handle keypress here?
      />

      <ControlledInput
        value={email}
        setValue={setEmail}
        ariaLabel={"email text box"}
        placeholder="email"
        onKeyPress={(e) => handleKeyPress(e, name, email, password)} // TODO: do we want a handle keypress here?
      />

      <ControlledInput
        value={password}
        setValue={setPassword}
        ariaLabel={"password text box"}
        placeholder="password"
        onKeyPress={(e) => handleKeyPress(e, name, email, password)}
      />

      <p> or register with </p>
      {/* wrap the google logo in an anchor element to have the image 
        link to firebase auth. TODO: change href to firebase auth 
        from google.com 
    */}
      <a
        href="https://www.google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={googleLogo} alt="google logo" className="google-logo" />
      </a>

      <div>
        {" "}
        {/* create another div tag so that the button displays below the google logo */}
        <button
          className="register-button"
          onClick={() => handleSubmit(name, email, password)}
        >
          Register
        </button>
      </div>
    </div>
  );
}

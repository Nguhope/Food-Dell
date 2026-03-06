import React, { useState } from "react";
import "./LoginPoup.css";
import { assets } from "../../assets/assets";

const LoginPopUP = ({ setShowLogin }) => {
  const [currentState, setCurrentstate] = useState("Login");
  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input type="text" placeholder="your name" required />
          )}
          <input type="email" placeholder="your email" required />
          <input type="password" placeholder="Password" required />
        </div>
        <button>
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" name="" id="" required />
          <p>By continuing , i agree to the term of use & privacy polcies </p>
        </div>
        {currentState === "Login" ? (
          <p>
            {" "}
            Create a new Accout ? <span onClick={() =>setCurrentstate("Sign Up")}>Click here </span>
          </p>
        ) : (
          <p>already having an account ? <span onClick={() =>setCurrentstate("Login")}>Login Here </span> </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUP;

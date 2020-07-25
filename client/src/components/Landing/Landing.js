import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="container">
      <h1 className="landing-head">
        <strong>
          YouTube <span className="landing-head-span">Notes</span>
        </strong>
      </h1>
      <p className="landing-para">
        With YouTube Notes, you can start jotting down your thoughts while
        watching a YouTube video
      </p>
      <div className="btn-container">
        <Link to={"/register"}>
          <button type="submit" className="reg-btn-landing">
            <strong>Register</strong>
          </button>
        </Link>

        <Link to={"/Login"}>
          <button type="submit" className="login-btn-landing">
            <strong>Login</strong>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import history from "../history";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    axios
      .post("/api/login", { user })
      .then((res) => {
        if (res.status === 200) {
          axios
            .get("/api/search")
            .then((res) => console.log("Token received"))
            .catch((err) => {
              throw err;
            });
          history.push("/api/search"); //To redirect the user to the /api/search route after
          //logging in
          window.location.reload(); //To reload so that the search page is visible now
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error logging in please try again");
      });
  }

  return (
    <div className="container">
      <h1 className="login-head">
        You are now just one step away from taking notes!!
      </h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          className="reg-input"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <label htmlFor="password">Password: </label>
        <input
          className="reg-input"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="log-log-btn" type="submit">
          Login
        </button>
        <Link to="/register">
          <small>Don't have an account yet? Let's change that!</small>
        </Link>
      </form>
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from "react";
import "./Register.css";
import axios from "axios";
import history from "../history";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [head, setHead] = useState("");

  //To show the heading on the register page
  useEffect(() => {
    fetch("/api/register")
      .then((res) => res.text())
      .then((res) => setHead(res));
  }, []);

  //To make a post request to the back-end with the user data
  function handleSubmit(e) {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
    };

    axios.post("/api/register", { user }).then((res) => {
      alert(res.data);
      if (res.data === "Registered successfully!!!!!") {
        history.push("/login");
        window.location.reload();
      }
    });
  }

  return (
    <div className="container">
      <h1 className="reg-head">Lets get started!</h1>
      <form className="reg-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          className="reg-input"
          type="text"
          onChange={(e) => setName(e.target.value)}
          name="name"
          autoComplete="off"
        />
        <label htmlFor="email">Email: </label>
        <input
          className="reg-input"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          autoComplete="off"
        />
        <label htmlFor="password">Password: </label>
        <input
          className="reg-input"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />
        <button type="submit" className="reg-reg-btn">
          Register
        </button>
        <Link to="/login">
          <small>Already have an account? Login</small>
        </Link>
      </form>
    </div>
  );
}

export default Register;

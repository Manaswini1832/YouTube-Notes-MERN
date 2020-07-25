import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import "./Search.css";

function Search() {
  const [head, setHead] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios
      .get("/api/search")
      .then((res) => {
        if (
          res.data === "Unauthorized: No token provided" ||
          res.data === "Unauthorized: Invalid token"
        ) {
          setHead(res.data);
        } else {
          setId(res.data);
        }
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <div className="search-container">
      {head === "Unauthorized: Invalid token" ||
      head === "Unauthorized: No token provided" ? (
        <div className="warning-div">
          <h1 className="warning-heading">
            Access Denied! Please consider logging in before accessing this
            page.
          </h1>
          <Link to="/login">
            <button className="warning-btn">Login</button>
          </Link>
        </div>
      ) : (
        <SearchBar userId={id} />
      )}
    </div>
  );
}

export default Search;

import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="nav">
      <div className="nav-items">
        <ul>
          <Link to="/search">
            <li>Search</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;

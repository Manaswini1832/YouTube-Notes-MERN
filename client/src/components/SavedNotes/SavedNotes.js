import React, { useEffect, useState } from "react";
import axios from "axios";
import Note from "./Note";
import "./Note.css";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./SavedNote.css";
import "../Search/Search.css";

function SavedNotes() {
  const [head, setHead] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    axios
      .get("/api/view")
      .then((res) => {
        if (
          res.data === "Unauthorized: No token provided" ||
          res.data === "Unauthorized: Invalid token"
        ) {
          setHead(res.data);
        }
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  useEffect(() => {
    let userId = window.location.pathname.slice(7);
    axios
      .post("/api/getnotes", { userId })
      .then((res) => {
        res.data.forEach((note) => {
          setSavedNotes((prevNotes) => {
            return [...prevNotes, note];
          });
        });
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  useEffect(() => {
    if (id !== "") {
      axios
        .post("/api/delete", { id })
        .then((res) => {
          if (res.data === "Deleted Successfully") {
            savedNotes = [];
            window.location.reload();
          }
        })
        .catch((err) => {
          throw err;
        });
      window.location.reload();
    }
  }, [id]);

  function handleClick(e) {
    e.preventDefault();
    var r = window.confirm(
      "By clicking on OK, all your notes will be deleted. Do you still want to proceed?"
    );
    console.log(r);
    if (r == true) {
      console.log("Let's delete all the notes");
      setId(window.location.pathname.slice(7));
    }
  }

  return (
    <div className="savedNote-div">
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
        <div className="notes-div">
          <NavBar />
          <h1>SAVED NOTES</h1>
          <button className="del-btn" onClick={handleClick} type="submit">
            <p>Delete all notes</p>
          </button>
          {savedNotes.map((note, index) => {
            return (
              <Note
                key={index}
                id={index}
                title={note.title}
                content={note.content}
                videoUrl={note.vidUrl}
                userId={note.id}
                tag1={note.tag}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedNotes;

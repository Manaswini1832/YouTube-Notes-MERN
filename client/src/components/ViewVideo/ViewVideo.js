import React, { useState, useEffect } from "react";
import "./ViewVideo.css";
import axios from "axios";
import history from "../history";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "../Search/Search.css";

function ViewVideo() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag1, setTag1] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [savedNote, setSavedNote] = useState({
    title: "",
    content: "",
    id: "",
    vidUrl: "",
    tag: "",
  });
  const [initialRender, setInitialRender] = useState("false"); //To stop sending the req
  //to /api/save on first render(first refresh)
  const [head, setHead] = useState(""); //To deal with unauthorized access

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
    console.log(initialRender);
    if (initialRender === "true") {
      axios
        .post("/api/save", { savedNote })
        .then((res) => {
          alert("Note saved!");
          const userId = res.data;
          console.log("UserId: " + userId);
          history.push(`/notes/${userId}`);
          window.location.reload();
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [savedNote]);

  useEffect(() => {
    var urlParams = new URLSearchParams(window.location.search);
    setVideoUrl(urlParams.get("videoid"));
  }, []);

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleContentChange(e) {
    setContent(e.target.value);
  }

  function handleTag1Change(e) {
    setTag1(e.target.value);
  }

  function handleNoteSave(e) {
    e.preventDefault();

    const id = window.location.pathname.slice(6);
    setSavedNote({
      title: title,
      content: content,
      id: id,
      vidUrl: videoUrl,
      tag: tag1,
    });
    setInitialRender("true");
  }

  return (
    <div>
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
        <div className="view-video-container">
          <NavBar />
          <iframe
            id="ytplayer"
            type="text/html"
            src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&origin=http://example.com`}
            frameBorder="0"
          ></iframe>

          <div className="note">
            <div>
              <label htmlFor="title">Title</label>
              <input type="text" value={title} onChange={handleTitleChange} />
              <label htmlFor="content">Content</label>
              <textarea
                name="note-area"
                rows="20"
                value={content}
                onChange={handleContentChange}
              ></textarea>

              <label htmlFor="tag">Tag</label>
              <input
                onChange={handleTag1Change}
                type="text"
                name="tag"
                className="tag-input"
                id="tag1"
              />

              <button className="save" onClick={handleNoteSave} type="submit">
                <p>Save note</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewVideo;

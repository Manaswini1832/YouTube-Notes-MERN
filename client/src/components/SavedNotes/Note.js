import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Note(props) {
  const videoUrl = props.videoUrl;
  const userId = props.userId;
  const [firstTag, setTag1] = useState("");

  useEffect(() => {
    setTag1(props.tag1);
  }, []);

  return (
    <div className="each-note">
      <h2>{props.title}</h2>

      <p className="content-para">{props.content}</p>
      <Link to={`/viewAgain/${userId}/?videoid=${videoUrl}&show=false`}>
        <button className="watch-again-btn">Watch the video again</button>
      </Link>
      <div className="tags-div">
        {firstTag === "" ? null : <p className="tag">{firstTag}</p>}
      </div>
    </div>
  );
}

export default Note;

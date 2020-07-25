import React from "react";
import "./WatchAgain.css";
import NavBar from "../NavBar/NavBar";

function WatchAgain() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get("videoid"));
  const videoUrl = urlParams.get("videoid");

  return (
    <div className="watch-again-div">
      <NavBar />
      <iframe
        id="ytplayer"
        type="text/html"
        src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&origin=http://example.com`}
        frameBorder="0"
        className="watch-again-player"
      ></iframe>
    </div>
  );
}

export default WatchAgain;

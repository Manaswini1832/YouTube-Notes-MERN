import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import axios from "axios";
import { Link } from "react-router-dom";

//userId is passed as a prop from search.js to searchbar.js
function SearchBar(props) {
  const [query, setQuery] = useState("");
  const [finalQuery, setFinalQuery] = useState("");
  const [urls, setUrls] = useState([]);
  const [videoIds, setVideoIds] = useState([]);

  useEffect(() => {
    setUrls([]);
    setVideoIds([]);
    axios
      .post("/api/request", { finalQuery })
      .then((res) => {
        for (let i = 0; i < res.data.imgSrcs.length; i++) {
          setUrls((prevUrls) => {
            return [...prevUrls, res.data.imgSrcs[i]];
          });

          setVideoIds((prevVideoIds) => {
            return [...prevVideoIds, res.data.videoIds[i]];
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  }, [finalQuery]);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFinalQuery(query);
    console.log(`I'll be querying for ${query}`);
  }

  return (
    <div className="searchBar-container">
      <div className="query-div">
        <form className="query-form" onSubmit={handleSubmit}>
          <label className="search-label">Search for videos : </label>
          <div className="input-and-btn">
            <input
              className="search-input"
              type="text"
              onChange={handleChange}
              value={query}
            />
            <button className="search-btn" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="thumbs-div">
        {urls.map((url, index) => {
          return (
            <Link
              key={index}
              to={`/view/${props.userId}?videoid=${videoIds[index]}&show=true`}
            >
              <div>
                <img
                  src={url}
                  alt="video-thumbnail"
                  key={index}
                  className="thumbnail"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;

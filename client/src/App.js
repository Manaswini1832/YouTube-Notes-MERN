import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Search from "./components/Search/Search";
import ViewVideo from "./components/ViewVideo/ViewVideo";
import SavedNotes from "./components/SavedNotes/SavedNotes";
import WatchAgain from "./components/WatchAgain/WatchAgain";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/api/search" exact component={Search} />
      <Route path="/view/:userId" exact component={ViewVideo} />
      <Route path="/viewAgain/:userId" exact component={WatchAgain} />
      <Route path="/notes/:userId" exact component={SavedNotes} />
    </Router>
  );
}

export default App;

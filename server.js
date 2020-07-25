const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken"); //to issue a JWT when a post req comes from /api/authenticate
const cookieParser = require("cookie-parser");
const verify = require("./verifyToken");
const fetch = require("node-fetch");

//Configuring the dotenv package to be able to use env variables
dotenv.config();

//Port definition
const PORT = process.env.PORT || 5000;

//Import User model
const User = require("./model/User");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Middleware(verify used for protected routes)
app.use("/api/search", verify);
app.use("/api/notes", verify);
app.use("/api/view", verify);

//Connect to the DB
const mongo_uri = process.env.DB_CONNECT;
mongoose.connect(
  mongo_uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      throw err;
    } else {
      console.log("Successfully connected to DB after protection");
    }
  }
);

//Register Route(Doesn't give a JWT)
app.post("/api/register", async (req, res) => {
  const user = await new User({
    name: req.body.user.name,
    email: req.body.user.email,
    password: req.body.user.password,
  });

  //For prevention against saving the same user multiple times
  User.findOne({ email: req.body.user.email }, (err, data) => {
    if (err) {
      throw err;
    } else if (data === null) {
      try {
        user.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.send("Registered successfully!!!!!").status(200);
          }
        });
      } catch (err) {
        res.status(400).send(err);
      }
    } else if (data !== null) {
      res.send("Email already exists!");
    }
  });
});

//Route for user login
app.post("/api/login", function (req, res) {
  const { email, password } = req.body.user;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (!user) {
      res.sendStatus(401);
    } else {
      //Used the isCorrectPassword method on the User model
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.sendStatus(500).send("Error logging in. Please try again!");
        } else if (!same) {
          res.sendStatus(401);
        } else {
          //Giving JWT with an expiry set to 24 hrs
          const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "24h",
          });
          res.cookie("token", token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

//Route to make a request to the YouTube API
app.post("/api/request", (req, res) => {
  //This is the URL that will give us data from YT API
  const reqUrl =
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.API_KEY}&max_results=60&part=snippet&q=` +
    req.body.finalQuery;

  //Function that makes a request to the YT API and returns an array of sources of the thumbnail
  async function giveImgSrcs() {
    const imgSrcs = []; //Contains all the thumbnail sources of videos
    const videoIds = []; //Contains all the video IDs of videos
    const data = await fetch(reqUrl);
    const json = await data.json();

    for (let i = 0; i < json.items.length; i++) {
      imgSrcs.push(json.items[i].snippet.thumbnails.medium.url);
      videoIds.push(json.items[i].id.videoId);
    }

    return {
      imgSrcs: imgSrcs,
      videoIds: videoIds,
    };
  }
  giveImgSrcs()
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

//Route which when called will save the note to the database
app.post("/api/save", verify, (req, res) => {
  const id = req.body.savedNote.id;
  const noteToBeSaved = req.body.savedNote;
  // console.log(noteToBeSaved);
  if (noteToBeSaved.title !== "" || noteToBeSaved.content !== "") {
    // console.log("We will now save this note");
    User.findOne({ _id: id }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        foundUser.notes.push(noteToBeSaved);
        foundUser.save();
        // console.log("Note saved!!");
      }
    });
  }
});

//Route for retrieving the notes that the user had stored in the DB
app.post("/api/getnotes", (req, res) => {
  User.findOne({ _id: req.body.userId }, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.send(data.notes);
    }
  });
});

//Route to delete all the notes
app.post("/api/delete", (req, res) => {
  let idOfUser = req.body.id;
  User.findOne({ _id: idOfUser }, (error, foundUser) => {
    if (!error) {
      foundUser.notes = [];
      foundUser.save((err) => {
        if (err) {
          throw err;
        } else {
          res.send("Deleted successfully!!!");
        }
      });
    } else {
      throw err;
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is up and running successfully!!");
});

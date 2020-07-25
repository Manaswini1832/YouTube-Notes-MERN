//This middleware is intended to sit between any get request and protected route
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//Configuring dotenv package to get access to env variables
dotenv.config();

const secret = `${process.env.TOKEN_SECRET}`;

const verify = function (req, res, next) {
  const token = req.cookies.token;
  if (token === undefined || !token) {
    res.send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.send("Unauthorized: Invalid token");
      } else {
        req._id = decoded._id;
        res.send(req._id);
        next();
      }
    });
  }
};

module.exports = verify;

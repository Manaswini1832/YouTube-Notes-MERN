const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Note schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  content: {
    type: String,
    required: true,
    min: 3,
  },
  vidUrl: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
});

//User Schema using the note schema for the notes array
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  notes: [noteSchema],
});

//Hashing our password
userSchema.pre("save", function (next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified("password")) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, saltRounds, function (err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

//Adding a method to our userSchema that checks if the password entered and the password from the database match
userSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

module.exports = new mongoose.model("User", userSchema);

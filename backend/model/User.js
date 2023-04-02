const Mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

UserSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user.update({ $unset: { token: 1 } }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = Mongoose.model("User", UserSchema, "user");

module.exports = User;

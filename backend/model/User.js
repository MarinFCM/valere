const Mongoose = require("mongoose");

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
    minlength: 64,
    required: true,
  },
});

const User = Mongoose.model("User", UserSchema, "user");

module.exports = User;

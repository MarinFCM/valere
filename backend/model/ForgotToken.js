const Mongoose = require("mongoose");

const ForgotTokenSchema = new Mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const ForgotToken = Mongoose.model("ForgotToken", ForgotTokenSchema, "forgotToken");

module.exports = ForgotToken;

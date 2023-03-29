const Mongoose = require("mongoose");

const ForgotTokenSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  token: {
    type: String,
    minlength: 64,
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

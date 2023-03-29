const Mongoose = require("mongoose");

const VerificationTokenSchema = new Mongoose.Schema({
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
});

const VerificationToken = Mongoose.model("VerificationToken", VerificationTokenSchema, "verificationToken");

module.exports = VerificationToken;

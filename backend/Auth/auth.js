const User = require("../model/User");
const ForgotToken = require("../model/ForgotToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("./mailer");
const crypto = require("crypto");
require("dotenv").config();

//const jwtSecret =
//  "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";

exports.checkLoginStatus = (req, res, next) => {
  let token = req.cookies.auth;
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) console.log("error", e);
    User.findOne({ _id: decoded, token: token })
      .then((user) => {
        req.token = token;
        req.email = user.email;
        next();
      })
      .catch((e) => console.log("error", e));
  });
};

exports.register = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    const confToken = jwt.sign({ email: email }, process.env.MAILER_SECRET);
    await User.create({
      email,
      password: hash,
      verified: false,
      token: confToken,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRET,
          {
            expiresIn: maxAge, // 3hrs
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
        nodemailer.sendConfirmationEmail(email, confToken);
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      if (user.verified == false) {
        res.status(400).json({
          message: "Login not successful",
          error: "Email not verified",
        });
      } else {
        bcrypt.compare(password, user.password).then(function (result) {
          if (result) {
            var token = jwt.sign(
              user._id.toHexString(),
              process.env.JWT_SECRET
            );
            User.findOneAndUpdate({ email: email }, { token: token })
              .then((user) => {
                res.cookie("auth", token, {
                  httpOnly: true,
                  maxAge: process.env.COOKIE_AGE * 1000 * 60 * 60,
                });
                res.status(201).json({
                  message: "User successfully Logged in",
                  user: user._id,
                });
              })
              .catch((e) => console.log("error", e));
          } else {
            res.status(400).json({ message: "Login not succesful" });
          }
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.verify = async (req, res, next) => {
  const { token } = req.params;

  jwt.verify(token, process.env.MAILER_SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      res.send(
        "Email verification failed, possibly the link is invalid or expired"
      );
      return;
    }
  });

  User.findOne({
    token: token,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User Not found." });
      }
      if (user.token != token) {
        return res.status(404).json({ message: "Invalid verification token." });
      }

      User.findOneAndUpdate({ email: user.email }, { verified: true, token: 1 })
        .then((user) => {
          return res
            .status(200)
            .json({ message: "Email verified, you can login now!" });
        })
        .catch((e) => console.log("error", e));
    })
    .catch((e) => console.log("error", e));
};

exports.logout = async (req, res, next) => {
  User.findOneAndUpdate({ email: req.email }, { token: 1 })
    .then((user) => {
      return res.sendStatus(200);
    })
    .catch((e) => console.log("error", e));
};

exports.forgot = async (req, res, next) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      let resetToken = crypto.randomBytes(32).toString("hex");
      bcrypt.hash(resetToken, 10).then((hash) => {
        ForgotToken.create({
          userId: user._id,
          email: user.email,
          token: hash,
          createdAt: Date.now(),
        })
          .then(() => {
            nodemailer.sendForgotEmail(user.email, resetToken, user._id);
            res.status(200).json({ message: "Reset email sent" });
          })
          .catch(() => {
            console.log("Forgot Token not created");
            return res.status(400).json({ message: "Reset email sent" });
          });
      });
    })
    .catch(() => {
      return res.status(400).json({ message: "Reset email sent" });
    });
};

exports.resetRend = async (req, res, next) => {
  ForgotToken.findOne({ userId: req.params.id })
    .then((doc) => {
      bcrypt.compare(req.params.token, doc.token).then((result) => {
        if (result) {
          res.render("reset");
        } else {
          res.status(400).json({ message: "Invalid reset token" });
        }
      });
    })
    .catch();
};

exports.reset = async (req, res, next) => {
  console.log(req);
  User.findOne({ userId: req.params.id }).then((user) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      User.updateOne({ password: hash }).then(() => {
        ForgotToken.findOneAndDelete(
          { userId: req.params.id },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Deleted token");
            }
          }
        );
        res.status(200).json({ message: "Password updated" });
      });
    });
  });
};

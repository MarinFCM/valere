const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("./mailer");

const jwtSecret =
  "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";

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
        const token = jwt.sign({ id: user._id, email }, jwtSecret, {
          expiresIn: maxAge, // 3hrs
        });
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
        // comparing given password with hashed password
        bcrypt.compare(password, user.password).then(function (result) {
          if (result) {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign({ id: user._id, email }, jwtSecret, {
              expiresIn: maxAge, // 3hrs in sec
            });
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000, // 3hrs in ms
            });
            res.status(201).json({
              message: "User successfully Logged in",
              user: user._id,
            });
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
  console.log(req.params);
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
        return res.status(404).send({ message: "User Not found." });
      }
      if (user.token != token) {
        return res.status(404).send({ message: "Invalid verification token." });
      }

      User.findOneAndUpdate({ email: user.email }, { verified: true })
        .then((user) => {
          return res
            .status(200)
            .send({ message: "Email verified, you can login now!" });
        })
        .catch((e) => console.log("error", e));
    })
    .catch((e) => console.log("error", e));
};

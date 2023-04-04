const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verify,
  logout,
  forgot,
  reset,
  checkLoginStatus,
  resetRend
} = require("./auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify/:token").get(verify);
router.route("/forgot").post(forgot);
router.route("/reset/:token/:id").post(reset);
router.route("/reset").get(resetRend);

router.route("/logout").get(checkLoginStatus, logout);

module.exports = router;

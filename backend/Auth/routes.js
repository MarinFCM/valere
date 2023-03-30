const express = require("express");
const router = express.Router();

const {register, login, verify, logout} = require("./auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify/:token").get(verify);
router.route("/logout").get(logout)

module.exports = router;
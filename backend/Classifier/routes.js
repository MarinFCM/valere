const express = require("express");
const router = express.Router();

const {recieveFile} = require("./recieveFile");

router.route("/upload").post(recieveFile);

module.exports = router;
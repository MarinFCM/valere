const express = require("express");
const router = express.Router();

const {recieveFile, upload} = require("./recieveFile");

router.route("/upload").post(upload.single("file"), recieveFile);

module.exports = router;
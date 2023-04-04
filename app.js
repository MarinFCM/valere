const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const http = require("http");
require("dotenv").config();
const { checkLoginStatus } = require("./Auth/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

PORT = process.env.PORT;

connectDB();

app.use("/api/auth", require("./Auth/routes"));
app.use("/api/file", require("./Classifier/routes"));

app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/views`));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/image", checkLoginStatus, (req, res) => {
  if (req.email == null) res.render("error");
  else res.render("image");
});

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

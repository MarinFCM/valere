const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
http = require("http");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

const PORT = 5000;
connectDB();

app.use("/api/auth", require("./Auth/routes"));
app.use("/api/file", require("./Classifier/routes"));

app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/views`));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/image", (req, res) => {
  res.render("image.html");
});

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

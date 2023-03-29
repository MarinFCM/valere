const express = require("express");
const connectDB = require("./db");
const app = express();
http = require('http')

const PORT = 5000;
app.use(express.json())
connectDB();

app.use("/api/auth", require("./Auth/routes"));

app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/views`));

app.get('/', (req, res) => {
  res.render('index.html')
})

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);
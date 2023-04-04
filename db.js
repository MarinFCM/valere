const Mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  await Mongoose.connect(process.env.LOCAL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;
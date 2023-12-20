// config/database.js

const mongoose = require("mongoose");

const mongo_uri = "mongodb://127.0.0.1:27017/adminlogin";

exports.connect = () => {
  mongoose
    .connect(mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((error) => {
      console.error("Database connection failed: " + error);
    });
};

// app.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const { connect } = require("./config/database");

connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/admin-panel", (req, res) => {
  res.sendFile(__dirname + "/public/admin-panel.html");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while logging in" });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

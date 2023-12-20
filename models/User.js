// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Create a default admin user
const defaultAdminUser = new User({
  username: "admin",
  password: "admin123",
});

// Save the default admin user to the database
defaultAdminUser.save();

module.exports = User;

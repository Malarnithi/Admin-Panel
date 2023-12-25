const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const { connect } = require("./config/database");

connect();

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.get("/admin-panel", (req, res) => {
    res.sendFile(__dirname + "/public/navigation.html");
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

// New route for handling category form submission
app.post("/add-category", async (req, res) => {
    try {
        // Get category name and description from the request body
        const { categoryName, categoryDescription } = req.body;

        // Create a new category object
        const newCategory = new Category({
            name: categoryName,
            description: categoryDescription,
        });

        // Save the category to the database
        await newCategory.save();

        res.status(201).json({ message: "Category added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred while adding the category" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

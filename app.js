// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/User");
const Category = require("./models/Category");
const { connect } = require("./config/database"); // Ensure you are importing connect from the correct path

connect();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/admin-panel", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "navigation.html"));
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

app.post("/add-category", async (req, res) => {
    try {
        // Get category name and description from the request body
        const { categoryName, categoryDescription } = req.body;

        // Try to find an existing category with the same name
        const existingCategory = await Category.findOne({ name: categoryName });

        if (existingCategory) {
            // If the category exists, update its description
            existingCategory.description = categoryDescription;
            await existingCategory.save();
            res.status(200).json({ message: "Category description updated successfully" });
        } else {
            // If the category doesn't exist, create a new one
            const newCategory = new Category({
                name: categoryName,
                description: categoryDescription,
            });

            // Save the category to the database
            await newCategory.save();
            res.status(201).json({ message: "Category added successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred while adding/updating the category" });
    }
});


app.get("/all-categories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: "Error occurred while fetching categories" });
    }
});

// New route for handling category deletion
app.post("/delete-categories", async (req, res) => {
    try {
        const { categoryIds } = req.body;

        // Use the Category model to delete multiple categories
        await Category.deleteMany({ _id: { $in: categoryIds } });

        res.status(200).json({ message: "Categories deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred while deleting categories" });
    }
});

app.post("/update-category", async (req, res) => {
    try {
        const { categoryId, categoryName, categoryDescription } = req.body;

        // Find the category by ID and update its data
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name: categoryName, description: categoryDescription },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while updating the category' });
    }
});

app.get("/course-descriptions", async (req, res) => {
    try {
        const categoryName = "Course"; // Set the desired category name
        const categories = await Category.find({ name: categoryName });
        const descriptions = categories.map(category => category.description);
        res.json(descriptions);
    } catch (error) {
        console.error('Error fetching descriptions:', error);
        res.status(500).json({ message: "Error occurred while fetching descriptions" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

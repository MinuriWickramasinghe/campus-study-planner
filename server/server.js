const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection (Serverless Friendly Connection)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Campus Study Planner API is running");
});

// Add Task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add task",
    });
  }
});

// Get All Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get tasks",
    });
  }
});

// Update Task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// Delete Task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

// Local Development සඳහා පමණක් Port එක Listen කිරීම
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel Serverless Function සඳහා Express App එක Export කිරීම
module.exports = app;
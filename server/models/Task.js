const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  subject: String,
  dueDate: String,
  priority: String,
  status: String,
  description: String,
});

module.exports = mongoose.model("Task", taskSchema);
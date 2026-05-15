const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch students." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.json(student);
  } catch (error) {
    return res.status(400).json({ message: "Invalid student id." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, course } = req.body;
    const student = await Student.create({ name, email, course });
    return res.status(201).json(student);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create student." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, course } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, course },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.json(student);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update student." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.json({ message: "Student deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid student id." });
  }
});

module.exports = router;

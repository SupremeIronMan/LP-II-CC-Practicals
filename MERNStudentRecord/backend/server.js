const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const studentSchema = new mongoose.Schema({
  name: String,
  regNo: String,
  phone: String,
  age: Number,
  department: String
});

const Student = mongoose.model('Student', studentSchema);

// GET all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new student
app.post('/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT update student
app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {      
        return res.status(404).json({ error: 'Student not found' });
        }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});
// DELETE student
app.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/', (req, res) => {
  res.send('Welcome to the Student Management API');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
}
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

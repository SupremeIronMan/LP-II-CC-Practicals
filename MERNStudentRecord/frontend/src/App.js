import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    regNo: '',
    phone: '',
    age: '',
    department: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`{replace YOUR_BACKEND_URL}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`{replace YOUR_BACKEND_URL}/students/${editingId}`, form);
      } else {
        await axios.post(`{replace YOUR_BACKEND_URL}/students`, form);
      }
      setForm({ name: '', regNo: '', phone: '', age: '', department: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      regNo: student.regNo,
      phone: student.phone,
      age: student.age,
      department: student.department
    });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`{replace YOUR_BACKEND_URL}/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h2>Student Management System</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Reg. No"
          value={form.regNo}
          onChange={e => setForm({ ...form, regNo: e.target.value })}
          required
        />
        <input
          placeholder="Phone No"
          type="tel"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
          required
        />
        <input
          placeholder="Department"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
          required
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          {editingId ? 'Update' : 'Add'} Student
        </button>
      </form>

      <div className="students-table-container">
        {students.length === 0 ? (
          <div className="empty-state">
            No students found. Add your first student above!
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg. No</th>
                <th>Phone No</th>
                <th>Age</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.regNo}</td>
                  <td>{student.phone}</td>
                  <td>{student.age}</td>
                  <td>{student.department}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;

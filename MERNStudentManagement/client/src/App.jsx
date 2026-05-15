import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/students";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    course: "",
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API_BASE_URL);
      setStudents(data);
    } catch (err) {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post(API_BASE_URL, formData);
      setFormData({ name: "", email: "", course: "" });
      fetchStudents();
    } catch (err) {
      setError("Failed to add student. Check values.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await axios.delete(`${API_BASE_URL}/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (err) {
      setError("Failed to delete student.");
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", email: "", course: "" });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      setError("");
      const { data } = await axios.put(`${API_BASE_URL}/${id}`, editData);
      setStudents((prev) =>
        prev.map((student) => (student._id === id ? data : student))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update student.");
    }
  };

  return (
    <div className="container">
      <h1>Student Manager</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Student</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list">
          {students.map((student) => (
            <li key={student._id}>
              {editingId === student._id ? (
                <>
                  <div className="edit-fields">
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      name="email"
                      type="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      name="course"
                      value={editData.course}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="actions">
                    <button onClick={() => handleUpdate(student._id)}>
                      Update
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>{student.name}</strong>
                    <div>{student.email}</div>
                    <div>{student.course}</div>
                  </div>
                  <div className="actions">
                    <button onClick={() => startEdit(student)}>Edit</button>
                    <button onClick={() => handleDelete(student._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

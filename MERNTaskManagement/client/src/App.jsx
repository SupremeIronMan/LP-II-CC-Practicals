import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
    setEditingTaskId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingTaskId) {
        const currentTask = tasks.find((task) => task._id === editingTaskId);
        await axios.put(`${API_BASE_URL}/tasks/${editingTaskId}`, {
          title: formData.title,
          description: formData.description,
          status: currentTask?.status || "pending",
        });
      } else {
        await axios.post(`${API_BASE_URL}/tasks`, formData);
      }

      resetForm();
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error.message);
    }
  };

  const handleEdit = (task) => {
    setFormData({ title: task.title, description: task.description });
    setEditingTaskId(task._id);
  };

  const handleStatusChange = async (task, status) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  return (
    <main className="app">
      <h1>Task Management App</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit">{editingTaskId ? "Update Task" : "Add Task"}</button>
          {editingTaskId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>All Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <h3 className={task.status === "completed" ? "completed" : ""}>
                {task.title}
              </h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>

              <select
                value={task.status}
                onChange={(event) => handleStatusChange(task, event.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <button type="button" className="secondary" onClick={() => handleEdit(task)}>
                Edit
              </button>
              <button type="button" className="danger" onClick={() => handleDelete(task._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;

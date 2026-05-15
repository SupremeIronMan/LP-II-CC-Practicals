import { useEffect, useState } from "react";
import axios from "axios";

const apiOrigin = "";
const API_BASE_URL = `${apiOrigin}/api/posts`;

function App() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    author: "",
    content: "",
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API_BASE_URL);
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
      setFormData({ title: "", author: "", content: "" });
      fetchPosts();
    } catch (err) {
      setError("Failed to create post. Check all fields.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      setError("Failed to delete post.");
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditData({
      title: post.title,
      author: post.author,
      content: post.content,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", author: "", content: "" });
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
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? data : post))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update post.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "";
    }
  };

  return (
    <div className="container">
      <h1>Online Blog</h1>
      <p className="subtitle">
        Create, view, edit, and delete posts from your browser.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your post..."
          value={formData.content}
          onChange={handleChange}
          required
        />
        <button type="submit">Publish post</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list">
          {posts.map((post) => (
            <li key={post._id}>
              {editingId === post._id ? (
                <>
                  <div className="edit-fields">
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      name="author"
                      value={editData.author}
                      onChange={handleEditChange}
                      required
                    />
                    <textarea
                      name="content"
                      value={editData.content}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="actions">
                    <button type="button" onClick={() => handleUpdate(post._id)}>
                      Save
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>{post.title}</strong>
                    <div className="post-meta">
                      By {post.author} · {formatDate(post.createdAt)}
                    </div>
                    <div className="post-content">{post.content}</div>
                  </div>
                  <div className="actions">
                    <button type="button" onClick={() => startEdit(post)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(post._id)}
                    >
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

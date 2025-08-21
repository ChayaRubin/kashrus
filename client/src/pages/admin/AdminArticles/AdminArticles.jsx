import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const { data } = await axios.get("http://localhost:5000/api/articles");
    setArticles(data);
  }

  async function saveArticle(e) {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/api/articles/${editing}`, form);
    } else {
      await axios.post("http://localhost:5000/api/articles", form);
    }
    setForm({ title: "", content: "" });
    setEditing(null);
    loadArticles();
  }

  async function editArticle(article) {
    setForm({ title: article.title, content: article.content });
    setEditing(article.id);
  }

  async function deleteArticle(id) {
    await axios.delete(`http://localhost:5000/api/articles/${id}`);
    loadArticles();
  }

  return (
    <div>
      <h1>Manage Articles</h1>
      <form onSubmit={saveArticle}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button type="submit">{editing ? "Update" : "Add"} Article</button>
      </form>

      <ul>
        {articles.map((a) => (
          <li key={a.id}>
            <strong>{a.title}</strong> – {a.content}{" "}
            <button onClick={() => editArticle(a)}>Edit</button>
            <button onClick={() => deleteArticle(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

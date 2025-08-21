import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHechsheirim() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", symbolUrl: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadHechsheirim();
  }, []);

  async function loadHechsheirim() {
    const { data } = await axios.get("http://localhost:5000/api/hechsheirim");
    setList(data);
  }

  async function saveHechsher(e) {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/api/hechsheirim/${editing}`, form);
    } else {
      await axios.post("http://localhost:5000/api/hechsheirim", form);
    }
    setForm({ name: "", description: "", symbolUrl: "" });
    setEditing(null);
    loadHechsheirim();
  }

  async function editHechsher(h) {
    setForm({ name: h.name, description: h.description || "", symbolUrl: h.symbolUrl || "" });
    setEditing(h.id);
  }

  async function deleteHechsher(id) {
    await axios.delete(`http://localhost:5000/api/hechsheirim/${id}`);
    loadHechsheirim();
  }

  return (
    <div>
      <h1>Manage Hechsheirim</h1>
      <form onSubmit={saveHechsher}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Symbol URL"
          value={form.symbolUrl}
          onChange={(e) => setForm({ ...form, symbolUrl: e.target.value })}
        />
        <button type="submit">{editing ? "Update" : "Add"} Hechsher</button>
      </form>

      <ul>
        {list.map((h) => (
          <li key={h.id}>
            <strong>{h.name}</strong> – {h.description}
            {h.symbolUrl && <img src={h.symbolUrl} alt={h.name} width="50" />}
            <button onClick={() => editHechsher(h)}>Edit</button>
            <button onClick={() => deleteHechsher(h.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRabanim() {
  const [rabbanim, setRabbanim] = useState([]);
  const [form, setForm] = useState({ name: "", area: "", bio: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadRabbanim();
  }, []);

  async function loadRabbanim() {
    const { data } = await axios.get("http://localhost:5000/rabanim");
    setRabbanim(data);
  }

  async function saveRabbi(e) {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/rabanim/${editing}`, form);
    } else {
      await axios.post("http://localhost:5000/rabanim", form);
    }
    setForm({ name: "", area: "", bio: "" });
    setEditing(null);
    loadRabbanim();
  }

  async function editRabbi(rabbi) {
    setForm({ name: rabbi.name, area: rabbi.area, bio: rabbi.bio || "" });
    setEditing(rabbi.id);
  }

  async function deleteRabbi(id) {
    await axios.delete(`http://localhost:5000/api/rabanim/${id}`);
    loadRabbanim();
  }

  return (
    <div>
      <h1>Manage Rabanim</h1>
      <form onSubmit={saveRabbi}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Area"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        />
        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <button type="submit">{editing ? "Update" : "Add"} Rabbi</button>
      </form>

      <ul>
        {rabbanim.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> – {r.area}
            <br />
            {r.bio}
            <button onClick={() => editRabbi(r)}>Edit</button>
            <button onClick={() => deleteRabbi(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Feedback } from "../../../app/api.js";

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    Feedback.list().then(setFeedback).catch(console.error);
  }, []);

  const handleStatusChange = async (id, status) => {
    await Feedback.update(id, status);
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Feedback</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {feedback.map((f) => (
          <li key={f.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><b>Message:</b> {f.message}</p>
            {f.restaurant && <p><b>Restaurant:</b> {f.restaurant.name}</p>}
            <p><b>Status:</b> {f.status}</p>
            <button onClick={() => handleStatusChange(f.id, "RESOLVED")}>Mark Resolved</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

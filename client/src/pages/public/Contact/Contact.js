import React, { useState } from "react";
import { Feedback } from "../../../app/api.js";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Feedback.submit({ message });
      setSubmitted(true);
    } catch (err) {
      alert("Failed to send feedback");
      console.error(err);
    }
  };

  if (submitted) {
    return <p>Thank you for your feedback!</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Contact / Feedback</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the issue (e.g. wrong address, closed restaurant)..."
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Feedback } from "../../../app/api.js";
import styles from "./Contact.module.css";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const restaurantId = searchParams.get("restaurantId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Feedback.submit({ message, restaurantId });
      setSubmitted(true);
    } catch (err) {
      alert("Failed to send feedback");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>Contact / Feedback</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue (e.g. wrong address, closed restaurant)..."
            rows={4}
            className={styles.textarea}
          />
          <button type="submit" className={styles.button}>
            Send
          </button>
        </form>
      ) : (
        <div className={styles.thankyou}>
          <p>Thank you for your feedback!</p>
        </div>
      )}

      {/* ✅ Back button always visible */}
      {restaurantId ? (
        <Link to={`/restaurant/${restaurantId}`} className={styles.backbutton}>
          ⬅ Back to Restaurant
        </Link>
      ) : (
        <button onClick={() => navigate(-1)} className={styles.backbutton}>
          ⬅ Back
        </button>
      )}
    </div>
  );
}

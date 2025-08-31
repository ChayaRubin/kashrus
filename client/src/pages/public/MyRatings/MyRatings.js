import React, { useEffect, useState } from "react";
import { Ratings } from "../../../app/api.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function MyRatings() {
  const { isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadRatings();
    }
  }, [isAuthenticated]);

  const loadRatings = async () => {
    try {
      // 👉 You need a backend endpoint that returns all ratings for current user
      const data = await Ratings.listMine();
      setRatings(data);
    } catch (err) {
      console.error("Failed to load my ratings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20 }}>
        <h2>My Ratings</h2>
        <p>
          Please <Link to="/login">log in</Link> to see your ratings.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Ratings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : ratings.length === 0 ? (
        <p>You haven’t rated any restaurants yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {ratings.map((r) => (
            <li
              key={r.restaurant.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <Link to={`/restaurant/${r.restaurant.id}`}>
                <strong>{r.restaurant.name}</strong>
              </Link>
              <p>
                Your rating: <b>{r.rating} ★</b>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

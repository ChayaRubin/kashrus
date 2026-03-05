// import React, { useState } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { Feedback } from "../../../app/api.js";
// import styles from "./Contact.module.css";

// export default function Contact() {
//   const [message, setMessage] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const restaurantId = searchParams.get("restaurantId");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await Feedback.submit({ message, restaurantId });
//       setSubmitted(true);
//     } catch (err) {
//       alert("Failed to send feedback");
//       console.error(err);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {!submitted ? (
//         <form onSubmit={handleSubmit}>
//           <h2 className={styles.title}>Contact / Feedback</h2>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Describe the issue (e.g. wrong address, closed restaurant)..."
//             rows={4}
//             className={styles.textarea}
//           />
//           <button type="submit" className={styles.button}>
//             Send
//           </button>
//         </form>
//       ) : (
//         <div className={styles.thankyou}>
//           <p>Thank you for your feedback!</p>
//         </div>
//       )}

//       {/* ✅ Back button always visible */}
//       {restaurantId ? (
//         <Link to={`/restaurant/${restaurantId}`} className={styles.backbutton}>
//           ⬅ Back to Restaurant
//         </Link>
//       ) : (
//         <button onClick={() => navigate(-1)} className={styles.backbutton}>
//           ⬅ Back
//         </button>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useSearchParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Feedback } from "../../../app/api.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import styles from "./Contact.module.css";

export default function Contact() {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const restaurantId = searchParams.get("restaurantId");
  const from = location.state?.from;
  const fromHome = location.state?.fromHome;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to send feedback.");
      return;
    }
    try {
      await Feedback.submit({ message, restaurantId });
      setSubmitted(true);
    } catch (err) {
      alert(err?.message === "Missing token" || err?.status === 401 ? "Please log in to send feedback." : "Failed to send feedback");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>Feedback</h2>
          <h4>Please describe the issue:</h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue (e.g. wrong address, closed restaurant)..."
            rows={4}
            className={styles.textarea}
          />
          {!isAuthenticated && message.trim().length > 0 && (
            <div className={styles.loginNotice}>
              You must be logged in to send feedback. Please log in!
            </div>
          )}
          <button type="submit" className={styles.button}>
            Send
          </button>
        </form>
      ) : (
        <div className={styles.thankyou}>
          <p>Thank you for your feedback!</p>
        </div>
      )}

      {/* Back button always visible */}
      {restaurantId ? (
        <Link
          to={`/restaurant/${restaurantId}`}
          state={{ from, fromHome }}
          className={styles.backbutton}
        >
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

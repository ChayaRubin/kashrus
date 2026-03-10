// import React, { useEffect, useState } from "react";
// import { Feedback } from "../../../app/api.js";
// import styles from "./AdminFeedback.module.css";

// export default function AdminFeedback() {
//   const [feedback, setFeedback] = useState([]);

//   useEffect(() => {
//     Feedback.list().then(setFeedback).catch(console.error);
//   }, []);

//   const handleStatusChange = async (id, status) => {
//     await Feedback.update(id, status);
//     setFeedback((prev) =>
//       prev.map((f) => (f.id === id ? { ...f, status } : f))
//     );
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>User Feedback</h2>
//       <ul className={styles.list}>
//         {feedback.map((f) => (
//           <li key={f.id} className={styles.item}>
//             <p className={styles.message}><b>Message:</b> {f.message}</p>
//             {f.restaurant && (
//               <p className={styles.meta}><b>Restaurant:</b> {f.restaurant.name}</p>
//             )}

//             <p
//               className={`${styles.status} ${
//                 f.status === "RESOLVED" ? styles.resolved : styles.new
//               }`}
//             >
//               <b>Status:</b> {f.status}
//             </p>

//             {f.status !== "RESOLVED" && (
//               <button
//                 className={styles.button}
//                 onClick={() => handleStatusChange(f.id, "RESOLVED")}
//               >
//                 Mark Resolved
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Feedback } from "../../../app/api.js";
import styles from "./AdminFeedback.module.css";

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

  const handleDelete = async (id) => {
    await Feedback.delete(id); // 👈 assuming your API has this
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Feedback</h1>
      <ul className={styles.list}>
        {feedback.map((f) => (
          <li key={f.id} className={styles.item}>
            <p className={styles.message}>
              <b>Message:</b> {f.message}
            </p>
            {f.restaurant && (
              <p className={styles.meta}>
                <b>Restaurant:</b> {f.restaurant.name}
              </p>
            )}

            {/* ✅ Status with color */}
            <p
              className={`${styles.status} ${
                f.status === "RESOLVED" ? styles.resolved : styles.new
              }`}
            >
              <b>Status:</b> {f.status}
            </p>

            {/* ✅ Mark resolved button (only if not resolved) */}
            {f.status !== "RESOLVED" && (
              <button
                className={styles.button}
                onClick={() => handleStatusChange(f.id, "RESOLVED")}
              >
                Mark Resolved
              </button>
            )}

            {/* ✅ Delete button (only if resolved) */}
            {f.status === "RESOLVED" && (
              <button
                className={styles.button}
                onClick={() => handleDelete(f.id)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

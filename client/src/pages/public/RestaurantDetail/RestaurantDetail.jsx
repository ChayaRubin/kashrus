
// import React, { useEffect, useState } from "react";
// import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
// import { Restaurants } from "../../../app/api.js";
// // import StarRating from "../../../components/StarRating/StarRating.jsx";
// import s from "./RestaurantDetail.module.css";

// export default function RestaurantDetail() {
//   const { id } = useParams();
//   const [r, setR] = useState(null);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const backTo = location.state?.from || "/browse"; // ✅ will always be TypePage now

//   useEffect(() => {
//     Restaurants.get(id).then(setR).catch(console.error);
//   }, [id]);

//   if (!r) return <p className={s.info}>Loading…</p>;

//   const images = Array.isArray(r.images) ? r.images : r.images ? [r.images] : [];

//   const averageRating = r.ratingCount > 0 ? r.ratingSum / r.ratingCount : 0;

//   const handleRatingChange = (newRating) => {
//     setR((prev) => ({
//       ...prev,
//       ratingSum: prev.ratingSum + (newRating - (prev.userRating || 0)),
//       ratingCount: prev.userRating ? prev.ratingCount : prev.ratingCount + 1,
//       userRating: newRating,
//     }));
//   };

//   return (
//     <div className={s.wrap}>
//       <div className={s.back}>
//         <button onClick={() => navigate(backTo)} className={s.backbutton}>
//           ⬅ Back to Restaurants
//         </button>
//       </div>

//       <h2 className={s.title}>{r.name}</h2>
//       <div className={s.meta}>
//         Level: {r.level} {r.hechsher ? `• ${r.hechsher}` : ""}{" "}
//         {r.city ? `• ${r.city}` : ""} {r.category ? ` • ${r.category}` : ""}
//       </div>

//       {images.length > 0 && (
//         <div className={s.gallery}>
//           {images.map((src, i) => (
//             <img key={i} src={src} alt={`Photo ${i + 1}`} className={s.image} />
//           ))}
//         </div>
//       )}

//       {r.description && <p className={s.description}>{r.description}</p>}

//       <div className={s.details}>
//         {r.address && (
//           <div>
//             <strong>Address:</strong> {r.address}
//           </div>
//         )}
//         {r.phone && (
//           <div>
//             <strong>Phone:</strong> {r.phone}
//           </div>
//         )}
//         {r.website && (
//           <div>
//             <a href={r.website} target="_blank" rel="noreferrer">
//               Website
//             </a>
//           </div>
//         )}
//       </div>

//       <div className={s.feedback}>
//         <Link to={`/contact?restaurantId=${r.id}`}>
//           Report an issue with this restaurant
//         </Link>
//       </div>
//     </div>
//   );
// }
// src/pages/public/RestaurantDetail/RestaurantDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import s from "./RestaurantDetail.module.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [r, setR] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // figure out where to go back
  const from = location.state?.from;
  const fromHome = location.state?.fromHome;

  let backTo = "/browse";   // default
  let backLabel = "⬅ Back to Restaurants";

  if (fromHome) {
    backTo = "/";
    backLabel = "⬅ Back to Home";
  } else if (from) {
    backTo = from;
  }

  useEffect(() => {
    Restaurants.get(id).then(setR).catch(console.error);
  }, [id]);

  if (!r) return <p className={s.info}>Loading…</p>;

  const images = Array.isArray(r.images)
    ? r.images
    : r.images
    ? [r.images]
    : [];

  return (
    <div className={s.wrap}>
      {/* Back button */}
      <div className={s.back}>
        <button onClick={() => navigate(backTo)} className={s.backbutton}>
          {backLabel}
        </button>
      </div>

      {/* Title + meta */}
      <h2 className={s.title}>{r.name}</h2>
      <div className={s.meta}>
        Level: {r.level} {r.hechsher ? `• ${r.hechsher}` : ""}{" "}
        {r.city ? `• ${r.city}` : ""} {r.category ? ` • ${r.category}` : ""}
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className={s.gallery}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Photo ${i + 1}`}
              className={s.image}
            />
          ))}
        </div>
      )}

      {/* Description */}
      {r.description && <p className={s.description}>{r.description}</p>}

      {/* Details */}
      <div className={s.details}>
        {r.address && (
          <div>
            <strong>Address:</strong> {r.address}
          </div>
        )}
        {r.phone && (
          <div>
            <strong>Phone:</strong> {r.phone}
          </div>
        )}
        {r.website && (
          <div>
            <a href={r.website} target="_blank" rel="noreferrer">
              Website
            </a>
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className={s.feedback}>
        <Link to={`/contact?restaurantId=${r.id}`}>
          Report an issue with this restaurant
        </Link>
      </div>
    </div>
  );
}

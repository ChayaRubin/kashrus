// import { useEffect, useState } from "react";
// import { Rabanim } from "../../../app/api";
// import styles from "./RabanimAdmin.module.css";
// import { Link } from "react-router-dom";

// export default function RabanimAdminList() {
//   const [q, setQ] = useState("");
//   const [area, setArea] = useState("");
//   const [data, setData] = useState({ items: [], total: 0 });

//   useEffect(() => {
//     Rabanim.list({ q, area, page: 1, pageSize: 100 }).then(setData);
//   }, [q, area]);

//   async function del(id) {
//     if (!confirm("Delete this rabbi?")) return;
//     await Rabanim.remove(id);
//     Rabanim.list({ q, area, page: 1, pageSize: 100 }).then(setData);
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.head}>
//         <h1>Rabbanim</h1>
//         <Link to="/admin/rabanim/new" className={styles.btnPrimary}>
//           + New
//         </Link>
//       </div>

//       <div className={styles.filters}>
//         <input
//           className={styles.input}
//           placeholder="Search…"
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//         />
//         <input
//           className={styles.input}
//           placeholder="Area…"
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//         />
//       </div>

//       <div className={styles.cards}>
//         {data.items.map((r) => (
//           <div key={r.id} className={styles.card}>
//             <div className={styles.cardHeader}>
//               <h3>{r.name}</h3>
//               <span className={styles.area}>{r.area || "—"}</span>
//             </div>
//             {r.bio && (
//               <p className={styles.bio}>
//                 {r.bio.slice(0, 100)}
//                 {r.bio.length > 100 && "…"}
//               </p>
//             )}
//             <div className={styles.cardActions}>
//               <Link className={styles.btn} to={`/admin/rabanim/${r.id}`}>
//                 Edit
//               </Link>
//               <button
//                 className={styles.btnDanger}
//                 onClick={() => del(r.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Rabanim } from "../../../app/api";
import styles from "./RabanimAdmin.module.css";
import { Link } from "react-router-dom";

export default function RabanimAdminList() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  useEffect(() => {
    Rabanim.list({ q, area, page: 1, pageSize: 100 }).then(setData);
  }, [q, area]);

  async function del(id) {
    if (!confirm("Delete this rabbi?")) return;
    await Rabanim.remove(id);
    Rabanim.list({ q, area, page: 1, pageSize: 100 }).then(setData);
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Rabbanim</h1>
        <Link to="/admin/rabanim/new" className={styles.btnPrimary}>
          + New
        </Link>
      </div>

      {/* <div className={styles.filters}>
        <input
          className={styles.input}
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Area…"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div> */}

      <div className={styles.cards}>
        {data.items.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{r.name}</h3>
              {r.area && <span className={styles.area}>{r.area}</span>}
            </div>
            {r.bio && <p className={styles.bio}>{r.bio}</p>}
            <div className={styles.cardActions}>
              <Link className={styles.btn} to={`/admin/rabanim/${r.id}`}>
                Edit
              </Link>
              <button
                className={styles.btnDanger}
                onClick={() => del(r.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

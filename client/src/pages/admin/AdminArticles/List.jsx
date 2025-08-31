// import { useEffect, useState } from "react";
// import { Articles } from "../../../app/api";
// import styles from "./ArticlesAdmin.module.css";
// import { Link } from "react-router-dom";

// export default function ArticlesAdminList(){
//   const [q,setQ]=useState(""); const [data,setData]=useState({items:[],total:0});
//   useEffect(()=>{ Articles.list({ q, page:1, pageSize:100 }).then(setData); },[q]);

//   async function del(id){ if(!confirm("Delete this article?")) return; await Articles.remove(id); Articles.list({ q, page:1, pageSize:100 }).then(setData); }

//   return (
//     <div className={styles.container}>
//       <div className={styles.head}>
//         <h1>Articles</h1>
//         <Link to="/admin/articles/new" className={styles.btnPrimary}>+ New</Link>
//       </div>
//       <input className={styles.input} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
//       <table className={styles.table}>
//         <thead><tr><th>Title</th><th>Created</th><th></th></tr></thead>
//         <tbody>
//           {data.items.map(a=>(
//             <tr key={a.id}>
//               <td>{a.title}</td>
//               <td>{new Date(a.createdAt).toLocaleString()}</td>
//               <td className={styles.actions}>
//                 <Link className={styles.btn} to={`/admin/articles/${a.id}`}>Edit</Link>
//                 <button className={styles.btnDanger} onClick={()=>del(a.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Articles } from "../../../app/api";
import styles from "./ArticlesAdmin.module.css";
import { Link } from "react-router-dom";

export default function ArticlesAdminList() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  useEffect(() => {
    Articles.list({ q, page: 1, pageSize: 100 }).then(setData);
  }, [q]);

  async function del(id) {
    if (!confirm("Delete this article?")) return;
    await Articles.remove(id);
    Articles.list({ q, page: 1, pageSize: 100 }).then(setData);
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Articles</h1>
        <Link to="/admin/articles/new" className={styles.btnPrimary}>
          + New
        </Link>
      </div>

      <input
        className={styles.input}
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.cards}>
        {data.items.map((a) => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{a.title}</h3>
              <span className={styles.date}>
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </div>
            {a.content && (
              <p className={styles.snippet}>
                {a.content.slice(0, 120)}
                {a.content.length > 120 && "…"}
              </p>
            )}
            <div className={styles.cardActions}>
              <Link className={styles.btn} to={`/admin/articles/${a.id}`}>
                Edit
              </Link>
              <button
                className={styles.btnDanger}
                onClick={() => del(a.id)}
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

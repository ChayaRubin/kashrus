import { useEffect, useState } from "react";
import { Hechsheirim } from "../../../app/api";
import styles from "./HechsheirimAdmin.module.css";
import { Link } from "react-router-dom";

export default function HechsheirimAdminList(){
  const [q,setQ]=useState(""); const [data,setData]=useState({items:[],total:0});
  useEffect(()=>{ Hechsheirim.list({ q, page:1, pageSize:100 }).then(setData); },[q]);

  async function del(id){ if(!confirm("Delete this hechsher?")) return; await Hechsheirim.remove(id); Hechsheirim.list({ q, page:1, pageSize:100 }).then(setData); }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Hechsheirim (Admin)</h1>
        <Link to="/admin/hechsheirim/new" className={styles.btnPrimary}>+ New</Link>
      </div>
      <input className={styles.input} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
      <table className={styles.table}>
        <thead><tr><th>Logo</th><th>Name</th><th>Description</th><th></th></tr></thead>
        <tbody>
          {data.items.map(h=>(
            <tr key={h.id}>
              <td>{h.symbolUrl && <img className={styles.logo} src={h.symbolUrl} alt="" />}</td>
              <td>{h.name}</td>
              <td className={styles.ellipsis}>{h.description||"-"}</td>
              <td className={styles.actions}>
                <Link className={styles.btn} to={`/admin/hechsheirim/${h.id}`}>Edit</Link>
                <button className={styles.btnDanger} onClick={()=>del(h.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

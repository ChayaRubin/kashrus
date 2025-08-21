import { useEffect, useState } from "react";
import { Rabanim } from "../../../app/api";
import styles from "./RabanimAdmin.module.css";
import { Link } from "react-router-dom";

export default function RabanimAdminList(){
  const [q,setQ]=useState(""); const [area,setArea]=useState("");
  const [data,setData]=useState({items:[],total:0});

  useEffect(()=>{ Rabanim.list({ q, area, page:1, pageSize:100 }).then(setData); },[q,area]);

  async function del(id){ if(!confirm("Delete this rabbi?")) return; await Rabanim.remove(id); Rabanim.list({ q, area, page:1, pageSize:100 }).then(setData); }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Rabbanim (Admin)</h1>
        <Link to="/admin/rabanim/new" className={styles.btnPrimary}>+ New</Link>
      </div>
      <div className={styles.filters}>
        <input className={styles.input} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
        <input className={styles.input} placeholder="Area…" value={area} onChange={e=>setArea(e.target.value)} />
      </div>
      <table className={styles.table}>
        <thead><tr><th>Name</th><th>Area</th><th></th></tr></thead>
        <tbody>
          {data.items.map(r=>(
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.area||"-"}</td>
              <td className={styles.actions}>
                <Link className={styles.btn} to={`/admin/rabanim/${r.id}`}>Edit</Link>
                <button className={styles.btnDanger} onClick={()=>del(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

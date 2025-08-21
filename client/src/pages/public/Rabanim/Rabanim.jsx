import { useEffect, useState } from "react";
import { Rabanim } from "../../../app/api";
import styles from "./Rabanim.module.css";

export default function RabanimPage(){
  const [q,setQ]=useState(""); const [area,setArea]=useState("");
  const [page,setPage]=useState(1); const [data,setData]=useState({items:[],total:0});

  useEffect(()=>{ Rabanim.list({ q, area, page, pageSize:12 }).then(setData).catch(console.error); },[q,area,page]);

  const pages = Math.max(1, Math.ceil(data.total/12));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rabbanim</h1>
      <div className={styles.filters}>
        <input className={styles.input} placeholder="Search name/bio…" value={q} onChange={e=>setQ(e.target.value)} />
        <input className={styles.input} placeholder="Area…" value={area} onChange={e=>setArea(e.target.value)} />
      </div>

      <ul className={styles.grid}>
        {data.items.map(r => (
          <li key={r.id} className={styles.card}>
            <div className={styles.cardHeader}>{r.name}</div>
            {r.area && <div className={styles.badge}>{r.area}</div>}
            {r.bio && <p className={styles.text}>{r.bio}</p>}
          </li>
        ))}
      </ul>

      <div className={styles.pager}>
        <button className={styles.btn} disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span className={styles.pageInfo}>{page}/{pages}</span>
        <button className={styles.btn} disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}

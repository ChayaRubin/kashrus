import { useEffect, useState } from "react";
import { Articles } from "../../../app/api";
import styles from "./Articles.module.css";

export default function ArticlesPage(){
  const [q,setQ]=useState(""); const [page,setPage]=useState(1);
  const [data,setData]=useState({items:[],total:0});

  useEffect(()=>{ Articles.list({ q, page, pageSize:12 }).then(setData).catch(console.error); },[q,page]);
  const pages = Math.max(1, Math.ceil(data.total/12));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Articles</h1>
      <input className={styles.input} placeholder="Search title/content…" value={q} onChange={e=>setQ(e.target.value)} />

      <ul className={styles.grid}>
        {data.items.map(a => (
          <li key={a.id} className={styles.card}>
            <div className={styles.cardHeader}>{a.title}</div>
            <small className={styles.muted}>{new Date(a.createdAt).toLocaleDateString()}</small>
            <p className={styles.text}>{a.content.slice(0,160)}{a.content.length>160 && "…"}</p>
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

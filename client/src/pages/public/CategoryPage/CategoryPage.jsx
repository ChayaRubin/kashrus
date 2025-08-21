// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function CategoryPage() {
//   const nav = useNavigate();
//   const card = { padding:'24px', borderRadius:14, border:'1px solid #eee', background:'#fff', fontSize:20, cursor:'pointer' };

//   return (
//     <div style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(2, minmax(0,1fr))' }}>
//       <button style={card} onClick={() => nav('/browse/MEAT')}>Meat</button>
//       <button style={card} onClick={() => nav('/browse/DAIRY')}>Dairy</button>
//     </div>
//   );
// }
import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './CategoryPage.module.css';

export default function CategoryPage() {
  const nav = useNavigate();

  return (
    <div className={s.grid}>
      <button className={s.card} onClick={() => nav('/browse/MEAT')}>Meat</button>
      <button className={s.card} onClick={() => nav('/browse/DAIRY')}>Dairy</button>
    </div>
  );
}

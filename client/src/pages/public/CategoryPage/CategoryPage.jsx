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

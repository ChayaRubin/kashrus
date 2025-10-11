import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import s from './CategoryPage.module.css';

export default function CategoryPage() {
  const nav = useNavigate();
  const location = useLocation();
  const [isFromHome, setIsFromHome] = useState(false);

  useEffect(() => {
    // Check if user came from home page using session storage
    const fromHome = sessionStorage.getItem('fromHomePage');
    
    if (fromHome === 'true') {
      setIsFromHome(true); // Use simple style
      sessionStorage.removeItem('fromHomePage'); // Clear after use
    } else {
      setIsFromHome(false); // Use enhanced style for direct access
    }
  }, []);

  // Simple style when coming from home page
  if (isFromHome) {
    return (
      <div className={s.simpleGrid}>
        <button className={s.simpleCard} onClick={() => nav('/browse/MEAT')}>Meat</button>
        <button className={s.simpleCard} onClick={() => nav('/browse/DAIRY')}>Dairy</button>
      </div>
    );
  }

  // Enhanced style when accessed directly
  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>Choose Your Category</h1>
        <p className={s.subtitle}>Discover the perfect dining experience tailored to your preferences</p>
      </div>
      
      <div className={s.grid}>
        <button className={s.card} onClick={() => nav('/browse/MEAT')}>
          <h3 className={s.cardTitle}>Meat</h3>
          <p className={s.cardDescription}>Restaurants serving meat dishes and meals</p>
        </button>
        
        <button className={s.card} onClick={() => nav('/browse/DAIRY')}>
          <h3 className={s.cardTitle}>Dairy</h3>
          <p className={s.cardDescription}>Restaurants serving dairy dishes and meals</p>
        </button>
      </div>
    </div>
  );
}

// Function to set the flag when navigating from home page
export const setFromHomePage = () => {
  sessionStorage.setItem('fromHomePage', 'true');
};

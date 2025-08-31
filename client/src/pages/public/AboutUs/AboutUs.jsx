import React from 'react';
import styles from './AboutUs.module.css';

export default function AboutUs({ text }) {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>About Us</h1>
      <div className={styles.paragraph}>
        {text || "Default About Us text goes here…"}
      </div>
    </section>
  );
}

import React from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
    return (
        <section className={styles.container}>
            <h1 className={styles.title}>About Us</h1>
            <p className={styles.paragraph}>
                Welcome to our website! We are dedicated to providing the best service and experience for our users.
                Our team is passionate about innovation and customer satisfaction.
            </p>
            <p className={styles.paragraph}>
                Feel free to contact us with any questions or feedback. Thank you for visiting!
            </p>
        </section>
    );
};

export default AboutUs;

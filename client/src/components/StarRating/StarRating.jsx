// client/src/components/StarRating/StarRating.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Ratings } from '../../app/api.js';
import styles from './StarRating.module.css';

export default function StarRating({ restaurantId, averageRating = 0, totalRatings = 0, onRatingChange }) {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && restaurantId) {
      loadUserRating();
    }
  }, [isAuthenticated, restaurantId]);

  const loadUserRating = async () => {
    try {
      const response = await Ratings.get(restaurantId);
      setUserRating(response.rating);
    } catch (error) {
      console.error('Failed to load user rating:', error);
      if (error.message && !error.message.includes('Authentication required')) {
        console.error('Rating error:', error);
      }
    }
  };

  const handleStarClick = async (rating) => {
    if (!isAuthenticated) {
      alert('Please log in to rate restaurants');
      return;
    }

    setIsLoading(true);
    try {
      if (rating === userRating) {
        await Ratings.remove(restaurantId);
        setUserRating(0);
        if (onRatingChange) onRatingChange(0);
      } else {
        await Ratings.add(restaurantId, rating);
        setUserRating(rating);
        if (onRatingChange) onRatingChange(rating);
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
      alert('Failed to update rating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
    const currentRating = hoverRating || userRating;

    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <button
          key={i}
          className={`${styles.star} ${i <= currentRating ? styles.filled : ''} ${isLoading ? styles.disabled : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={isLoading}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  const renderAverageStars = () => {
    const stars = [];
    const maxRating = 5;
    const roundedRating = Math.round(averageRating);

    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${i <= roundedRating ? styles.filled : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        {isAuthenticated ? renderStars() : renderAverageStars()}
      </div>
      <div className={styles.info}>
        <span className={styles.average}>
          {averageRating > 0 ? averageRating.toFixed(1) : 'No'} ★
        </span>
        {totalRatings > 0 && (
          <span className={styles.count}>
            ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
          </span>
        )}
        {!isAuthenticated && (
          <span className={styles.loginPrompt}>
            <a href="/login">Log in to rate</a>
          </span>
        )}
      </div>
    </div>
  );
}

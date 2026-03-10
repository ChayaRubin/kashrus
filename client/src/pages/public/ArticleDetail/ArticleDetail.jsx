import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Articles } from "../../../app/api";
import styles from "./ArticleDetail.module.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      Articles.get(id)
        .then(setArticle)
        .catch(err => {
          console.error("Error fetching article:", err);
          setError("Article not found");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Article Not Found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button className={styles.backBtn} onClick={() => navigate('/articles')}>
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/articles')}>
        ← Back to Articles
      </button>
      
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>
          <time className={styles.date}>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </header>
        
        <div className={styles.content}>
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}

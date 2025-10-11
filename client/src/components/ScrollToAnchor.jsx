import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToAnchor({ offset = -80 }) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // Wait one frame so the section is in the DOM
    requestAnimationFrame(() => {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }, [hash, offset]);

  return null;
}

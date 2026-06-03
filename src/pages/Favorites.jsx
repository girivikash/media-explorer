import { useCallback, useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';

const FAVORITES_KEY = 'cine-stream-favorites';

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Favorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback(
    movie => {
      setFavorites(prev => prev.filter(item => item.id !== movie.id));
    },
    [setFavorites]
  );

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div>
          <h2>My Favorites</h2>
          <p>Saved movies are persisted in your browser via localStorage.</p>
        </div>
      </section>

      {favorites.length === 0 ? (
        <div className="notification info">No favorites yet. Click the heart on a movie to save it.</div>
      ) : (
        <MovieGrid movies={favorites} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
    </div>
  );
}

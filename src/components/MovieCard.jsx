import { getPosterUrl } from '../api/tmdb';

export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  return (
    <article className="movie-card">
      <img
        className="movie-poster"
        src={getPosterUrl(movie.poster_path)}
        alt={movie.title}
        loading="lazy"
      />

      <button
        type="button"
        className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
        onClick={() => onToggleFavorite(movie)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        ♥
      </button>

      <div className="movie-meta">
        <h2>{movie.title}</h2>
        <div className="movie-details">
          <span>{releaseYear}</span>
          <span>⭐ {movie.vote_average?.toFixed(1) || '0.0'}</span>
        </div>
      </div>
    </article>
  );
}

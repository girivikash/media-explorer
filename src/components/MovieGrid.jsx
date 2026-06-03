import MovieCard from './MovieCard';

export default function MovieGrid({ movies, favorites, onToggleFavorite }) {
  return (
    <section className="movie-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.some(item => item.id === movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}

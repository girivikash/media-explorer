import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchAuthentication, fetchMoodMatch, fetchPopularMovies, searchMovies } from '../api/tmdb';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import debounce from '../utils/debounce';

const FAVORITES_KEY = 'cine-stream-favorites';

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [moodPrompt, setMoodPrompt] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('checking');
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(loadFavorites);
  const sentinelRef = useRef(null);

  const debouncedSetDebouncedTerm = useMemo(
    () => debounce(value => setDebouncedTerm(value), 500),
    []
  );

  const handleSearchChange = value => {
    setSearchTerm(value);
    debouncedSetDebouncedTerm(value);
  };

  const handleSearchSubmit = useCallback(() => {
    setDebouncedTerm(searchTerm.trim());
  }, [searchTerm]);

  const toggleFavorite = useCallback(
    movie => {
      setFavorites(prev => {
        const already = prev.some(item => item.id === movie.id);
        const next = already ? prev.filter(item => item.id !== movie.id) : [...prev, movie];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError('');
  }, [debouncedTerm]);

  useEffect(() => {
    let active = true;

    async function validateKey() {
      try {
        await fetchAuthentication();
        if (active) setAuthStatus('valid');
      } catch (err) {
        if (active) {
          setAuthStatus('invalid');
          setError('TMDB API key is invalid or missing.');
        }
      }
    }

    validateKey();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');

      try {
        const response = debouncedTerm.trim()
          ? await searchMovies(debouncedTerm, page)
          : await fetchPopularMovies(page);

        if (!active) return;

        setMovies(prev => (page === 1 ? response.results : [...prev, ...response.results]));
        setHasMore(page < response.total_pages);
      } catch (err) {
        if (!active) return;
        setError('Failed to load movies. Check your API key or network.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [debouncedTerm, page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(current => current + 1);
    }
  }, [hasMore, loading]);

  useInfiniteScroll({
    sentinelRef,
    onLoadMore: loadMore,
    loading,
    hasMore
  });

  const handleMoodSubmit = async () => {
    if (!moodPrompt.trim()) return;
    setAiLoading(true);
    setError('');

    try {
      const title = await fetchMoodMatch(moodPrompt);
      if (title) {
        setSearchTerm(title);
        debouncedSetDebouncedTerm(title);
        setMoodPrompt('');
      } else {
        setError('No mood match could be generated.');
      }
    } catch (err) {
      setError(err.message || 'Mood matcher failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div>
          <h2>Discover Popular Movies</h2>
          <p>Browse TMDB popular titles, search with debounce, and save favorites locally.</p>
        </div>
        <div className="hero-actions">
          <SearchBar
            label="Search Movies"
            value={searchTerm}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            placeholder="Search by title..."
            buttonText="Search"
          />
          <SearchBar
            label="Mood Matcher"
            value={moodPrompt}
            onChange={setMoodPrompt}
            onSubmit={handleMoodSubmit}
            placeholder="I want a feel-good comedy..."
            buttonText={aiLoading ? 'Thinking…' : 'Match Mood'}
            disabled={aiLoading}
          />
        </div>
      </section>

      {error ? <div className="notification error">{error}</div> : null}

      <div className="status-bar">
        <span>{debouncedTerm ? `Searching for “${debouncedTerm}”` : 'Showing popular movies'}</span>
        <span>{movies.length} titles loaded</span>
        <span>
          {authStatus === 'checking'
            ? 'Validating TMDB key…'
            : authStatus === 'valid'
            ? 'TMDB key valid'
            : 'TMDB key invalid'}
        </span>
      </div>

      <MovieGrid movies={movies} favorites={favorites} onToggleFavorite={toggleFavorite} />

      {loading && <div className="loader">Loading more movies…</div>}
      {!loading && !hasMore && <div className="loader">No more movies to load.</div>}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
}

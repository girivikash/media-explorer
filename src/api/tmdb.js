const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

if (!API_KEY) {
  console.warn('VITE_TMDB_API_KEY is not set. TMDB requests will fail.');
}

function buildUrl(path, params = {}) {
  const search = new URLSearchParams({ api_key: API_KEY, ...params });
  return `${BASE_URL}${path}?${search.toString()}`;
}

async function fetchTmdb(path, params) {
  const url = buildUrl(path, params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('TMDB request failed');
  }
  return response.json();
}

export async function fetchPopularMovies(page = 1) {
  return fetchTmdb('/movie/popular', { page });
}

export async function searchMovies(query, page = 1) {
  return fetchTmdb('/search/movie', { query, page, include_adult: 'false' });
}

export async function fetchAuthentication() {
  const url = `${BASE_URL}/authentication/token/new?api_key=${API_KEY}`;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json' }
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('TMDB authentication request failed');
  }

  return response.json();
}

export async function fetchMoodMatch(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Return a single movie title that matches this mood: "${prompt}". Reply with the title only.`
        }
      ],
      max_tokens: 20,
      temperature: 0.7
    })
  });

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content?.trim();
  return text || '';
}

export function getPosterUrl(path) {
  return path ? `${IMAGE_BASE}${path}` : 'https://via.placeholder.com/342x513?text=No+Image';
}

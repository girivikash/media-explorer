import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Cine-Stream</h1>
          <p>Netflix-lite discovery powered by TMDB.</p>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Discover
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>
            My Favorites
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

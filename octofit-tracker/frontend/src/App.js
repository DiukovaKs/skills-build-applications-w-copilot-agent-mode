import React, { useState } from 'react';
import './App.css';
import { NavLink, Routes, Route } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h1 className="card-title display-6">OctoFit Tracker Dashboard</h1>
        <p className="card-text lead">
          Explore API-backed fitness data from the backend and manage activities, leaderboard standings, teams, users, and workouts.
        </p>
        <p>
          Use the navigation links above to switch between views. Each view uses a responsive Bootstrap table and a detail modal.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="octofitNavbar"
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`} id="octofitNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {[
                { path: '/activities', label: 'Activities' },
                { path: '/leaderboard', label: 'Leaderboard' },
                { path: '/teams', label: 'Teams' },
                { path: '/users', label: 'Users' },
                { path: '/workouts', label: 'Workouts' },
              ].map((link) => (
                <li className="nav-item" key={link.path}>
                  <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to={link.path}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
